package de.lernziel.sprachcoach.trainer

import de.lernziel.sprachcoach.data.LevelScore
import de.lernziel.sprachcoach.data.SelectOne
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.random.Random

class PlacementTest {

    private fun q(level: String, i: Int) =
        SelectOne("$level-$i", level, "T", "$level-$i", "p", listOf("a", "b"), "a")

    private val pools = Session.LEVELS.associateWith { lvl -> (1..15).map { q(lvl, it) } }

    @Test
    fun usesAllSixtyQuestions() {
        val order = buildProgressiveOrder(pools, Random(1))
        assertEquals(60, order.size)
        assertEquals(60, order.map { it.id }.toSet().size)
    }

    @Test
    fun nextLevelOnlyAfterSevenOfThePreviousOne() {
        repeat(20) { seed ->
            val order = buildProgressiveOrder(pools, Random(seed))
            for ((i, level) in Session.LEVELS.withIndex().drop(1)) {
                val firstAt = order.indexOfFirst { it.level == level }
                val previousShown = order.take(firstAt).count { it.level == Session.LEVELS[i - 1] }
                assertTrue("seed $seed: $level after $previousShown", previousShown >= 7)
            }
        }
    }

    @Test
    fun levelIsHighestWithSixtyPercent() {
        fun s(c: Int) = LevelScore(c, 15)
        assertEquals("A1", evaluatePlacementLevel(emptyMap()))
        assertEquals("A2", evaluatePlacementLevel(mapOf("A1" to s(15), "A2" to s(9), "B1" to s(8), "B2" to s(2))))
        assertEquals("B2", evaluatePlacementLevel(mapOf("A1" to s(15), "A2" to s(15), "B1" to s(15), "B2" to s(9))))
    }
}
