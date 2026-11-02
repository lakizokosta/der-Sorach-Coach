package de.lernziel.sprachcoach.trainer

import de.lernziel.sprachcoach.data.Question
import kotlin.random.Random

/**
 * Port of `AdaptiveQueue` (`src/site/utils/queue.js`): de-duplicates identical
 * questions, shuffles once, and re-inserts a wrongly answered question 2–5
 * positions later until its third wrong attempt.
 */
class AdaptiveQueue(questions: List<Question>, shuffle: Boolean = true, private val random: Random = Random.Default) {

    private val original: List<Question> = dedupe(questions)
    private val queue: ArrayDeque<Question> = ArrayDeque(if (shuffle) original.shuffled(random) else original)
    private val attempts = mutableMapOf<String, Int>()
    private val solved = mutableSetOf<String>()

    val total: Int get() = original.size
    val solvedCount: Int get() = solved.size
    val progressPct: Int get() = if (total == 0) 0 else Math.round(solvedCount * 100f / total)

    fun hasNext(): Boolean = queue.isNotEmpty()

    fun peek(): Question? = queue.firstOrNull()

    fun consumeCorrect() {
        queue.removeFirstOrNull()?.let { solved += it.id }
    }

    fun consumeWrong() {
        val q = queue.removeFirstOrNull() ?: return
        val count = (attempts[q.id] ?: 0) + 1
        attempts[q.id] = count
        if (count >= MAX_ATTEMPTS) return
        val offset = random.nextInt(REINSERT_MIN_OFFSET, REINSERT_MAX_OFFSET + 1)
        queue.add(minOf(queue.size, offset), q)
    }

    /** Keeps one random representative per content fingerprint (`dedupeIdenticalQuestions`). */
    private fun dedupe(questions: List<Question>): List<Question> {
        val seen = mutableSetOf<String>()
        return questions.shuffled(random).filter { seen.add(it.fp) }
    }

    private companion object {
        const val MAX_ATTEMPTS = 3
        const val REINSERT_MIN_OFFSET = 2
        const val REINSERT_MAX_OFFSET = 5
    }
}
