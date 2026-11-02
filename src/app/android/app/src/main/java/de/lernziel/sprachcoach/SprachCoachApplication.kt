package de.lernziel.sprachcoach

import android.app.Application
import de.lernziel.sprachcoach.account.AccountStore
import de.lernziel.sprachcoach.account.Backend
import de.lernziel.sprachcoach.data.ProgressStore
import de.lernziel.sprachcoach.data.QuestionRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

/** Holds the app-wide singletons, so they outlive activity recreation (e.g. a language switch). */
class SprachCoachApplication : Application() {

    @Serializable
    private data class Config(val scriptUrl: String = "")

    /** Lives as long as the process: entitlement checks and progress pushes. */
    val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    val repository by lazy { QuestionRepository(assets) }
    val progress by lazy { ProgressStore(this) }
    val account by lazy {
        val config = assets.open("config.json").bufferedReader().use { CONFIG_JSON.decodeFromString<Config>(it.readText()) }
        AccountStore(this, Backend(config.scriptUrl), progress, appScope)
    }

    private companion object {
        val CONFIG_JSON = Json { ignoreUnknownKeys = true }
    }

    override fun onCreate() {
        super.onCreate()
        appScope.launch { account.refresh() }
    }
}
