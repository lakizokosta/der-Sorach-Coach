package de.lernziel.sprachcoach.trainer

import de.lernziel.sprachcoach.data.xpLevel
import de.lernziel.sprachcoach.trainer.widgets.normalizeGapAnswer
import org.junit.Assert.assertEquals
import org.junit.Test

class FormatTest {
    @Test
    fun formatsTimer() {
        assertEquals("10:00", formatMmSs(600))
        assertEquals("00:09", formatMmSs(9))
    }

    @Test
    fun normalizesGapAnswersLikeTheWeb() {
        assertEquals("der tisch", normalizeGapAnswer("  Der   Tisch "))
        assertEquals("über", normalizeGapAnswer("Über"))
    }

    @Test
    fun xpLevelThresholds() {
        assertEquals(1, xpLevel(99).num)
        assertEquals(2, xpLevel(100).num)
        assertEquals(3, xpLevel(500).num)
        assertEquals(4, xpLevel(1500).num)
        assertEquals(5, xpLevel(4000).num)
    }
}
