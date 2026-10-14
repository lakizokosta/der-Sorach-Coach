package de.lernziel.sprachcoach.account

import android.content.Context
import androidx.core.content.edit
import de.lernziel.sprachcoach.BuildConfig
import de.lernziel.sprachcoach.data.ProgressStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import java.time.LocalDate
import java.time.ZoneOffset
import java.net.URLDecoder
import java.util.UUID

enum class Tier { FREE, BASIS, PREMIUM }

/** What the learner may use, plus how they are signed in. */
data class Account(
    val tier: Tier = Tier.FREE,
    /** `YYYY-MM-DD`, or empty when unknown / not Premium. */
    val premiumExpires: String = "",
    /** Magic-link login e-mail, or empty when not logged in. */
    val email: String = "",
    /** Activation code used on this device, if any. */
    val code: String = "",
    /** True until the first entitlement check after start has finished. */
    val checking: Boolean = false,
) {
    val isPremium: Boolean get() = tier == Tier.PREMIUM
    val isPaid: Boolean get() = tier != Tier.FREE
    val isLoggedIn: Boolean get() = email.isNotEmpty()
}

/** Outcome of a user action on the account screen. */
sealed interface AccountResult {
    data object LinkSent : AccountResult
    data object LinkSentDelayed : AccountResult
    data class Activated(val tier: Tier) : AccountResult
    data class Error(val message: String) : AccountResult
}

/**
 * Entitlements and login against the website's Apps Script backend
 * (`usePremium.js`, `useAuth.js`, `useProgressSync.js`):
 *
 * - Magic-link login (`requestMagicLink` → link with `?mltoken=` →
 *   `validateMagicToken`), kept alive with `refreshMagicSession`. This is how
 *   people who bought on the website unlock the app (up to 2 devices).
 * - Activation codes (`validateCode`) for codes not yet used on another device.
 * - Progress sync for logged-in users: pull and merge on login, push 800 ms
 *   after each change (`saveProgressByEmail`).
 *
 * The app has no purchase flow. When the server is unreachable the last known
 * entitlement stays valid until its expiry date.
 */
class AccountStore(
    context: Context,
    private val backend: Backend,
    private val progress: ProgressStore,
    private val scope: CoroutineScope,
) {
    private val prefs = context.getSharedPreferences("account", Context.MODE_PRIVATE)

    private val _account = MutableStateFlow(readCached())
    val account: StateFlow<Account> = _account.asStateFlow()

    /** Stable random id for this installation; the backend counts devices by it. */
    val deviceId: String = prefs.getString(KEY_DEVICE, null) ?: ("app-" + UUID.randomUUID()).also {
        prefs.edit { putString(KEY_DEVICE, it) }
    }

    /** E-mail last typed for login, to prefill the form. */
    var lastEmail: String
        get() = prefs.getString(KEY_LAST_EMAIL, "").orEmpty()
        set(value) = prefs.edit { putString(KEY_LAST_EMAIL, value) }

    init {
        startProgressPush()
    }

    private fun readCached(): Account {
        val tier = runCatching { Tier.valueOf(prefs.getString(KEY_TIER, "") ?: "") }.getOrDefault(Tier.FREE)
        val expires = prefs.getString(KEY_EXPIRES, "").orEmpty()
        return Account(
            tier = if (tier == Tier.PREMIUM && isExpired(expires)) Tier.FREE else tier,
            premiumExpires = expires,
            email = prefs.getString(KEY_EMAIL, "").orEmpty(),
            code = prefs.getString(KEY_CODE, "").orEmpty(),
        )
    }

    private fun publish(account: Account) {
        prefs.edit {
            putString(KEY_TIER, account.tier.name)
            putString(KEY_EXPIRES, account.premiumExpires)
        }
        _account.value = account
    }

    private fun isExpired(expires: String): Boolean {
        val day = expires.take(10)
        if (day.length < 10) return false
        val today = LocalDate.now(ZoneOffset.UTC).toString()
        return day < today
    }

    private fun premiumOrFree(expires: String) = if (isExpired(expires)) Tier.FREE else Tier.PREMIUM

    // --- Start-up check ------------------------------------------------------

    /** Re-validates the login session and/or activation code (on app start). */
    suspend fun refresh() {
        _account.update { it.copy(checking = true) }
        var account = _account.value.copy(checking = true)
        var fromEmail: Tier? = null

        val email = prefs.getString(KEY_EMAIL, "").orEmpty()
        val session = prefs.getString(KEY_SESSION, "").orEmpty()
        if (email.isNotEmpty() && session.isNotEmpty()) {
            val res = backend.get(
                mapOf("action" to "refreshMagicSession", "email" to email, "sessionToken" to session, "_" to now()),
            )
            when {
                res.ok -> {
                    fromEmail = tierFrom(res.bool("isPremium"), res.bool("isBasis"), res.str("premiumExpires"))
                    account = account.copy(tier = fromEmail, premiumExpires = res.str("premiumExpires"), email = email)
                    pullProgress(email, session)
                }
                !res.networkError -> {
                    clearLogin()
                    account = account.copy(email = "", tier = Tier.FREE, premiumExpires = "")
                }
            }
        }

        val code = prefs.getString(KEY_CODE, "").orEmpty()
        if (code.isNotEmpty() && fromEmail != Tier.PREMIUM) {
            val res = validateCode(code, prefs.getString(KEY_CODE_SESSION, "").orEmpty())
            when {
                res.ok -> account = applyCodeResult(account, code, res)
                !res.networkError -> {
                    prefs.edit { remove(KEY_CODE); remove(KEY_CODE_SESSION) }
                    account = account.copy(code = "", tier = fromEmail ?: Tier.FREE)
                }
            }
        }

        if (email.isEmpty() && code.isEmpty()) account = account.copy(tier = Tier.FREE, premiumExpires = "")
        if (account.tier == Tier.PREMIUM && isExpired(account.premiumExpires)) account = account.copy(tier = Tier.FREE)
        publish(debugOverride(account.copy(checking = false)))
    }

    /**
     * Debug builds only: `adb shell run-as de.lernziel.sprachcoach` can set
     * `debug_tier` (FREE/BASIS/PREMIUM) in shared_prefs/account.xml to try the
     * Premium screens without a real code. Ignored in release builds.
     */
    private fun debugOverride(account: Account): Account {
        if (!BuildConfig.DEBUG) return account
        val forced = prefs.getString(KEY_DEBUG_TIER, null)?.let { runCatching { Tier.valueOf(it) }.getOrNull() }
        return if (forced == null) account else account.copy(tier = forced)
    }

    private fun tierFrom(isPremium: Boolean, isBasis: Boolean, expires: String) = when {
        isPremium -> premiumOrFree(expires)
        isBasis -> Tier.BASIS
        else -> Tier.FREE
    }

    private suspend fun validateCode(code: String, sessionToken: String) = backend.get(
        mapOf(
            "action" to "validateCode",
            "code" to code,
            "email" to (prefs.getString(KEY_EMAIL, null) ?: lastEmail).lowercase(),
            "deviceId" to deviceId,
            "sessionToken" to sessionToken,
        ),
    )

    /** `applyEntitlementsFromCode`: BASIS codes lift the time limit, others unlock Premium. */
    private fun applyCodeResult(account: Account, code: String, res: BackendResult): Account {
        prefs.edit {
            putString(KEY_CODE, code)
            putString(KEY_CODE_SESSION, res.str("sessionToken"))
        }
        val isBasis = code.startsWith("BASIS") || res.str("type") == "basis"
        val expires = res.str("expires").take(10)
        val codeTier = if (isBasis) Tier.BASIS else premiumOrFree(expires)
        val tier = maxOf(account.tier, codeTier)
        return account.copy(
            code = code,
            tier = tier,
            premiumExpires = if (codeTier == Tier.PREMIUM) expires else account.premiumExpires,
        )
    }

    // --- User actions ----------------------------------------------------------

    suspend fun requestMagicLink(email: String): AccountResult {
        val normalized = email.trim().lowercase()
        if (!normalized.contains('@') || !normalized.contains('.')) return AccountResult.Error(ERR_INVALID_EMAIL)
        lastEmail = normalized
        val res = backend.get(
            mapOf("action" to "requestMagicLink", "email" to normalized, "deviceId" to deviceId, "_" to now()),
            timeoutMs = 35_000,
        )
        return when {
            res.ok -> AccountResult.LinkSent
            res.error == "Zeitüberschreitung" -> AccountResult.LinkSentDelayed
            else -> AccountResult.Error(res.error)
        }
    }

    /** Accepts the full login link from the e-mail (`…/?mltoken=…`) or the bare token. */
    suspend fun loginWithLink(input: String): AccountResult {
        val token = extractToken(input) ?: return AccountResult.Error(ERR_INVALID_LINK)
        val res = backend.get(mapOf("action" to "validateMagicToken", "token" to token, "deviceId" to deviceId))
        if (!res.ok) return AccountResult.Error(res.error)

        val email = res.str("email")
        val session = res.str("sessionToken")
        prefs.edit {
            putString(KEY_EMAIL, email)
            putString(KEY_SESSION, session)
        }
        lastEmail = email
        progress.mergeServer(res.str("streakData"), res.str("xpData"), res.str("dailyGoalData"))
        val tier = maxOf(tierFrom(res.bool("isPremium"), res.bool("isBasis"), res.str("premiumExpires")), _account.value.tier)
        publish(_account.value.copy(email = email, tier = tier, premiumExpires = res.str("premiumExpires"), checking = false))
        pushProgress()
        return AccountResult.Activated(tier)
    }

    suspend fun activateCode(input: String): AccountResult {
        val code = input.trim().uppercase()
        if (code.isEmpty()) return AccountResult.Error(ERR_ENTER_CODE)
        val res = validateCode(code, "")
        if (!res.ok) return AccountResult.Error(res.error)
        val account = applyCodeResult(_account.value, code, res)
        publish(account.copy(checking = false))
        return AccountResult.Activated(account.tier)
    }

    /** Ends the login session on the server (frees the device slot) and forgets entitlements. */
    suspend fun signOut() {
        val email = prefs.getString(KEY_EMAIL, "").orEmpty()
        val session = prefs.getString(KEY_SESSION, "").orEmpty()
        if (email.isNotEmpty() && session.isNotEmpty()) {
            backend.post(
                buildJsonObject {
                    put("action", JsonPrimitive("revokeMagicSession"))
                    put("email", JsonPrimitive(email))
                    put("sessionToken", JsonPrimitive(session))
                    put("deviceId", JsonPrimitive(deviceId))
                },
            )
        }
        clearLogin()
        prefs.edit { remove(KEY_CODE); remove(KEY_CODE_SESSION) }
        publish(Account())
    }

    private fun clearLogin() = prefs.edit { remove(KEY_EMAIL); remove(KEY_SESSION) }

    // --- Progress sync ---------------------------------------------------------

    private suspend fun pullProgress(email: String, session: String) {
        val res = backend.post(
            buildJsonObject {
                put("action", JsonPrimitive("loadProgressByEmail"))
                put("email", JsonPrimitive(email))
                put("sessionToken", JsonPrimitive(session))
            },
        )
        if (res.ok) progress.mergeServer(res.str("streakData"), res.str("xpData"), res.str("dailyGoalData"))
    }

    private suspend fun pushProgress() {
        val email = prefs.getString(KEY_EMAIL, "").orEmpty()
        val session = prefs.getString(KEY_SESSION, "").orEmpty()
        if (email.isEmpty() || session.isEmpty()) return
        backend.post(
            buildJsonObject {
                put("action", JsonPrimitive("saveProgressByEmail"))
                put("email", JsonPrimitive(email))
                put("sessionToken", JsonPrimitive(session))
                put("streakData", JsonPrimitive(progress.exportStreak()))
                put("xpData", JsonPrimitive(progress.exportXp()))
                put("dailyGoalData", JsonPrimitive(progress.exportDailyGoal()))
            },
        )
    }

    @OptIn(FlowPreview::class)
    private fun startProgressPush() {
        scope.launch { progress.changes.debounce(800).collect { pushProgress() } }
    }

    private fun now() = System.currentTimeMillis().toString()

    companion object {
        const val ERR_INVALID_EMAIL = "invalid-email"
        const val ERR_INVALID_LINK = "invalid-link"
        const val ERR_ENTER_CODE = "enter-code"

        /** The `mltoken` of a login link, or the input itself if it already looks like a token. */
        fun extractToken(input: String): String? {
            val text = input.trim()
            if (text.isEmpty()) return null
            val fromUrl = Regex("[?&]mltoken=([^&#\\s]+)").find(text)?.groupValues?.get(1)
            if (fromUrl != null) return URLDecoder.decode(fromUrl, "UTF-8")
            return text.takeIf { Regex("^[A-Za-z0-9]{16,}$").matches(it) }
        }

        private const val KEY_DEVICE = "device_id"
        private const val KEY_LAST_EMAIL = "last_email"
        private const val KEY_EMAIL = "email"
        private const val KEY_SESSION = "session_token"
        private const val KEY_CODE = "code"
        private const val KEY_CODE_SESSION = "code_session_token"
        private const val KEY_TIER = "tier"
        private const val KEY_EXPIRES = "premium_expires"
        private const val KEY_DEBUG_TIER = "debug_tier"
    }
}
