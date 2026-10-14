package de.lernziel.sprachcoach.ui

import androidx.appcompat.app.AppCompatDelegate
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.os.LocaleListCompat
import de.lernziel.sprachcoach.R

private val LOCALES = listOf("de", "ru", "en")

/** DE · RU · EN pill (`LocaleSwitcher.vue`). Uses Android per-app languages. */
@Composable
fun LocaleSwitcher() {
    val current = LocalConfiguration.current.locales[0].language.takeIf { it in LOCALES } ?: "de"
    val label = stringResource(R.string.locale_switcher)
    Row(
        modifier = Modifier
            .semantics { contentDescription = label }
            .clip(RoundedCornerShape(16.dp))
            .background(Palette.Card)
            .border(1.dp, Palette.Border, RoundedCornerShape(16.dp))
            .padding(3.dp),
    ) {
        LOCALES.forEach { code ->
            val active = code == current
            Text(
                code.uppercase(),
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = if (active) Color.White else Palette.Muted,
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (active) Palette.Purple else Color.Transparent)
                    .semantics { selected = active }
                    .clickable(role = Role.Button) {
                        AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(code))
                    }
                    .padding(horizontal = 12.dp, vertical = 4.dp),
            )
        }
    }
}
