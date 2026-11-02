package de.lernziel.sprachcoach.account

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class LoginLinkTest {
    @Test
    fun extractsTokenFromEmailLink() {
        assertEquals("abc123DEF456ghi789", AccountStore.extractToken("https://lernziel-deutsch.de/?mltoken=abc123DEF456ghi789"))
        assertEquals("abc123DEF456ghi789", AccountStore.extractToken("  https://lernziel-deutsch.de/?x=1&mltoken=abc123DEF456ghi789#/ "))
    }

    @Test
    fun acceptsBareTokenAndRejectsOtherText() {
        assertEquals("0123456789abcdef0123", AccountStore.extractToken("0123456789abcdef0123"))
        assertNull(AccountStore.extractToken("hello"))
        assertNull(AccountStore.extractToken("https://lernziel-deutsch.de/"))
        assertNull(AccountStore.extractToken(""))
    }
}
