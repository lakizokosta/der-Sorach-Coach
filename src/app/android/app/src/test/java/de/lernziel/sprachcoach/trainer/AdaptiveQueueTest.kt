package de.lernziel.sprachcoach.trainer

import de.lernziel.sprachcoach.data.SelectOne
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.random.Random

class AdaptiveQueueTest {

    private fun q(id: String, fp: String = id) =
        SelectOne(id = id, level = "A1", topic = "T", fp = fp, prompt = "p", options = listOf("a", "b"), correct = "a")

    @Test
    fun dedupesByFingerprint() {
        val queue = AdaptiveQueue(listOf(q("1", "x"), q("2", "x"), q("3", "y")), random = Random(1))
        assertEquals(2, queue.total)
    }

    @Test
    fun keepsOrderWithoutShuffle() {
        val queue = AdaptiveQueue(listOf(q("1"), q("2"), q("3")), shuffle = false, random = Random(1))
        assertEquals(3, queue.total)
        val seen = mutableListOf<String>()
        while (queue.hasNext()) {
            seen += queue.peek()!!.id
            queue.consumeCorrect()
        }
        assertEquals(setOf("1", "2", "3"), seen.toSet())
        assertEquals(100, queue.progressPct)
    }

    @Test
    fun wrongQuestionReturnsTwoToFiveLaterAndDropsAfterThirdWrong() {
        val questions = (1..10).map { q(it.toString()) }
        val queue = AdaptiveQueue(questions, random = Random(7))
        val first = queue.peek()!!.id
        queue.consumeWrong()
        val position = generateSequence { if (queue.hasNext()) queue.peek()!!.id.also { queue.consumeCorrect() } else null }
            .indexOf(first)
        assertTrue("re-inserted at $position", position in 2..5)
    }

    @Test
    fun dropsAfterThreeWrongAttempts() {
        val queue = AdaptiveQueue(listOf(q("1")), random = Random(3))
        repeat(3) { queue.consumeWrong() }
        assertFalse(queue.hasNext())
        assertEquals(0, queue.solvedCount)
        assertEquals(1, queue.total)
    }
}
