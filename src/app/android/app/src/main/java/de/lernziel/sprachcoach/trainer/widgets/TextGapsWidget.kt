package de.lernziel.sprachcoach.trainer.widgets

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.data.TextGaps
import de.lernziel.sprachcoach.ui.Palette

/**
 * `text-gaps` (`TextGaps.vue`): tap a gap, pick one of three forms. A wrong
 * pick leaves the gap empty (and makes the question count as wrong); the
 * question resolves once every gap is filled correctly.
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun TextGapsWidget(question: TextGaps, callbacks: AnswerCallbacks) {
    val answers = remember { mutableStateListOf<String?>().apply { repeat(question.gaps.size) { add(null) } } }
    var openGap by remember { mutableIntStateOf(-1) }
    var options by remember { mutableStateOf(emptyList<String>()) }
    var hadWrong by remember { mutableStateOf(false) }
    var finalised by remember { mutableStateOf(false) }

    fun pick(option: String) {
        val idx = openGap
        openGap = -1
        if (idx < 0 || finalised) return
        val gap = question.gaps[idx]
        if (option.trim() == gap.correct.trim()) {
            answers[idx] = option
            if (answers.indices.all { answers[it] == question.gaps[it].correct }) {
                finalised = true
                callbacks.onAnswer(!hadWrong)
            }
        } else if (!hadWrong) {
            hadWrong = true
            callbacks.onFirstWrong()
        }
    }

    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        if (question.label.isNotEmpty()) {
            Text(question.label, fontWeight = FontWeight.Bold, color = Palette.PurpleDark)
        }
        FlowRow(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(Palette.Card)
                .padding(14.dp),
            itemVerticalAlignment = Alignment.CenterVertically,
        ) {
            question.parts.forEachIndexed { i, part ->
                FlowText(part, fontSize = 17.sp)
                if (i < question.gaps.size) {
                    val value = answers[i]
                    Box(Modifier.padding(end = 5.dp, bottom = 6.dp)) {
                        Text(
                            value ?: "…",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (value != null) Palette.GreenDark else Palette.Purple,
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (value != null) Palette.Green.copy(alpha = 0.18f) else Palette.PurpleTint)
                                .border(1.dp, if (openGap == i) Palette.Purple else Palette.Border, RoundedCornerShape(8.dp))
                                .clickable(role = Role.Button, enabled = !finalised && value == null) {
                                    options = question.gaps[i].options.shuffled()
                                    openGap = i
                                }
                                .padding(horizontal = 12.dp, vertical = 4.dp),
                        )
                        DropdownMenu(expanded = openGap == i, onDismissRequest = { openGap = -1 }) {
                            options.forEach { option ->
                                DropdownMenuItem(text = { Text(option, fontSize = 17.sp) }, onClick = { pick(option) })
                            }
                        }
                    }
                }
            }
        }
        if (!finalised) {
            Text(stringResource(R.string.q_textgaps_helper), color = Palette.Muted, fontSize = 13.sp)
        }
    }
}
