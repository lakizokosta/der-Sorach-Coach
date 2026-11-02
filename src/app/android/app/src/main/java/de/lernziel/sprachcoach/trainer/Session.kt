package de.lernziel.sprachcoach.trainer

import de.lernziel.sprachcoach.data.LevelScore
import de.lernziel.sprachcoach.data.Question
import kotlinx.serialization.Serializable
import kotlin.random.Random

/**
 * What a trainer session trains — the app's version of the web's
 * `/trainer?level&mode&topic&set` query (spec 02-trainer §1.2, §2.1).
 */
@Serializable
data class Session(val mode: Mode, val level: String = "A1", val key: String = "") {

    enum class Mode(val premiumOnly: Boolean) {
        /** All grammar questions of a level (free; Premium gets ×2 XP). */
        LEVEL(false),
        /** One grammar topic. */
        TOPIC(true),
        /** One Wortschatz set. */
        VOCAB(true),
        /** The three weakest topics. */
        SCHWAECHEN(true),
        /** 60-question Einstufungstest, A1 → B2. */
        PLACEMENT(true),
    }

    companion object {
        val LEVELS = listOf("A1", "A2", "B1", "B2")
    }
}

private const val PURE_INTRO = 7
private const val PASS_RATIO = 0.6

/**
 * Progressive placement order (`buildProgressiveOrder`, `src/site/utils/placementTest.js`):
 * a level becomes eligible once 7 questions of the previous level were shown;
 * each step picks a random eligible level and a random question from it.
 */
fun buildProgressiveOrder(pools: Map<String, List<Question>>, random: Random = Random.Default): List<Question> {
    val remaining = Session.LEVELS.associateWith { pools[it].orEmpty().toMutableList() }
    val shown = Session.LEVELS.associateWith { 0 }.toMutableMap()
    val total = remaining.values.sumOf { it.size }
    val order = mutableListOf<Question>()

    fun canShow(level: String): Boolean {
        if (remaining.getValue(level).isEmpty()) return false
        val idx = Session.LEVELS.indexOf(level)
        return idx == 0 || shown.getValue(Session.LEVELS[idx - 1]) >= PURE_INTRO ||
            remaining.getValue(Session.LEVELS[idx - 1]).isEmpty()
    }

    while (order.size < total) {
        val eligible = Session.LEVELS.filter(::canShow)
        if (eligible.isEmpty()) break
        val level = eligible[random.nextInt(eligible.size)]
        val pool = remaining.getValue(level)
        order += pool.removeAt(random.nextInt(pool.size))
        shown[level] = shown.getValue(level) + 1
    }
    return order
}

/** Highest level with ≥ 60 % correct, default A1 (`evaluatePlacementLevel`). */
fun evaluatePlacementLevel(scores: Map<String, LevelScore>): String {
    var result = "A1"
    for (level in Session.LEVELS) {
        val s = scores[level] ?: continue
        if (s.total > 0 && s.correct.toDouble() / s.total >= PASS_RATIO) result = level
    }
    return result
}
