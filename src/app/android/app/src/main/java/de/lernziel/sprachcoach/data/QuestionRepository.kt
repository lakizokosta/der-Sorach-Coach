package de.lernziel.sprachcoach.data

import android.content.res.AssetManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json

/**
 * Loads the bundled content exported from src/site: grammar and vocab banks,
 * topic manifest, Premium hub catalogue, grammar hints and dictionary.
 */
class QuestionRepository(private val assets: AssetManager) {

    private val json = Json { ignoreUnknownKeys = true }
    private val cache = mutableMapOf<String, List<Question>>()
    private var topics: Map<String, Map<String, TopicInfo>>? = null
    private val hub: Map<String, HubLevel> by lazy { read("hub.json") }
    private val grammarHints: Map<String, Map<String, String>> by lazy { read("grammarHints.json") }
    private val dictionary: Map<String, DictEntry> by lazy { read("dictionary.json") }

    private inline fun <reified T> read(path: String): T =
        assets.open(path).bufferedReader().use { json.decodeFromString<T>(it.readText()) }

    /** Grammar questions of a level (`assets/questions/<LEVEL>.json`). */
    suspend fun questionsForLevel(level: String): List<Question> = bank("questions", level)

    /** Wortschatz questions of a level (`assets/vocab/<LEVEL>.json`). */
    suspend fun vocabForLevel(level: String): List<Question> = bank("vocab", level)

    private suspend fun bank(dir: String, level: String): List<Question> = withContext(Dispatchers.IO) {
        synchronized(cache) {
            cache.getOrPut("$dir/$level") {
                if (level !in LEVELS) emptyList() else read<List<Question>>("$dir/$level.json")
            }
        }
    }

    /** Questions of one grammar topic; keys match regardless of the CEFR suffix. */
    suspend fun questionsForTopic(level: String, topic: String): List<Question> {
        val key = normalizeTopicKey(topic)
        return questionsForLevel(level).filter { normalizeTopicKey(it.topic) == key }
    }

    suspend fun questionsForVocabSet(level: String, set: String): List<Question> =
        vocabForLevel(level).filter { it.topic == set.uppercase() }

    fun hubLevel(level: String): HubLevel = hub[level] ?: HubLevel(emptyList(), emptyList())

    fun hubTopic(level: String, key: String): HubTopic? = hubLevel(level).topics.firstOrNull { it.key == key.uppercase() }

    fun vocabSet(level: String, key: String): VocabSet? = hubLevel(level).vocab.firstOrNull { it.key == key.uppercase() }

    /** Grammatik-Tipp text for a topic in DE/RU/EN, falling back to German (`getStaticHint`). */
    fun grammarHint(topic: String, lang: String): String? {
        val upper = topic.uppercase()
        val hint = grammarHints[upper] ?: grammarHints[normalizeTopicKey(upper)] ?: return null
        return hint[lang.uppercase()] ?: hint["DE"]
    }

    fun lookupWord(word: String): DictEntry? = dictionary[word.lowercase()]

    /** Friendly name and pool size of a topic, or null if unknown. */
    suspend fun topicInfo(level: String, topic: String): TopicInfo? = withContext(Dispatchers.IO) {
        val all = topics ?: assets.open("topics.json").bufferedReader().use {
            json.decodeFromString<Map<String, Map<String, TopicInfo>>>(it.readText())
        }.also { topics = it }
        all[level]?.get(topic.uppercase())
    }

    fun legalHtml(slug: String): String =
        assets.open("legal/$slug.html").bufferedReader().use { it.readText() }

    companion object {
        val LEVELS = listOf("A1", "A2", "B1", "B2")
    }
}
