package de.lernziel.sprachcoach

import android.content.Intent
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import de.lernziel.sprachcoach.account.AccountStore
import de.lernziel.sprachcoach.trainer.Session
import de.lernziel.sprachcoach.trainer.TrainerScreen
import de.lernziel.sprachcoach.trainer.TrainerViewModel
import de.lernziel.sprachcoach.ui.AccountScreen
import de.lernziel.sprachcoach.ui.LandingScreen
import de.lernziel.sprachcoach.ui.LegalScreen
import de.lernziel.sprachcoach.ui.Palette
import de.lernziel.sprachcoach.ui.ProfileScreen
import de.lernziel.sprachcoach.ui.SprachCoachTheme
import kotlinx.serialization.Serializable

@Serializable private object LandingRoute
@Serializable private object ProfileRoute
@Serializable private object AccountRoute
/** The mode travels as its name: navigation resolves enum arguments by class name, which R8 renames. */
@Serializable private data class TrainerRoute(val mode: String, val level: String, val key: String) {
    constructor(session: Session) : this(session.mode.name, session.level, session.key)
    val session: Session get() = Session(Session.Mode.valueOf(mode), level, key)
}
@Serializable private data class LegalRoute(val slug: String)

class MainActivity : AppCompatActivity() {

    /** A login link (`…?mltoken=…`) the app was opened with, waiting for the account screen. */
    private var pendingLink by mutableStateOf<String?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        if (savedInstanceState == null) pendingLink = loginLinkFrom(intent)
        setContent {
            SprachCoachTheme {
                Box(Modifier.fillMaxSize().background(Palette.Cream)) {
                    SprachCoachNavHost(pendingLink, onLinkConsumed = { pendingLink = null })
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        loginLinkFrom(intent)?.let { pendingLink = it }
    }

    private fun loginLinkFrom(intent: Intent?): String? =
        intent?.dataString?.takeIf { AccountStore.extractToken(it) != null && it.contains("mltoken=") }
}

@Composable
private fun SprachCoachNavHost(pendingLink: String?, onLinkConsumed: () -> Unit) {
    val app = LocalContext.current.applicationContext as SprachCoachApplication
    val repository = app.repository
    val progress = app.progress
    val account = app.account
    val nav = rememberNavController()

    LaunchedEffect(pendingLink) {
        if (pendingLink != null) nav.navigate(AccountRoute) { launchSingleTop = true }
    }

    NavHost(nav, startDestination = LandingRoute) {
        composable<LandingRoute> {
            LandingScreen(
                progress = progress.snapshot,
                account = account.account,
                repository = repository,
                onStartSession = { nav.navigate(TrainerRoute(it)) },
                onOpenProfile = { nav.navigate(ProfileRoute) },
                onOpenAccount = { nav.navigate(AccountRoute) },
                onOpenLegal = { nav.navigate(LegalRoute(it)) },
            )
        }
        composable<TrainerRoute> { entry ->
            val session = entry.toRoute<TrainerRoute>().session
            val vm = viewModel { TrainerViewModel(session, account.account.value.tier, repository, progress) }
            TrainerScreen(
                viewModel = vm,
                repository = repository,
                onBack = { nav.popBackStack() },
                onStartSession = { nav.replaceTrainer(it) },
                onOpenAccount = { nav.navigate(AccountRoute) },
            )
        }
        composable<ProfileRoute> {
            ProfileScreen(
                progress = progress.snapshot,
                account = account.account,
                hub = repository::hubLevel,
                onOpenAccount = { nav.navigate(AccountRoute) },
                onBack = { nav.popBackStack() },
            )
        }
        composable<AccountRoute> {
            AccountScreen(account, pendingLink, onLinkConsumed, onBack = { nav.popBackStack() })
        }
        composable<LegalRoute> { entry ->
            LegalScreen(
                slug = entry.toRoute<LegalRoute>().slug,
                loadHtml = repository::legalHtml,
                onSelect = { slug ->
                    nav.navigate(LegalRoute(slug)) { popUpTo<LegalRoute> { inclusive = true } }
                },
                onBack = { nav.popBackStack() },
            )
        }
    }
}

/** Starts another session from a result screen, replacing the finished one. */
private fun NavHostController.replaceTrainer(session: Session) =
    navigate(TrainerRoute(session)) { popUpTo<TrainerRoute> { inclusive = true } }
