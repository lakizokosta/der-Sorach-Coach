package de.lernziel.sprachcoach.trainer.widgets

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.data.InputText
import de.lernziel.sprachcoach.ui.Palette

private val UMLAUTS = listOf("ä", "ö", "ü", "Ä", "Ö", "Ü", "ß")

/** Same normalisation as `normalizeGapAnswer`: trim, lower-case, collapse whitespace. */
fun normalizeGapAnswer(value: String): String = value.trim().lowercase().replace(Regex("\\s+"), " ")

/**
 * `input-text` (`FillBlank.vue`): type the missing word. First wrong check
 * allows another try; the second reveals `correct[0]`. Noch einmal clears
 * the input and the wrong-check counter.
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FillBlankWidget(question: InputText, callbacks: AnswerCallbacks) {
    var value by remember { mutableStateOf(TextFieldValue("")) }
    var wrongChecks by remember { mutableIntStateOf(0) }
    var hadWrong by remember { mutableStateOf(false) }
    var finalised by remember { mutableStateOf(false) }
    var isOk by remember { mutableStateOf(false) }
    var revealed by remember { mutableStateOf(false) }
    var message by remember { mutableStateOf("") }
    var hintVisible by remember { mutableStateOf(false) }
    val wordChoices = remember { question.wordChoices.shuffled() }
    val focus = remember { FocusRequester() }
    LaunchedEffect(Unit) { focus.requestFocus() }

    val msgEnterAnswer = stringResource(R.string.q_enter_answer)
    val msgCorrect = stringResource(R.string.q_correct)
    val msgWrong = stringResource(R.string.q_wrong_answer)

    fun check() {
        if (finalised) return
        val answer = normalizeGapAnswer(value.text)
        if (answer.isEmpty()) {
            message = msgEnterAnswer
            return
        }
        if (answer in question.acceptable) {
            finalised = true
            isOk = true
            message = msgCorrect
            callbacks.onAnswer(!hadWrong)
            return
        }
        wrongChecks += 1
        if (!hadWrong) {
            hadWrong = true
            callbacks.onFirstWrong()
        }
        if (wrongChecks >= 2) {
            val solution = question.correct.firstOrNull().orEmpty()
            value = TextFieldValue(solution, TextRange(solution.length))
            revealed = true
            finalised = true
            message = msgWrong
            callbacks.onAnswer(false)
        } else {
            message = ""
            focus.requestFocus()
        }
    }

    fun insert(char: String) {
        if (finalised) return
        val sel = value.selection
        val text = value.text.replaceRange(sel.min, sel.max, char)
        value = TextFieldValue(text, TextRange(sel.min + char.length))
        focus.requestFocus()
    }

    val fieldColor = when {
        isOk -> Palette.Green.copy(alpha = 0.18f)
        revealed -> Palette.Revealed
        wrongChecks > 0 -> Palette.Red.copy(alpha = 0.15f)
        else -> Palette.Card
    }
    val borderColor = when {
        isOk -> Palette.Green
        revealed -> Palette.GreenDark
        wrongChecks > 0 -> Palette.Red
        else -> Palette.Purple
    }

    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        PromptBox(question.instruction.ifEmpty { stringResource(R.string.trainer_fill_blank_default) })

        FlowRow(
            modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
            horizontalArrangement = Arrangement.Center,
            verticalArrangement = Arrangement.Center,
            itemVerticalAlignment = Alignment.CenterVertically,
        ) {
            FlowText(question.left, dictionary = true)
            BasicTextField(
                value = value,
                onValueChange = { if (!finalised) value = it },
                singleLine = true,
                readOnly = finalised,
                textStyle = TextStyle(fontSize = 20.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center),
                keyboardOptions = KeyboardOptions(
                    capitalization = KeyboardCapitalization.None,
                    autoCorrectEnabled = false,
                    imeAction = ImeAction.Done,
                ),
                keyboardActions = KeyboardActions(onDone = { check() }),
                modifier = Modifier
                    .focusRequester(focus)
                    .padding(end = 5.dp, bottom = 6.dp)
                    .widthIn(min = 90.dp, max = 260.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(fieldColor)
                    .border(2.dp, borderColor, RoundedCornerShape(8.dp))
                    .padding(horizontal = 10.dp, vertical = 6.dp),
            )
            FlowText(question.right, dictionary = true)
            if (question.gapCue.isNotEmpty()) FlowText("(${question.gapCue})", color = Palette.Muted)
        }

        when {
            question.verbInfinitive.isNotEmpty() ->
                Text(stringResource(R.string.trainer_infinitive_hint, question.verbInfinitive), color = Palette.PurpleDark)
            wordChoices.isNotEmpty() ->
                Text("${stringResource(R.string.trainer_word_choices_hint)} ${wordChoices.joinToString(" · ")}", color = Palette.PurpleDark)
        }

        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally)) {
            WidgetButton(stringResource(R.string.q_check), onClick = ::check, enabled = !finalised)
            if (question.hint.isNotEmpty()) {
                WidgetButton(stringResource(R.string.q_tip), onClick = { hintVisible = true })
            }
            WidgetButton(stringResource(R.string.q_retry), enabled = !finalised, onClick = {
                value = TextFieldValue("")
                wrongChecks = 0
                message = ""
                focus.requestFocus()
            })
        }

        Message(message, good = isOk)
        if (hintVisible) Text("💡 ${question.hint}", color = Palette.Muted)
        if (question.hint.isNotEmpty() && !finalised && !hintVisible) {
            Text(stringResource(R.string.trainer_fill_blank_tip_hint), color = Palette.Muted, fontSize = 13.sp)
        }

        if (!finalised) {
            FlowRow(horizontalArrangement = Arrangement.Center) {
                UMLAUTS.forEach { KeyButton(it) { insert(it) } }
            }
        }
    }
}
