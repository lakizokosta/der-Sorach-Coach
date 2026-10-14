package de.lernziel.sprachcoach.ui

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.account.Account
import de.lernziel.sprachcoach.data.HubLevel
import de.lernziel.sprachcoach.data.ProgressSnapshot
import de.lernziel.sprachcoach.trainer.Session
import kotlinx.coroutines.flow.StateFlow

/** Medals for the longest streak (`useStreak.js`): 🥉3 🥈7 🥇14 💎30 👑60 🌟100. */
private val MEDALS = listOf(3 to "🥉", 7 to "🥈", 14 to "🥇", 30 to "💎", 60 to "👑", 100 to "🌟")

/**
 * Profile (spec 04-profile): a mini view for Free/Basis (XP, streak, daily
 * goal, Premium note) and the full view for Premium (plus freezes, medals,
 * placement result and topic mastery).
 */
@Composable
fun ProfileScreen(
    progress: StateFlow<ProgressSnapshot>,
    account: StateFlow<Account>,
    hub: (String) -> HubLevel,
    onOpenAccount: () -> Unit,
    onBack: () -> Unit,
) {
    val snapshot by progress.collectAsStateWithLifecycle()
    val acc by account.collectAsStateWithLifecycle()
    val full = acc.isPremium
    BackHandler(onBack = onBack)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .safeDrawingPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Text(
            stringResource(R.string.trainer_back),
            color = Palette.Purple,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth().clickable(role = Role.Button, onClick = onBack).padding(vertical = 8.dp),
        )
        LzdLogo(size = 64.dp)
        Text(
            stringResource(if (full) R.string.profile_title_full else R.string.profile_title_mini),
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
        )
        if (!full) Text(stringResource(R.string.profile_subtitle_mini), color = Palette.Muted)

        AccountRow(acc, onOpenAccount)
        XpCard(snapshot)
        StreakCard(snapshot, full)
        DailyGoalCard(snapshot.todayCount)

        if (full) {
            if (snapshot.cefr.level.isNotEmpty()) PlacementCard(snapshot)
            TopicsCard(snapshot, hub)
        } else {
            Card {
                Text(stringResource(R.string.profile_upsell_title), fontWeight = FontWeight.Bold)
                listOf(R.string.profile_upsell_1, R.string.profile_upsell_2, R.string.profile_upsell_3).forEach {
                    Text("• " + stringResource(it), fontSize = 14.sp, modifier = Modifier.padding(top = 4.dp))
                }
                Spacer(Modifier.height(10.dp))
                PrimaryButton(stringResource(R.string.account_unlock), onClick = onOpenAccount)
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun AccountRow(account: Account, onOpenAccount: () -> Unit) {
    Card(Modifier.clickable(role = Role.Button, onClick = onOpenAccount)) {
        when {
            account.isLoggedIn -> Text(stringResource(R.string.account_logged_in_as, account.email), fontWeight = FontWeight.Bold)
            account.isPremium -> Text(stringResource(R.string.premium_active), fontWeight = FontWeight.Bold)
            else -> Text(stringResource(R.string.profile_login_hint), fontSize = 14.sp)
        }
    }
}

@Composable
private fun XpCard(snapshot: ProgressSnapshot) {
    val level = snapshot.level
    val xp = snapshot.totalXp
    Card {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                "Lv${level.num}",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .background(Palette.Purple)
                    .padding(horizontal = 10.dp, vertical = 4.dp),
            )
            Text("  ${level.name}", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }
        Spacer(Modifier.height(8.dp))
        val next = level.next
        Text(
            if (next == null) {
                stringResource(R.string.profile_xp_max, xp)
            } else {
                stringResource(R.string.profile_xp_line, xp, next - xp, level.num + 1)
            },
            fontSize = 14.sp,
        )
        Spacer(Modifier.height(8.dp))
        val fraction = if (next == null) 1f else (xp - level.prev).toFloat() / (next - level.prev)
        SegmentedProgress(fraction, Palette.Purple, Modifier.fillMaxWidth().height(10.dp))
    }
}

@Composable
private fun StreakCard(snapshot: ProgressSnapshot, full: Boolean) {
    val streak = snapshot.streak
    Card {
        Text(stringResource(R.string.profile_streak), fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            Stat(streak.currentStreak.toString(), stringResource(R.string.profile_current))
            Stat(streak.longestStreak.toString(), stringResource(R.string.profile_record))
            if (full) {
                Stat(streak.freezes.toString(), stringResource(R.string.profile_freezes))
            } else {
                Stat(streak.activeDays.size.toString(), stringResource(R.string.profile_active_days))
            }
        }
        if (full || streak.longestStreak > 0) {
            Spacer(Modifier.height(8.dp))
            val earned = MEDALS.filter { streak.longestStreak >= it.first }.map { it.second }
            Text(
                (earned + List(MEDALS.size - earned.size) { "▫" }).joinToString(" "),
                fontSize = 20.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

@Composable
private fun Stat(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Palette.Purple)
        Text(label, fontSize = 12.sp, color = Palette.Muted)
    }
}

@Composable
private fun PlacementCard(snapshot: ProgressSnapshot) {
    val cefr = snapshot.cefr
    Card {
        Text(stringResource(R.string.profile_placement, cefr.level), fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(6.dp))
        Session.LEVELS.forEach { lvl ->
            val s = cefr.scores[lvl] ?: return@forEach
            Row(Modifier.padding(vertical = 2.dp), verticalAlignment = Alignment.CenterVertically) {
                LevelPill(lvl, highlighted = lvl == cefr.level)
                Text("  ${s.correct}/${s.total} (${s.pct}%)", fontSize = 14.sp)
            }
        }
        val pct = if (cefr.totalAnswered == 0) 0 else Math.round(cefr.totalCorrect * 100f / cefr.totalAnswered)
        if (pct > 0) Text(stringResource(R.string.profile_placement_total, pct), fontSize = 13.sp, color = Palette.Muted)
    }
}

/** 📚 Alle Themen: mastered topics per level (≥ 50 correct). Collapsed by default. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun TopicsCard(snapshot: ProgressSnapshot, hub: (String) -> HubLevel) {
    var open by rememberSaveable { mutableStateOf(false) }
    val byLevel = Session.LEVELS.associateWith { hub(it).topics }
    val total = byLevel.values.sumOf { it.size }
    val mastered = byLevel.values.sumOf { topics -> topics.count { snapshot.isMastered(it.key) } }
    Card(Modifier.clickable(role = Role.Button) { open = !open }) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(stringResource(R.string.profile_topics), fontWeight = FontWeight.Bold)
            Text(stringResource(R.string.profile_topics_count, mastered, total) + if (open) "  ▴" else "  ▾", color = Palette.Muted, fontSize = 13.sp)
        }
        Spacer(Modifier.height(8.dp))
        SegmentedProgress(if (total == 0) 0f else mastered.toFloat() / total, Palette.Green, Modifier.fillMaxWidth().height(8.dp))
        AnimatedVisibility(open) {
            Column(Modifier.padding(top = 10.dp)) {
                byLevel.forEach { (level, topics) ->
                    Text(level, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 8.dp))
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        topics.forEach { topic ->
                            val done = snapshot.isMastered(topic.key)
                            val correct = snapshot.xp.topicCorrect[topic.key] ?: 0
                            Text(
                                (if (done) "✅ " else "") + topic.name + if (done) "" else "  $correct/50",
                                fontSize = 12.sp,
                                color = if (done) Palette.GreenDark else Palette.Text,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (done) Palette.Green.copy(alpha = 0.15f) else Palette.Answer)
                                    .padding(horizontal = 8.dp, vertical = 4.dp),
                            )
                        }
                    }
                }
            }
        }
    }
}
