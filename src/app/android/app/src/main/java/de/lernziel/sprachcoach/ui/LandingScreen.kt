package de.lernziel.sprachcoach.ui

import androidx.annotation.StringRes
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.account.Account
import de.lernziel.sprachcoach.account.Tier
import de.lernziel.sprachcoach.data.ProgressSnapshot
import de.lernziel.sprachcoach.data.QuestionRepository
import de.lernziel.sprachcoach.data.rankWeakTopics
import de.lernziel.sprachcoach.trainer.Session
import kotlinx.coroutines.flow.StateFlow

/**
 * Landing page (spec 01-landing §3): hero, account chip, profile button,
 * progress summary, level picker, Einstufungstest, Premium training hub,
 * dashboard (calendar, Schwächen) and legal links.
 */
@Composable
fun LandingScreen(
    progress: StateFlow<ProgressSnapshot>,
    account: StateFlow<Account>,
    repository: QuestionRepository,
    onStartSession: (Session) -> Unit,
    onOpenProfile: () -> Unit,
    onOpenAccount: () -> Unit,
    onOpenLegal: (String) -> Unit,
) {
    val snapshot by progress.collectAsStateWithLifecycle()
    val acc by account.collectAsStateWithLifecycle()
    val premium = acc.isPremium

    Column(
        modifier = Modifier
            .fillMaxSize()
            .safeDrawingPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            LocaleSwitcher()
            Spacer(Modifier.weight(1f))
            AccountChip(acc, onOpenAccount)
        }
        Spacer(Modifier.height(16.dp))
        LzdLogo(size = 120.dp)
        Spacer(Modifier.height(12.dp))
        Text(stringResource(R.string.app_name), fontSize = 34.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        Text(
            stringResource(R.string.landing_subtitle).replace(" — ", " —\n"),
            textAlign = TextAlign.Center,
            fontSize = 16.sp,
        )
        Spacer(Modifier.height(8.dp))
        Text(stringResource(R.string.landing_slogan), color = Palette.Purple, fontStyle = FontStyle.Italic)
        if (!acc.isPaid) {
            Spacer(Modifier.height(10.dp))
            Pill(stringResource(R.string.landing_free_start))
        }

        if (snapshot.hasProgress || premium) {
            Spacer(Modifier.height(14.dp))
            ProgressSummary(snapshot)
        }
        Spacer(Modifier.height(12.dp))
        SecondaryButton(
            stringResource(R.string.landing_profile) + if (premium) "" else " 💎",
            onClick = onOpenProfile,
        )
        if (snapshot.hasProgress || premium) {
            Spacer(Modifier.height(12.dp))
            DailyGoalCard(snapshot.todayCount)
        }

        Spacer(Modifier.height(24.dp))
        Text(
            stringResource(R.string.landing_level_pick_title),
            color = Palette.PurpleDark,
            fontWeight = FontWeight.Bold,
            fontSize = 18.sp,
        )
        if (!acc.isPaid) Text(stringResource(R.string.landing_start_hint), color = Palette.Muted, fontSize = 12.sp)
        Spacer(Modifier.height(12.dp))
        LevelGrid { onStartSession(Session(Session.Mode.LEVEL, it)) }

        Spacer(Modifier.height(16.dp))
        NiveauTestBlock(snapshot.cefr.level, premium, { onStartSession(Session(Session.Mode.PLACEMENT)) }, onOpenAccount)

        Spacer(Modifier.height(16.dp))
        if (acc.tier == Tier.BASIS) {
            Text(stringResource(R.string.hub_basis_banner), fontSize = 13.sp, color = Palette.PurpleDark, textAlign = TextAlign.Center)
            Spacer(Modifier.height(8.dp))
        }
        TrainingHub(
            hub = repository::hubLevel,
            snapshot = snapshot,
            locked = !premium,
            initialLevel = snapshot.cefr.level.ifEmpty { "A1" },
            onStart = onStartSession,
            onLocked = onOpenAccount,
        )

        if (snapshot.hasProgress || premium) {
            Spacer(Modifier.height(24.dp))
            SectionDivider(stringResource(R.string.landing_section_dashboard))
            Spacer(Modifier.height(12.dp))
            ActivityCalendar(snapshot.streak.activeDays)
            Spacer(Modifier.height(12.dp))
            SchwaechenCard(
                isPremium = premium,
                weak = remember(snapshot.xp) {
                    rankWeakTopics(snapshot.xp, Session.LEVELS.associateWith { repository.hubLevel(it).topics })
                },
                onTrain = { onStartSession(Session(Session.Mode.SCHWAECHEN)) },
                onLocked = onOpenAccount,
            )
        }

        Spacer(Modifier.height(32.dp))
        LegalFooter(onOpenLegal)
    }
}

/** Top-right chip: 🔑 Anmelden, or the current entitlement. */
@Composable
private fun AccountChip(account: Account, onClick: () -> Unit) {
    val (text, filled) = when {
        account.isPremium -> stringResource(R.string.premium_active) to true
        account.tier == Tier.BASIS -> stringResource(R.string.basis_active) to true
        else -> stringResource(R.string.sign_in_button) to false
    }
    Text(
        text,
        fontSize = 13.sp,
        fontWeight = FontWeight.Bold,
        color = if (filled) Palette.PurpleDark else Color.White,
        modifier = Modifier
            .clip(RoundedCornerShape(16.dp))
            .background(if (filled) Palette.PurpleTint else Palette.Purple)
            .border(1.dp, Palette.Purple, RoundedCornerShape(16.dp))
            .clickable(role = Role.Button, onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 6.dp),
    )
}

@Composable
private fun Pill(text: String) {
    Text(
        text,
        color = Palette.PurpleDark,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        textAlign = TextAlign.Center,
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(Palette.PurpleTint)
            .border(1.dp, Palette.Purple, RoundedCornerShape(20.dp))
            .padding(horizontal = 16.dp, vertical = 8.dp),
    )
}

@Composable
private fun ProgressSummary(snapshot: ProgressSnapshot) {
    val parts = buildList {
        if (snapshot.currentStreak > 0) {
            val unit = stringResource(if (snapshot.currentStreak == 1) R.string.day else R.string.days)
            add("🔥 ${snapshot.currentStreak} $unit")
        }
        add("⭐ ${snapshot.totalXp} XP")
        add("Lv${snapshot.level.num} ${snapshot.level.name}")
    }
    Text(parts.joinToString(" · "), fontWeight = FontWeight.Bold, color = Palette.PurpleDark)
}

/** Einstufungstest button (`NiveauTestBlock.vue`). */
@Composable
private fun NiveauTestBlock(cefrLevel: String, premium: Boolean, onStart: () -> Unit, onLocked: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.widthIn(max = 520.dp)) {
        val label = if (cefrLevel.isNotEmpty()) {
            stringResource(R.string.landing_niveau_retest, cefrLevel)
        } else {
            stringResource(R.string.landing_niveau_test)
        }
        SecondaryButton(
            label + if (premium) "" else "  " + stringResource(R.string.badge_premium),
            onClick = if (premium) onStart else onLocked,
        )
        Text(
            stringResource(if (premium) R.string.landing_niveau_hint_premium else R.string.landing_niveau_hint_locked),
            fontSize = 11.sp,
            color = Palette.Muted,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 4.dp),
        )
    }
}

@Composable
private fun SectionDivider(text: String) {
    Row(Modifier.widthIn(max = 520.dp).fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        HorizontalDivider(Modifier.weight(1f), color = Palette.Border)
        Text("  $text  ", color = Palette.Muted, fontWeight = FontWeight.Bold, fontSize = 13.sp)
        HorizontalDivider(Modifier.weight(1f), color = Palette.Border)
    }
}

/** 2×2 grid in the web's visual order: A1 B1 / A2 B2. */
@Composable
private fun LevelGrid(onStartLevel: (String) -> Unit) {
    val rows = listOf(
        listOf("A1" to R.string.level_a1, "B1" to R.string.level_b1),
        listOf("A2" to R.string.level_a2, "B2" to R.string.level_b2),
    )
    Column(Modifier.widthIn(max = 520.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        rows.forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                row.forEach { (level, label) ->
                    LevelCard(level, label, Modifier.weight(1f)) { onStartLevel(level) }
                }
            }
        }
    }
}

@Composable
private fun LevelCard(level: String, @StringRes label: Int, modifier: Modifier, onClick: () -> Unit) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(18.dp))
            .background(Palette.Purple)
            .clickable(role = Role.Button, onClick = onClick)
            .padding(vertical = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(level, color = Palette.Card, fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Text(stringResource(label), color = Palette.Card, fontSize = 12.sp)
    }
}

@Composable
private fun LegalFooter(onOpenLegal: (String) -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(18.dp)) {
        LEGAL_PAGES.forEach { (slug, label) ->
            Text(
                stringResource(label),
                color = Palette.Muted,
                fontSize = 13.sp,
                textDecoration = TextDecoration.Underline,
                modifier = Modifier.clickable(role = Role.Button) { onOpenLegal(slug) },
            )
        }
    }
    Spacer(Modifier.height(6.dp))
    Text(stringResource(R.string.copyright), color = Palette.Muted, fontSize = 11.sp)
    Spacer(Modifier.height(16.dp))
}

val LEGAL_PAGES = listOf(
    "agb" to R.string.legal_agb,
    "datenschutz" to R.string.legal_privacy,
    "impressum" to R.string.legal_imprint,
)
