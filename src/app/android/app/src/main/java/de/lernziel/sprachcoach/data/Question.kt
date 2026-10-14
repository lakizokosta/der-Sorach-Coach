package de.lernziel.sprachcoach.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonClassDiscriminator

/**
 * A trainer question as exported by `scripts/export-android-assets.mjs`.
 *
 * Display values the web widgets derive at runtime (stripped prompts, gap
 * cues, dropbox chunks, …) are precomputed by the export, so these classes
 * only carry what the widgets render and score.
 */
@OptIn(kotlinx.serialization.ExperimentalSerializationApi::class)
@Serializable
@JsonClassDiscriminator("type")
sealed interface Question {
    val id: String
    val level: String
    val topic: String

    /** Content fingerprint; identical questions share it (`dedupeQuestions.js`). */
    val fp: String
}

/** `select-one` → MultipleChoice. Correct iff the first click hits [correct]. */
@Serializable
@SerialName("select-one")
data class SelectOne(
    override val id: String,
    override val level: String,
    override val topic: String,
    override val fp: String,
    val prompt: String,
    val options: List<String>,
    val correct: String,
) : Question

/** `multi-select` → MultiSelect. Correct iff the picked set equals [correctSet]. */
@Serializable
@SerialName("multi-select")
data class MultiSelect(
    override val id: String,
    override val level: String,
    override val topic: String,
    override val fp: String,
    val prompt: String,
    val options: List<String>,
    val correctSet: List<String>,
) : Question

/** `input-text` → FillBlank. [acceptable] is already normalised (`normalizeGapAnswer`). */
@Serializable
@SerialName("input-text")
data class InputText(
    override val id: String,
    override val level: String,
    override val topic: String,
    override val fp: String,
    val instruction: String,
    val left: String,
    val right: String,
    val correct: List<String>,
    val acceptable: List<String>,
    val hint: String,
    val verbInfinitive: String,
    val wordChoices: List<String>,
    val gapCue: String,
) : Question

/** One tappable dropbox chip: one or more consecutive words of the sentence. */
@Serializable
data class Chunk(val id: String, val start: Int, val words: List<String>) {
    val text: String get() = words.joinToString(" ")
}

/** A TeKaMoLo group for the SATZANALYSE breakdown (`T|K|M|L|_`). */
@Serializable
data class TekamoloGroup(val code: String, val text: String)

/** `dropbox` → DragDrop. Words are tapped into order; punctuation is fixed. */
@Serializable
@SerialName("dropbox")
data class Dropbox(
    override val id: String,
    override val level: String,
    override val topic: String,
    override val fp: String,
    val prompt: String,
    /** Core-word index → fixed punctuation (`.`, `?`, `!`) shown after it. */
    val punctAfter: Map<Int, String>,
    /** Core-word indices followed by an automatic comma. */
    val commaAfter: List<Int>,
    /** Chips in reference order. */
    val chunks: List<Chunk>,
    /** Accepted word orders (reference first, then alternatives). */
    val validOrders: List<List<String>>,
    val solution: String,
    val tekamolo: List<TekamoloGroup>,
) : Question

@Serializable
data class Gap(val correct: String, val options: List<String>)

/** `text-gaps` → TextGaps. [parts] surround the gaps: parts[0] gap0 parts[1] gap1 … */
@Serializable
@SerialName("text-gaps")
data class TextGaps(
    override val id: String,
    override val level: String,
    override val topic: String,
    override val fp: String,
    val label: String,
    val parts: List<String>,
    val gaps: List<Gap>,
) : Question

@Serializable
data class TopicInfo(val name: String, val count: Int)

/** A grammar topic of the Premium hub (`src/site/data/premiumTopics.js`). */
@Serializable
data class HubTopic(val key: String, val name: String, val desc: String, val count: Int)

/** A Wortschatz set (`src/site/data/vocabularySets.js`); [accent] is a CSS hex colour or empty. */
@Serializable
data class VocabSet(val key: String, val name: String, val desc: String, val count: Int, val accent: String = "")

@Serializable
data class HubLevel(val topics: List<HubTopic>, val vocab: List<VocabSet>)

/** Precomputed dictionary entry: lemma, part of speech, gender (m/f/n) and RU/EN gloss. */
@Serializable
data class DictEntry(
    @SerialName("l") val lemma: String,
    @SerialName("p") val pos: String? = null,
    @SerialName("g") val gender: String? = null,
    val ru: String? = null,
    val en: String? = null,
)

/** Topic keys match across CEFR suffixes: `AKKUSATIV` ≙ `AKKUSATIVA1` (`normalizeTopicKey`). */
fun normalizeTopicKey(key: String): String = key.uppercase().replace(Regex("(A1|A2|B1|B2)$"), "")
