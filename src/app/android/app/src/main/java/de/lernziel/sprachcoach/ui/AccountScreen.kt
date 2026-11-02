package de.lernziel.sprachcoach.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboard
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.account.Account
import de.lernziel.sprachcoach.account.AccountResult
import de.lernziel.sprachcoach.account.AccountStore
import de.lernziel.sprachcoach.account.Tier
import kotlinx.coroutines.launch

/** Feedback line under a form: text and whether it is good news. */
private data class Status(val text: String, val good: Boolean, val busy: Boolean = false)

/**
 * Sign-in and activation (spec 03-premium §1 activation area, LoginPanel).
 * The app sells nothing: Premium bought on the website is unlocked here by
 * e-mail login link (2 devices) or by an unused activation code.
 */
@Composable
fun AccountScreen(store: AccountStore, pendingLink: String?, onLinkConsumed: () -> Unit, onBack: () -> Unit) {
    val account by store.account.collectAsStateWithLifecycle()
    val scope = rememberCoroutineScope()
    BackHandler(onBack = onBack)

    var email by rememberSaveable { mutableStateOf(store.lastEmail) }
    var link by rememberSaveable { mutableStateOf("") }
    var code by rememberSaveable { mutableStateOf("") }
    var emailStatus by remember { mutableStateOf<Status?>(null) }
    var linkStatus by remember { mutableStateOf<Status?>(null) }
    var codeStatus by remember { mutableStateOf<Status?>(null) }

    val msgSending = stringResource(R.string.account_sending)
    val msgLoggingIn = stringResource(R.string.account_logging_in)
    val msgActivating = stringResource(R.string.account_activating)
    val messages = resultMessages(email)

    fun login(input: String) {
        linkStatus = Status(msgLoggingIn, good = true, busy = true)
        scope.launch {
            linkStatus = messages(store.loginWithLink(input))
            if (linkStatus?.good == true) link = ""
        }
    }

    // A login link opened with the app (https://lernziel-deutsch.de/?mltoken=…).
    LaunchedEffect(pendingLink) {
        if (pendingLink != null) {
            link = pendingLink
            onLinkConsumed()
            login(pendingLink)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .safeDrawingPadding()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Text(
            stringResource(R.string.trainer_back),
            color = Palette.Purple,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth().clickable(role = Role.Button, onClick = onBack).padding(vertical = 8.dp),
        )
        LzdLogo(size = 64.dp)
        Text(stringResource(R.string.account_title), fontSize = 22.sp, fontWeight = FontWeight.Bold)

        StatusCard(account, onSignOut = { scope.launch { store.signOut() } })

        if (!account.isLoggedIn) {
            Card {
                Text(stringResource(R.string.account_login_title), fontWeight = FontWeight.Bold)
                Text(stringResource(R.string.account_login_intro), fontSize = 13.sp, color = Palette.Muted)
                Spacer(Modifier.height(10.dp))
                Field(email, { email = it }, stringResource(R.string.account_email_hint), KeyboardType.Email)
                Spacer(Modifier.height(10.dp))
                PrimaryButton(
                    stringResource(R.string.account_send_link),
                    enabled = emailStatus?.busy != true,
                    onClick = {
                        emailStatus = Status(msgSending, good = true, busy = true)
                        scope.launch { emailStatus = messages(store.requestMagicLink(email)) }
                    },
                )
                StatusLine(emailStatus)
            }

            Card {
                Text(stringResource(R.string.account_paste_title), fontWeight = FontWeight.Bold)
                Text(stringResource(R.string.account_paste_intro), fontSize = 13.sp, color = Palette.Muted)
                Spacer(Modifier.height(10.dp))
                Field(link, { link = it }, stringResource(R.string.account_paste_hint), KeyboardType.Uri)
                Spacer(Modifier.height(10.dp))
                val clipboard = LocalClipboard.current
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    SecondaryButton(stringResource(R.string.account_paste_clipboard), onClick = {
                        scope.launch {
                            clipboard.getClipEntry()?.clipData?.takeIf { it.itemCount > 0 }
                                ?.getItemAt(0)?.text?.let { link = it.toString().trim() }
                        }
                    })
                    PrimaryButton(
                        stringResource(R.string.account_login),
                        enabled = link.isNotBlank() && linkStatus?.busy != true,
                        onClick = { login(link) },
                    )
                }
                StatusLine(linkStatus)
            }
        }

        if (!account.isPremium) {
            Card {
                Text(stringResource(R.string.account_code_title), fontWeight = FontWeight.Bold)
                Text(stringResource(R.string.account_code_intro), fontSize = 13.sp, color = Palette.Muted)
                Spacer(Modifier.height(10.dp))
                Field(code, { code = it }, stringResource(R.string.account_code_hint), KeyboardType.Ascii, caps = true)
                Spacer(Modifier.height(10.dp))
                PrimaryButton(
                    stringResource(R.string.account_activate),
                    enabled = codeStatus?.busy != true,
                    onClick = {
                        codeStatus = Status(msgActivating, good = true, busy = true)
                        scope.launch { codeStatus = messages(store.activateCode(code)) }
                    },
                )
                StatusLine(codeStatus)
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

/** Maps an [AccountResult] to a localized status line. */
@Composable
private fun resultMessages(email: String): (AccountResult) -> Status {
    val sent = stringResource(R.string.account_link_sent, email)
    val delayed = stringResource(R.string.account_link_sent_delayed, email)
    val premium = stringResource(R.string.account_premium_activated)
    val basis = stringResource(R.string.account_basis_activated)
    val free = stringResource(R.string.account_logged_in_free)
    val invalidEmail = stringResource(R.string.account_err_invalid_email)
    val invalidLink = stringResource(R.string.account_err_invalid_link)
    val enterCode = stringResource(R.string.account_err_enter_code)
    val errTemplate = stringResource(R.string.account_err, "%s")
    return { result ->
        when (result) {
            AccountResult.LinkSent -> Status(sent, true)
            AccountResult.LinkSentDelayed -> Status(delayed, true)
            is AccountResult.Activated -> when (result.tier) {
                Tier.PREMIUM -> Status(premium, true)
                Tier.BASIS -> Status(basis, true)
                Tier.FREE -> Status(free, true)
            }
            is AccountResult.Error -> Status(
                when (result.message) {
                    AccountStore.ERR_INVALID_EMAIL -> invalidEmail
                    AccountStore.ERR_INVALID_LINK -> invalidLink
                    AccountStore.ERR_ENTER_CODE -> enterCode
                    else -> errTemplate.replace("%s", result.message)
                },
                good = false,
            )
        }
    }
}

@Composable
private fun StatusCard(account: Account, onSignOut: () -> Unit) {
    Card {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            val active = account.isPaid
            Text(
                stringResource(if (active) R.string.account_status_active else R.string.account_status_inactive),
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (active) Palette.Green else Palette.Red)
                    .padding(horizontal = 10.dp, vertical = 4.dp),
            )
            Spacer(Modifier.weight(1f))
            if (account.checking) CircularProgressIndicator(Modifier.height(18.dp), strokeWidth = 2.dp, color = Palette.Purple)
        }
        Spacer(Modifier.height(10.dp))
        Text(
            when (account.tier) {
                Tier.PREMIUM -> if (account.premiumExpires.isNotEmpty()) {
                    stringResource(R.string.account_premium_until, account.premiumExpires)
                } else {
                    stringResource(R.string.premium_active)
                }
                Tier.BASIS -> stringResource(R.string.account_basis)
                Tier.FREE -> stringResource(R.string.account_free)
            },
            fontWeight = FontWeight.Bold,
        )
        if (account.isLoggedIn) Text(stringResource(R.string.account_logged_in_as, account.email))
        if (account.code.isNotEmpty()) Text(stringResource(R.string.account_code_on_device, account.code), fontSize = 13.sp)
        if (account.isLoggedIn) {
            Text(stringResource(R.string.account_sync_note), fontSize = 12.sp, color = Palette.Muted)
        }
        if (account.isLoggedIn || account.code.isNotEmpty()) {
            Spacer(Modifier.height(10.dp))
            SecondaryButton(stringResource(R.string.account_sign_out), onClick = onSignOut)
        }
    }
}

@Composable
private fun Field(
    value: String,
    onChange: (String) -> Unit,
    placeholder: String,
    type: KeyboardType,
    caps: Boolean = false,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        placeholder = { Text(placeholder, color = Palette.Muted) },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            keyboardType = type,
            capitalization = if (caps) KeyboardCapitalization.Characters else KeyboardCapitalization.None,
            autoCorrectEnabled = false,
        ),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Palette.Purple,
            unfocusedContainerColor = Palette.Card,
            focusedContainerColor = Palette.Card,
        ),
        modifier = Modifier.fillMaxWidth(),
    )
}

@Composable
private fun StatusLine(status: Status?) {
    if (status == null) return
    Text(
        status.text,
        color = if (status.good) Palette.GreenDark else Palette.Red,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        modifier = Modifier.padding(top = 8.dp),
    )
}
