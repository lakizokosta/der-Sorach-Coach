package de.lernziel.sprachcoach.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
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
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.data.HubLevel
import de.lernziel.sprachcoach.data.ProgressSnapshot
import de.lernziel.sprachcoach.trainer.Session

/**
 * Premium-Training hub (`TrainingHubPanel.vue`): switch between grammar topics
 * and Wortschatz sets, pick a level, start a session. When [locked] it is a
 * preview: no level is open at first and every tap leads to [onLocked].
 */
@Composable
fun TrainingHub(
    hub: (String) -> HubLevel,
    snapshot: ProgressSnapshot,
    locked: Boolean,
    initialLevel: String,
    onStart: (Session) -> Unit,
    onLocked: () -> Unit,
) {
    var vocab by rememberSaveable { mutableStateOf(false) }
    var level by rememberSaveable { mutableStateOf(if (locked) "" else initialLevel) }

    Column(
        modifier = Modifier
            .widthIn(max = 520.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(Palette.Card.copy(alpha = if (locked) 0.6f else 1f))
            .border(1.dp, Palette.Border, RoundedCornerShape(18.dp))
            .padding(14.dp),
    ) {
        Text(
            stringResource(R.string.hub_title) + if (locked) "  💎" else "",
            fontWeight = FontWeight.Bold,
            fontSize = 17.sp,
        )
        if (locked) Text(stringResource(R.string.hub_locked_hint), fontSize = 12.sp, color = Palette.Muted)
        Spacer(Modifier.height(10.dp))

        Toggle(
            options = listOf(stringResource(R.string.hub_mode_topics), stringResource(R.string.hub_mode_vocab)),
            selected = if (vocab) 1 else 0,
            onSelect = { vocab = it == 1 },
        )
        Spacer(Modifier.height(10.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Session.LEVELS.forEach { lvl ->
                val active = lvl == level
                Text(
                    lvl,
                    textAlign = TextAlign.Center,
                    fontWeight = FontWeight.Bold,
                    color = if (active) Color.White else Palette.PurpleDark,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (active) Palette.Purple else Palette.PurpleTint)
                        .clickable(role = Role.Tab) { level = if (locked && active) "" else lvl }
                        .padding(vertical = 8.dp),
                )
            }
        }

        if (level.isEmpty()) return@Column
        Spacer(Modifier.height(10.dp))
        val content = hub(level)
        if (vocab) {
            if (content.vocab.isEmpty()) {
                Text(stringResource(R.string.hub_vocab_empty, level), color = Palette.Muted)
            }
            content.vocab.forEach { set ->
                val accent = runCatching { Color(set.accent.toColorInt()) }.getOrDefault(Palette.Purple)
                HubRow(
                    title = set.name,
                    subtitle = set.desc,
                    count = set.count,
                    accent = accent,
                    trailing = if (locked) "💎" else "",
                ) { if (locked) onLocked() else onStart(Session(Session.Mode.VOCAB, level, set.key)) }
            }
        } else {
            content.topics.filter { it.count > 0 }.forEach { topic ->
                HubRow(
                    title = topic.name,
                    subtitle = topic.desc,
                    count = topic.count,
                    accent = Palette.Purple,
                    trailing = when {
                        locked -> "💎"
                        snapshot.isMastered(topic.key) -> "✅"
                        else -> ""
                    },
                ) { if (locked) onLocked() else onStart(Session(Session.Mode.TOPIC, level, topic.key)) }
            }
        }
    }
}

@Composable
private fun HubRow(title: String, subtitle: String, count: Int, accent: Color, trailing: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(Palette.Answer)
            .clickable(role = Role.Button, onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Spacer(Modifier.width(4.dp).height(36.dp).background(accent))
        Spacer(Modifier.width(10.dp))
        Column(Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.Bold)
            Text(subtitle, fontSize = 12.sp, color = Palette.Muted)
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(stringResource(R.string.hub_questions_count, count), fontSize = 11.sp, color = Palette.Muted)
            if (trailing.isNotEmpty()) Text(trailing)
        }
    }
}

/** Two-option pill switch. */
@Composable
fun Toggle(options: List<String>, selected: Int, onSelect: (Int) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Color(0xFFEAEAEA))
            .padding(3.dp),
    ) {
        options.forEachIndexed { i, label ->
            Text(
                label,
                textAlign = TextAlign.Center,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp,
                color = if (i == selected) Palette.PurpleDark else Palette.Muted,
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(18.dp))
                    .background(if (i == selected) Palette.Card else Color.Transparent)
                    .clickable(role = Role.Tab) { onSelect(i) }
                    .padding(vertical = 8.dp),
            )
        }
    }
}
