package de.lernziel.sprachcoach.trainer.widgets

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRowScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.LinkAnnotation
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextLinkStyles
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withLink
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.data.DictEntry
import de.lernziel.sprachcoach.ui.Palette

/** Premium dictionary: which words can be looked up, and what happens on tap. */
class DictionaryAccess(val lookup: (String) -> DictEntry?, val open: (String) -> Unit)

/** Provided by the trainer for Premium users only; null means plain text. */
val LocalDictionary = staticCompositionLocalOf<DictionaryAccess?> { null }

private val WORD = Regex("[А-Яа-яA-Za-zÄÖÜäöüß]+")

/** Prompt text whose known words open the dictionary (`wrapWordsForDictionary`). */
@Composable
fun PromptText(
    text: String,
    modifier: Modifier = Modifier,
    fontSize: TextUnit = 17.sp,
    textAlign: TextAlign = TextAlign.Start,
) {
    val dict = LocalDictionary.current
    val annotated = if (dict == null) {
        AnnotatedString(text)
    } else {
        buildAnnotatedString {
            var last = 0
            for (match in WORD.findAll(text)) {
                append(text.substring(last, match.range.first))
                val word = match.value
                if (dict.lookup(word) != null) {
                    withLink(LinkAnnotation.Clickable(word, DICT_LINK_STYLE) { dict.open(word) }) { append(word) }
                } else {
                    append(word)
                }
                last = match.range.last + 1
            }
            append(text.substring(last))
        }
    }
    Text(annotated, fontSize = fontSize, textAlign = textAlign, modifier = modifier)
}

private val DICT_LINK_STYLE = TextLinkStyles(
    style = SpanStyle(textDecoration = TextDecoration.Underline, color = Palette.PurpleDark),
)

/** One word of a [FlowText] line; tappable when the dictionary knows it. */
@Composable
fun FlowRowScope.FlowWord(word: String, fontSize: TextUnit, color: Color) {
    val dict = LocalDictionary.current
    val core = WORD.find(word)?.value
    val known = dict != null && core != null && dict.lookup(core) != null
    Text(
        word,
        fontSize = fontSize,
        color = if (known) Palette.PurpleDark else color,
        textDecoration = if (known) TextDecoration.Underline else null,
        modifier = Modifier
            .padding(end = 5.dp, bottom = 6.dp)
            .then(if (known) Modifier.clickable(role = Role.Button) { dict.open(core) } else Modifier),
    )
}

/**
 * Popup card for a looked-up word (`DictionaryPopup.vue`): word, `→ lemma`,
 * part of speech (der/die/das, Verb, Adj., Adv.), translation in the UI
 * language (German UI shows Russian, else English).
 */
@Composable
fun DictionaryCard(word: String, entry: DictEntry?, onClose: () -> Unit, modifier: Modifier = Modifier) {
    val ui = LocalConfiguration.current.locales[0].language
    val translation = when (ui) {
        "en" -> entry?.en
        "ru" -> entry?.ru
        else -> entry?.ru ?: entry?.en
    } ?: "—"
    val pos = when (entry?.pos) {
        "verb" -> "Verb"
        "adv" -> "Adv."
        "adj" -> "Adj."
        "noun" -> mapOf("m" to "der", "f" to "die", "n" to "das")[entry.gender] ?: "Nomen"
        else -> ""
    }
    val lemma = entry?.lemma?.let { if (entry.pos == "noun") it.replaceFirstChar(Char::uppercase) else it }
    Column(
        modifier = modifier
            .widthIn(max = 360.dp)
            .fillMaxWidth()
            .shadow(8.dp, RoundedCornerShape(16.dp))
            .clip(RoundedCornerShape(16.dp))
            .background(Palette.Card)
            .border(1.dp, Palette.Purple, RoundedCornerShape(16.dp))
            .clickable(onClick = onClose)
            .padding(16.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(word, fontWeight = FontWeight.Bold, fontSize = 20.sp, modifier = Modifier.weight(1f))
            if (pos.isNotEmpty()) Text(pos, color = Palette.Purple, fontWeight = FontWeight.Bold)
            Text("  ✕", color = Palette.Muted, fontSize = 18.sp)
        }
        if (lemma != null && !lemma.equals(word, ignoreCase = true)) {
            Text("→ $lemma", color = Palette.Muted)
        }
        Spacer(Modifier.height(6.dp))
        Text(translation, fontSize = 18.sp)
        Text("Wörterbuch", fontSize = 11.sp, color = Palette.Muted, modifier = Modifier.padding(top = 6.dp))
    }
}
