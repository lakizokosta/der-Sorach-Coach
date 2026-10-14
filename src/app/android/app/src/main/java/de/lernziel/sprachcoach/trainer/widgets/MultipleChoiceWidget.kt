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
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.data.SelectOne
import de.lernziel.sprachcoach.ui.Palette

/**
 * `select-one` (`MultipleChoice.vue`): wrong picks turn red and stay; the
 * learner keeps trying until the right option. Correct only if the first
 * click was right. When only the correct option is left it resolves as wrong.
 */
@Composable
fun MultipleChoiceWidget(question: SelectOne, callbacks: AnswerCallbacks) {
    val options = remember { question.options.shuffled() }
    val wrongPicks = remember { mutableStateListOf<String>() }
    var finalised by remember { mutableStateOf(false) }

    fun isCorrect(option: String) = option.trim() == question.correct.trim()

    fun pick(option: String) {
        if (finalised || option in wrongPicks) return
        if (isCorrect(option)) {
            finalised = true
            callbacks.onAnswer(wrongPicks.isEmpty())
            return
        }
        if (wrongPicks.isEmpty()) callbacks.onFirstWrong()
        wrongPicks += option
        if (options.count { it !in wrongPicks } == 1) {
            finalised = true
            callbacks.onAnswer(false)
        }
    }

    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        PromptText(
            question.prompt,
            fontSize = 24.sp,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
        )
        options.forEach { option ->
            val color = when {
                finalised && isCorrect(option) -> Palette.Green
                option in wrongPicks -> Palette.Red
                else -> Palette.Answer
            }
            val onColor = if (color == Palette.Answer) Palette.Text else Palette.Card
            OutlinedButton(
                onClick = { pick(option) },
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
                Text(option, fontSize = 17.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(vertical = 4.dp))
            }
        }
    }
}
