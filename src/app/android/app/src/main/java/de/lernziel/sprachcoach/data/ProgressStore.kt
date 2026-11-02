package de.lernziel.sprachcoach.data

import android.content.Context
import androidx.core.content.edit
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.time.LocalDate
import java.time.ZoneOffset

/** XP level as defined in `src/site/composables/useXp.js` (names stay German, as on the web). */
data class XpLevel(val num: Int, val name: String, val prev: Int, val next: Int?)

fun xpLevel(xp: Int): XpLevel = when {
    xp >= 4000 -> XpLevel(5, "Meister", 4000, null)
    xp >= 1500 -> XpLevel(4, "Profi", 1500, 4000)
    xp >= 500 -> XpLevel(3, "Fortgeschrittener", 500, 1500)
    xp >= 100 -> XpLevel(2, "Lernender", 100, 500)
    else -> XpLevel(1, "Anfänger", 0, 100)
}

/** `lzd_streak` on the web. */
@Serializable
data class StreakData(
    val currentStreak: Int = 0,
    val longestStreak: Int = 0,
    val freezes: Int = 0,
    val lastActiveDate: String = "",
    val activeDays: List<String> = emptyList(),
)

/** `lzd_xp` + `lzd_topic_correct` + `lzd_topic_wrong` on the web (sync shape of `getXpSnapshot`). */
@Serializable
data class XpData(
    val totalXP: Int = 0,
    val topicCorrect: Map<String, Int> = emptyMap(),
    val topicWrong: Map<String, Int> = emptyMap(),
)

/** `lzd_daily_goal` on the web. */
@Serializable
data class DailyGoalData(val date: String = "", val count: Int = 0)

@Serializable
data class LevelScore(val correct: Int = 0, val total: Int = 0) {
    val pct: Int get() = if (total == 0) 0 else Math.round(correct * 100f / total)
}

/** `lzd_cefr_level`: result of the Einstufungstest. */
@Serializable
data class CefrData(
    val level: String = "",
    val testedAt: String = "",
    val scores: Map<String, LevelScore> = emptyMap(),
    val totalCorrect: Int = 0,
    val totalAnswered: Int = 0,
)

// --- Merge rules of src/site/utils/progressMerge.js ---------------------------

/** Keeps the best of both: max counters, latest active date, union of active days (last 42). */
fun mergeStreak(local: StreakData, server: StreakData) = StreakData(
    currentStreak = maxOf(local.currentStreak, server.currentStreak),
    longestStreak = maxOf(local.longestStreak, server.longestStreak),
    freezes = maxOf(local.freezes, server.freezes),
    lastActiveDate = maxOf(local.lastActiveDate, server.lastActiveDate),
    activeDays = (local.activeDays + server.activeDays).distinct().sorted().takeLast(42),
)

/** Max total XP and per-topic max of correct / wrong counters. */
fun mergeXp(local: XpData, server: XpData): XpData {
    fun merge(a: Map<String, Int>, b: Map<String, Int>) = (a.keys + b.keys).associateWith { maxOf(a[it] ?: 0, b[it] ?: 0) }
    return XpData(
        totalXP = maxOf(local.totalXP, server.totalXP),
        topicCorrect = merge(local.topicCorrect, server.topicCorrect),
        topicWrong = merge(local.topicWrong, server.topicWrong),
    )
}

/** Only today's count survives; both sides from today → the higher count. */
fun mergeDailyGoal(local: DailyGoalData, server: DailyGoalData, today: String) = when {
    local.date == today && server.date == today -> DailyGoalData(today, maxOf(local.count, server.count))
    local.date == today -> local
    server.date == today -> server
    else -> DailyGoalData(today, 0)
}

/** What the screens show. */
data class ProgressSnapshot(
    val xp: XpData,
    val streak: StreakData,
    val todayCount: Int,
    val cefr: CefrData,
) {
    val totalXp: Int get() = xp.totalXP
    val currentStreak: Int get() = streak.currentStreak
    val level: XpLevel get() = xpLevel(xp.totalXP)
    val hasProgress: Boolean get() = xp.totalXP > 0 || streak.currentStreak > 0

    fun isMastered(topic: String) = (xp.topicCorrect[topic.uppercase()] ?: 0) >= ProgressStore.MASTERY_THRESHOLD
}

/** Side effects of an XP change that the trainer announces as toasts. */
data class XpChange(val levelUp: XpLevel?, val topicMastered: Boolean)

/** A topic ranked by `getWeakestTopics` (`src/site/utils/weakTopics.js`). */
data class WeakTopic(val level: String, val topic: HubTopic, val wrong: Int, val correct: Int)

/** The [limit] topics with most errors (rank = wrong × 1000 − correct), among hub topics with questions. */
fun rankWeakTopics(xp: XpData, topicsByLevel: Map<String, List<HubTopic>>, limit: Int = 3): List<WeakTopic> =
    topicsByLevel.flatMap { (level, topics) ->
        topics.mapNotNull { topic ->
            val wrong = xp.topicWrong[topic.key] ?: 0
            if (wrong <= 0 || topic.count == 0) null else WeakTopic(level, topic, wrong, xp.topicCorrect[topic.key] ?: 0)
        }
    }.sortedByDescending { it.wrong * 1000 - it.correct }.take(limit)

/**
 * Local learner progress, stored in the website's JSON shapes so it can be
 * merged with the server copy (`progressMerge.js`): XP and topic counters
 * (`useXp`), daily goal (`useDailyGoal`), streak with Premium freezes
 * (`useStreak`), daily bonus tiers (`useDailyBonus`), placement result
 * (`useCefrLevel`) and the free 10-minute limit (`useFreeDailyLimit`).
 *
 * Days are UTC calendar days, like `toISOString()` on the web, so both sides
 * agree on "today" when syncing.
 */
class ProgressStore(
    context: Context,
    private val today: () -> LocalDate = { LocalDate.now(ZoneOffset.UTC) },
) {
    private val prefs = context.getSharedPreferences("progress", Context.MODE_PRIVATE)
    private val json = Json { ignoreUnknownKeys = true }

    private var xp: XpData = read(KEY_XP) ?: XpData()
    private var streak: StreakData = read(KEY_STREAK) ?: StreakData()
    private var goal: DailyGoalData = read(KEY_GOAL) ?: DailyGoalData()
    private var cefr: CefrData = read(KEY_CEFR) ?: CefrData()

    private val _snapshot = MutableStateFlow(snapshot())
    val snapshot: StateFlow<ProgressSnapshot> = _snapshot.asStateFlow()

    private val _changes = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    /** Emits after every change that should be pushed to the server. */
    val changes: SharedFlow<Unit> = _changes.asSharedFlow()

    private inline fun <reified T> read(key: String): T? =
        prefs.getString(key, null)?.let { runCatching { json.decodeFromString<T>(it) }.getOrNull() }

    private fun todayIso() = today().toString()

    private fun snapshot() = ProgressSnapshot(xp, streak, todayCount(), cefr)

    private fun save(notify: Boolean = true) {
        prefs.edit {
            putString(KEY_XP, json.encodeToString(xp))
            putString(KEY_STREAK, json.encodeToString(streak))
            putString(KEY_GOAL, json.encodeToString(goal))
            putString(KEY_CEFR, json.encodeToString(cefr))
        }
        _snapshot.value = snapshot()
        if (notify) _changes.tryEmit(Unit)
    }

    // --- Free daily limit -------------------------------------------------

    fun freeSecondsRemaining(): Int = (FREE_SECONDS_PER_DAY - freeSecondsUsedToday()).coerceAtLeast(0)

    private fun freeSecondsUsedToday(): Int =
        if (prefs.getString(KEY_FREE_DATE, "") == todayIso()) {
            prefs.getInt(KEY_FREE_USED, 0).coerceIn(0, FREE_SECONDS_PER_DAY)
        } else {
            0
        }

    fun addFreeSecondsUsed(seconds: Int) {
        if (seconds <= 0) return
        val used = (freeSecondsUsedToday() + seconds).coerceAtMost(FREE_SECONDS_PER_DAY)
        prefs.edit {
            putString(KEY_FREE_DATE, todayIso())
            putInt(KEY_FREE_USED, used)
        }
    }

    // --- XP and topic counters --------------------------------------------

    /**
     * Adds [amount] XP (total floored at 0) and moves the topic mastery
     * counter by [correctDelta] (floored at 0).
     */
    fun addXp(amount: Int, topic: String? = null, correctDelta: Int = 0): XpChange {
        if (amount == 0) return XpChange(null, false)
        val before = xp.totalXP
        var mastered = false
        var topicCorrect = xp.topicCorrect
        if (topic != null && correctDelta != 0) {
            val key = topic.uppercase()
            val old = topicCorrect[key] ?: 0
            val new = (old + correctDelta).coerceAtLeast(0)
            topicCorrect = topicCorrect + (key to new)
            mastered = old < MASTERY_THRESHOLD && new >= MASTERY_THRESHOLD
        }
        xp = xp.copy(totalXP = (before + amount).coerceAtLeast(0), topicCorrect = topicCorrect)
        save()
        val levelUp = xpLevel(xp.totalXP).takeIf { it.num > xpLevel(before).num }
        return XpChange(levelUp, mastered)
    }

    fun recordTopicWrong(topic: String) {
        val key = topic.uppercase()
        xp = xp.copy(topicWrong = xp.topicWrong + (key to ((xp.topicWrong[key] ?: 0) + 1)))
        save()
    }

    fun weakestTopics(topicsByLevel: Map<String, List<HubTopic>>, limit: Int = 3): List<WeakTopic> =
        rankWeakTopics(xp, topicsByLevel, limit)

    // --- Daily goal and streak ---------------------------------------------

    fun todayCount(): Int = if (goal.date == todayIso()) goal.count else 0

    /** Counts one answered question toward today's goal; completes the streak day at 20. */
    fun recordQuestionAnswered(isPremium: Boolean) {
        goal = DailyGoalData(todayIso(), todayCount() + 1)
        markActiveDay()
        if (goal.count >= DAILY_GOAL_QUESTIONS) recordActivityToday(isPremium)
        save()
    }

    private fun markActiveDay() {
        val today = todayIso()
        if (today !in streak.activeDays) streak = streak.copy(activeDays = (streak.activeDays + today).takeLast(42))
    }

    /**
     * Streak day (`recordActivityToday`): +1 after yesterday; Premium spends a
     * freeze to bridge one missed day and earns one every 7 days (max 3).
     */
    private fun recordActivityToday(isPremium: Boolean) {
        val today = today()
        if (streak.lastActiveDate == today.toString()) return
        var s = streak
        s = when {
            s.lastActiveDate == today.minusDays(1).toString() -> s.copy(currentStreak = s.currentStreak + 1)
            s.lastActiveDate.isEmpty() -> s.copy(currentStreak = 1)
            isPremium && s.freezes > 0 && daysSince(s.lastActiveDate) <= 2 ->
                s.copy(freezes = s.freezes - 1, currentStreak = s.currentStreak + 1)
            else -> s.copy(currentStreak = 1)
        }
        s = s.copy(longestStreak = maxOf(s.longestStreak, s.currentStreak))
        if (isPremium && s.currentStreak % 7 == 0 && s.freezes < 3) s = s.copy(freezes = s.freezes + 1)
        streak = s.copy(lastActiveDate = today.toString())
    }

    private fun daysSince(iso: String): Long =
        runCatching { today().toEpochDay() - LocalDate.parse(iso).toEpochDay() }.getOrDefault(Long.MAX_VALUE)

    // --- Daily bonus tiers -------------------------------------------------

    /**
     * Claims the post-goal milestone for today's [answered] count, if any
     * (25 → +5, 30 → +8, 35 → +12 XP, once per day). Returns the XP awarded.
     */
    fun claimBonusTier(answered: Int): Int {
        val bonus = BONUS_TIERS[answered] ?: return 0
        val claimed = if (prefs.getString(KEY_BONUS_DATE, "") == todayIso()) {
            prefs.getStringSet(KEY_BONUS_TIERS, emptySet()).orEmpty()
        } else {
            emptySet()
        }
        if (answered.toString() in claimed) return 0
        prefs.edit {
            putString(KEY_BONUS_DATE, todayIso())
            putStringSet(KEY_BONUS_TIERS, claimed + answered.toString())
        }
        return bonus
    }

    // --- Placement result ----------------------------------------------------

    fun setCefrLevel(level: String, scores: Map<String, LevelScore>) {
        cefr = CefrData(
            level = level,
            testedAt = todayIso(),
            scores = scores,
            totalCorrect = scores.values.sumOf { it.correct },
            totalAnswered = scores.values.sumOf { it.total },
        )
        save(notify = false)
    }

    // --- Server sync (shapes and merge rules of src/site/utils/progressMerge.js) ----

    fun exportStreak(): String = json.encodeToString(streak)
    fun exportXp(): String = json.encodeToString(xp)
    fun exportDailyGoal(): String = json.encodeToString(goal)

    /** Merges server JSON into local progress without triggering a push. */
    fun mergeServer(streakJson: String?, xpJson: String?, goalJson: String?) {
        parse<StreakData>(streakJson)?.let { streak = mergeStreak(streak, it) }
        parse<XpData>(xpJson)?.let { xp = mergeXp(xp, it) }
        parse<DailyGoalData>(goalJson)?.let { goal = mergeDailyGoal(goal, it, todayIso()) }
        save(notify = false)
    }

    private inline fun <reified T> parse(raw: String?): T? =
        raw?.takeIf { it.isNotBlank() }?.let { runCatching { json.decodeFromString<T>(it) }.getOrNull() }

    companion object {
        const val FREE_SECONDS_PER_DAY = 10 * 60
        const val DAILY_GOAL_QUESTIONS = 20
        const val MASTERY_THRESHOLD = 50
        private val BONUS_TIERS = mapOf(25 to 5, 30 to 8, 35 to 12)

        private const val KEY_XP = "xp_json"
        private const val KEY_STREAK = "streak_json"
        private const val KEY_GOAL = "daily_goal_json"
        private const val KEY_CEFR = "cefr_json"
        private const val KEY_FREE_DATE = "free_date"
        private const val KEY_FREE_USED = "free_used_seconds"
        private const val KEY_BONUS_DATE = "bonus_date"
        private const val KEY_BONUS_TIERS = "bonus_tiers"
    }
}
