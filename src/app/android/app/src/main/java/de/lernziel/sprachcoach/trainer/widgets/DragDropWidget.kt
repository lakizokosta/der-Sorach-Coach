package de.lernziel.sprachcoach.trainer.widgets

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.data.Chunk
import de.lernziel.sprachcoach.data.Dropbox
import de.lernziel.sprachcoach.data.TekamoloGroup
import de.lernziel.sprachcoach.ui.Palette

/** Initial bank order: shuffled, but never already in the correct order (`scrambleBank`). */
private fun scrambled(chunks: List<Chunk>): List<Chunk> {
    val s = chunks.shuffled().toMutableList()
    if (s.size > 1 && s.map { it.id } == chunks.map { it.id }) {
        s[0] = s.last().also { s[s.lastIndex] = s[0] }
    }
    return s
}

/**
 * `dropbox` (`DragDrop.vue`): tap chips into sentence order. After the first
 * wrong check, chips already in place turn green and lock; the second wrong
 * check reveals the solution (plus TeKaMoLo breakdown). Tipp places the next
 * correct chip without affecting the score.
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun DragDropWidget(question: Dropbox, callbacks: AnswerCallbacks) {
    val reference = question.chunks
    val bank = remember { mutableStateListOf<Chunk>().apply { addAll(scrambled(reference)) } }
    val drop = remember { mutableStateListOf<Chunk>() }
    var wrongChecks by remember { mutableIntStateOf(0) }
    var hadWrong by remember { mutableStateOf(false) }
    var finalised by remember { mutableStateOf(false) }
    var succeeded by remember { mutableStateOf(false) }
    var showSolution by remember { mutableStateOf(false) }
    var message by remember { mutableStateOf("") }

    val msgPlaceWords = stringResource(R.string.q_place_words)
    val msgCorrect = stringResource(R.string.q_correct)
    val msgWrong = stringResource(R.string.q_wrong_solution)

    val locked = finalised || showSolution
    fun inPlace(index: Int) = drop.getOrNull(index)?.id == reference.getOrNull(index)?.id
    fun isChipLocked(index: Int) = wrongChecks >= 1 && !locked && inPlace(index)

    /** When one chip is left in the bank it moves automatically. */
    fun autoAppendLast() {
        if (bank.size == 1) drop += bank.removeAt(0)
    }

    fun push(chunk: Chunk) {
        if (locked) return
        bank.remove(chunk)
        drop += chunk
        autoAppendLast()
    }

    fun pop(index: Int) {
        if (locked || isChipLocked(index)) return
        bank += drop.removeAt(index)
    }

    fun firstMismatch(): Int = drop.indices.firstOrNull { !inPlace(it) } ?: drop.size

    fun applyHint() {
        if (locked) return
        val target = firstMismatch()
        if (target >= reference.size) return
        while (drop.size > target) bank += drop.removeAt(drop.lastIndex)
        val next = reference[target]
        if (bank.removeIf { it.id == next.id }) {
            drop += next
            autoAppendLast()
        }
    }

    fun finalise(correct: Boolean) {
        finalised = true
        succeeded = correct
        if (correct) message = msgCorrect
        callbacks.onAnswer(correct && !hadWrong)
    }

    fun check() {
        if (finalised) return
        if (drop.isEmpty()) {
            message = msgPlaceWords
            return
        }
        val words = drop.flatMap { it.words }
        if (question.validOrders.any { it == words }) {
            finalise(true)
            return
        }
        wrongChecks += 1
        hadWrong = true
        message = ""
        if (wrongChecks == 1) {
            callbacks.onFirstWrong()
            return
        }
        showSolution = true
        drop.replaceAll(reference)
        bank.clear()
        message = msgWrong
        finalise(false)
    }

    fun chipColor(index: Int): Color = when {
        showSolution || (finalised && succeeded) -> Palette.Green
        wrongChecks >= 1 && inPlace(index) -> Palette.Green
        else -> Palette.PurpleTint
    }

    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PromptBox(question.prompt.ifEmpty { stringResource(R.string.q_dropbox_default_prompt) })

        // Drop zone: placed chips with automatic commas and fixed punctuation.
        FlowRow(
            modifier = Modifier
                .fillMaxWidth()
                .defaultMinSize(minHeight = 64.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(Palette.Card)
                .border(2.dp, Palette.Purple.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
                .padding(10.dp),
            horizontalArrangement = Arrangement.Center,
            itemVerticalAlignment = Alignment.CenterVertically,
        ) {
            if (drop.isEmpty()) {
                Text(stringResource(R.string.q_dropbox_placeholder), color = Palette.Muted, modifier = Modifier.padding(8.dp))
            }
            val anchored = mutableSetOf<Int>()
            drop.forEachIndexed { index, chunk ->
                val lastWord = chunk.start + chunk.words.size - 1
                val endWordIndex = drop.take(index + 1).sumOf { it.words.size } - 1
                val suffix = buildString {
                    if (endWordIndex in question.commaAfter) append(',')
                    question.punctAfter[lastWord]?.let { append(it); anchored += lastWord }
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    ChipText(chunk.text, chipColor(index), onClick = { pop(index) })
                    if (suffix.isNotEmpty()) Text(suffix, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                }
            }
            // Punctuation whose word is not placed yet stays visible at the end.
            question.punctAfter.keys.filter { it !in anchored }.sorted().forEach { key ->
                Text(question.punctAfter.getValue(key), fontSize = 20.sp, modifier = Modifier.alpha(0.4f).padding(4.dp))
            }
        }

        // Word bank.
        FlowRow(horizontalArrangement = Arrangement.Center, modifier = Modifier.fillMaxWidth()) {
            bank.toList().forEach { chunk -> ChipText(chunk.text, Palette.Answer, onClick = { push(chunk) }) }
        }

        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally)) {
            WidgetButton(stringResource(R.string.q_check), onClick = ::check, enabled = !finalised)
            WidgetButton(stringResource(R.string.q_tip), onClick = ::applyHint, enabled = !locked && firstMismatch() < reference.size)
            WidgetButton(stringResource(R.string.q_retry), enabled = !finalised, onClick = {
                wrongChecks = 0
                showSolution = false
                message = ""
                drop.clear()
                bank.replaceAll(scrambled(reference))
            })
        }

        Message(message, good = succeeded)
        if (showSolution) {
            Text(question.solution, color = Palette.GreenDark, fontWeight = FontWeight.Bold, fontSize = 18.sp, textAlign = TextAlign.Center)
            if (question.tekamolo.isNotEmpty()) TekamoloBreakdown(question.tekamolo)
        }
    }
}

private fun SnapshotStateList<Chunk>.replaceAll(chunks: List<Chunk>) {
    clear()
    addAll(chunks)
}

@Composable
private fun ChipText(text: String, color: Color, onClick: () -> Unit) {
    val onColor = if (color == Palette.Green) Palette.Card else Palette.Text
    Text(
        text,
        fontSize = 18.sp,
        fontWeight = FontWeight.Bold,
        color = onColor,
        modifier = Modifier
            .padding(4.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(color)
            .border(1.dp, Palette.Border, RoundedCornerShape(10.dp))
            .clickable(role = Role.Button, onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 8.dp),
    )
}

/** 📌 SATZANALYSE: Te(mporal) · Ka(usal) · Mo(dal) · Lo(kal) groups, colours from `DragDrop.vue`. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun TekamoloBreakdown(groups: List<TekamoloGroup>) {
    data class Style(val label: String, val bg: Color, val border: Color, val text: Color)
    val styles = mapOf(
        "T" to Style("Te · Wann?", Color(0xFFFFF3E0), Color(0xFFFF9800), Color(0xFFBF360C)),
        "K" to Style("Ka · Warum?", Color(0xFFE3F2FD), Color(0xFF1976D2), Color(0xFF0D47A1)),
        "M" to Style("Mo · Wie?", Color(0xFFE8F5E9), Color(0xFF388E3C), Color(0xFF1B5E20)),
        "L" to Style("Lo · Wo/Wohin?", Color(0xFFFCE4EC), Color(0xFFC2185B), Color(0xFF880E4F)),
    )
    val neutral = Style("", Color(0xFFF5F5F5), Color(0xFFBDBDBD), Color(0xFF555555))
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(stringResource(R.string.q_satzanalyse), fontSize = 11.sp, color = Palette.Muted)
        FlowRow(horizontalArrangement = Arrangement.Center, modifier = Modifier.fillMaxWidth()) {
            groups.forEach { group ->
                val style = styles[group.code] ?: neutral
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(3.dp)) {
                    Text(
                        group.text,
                        color = style.text,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(style.bg)
                            .border(2.dp, style.border, RoundedCornerShape(10.dp))
                            .padding(horizontal = 10.dp, vertical = 6.dp),
                    )
                    if (style.label.isNotEmpty()) Text(style.label, fontSize = 11.sp, fontWeight = FontWeight.Black, color = style.text)
                }
            }
        }
    }
}
