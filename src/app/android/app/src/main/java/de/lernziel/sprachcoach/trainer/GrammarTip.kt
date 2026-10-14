package de.lernziel.sprachcoach.trainer

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.ui.Palette

/**
 * 📚 Grammatik-Tipp (`GrammarTip.vue`): Premium, shown after an error, with a
 * RU | DE | EN switch (default DE). Renders nothing if the topic has no hint.
 */
@Composable
fun GrammarTip(hint: (lang: String) -> String?) {
    var lang by remember { mutableStateOf("DE") }
    val text = hint(lang) ?: return
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 12.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(Color(0xFFFFF8E1))
            .border(1.dp, Color(0xFFFFC107), RoundedCornerShape(14.dp))
            .padding(14.dp),
    ) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("📚 Grammatik-Tipp", fontWeight = FontWeight.Bold)
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                listOf("RU", "DE", "EN").forEach { code ->
                    Text(
                        code,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (code == lang) Palette.Card else Palette.Muted,
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (code == lang) Palette.Purple else Color.Transparent)
                            .clickable(role = Role.Tab) { lang = code }
                            .padding(horizontal = 8.dp, vertical = 2.dp),
                    )
                }
            }
        }
        Text(text, fontSize = 14.sp, modifier = Modifier.padding(top = 8.dp))
    }
}
