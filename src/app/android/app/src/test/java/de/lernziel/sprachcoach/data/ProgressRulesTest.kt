package de.lernziel.sprachcoach.data

import org.junit.Assert.assertEquals
import org.junit.Test

class ProgressRulesTest {

    @Test
    fun weakTopicsRankByErrorsThenFewerCorrect() {
        val topics = mapOf(
            "A1" to listOf(HubTopic("DATIVA1", "Dativ", "", 150), HubTopic("ARTIKEL", "Artikel", "", 150)),
            "B1" to listOf(HubTopic("PASSIVB1", "Passiv", "", 150), HubTopic("EMPTY", "Leer", "", 0)),
        )
        val xp = XpData(
            topicCorrect = mapOf("DATIVA1" to 5, "ARTIKEL" to 0),
            topicWrong = mapOf("DATIVA1" to 3, "ARTIKEL" to 3, "PASSIVB1" to 1, "EMPTY" to 9),
        )
        val ranked = rankWeakTopics(xp, topics)
        assertEquals(listOf("ARTIKEL", "DATIVA1", "PASSIVB1"), ranked.map { it.topic.key })
    }

    @Test
    fun streakMergeKeepsBestOfBoth() {
        val merged = mergeStreak(
            StreakData(3, 5, 1, "2026-10-12", listOf("2026-10-11", "2026-10-12")),
            StreakData(2, 9, 0, "2026-10-13", listOf("2026-10-13")),
        )
        assertEquals(StreakData(3, 9, 1, "2026-10-13", listOf("2026-10-11", "2026-10-12", "2026-10-13")), merged)
    }

    @Test
    fun xpMergeTakesMaxPerTopic() {
        val merged = mergeXp(
            XpData(120, mapOf("A" to 3), mapOf("A" to 1)),
            XpData(100, mapOf("A" to 5, "B" to 1), emptyMap()),
        )
        assertEquals(XpData(120, mapOf("A" to 5, "B" to 1), mapOf("A" to 1)), merged)
    }

    @Test
    fun dailyGoalMergeOnlyKeepsToday() {
        val today = "2026-10-13"
        assertEquals(DailyGoalData(today, 7), mergeDailyGoal(DailyGoalData(today, 7), DailyGoalData(today, 4), today))
        assertEquals(DailyGoalData(today, 4), mergeDailyGoal(DailyGoalData("2026-10-12", 30), DailyGoalData(today, 4), today))
        assertEquals(DailyGoalData(today, 0), mergeDailyGoal(DailyGoalData("2026-10-11", 3), DailyGoalData("2026-10-12", 4), today))
    }
}
