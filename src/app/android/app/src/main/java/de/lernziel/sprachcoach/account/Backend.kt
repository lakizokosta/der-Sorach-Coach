package de.lernziel.sprachcoach.account

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.booleanOrNull
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.SocketTimeoutException
import java.net.URL
import java.net.URLEncoder

/** A backend reply: the JSON object, or a failure with a message. */
class BackendResult(val json: JsonObject, val networkError: Boolean = false) {
    val ok: Boolean get() = json["ok"].bool() == true
    val error: String get() = json["error"].str().ifEmpty { "Fehler" }

    fun str(key: String): String = json[key].str()
    fun bool(key: String): Boolean = json[key].bool() == true

    companion object {
        fun failure(message: String, network: Boolean) =
            BackendResult(buildJsonObject { put("ok", JsonPrimitive(false)); put("error", JsonPrimitive(message)) }, network)
    }
}

private fun JsonElement?.str(): String = (this as? JsonPrimitive)?.contentOrNull.orEmpty()
private fun JsonElement?.bool(): Boolean? = (this as? JsonPrimitive)?.booleanOrNull

/**
 * Client for the Google Apps Script backend, mirroring `src/site/utils/api.js`:
 * GET with query parameters, POST as a `text/plain` JSON body, and one retry
 * for transient network failures. Never throws.
 */
class Backend(private val scriptUrl: String) {

    private val json = Json { ignoreUnknownKeys = true }

    val configured: Boolean get() = scriptUrl.isNotBlank()

    suspend fun get(params: Map<String, String>, timeoutMs: Int = 25_000): BackendResult = withRetry {
        val query = params.entries.joinToString("&") { (k, v) -> "${enc(k)}=${enc(v)}" }
        request(URL("$scriptUrl?$query"), "GET", null, timeoutMs)
    }

    suspend fun post(body: JsonObject, timeoutMs: Int = 25_000): BackendResult = withRetry {
        request(URL(scriptUrl), "POST", body.toString(), timeoutMs)
    }

    private suspend fun withRetry(call: () -> BackendResult): BackendResult = withContext(Dispatchers.IO) {
        if (!configured) return@withContext BackendResult.failure("Kein Backend konfiguriert", network = false)
        var result = call()
        if (result.networkError) {
            delay(700)
            result = call()
        }
        result
    }

    private fun request(url: URL, method: String, body: String?, timeoutMs: Int): BackendResult {
        val conn = url.openConnection() as HttpURLConnection
        return try {
            conn.requestMethod = method
            conn.connectTimeout = timeoutMs
            conn.readTimeout = timeoutMs
            conn.useCaches = false
            // Apps Script answers via a redirect to script.googleusercontent.com.
            conn.instanceFollowRedirects = true
            if (body != null) {
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "text/plain;charset=utf-8")
                conn.outputStream.use { it.write(body.toByteArray()) }
            }
            val code = conn.responseCode
            val text = (if (code in 200..299) conn.inputStream else conn.errorStream)
                ?.bufferedReader()?.use { it.readText() }.orEmpty()
            when {
                code !in 200..299 -> BackendResult.failure("Server-Fehler ($code)", network = code >= 500)
                text.isBlank() -> BackendResult.failure("Leere Backend-Antwort", network = true)
                else -> runCatching { BackendResult(json.parseToJsonElement(text).jsonObject) }
                    .getOrElse { BackendResult.failure("Ungültige Backend-Antwort", network = true) }
            }
        } catch (e: SocketTimeoutException) {
            BackendResult.failure("Zeitüberschreitung", network = true)
        } catch (e: IOException) {
            BackendResult.failure("Keine Verbindung zum Server", network = true)
        } finally {
            conn.disconnect()
        }
    }

    private fun enc(value: String) = URLEncoder.encode(value, "UTF-8")
}
