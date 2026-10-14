package de.lernziel.sprachcoach.trainer.widgets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.FlowRowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.ui.Palette

/** Callbacks every question widget reports to the trainer (`first-wrong` / `answer` on the web). */
class AnswerCallbacks(val onFirstWrong: () -> Unit, val onAnswer: (isCorrect: Boolean) -> Unit)

/** Instruction / prompt box shown above a widget (`.question-box`); [dictionary] makes words tappable. */
@Composable
fun PromptBox(text: String, modifier: Modifier = Modifier, dictionary: Boolean = false) {
    if (dictionary) {
        PromptText(text, modifier = modifier.promptBox())
    } else {
        Text(text, fontSize = 17.sp, modifier = modifier.promptBox())
    }
}

private fun Modifier.promptBox() = this
    .fillMaxWidth()
    .clip(RoundedCornerShape(12.dp))
    .background(Palette.Card)
    .padding(14.dp)

/**
 * Emits [text] word by word into a FlowRow so it wraps naturally around
 * inline elements (gaps, inputs). Newlines force a line break.
 */
@Composable
fun FlowRowScope.FlowText(
    text: String,
    fontSize: TextUnit = 20.sp,
    color: Color = Palette.Text,
    dictionary: Boolean = false,
) {
    val lines = text.split('\n')
    lines.forEachIndexed { lineIndex, line ->
        if (lineIndex > 0) Box(Modifier.fillMaxWidth().height(0.dp))
        line.split(' ').filter { it.isNotEmpty() }.forEach { word ->
            if (dictionary) {
                FlowWord(word, fontSize, color)
            } else {
                Text(word, fontSize = fontSize, color = color, modifier = Modifier.padding(end = 5.dp, bottom = 6.dp))
            }
        }
    }
}

/** Small white action button (Prüfen / Tipp / Noch einmal). */
@Composable
fun WidgetButton(text: String, onClick: () -> Unit, enabled: Boolean = true) {
    OutlinedButton(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Palette.Border),
        colors = ButtonDefaults.outlinedButtonColors(containerColor = Palette.Card, contentColor = Palette.Text),
    ) {
        Text(text, fontWeight = FontWeight.Bold)
    }
}

/** Single umlaut key of the German character row. */
@Composable
fun KeyButton(text: String, onClick: () -> Unit) {
    TextButton(
        onClick = onClick,
        modifier = Modifier.padding(2.dp).clip(RoundedCornerShape(8.dp)).background(Palette.Card),
    ) {
        Text(text, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Palette.Text)
    }
}

/** Status line under a widget (green success / red error). */
@Composable
fun Message(text: String, good: Boolean) {
    if (text.isEmpty()) return
    Text(
        text,
        color = if (good) Palette.Green else Palette.Red,
        fontWeight = FontWeight.Bold,
        modifier = Modifier.padding(top = 8.dp),
    )
}
