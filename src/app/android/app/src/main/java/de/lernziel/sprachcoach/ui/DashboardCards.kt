package de.lernziel.sprachcoach.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.res.stringArrayResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.data.ProgressStore
import de.lernziel.sprachcoach.data.WeakTopic
import java.time.LocalDate
import java.time.ZoneOffset

/** White rounded card used by the dashboard. */
@Composable
fun Card(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = modifier
            .widthIn(max = 520.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Palette.Card)
            .padding(16.dp),
        content = content,
    )
}

/** Collapsible card: header (title, count, bar) always visible, body on tap — like the web's `<details>`. */
@Composable
private fun ExpandableCard(
    title: String,
    count: String,
    progress: Float,
    content: @Composable ColumnScope.() -> Unit,
) {
    var open by rememberSaveable(title) { mutableStateOf(false) }
    Card(Modifier.clickable(role = Role.Button) { open = !open }) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(title, fontWeight = FontWeight.Bold)
            Text(count + if (open) "  ▴" else "  ▾", color = Palette.Muted, fontSize = 13.sp)
        }
        Spacer(Modifier.height(10.dp))
        SegmentedProgress(progress, Palette.Purple, Modifier.fillMaxWidth().height(8.dp))
        AnimatedVisibility(open) {
            Column(Modifier.padding(top = 12.dp)) { content() }
        }
    }
}

@Composable
fun DailyGoalCard(todayCount: Int) {
    val goal = ProgressStore.DAILY_GOAL_QUESTIONS
    val done = todayCount >= goal
    Card {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(
                stringResource(if (done) R.string.daily_goal_title_done else R.string.daily_goal_title),
                fontWeight = FontWeight.Bold,
            )
            Text(stringResource(R.string.daily_goal_count, todayCount, goal), color = Palette.Muted)
        }
        Spacer(Modifier.height(10.dp))
        SegmentedProgress(todayCount.toFloat() / goal, if (done) Palette.Green else Palette.Purple, Modifier.fillMaxWidth().height(8.dp))
    }
}

/** 📅 Aktivitätenkalender (`ActivityCalendar.vue`): last 42 days, Monday-first grid. */
@Composable
fun ActivityCalendar(activeDays: List<String>) {
    val today = LocalDate.now(ZoneOffset.UTC)
    val days = (41 downTo 0).map { today.minusDays(it.toLong()) }
    val active = activeDays.toSet()
    val count = days.count { it.toString() in active }
    ExpandableCard(
        title = stringResource(R.string.calendar_title),
        count = stringResource(R.string.calendar_count, count, 42),
        progress = count / 42f,
    ) {
        val labels = stringArrayResource(R.array.calendar_day_labels)
        Row(Modifier.fillMaxWidth()) {
            labels.forEach { Text(it, Modifier.weight(1f), textAlign = TextAlign.Center, fontSize = 11.sp, color = Palette.Muted) }
        }
        // Leading blanks so the first day lands in its weekday column.
        val cells = List(days.first().dayOfWeek.value - 1) { null } + days
        cells.chunked(7).forEach { week ->
            Row(Modifier.fillMaxWidth()) {
                week.forEach { day ->
                    Box(Modifier.weight(1f).padding(2.dp).aspectRatio(1f)) {
                        if (day != null) {
                            val isActive = day.toString() in active
                            Box(
                                Modifier
                                    .fillMaxSize()
                                    .clip(RoundedCornerShape(5.dp))
                                    .background(if (isActive) Palette.Purple else Color(0xFFEDEDED))
                                    .then(if (day == today) Modifier.border(2.dp, Palette.PurpleDark, RoundedCornerShape(5.dp)) else Modifier),
                            )
                        }
                    }
                }
                repeat(7 - week.size) { Spacer(Modifier.weight(1f)) }
            }
        }
        Spacer(Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Legend(Color(0xFFEDEDED), stringResource(R.string.calendar_legend_less))
            Legend(Palette.Purple, stringResource(R.string.calendar_legend_active))
            Legend(Color.Transparent, stringResource(R.string.calendar_legend_today), border = true)
        }
    }
}

@Composable
private fun Legend(color: Color, label: String, border: Boolean = false) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier
                .size(12.dp)
                .clip(RoundedCornerShape(3.dp))
                .background(color)
                .then(if (border) Modifier.border(2.dp, Palette.PurpleDark, RoundedCornerShape(3.dp)) else Modifier),
        )
        Text(" $label", fontSize = 11.sp, color = Palette.Muted)
    }
}

/** 🎯 Schwächen-Modus card (`SchwaechenCard.vue`). */
@Composable
fun SchwaechenCard(
    isPremium: Boolean,
    weak: List<WeakTopic>,
    onTrain: () -> Unit,
    onLocked: () -> Unit,
) {
    val errors = weak.sumOf { it.wrong }
    ExpandableCard(
        title = stringResource(R.string.schwaechen_title),
        count = when {
            !isPremium -> stringResource(R.string.schwaechen_count_premium)
            weak.isEmpty() -> stringResource(R.string.schwaechen_count_empty)
            else -> stringResource(R.string.schwaechen_count_summary, errors, weak.size)
        },
        progress = if (isPremium) errors / 30f else 0f,
    ) {
        when {
            !isPremium -> {
                Text(stringResource(R.string.schwaechen_body_locked), fontSize = 14.sp)
                Spacer(Modifier.height(10.dp))
                PrimaryButton(stringResource(R.string.account_unlock), onClick = onLocked)
            }
            weak.isEmpty() -> Text(stringResource(R.string.schwaechen_body_no_errors), fontSize = 14.sp)
            else -> {
                Text(stringResource(R.string.schwaechen_list_title), fontSize = 14.sp, fontWeight = FontWeight.Bold)
                weak.forEach {
                    Text(
                        "${it.level} · ${it.topic.name} — ${stringResource(R.string.schwaechen_error_count, it.wrong)}",
                        fontSize = 14.sp,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
                Spacer(Modifier.height(10.dp))
                PrimaryButton(stringResource(R.string.schwaechen_train), onClick = onTrain)
            }
        }
    }
}
