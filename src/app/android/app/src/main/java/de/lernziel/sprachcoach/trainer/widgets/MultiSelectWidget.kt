package de.lernziel.sprachcoach.trainer.widgets

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.data.MultiSelect
import de.lernziel.sprachcoach.ui.Palette

/**
 * `multi-select` (`MultiSelect.vue`): toggle options, single check. Correct
 * only if the picked set equals the correct set exactly; never a retry.
 */
@Composable
fun MultiSelectWidget(question: MultiSelect, callbacks: AnswerCallbacks) {
    val options = remember { question.options.shuffled() }
    val correct = remember { question.correctSet.toSet() }
    var selected by remember { mutableStateOf(emptySet<String>()) }
    var finalised by remember { mutableStateOf(false) }

    Column(verticalArrangement = Arrangement.spacedBy(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        PromptBox(question.prompt, dictionary = true)
        options.forEach { option ->
            val picked = option in selected
            val isRight = option in correct
            val (prefix, color) = when {
                !finalised -> (if (picked) "☑️" else "☐") to (if (picked) Palette.PurpleTint else Palette.Answer)
                picked && isRight -> "✅" to Palette.Green
                isRight -> "☑️" to Palette.Revealed
                picked -> "❌" to Palette.Red
                else -> "☐" to Palette.Answer
            }
            val onColor = if (color == Palette.Green || color == Palette.Red) Palette.Card else Palette.Text
            OutlinedButton(
                onClick = { selected = if (picked) selected - option else selected + option },
                enabled = !finalised,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                border = BorderStroke(2.dp, Palette.Border),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = color,
                    contentColor = onColor,
                    disabledContainerColor = color,
                    disabledContentColor = onColor,
                ),
            ) {
                Text("$prefix  $option", fontSize = 17.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(vertical = 4.dp))
            }
        }
        if (!finalised) {
            WidgetButton(stringResource(R.string.q_check_plain), enabled = selected.isNotEmpty(), onClick = {
                finalised = true
                callbacks.onAnswer(selected == correct)
            })
        }
    }
}
