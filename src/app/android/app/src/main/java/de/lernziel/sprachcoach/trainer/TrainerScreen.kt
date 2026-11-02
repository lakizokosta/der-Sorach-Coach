package de.lernziel.sprachcoach.trainer

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.LifecycleStartEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import de.lernziel.sprachcoach.R
import de.lernziel.sprachcoach.account.Tier
import de.lernziel.sprachcoach.data.Dropbox
import de.lernziel.sprachcoach.data.InputText
import de.lernziel.sprachcoach.data.MultiSelect
import de.lernziel.sprachcoach.data.ProgressSnapshot
import de.lernziel.sprachcoach.data.Question
import de.lernziel.sprachcoach.data.QuestionRepository
import de.lernziel.sprachcoach.data.SelectOne
import de.lernziel.sprachcoach.data.TextGaps
import de.lernziel.sprachcoach.trainer.widgets.AnswerCallbacks
import de.lernziel.sprachcoach.trainer.widgets.DictionaryAccess
import de.lernziel.sprachcoach.trainer.widgets.DictionaryCard
import de.lernziel.sprachcoach.trainer.widgets.DragDropWidget
import de.lernziel.sprachcoach.trainer.widgets.FillBlankWidget
import de.lernziel.sprachcoach.trainer.widgets.LocalDictionary
import de.lernziel.sprachcoach.trainer.widgets.MultiSelectWidget
import de.lernziel.sprachcoach.trainer.widgets.MultipleChoiceWidget
import de.lernziel.sprachcoach.trainer.widgets.TextGapsWidget
import de.lernziel.sprachcoach.ui.LevelPill
import de.lernziel.sprachcoach.ui.LzdLogo
import de.lernziel.sprachcoach.ui.Palette
import de.lernziel.sprachcoach.ui.PrimaryButton
import de.lernziel.sprachcoach.ui.SecondaryButton
import de.lernziel.sprachcoach.ui.SegmentedProgress
import kotlinx.coroutines.delay

/** Trainer (spec 02-trainer): loading → question loop → result, or the empty / locked state. */
@Composable
fun TrainerScreen(
    viewModel: TrainerViewModel,
    repository: QuestionRepository,
    onBack: () -> Unit,
    onStartSession: (Session) -> Unit,
    onOpenAccount: () -> Unit,
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    var dictWord by remember { mutableStateOf<String?>(null) }

    LifecycleStartEffect(viewModel) {
        viewModel.onVisibilityChanged(true)
        onStopOrDispose { viewModel.onVisibilityChanged(false) }
    }
    BackHandler(onBack = onBack)

    val scroll = rememberScrollState()
    val activeKey = (state as? TrainerState.Active)?.questionKey
    LaunchedEffect(activeKey, state is TrainerState.Finished) {
        scroll.scrollTo(0)
        dictWord = null
    }

    val dictionary = remember(viewModel.isPremium) {
        if (viewModel.isPremium) DictionaryAccess(repository::lookupWord) { dictWord = it } else null
    }

    CompositionLocalProvider(LocalDictionary provides dictionary) {
        Box(Modifier.fillMaxSize().safeDrawingPadding().imePadding()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(scroll)
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                LzdLogo(size = 64.dp)
                Spacer(Modifier.height(8.dp))
                Column(Modifier.widthIn(max = 640.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    when (val s = state) {
                        TrainerState.Loading -> {
                            Spacer(Modifier.height(24.dp))
                            CircularProgressIndicator(color = Palette.Purple)
                            Spacer(Modifier.height(12.dp))
                            Text(stringResource(R.string.trainer_loading), fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        }
                        TrainerState.Empty -> EmptyState(viewModel.session, onBack)
                        TrainerState.Locked -> LockedState(onOpenAccount, onBack)
                        is TrainerState.Active -> ActiveQuestion(viewModel, repository, s, onBack)
                        is TrainerState.Finished -> {
                            val snapshot by viewModel.progressSnapshot.collectAsStateWithLifecycle()
                            ResultScreen(
                                result = s.result,
                                snapshot = snapshot,
                                isPremium = viewModel.isPremium,
                                onRestart = viewModel::restart,
                                onBack = onBack,
                                onStartSession = onStartSession,
                            )
                        }
                    }
                }
            }
            FeedbackToast(viewModel, Modifier.align(Alignment.TopCenter).padding(top = 72.dp))
            dictWord?.let { word ->
                DictionaryCard(
                    word = word,
                    entry = repository.lookupWord(word),
                    onClose = { dictWord = null },
                    modifier = Modifier.align(Alignment.BottomCenter).padding(16.dp),
                )
            }
        }
    }
}

@Composable
private fun sessionLabel(label: SessionLabel, question: Question?): String {
    val s = label.session
    return when (s.mode) {
        Session.Mode.LEVEL -> stringResource(
            if (label.tier == Tier.PREMIUM) R.string.trainer_premium_label else R.string.trainer_free_label,
            s.level,
        )
        Session.Mode.TOPIC -> stringResource(R.string.trainer_topic_label, s.level, label.name)
        Session.Mode.VOCAB -> stringResource(R.string.trainer_vocab_label, s.level, label.name)
        Session.Mode.SCHWAECHEN -> stringResource(R.string.trainer_schwaechen_label, label.name)
        Session.Mode.PLACEMENT -> stringResource(
            R.string.trainer_placement_label,
            TrainerViewModel.PLACEMENT_PER_LEVEL * Session.LEVELS.size,
            question?.level.orEmpty(),
        )
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ActiveQuestion(
    viewModel: TrainerViewModel,
    repository: QuestionRepository,
    s: TrainerState.Active,
    onBack: () -> Unit,
) {
    val score by viewModel.score.collectAsStateWithLifecycle()
    val seconds by viewModel.seconds.collectAsStateWithLifecycle()
    val snapshot by viewModel.progressSnapshot.collectAsStateWithLifecycle()
    val label by viewModel.label.collectAsStateWithLifecycle()

    Text(
        sessionLabel(label, s.question),
        fontSize = 13.sp,
        color = Palette.Muted,
        textAlign = TextAlign.Center,
    )
    if (viewModel.timerMode != TimerMode.HIDDEN) {
        Spacer(Modifier.height(10.dp))
        TimerCircle(seconds)
    }
    Spacer(Modifier.height(12.dp))

    Text(
        "✓ ${score.correct} · ✗ ${score.wrong} · ${score.pct}%",
        fontWeight = FontWeight.Bold,
        fontSize = 13.sp,
        modifier = Modifier.fillMaxWidth(),
        textAlign = TextAlign.End,
    )
    SegmentedProgress(s.progressPct / 100f, Palette.Purple, Modifier.fillMaxWidth().height(10.dp))
    Spacer(Modifier.height(10.dp))
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally)) {
        if (snapshot.currentStreak > 0) Badge(stringResource(R.string.trainer_streak_badge, snapshot.currentStreak))
        Badge("⭐ ${snapshot.totalXp} XP · Lv${snapshot.level.num}")
        if (viewModel.isPremium) Badge(stringResource(R.string.trainer_xp2_badge))
    }
    Spacer(Modifier.height(14.dp))

    Text(stringResource(R.string.trainer_question, s.current, s.total), fontSize = 22.sp, fontWeight = FontWeight.Bold)
    s.topic?.let {
        Text(stringResource(R.string.trainer_topic_pool, it.name, it.count), fontSize = 12.sp, color = Palette.Muted)
    }
    Spacer(Modifier.height(14.dp))

    key(s.questionKey) {
        QuestionWidget(s.question, AnswerCallbacks(viewModel::onFirstWrong, viewModel::onAnswer))
    }

    if (s.showRetry && !s.resolved) {
        Text(
            stringResource(R.string.trainer_wrong_retry),
            color = Palette.Red,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(top = 12.dp),
        )
    }
    s.tipTopic?.let { topic -> key(s.questionKey) { GrammarTip { lang -> repository.grammarHint(topic, lang) } } }

    Spacer(Modifier.height(18.dp))
    PrimaryButton(stringResource(R.string.trainer_next), onClick = viewModel::next, enabled = s.resolved)
    Spacer(Modifier.height(24.dp))
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        SecondaryButton(stringResource(R.string.trainer_finish), onClick = viewModel::finishManually)
        SecondaryButton(stringResource(R.string.trainer_back_short), onClick = onBack)
    }
    Spacer(Modifier.height(24.dp))
}

@Composable
private fun QuestionWidget(question: Question, callbacks: AnswerCallbacks) {
    when (question) {
        is SelectOne -> MultipleChoiceWidget(question, callbacks)
        is MultiSelect -> MultiSelectWidget(question, callbacks)
        is InputText -> FillBlankWidget(question, callbacks)
        is Dropbox -> DragDropWidget(question, callbacks)
        is TextGaps -> TextGapsWidget(question, callbacks)
    }
}

@Composable
private fun TimerCircle(seconds: Int) {
    Box(
        modifier = Modifier.size(120.dp).border(5.dp, Palette.Purple, CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        Text(formatMmSs(seconds), fontSize = 30.sp, fontWeight = FontWeight.Bold, color = Palette.Purple)
    }
}

fun formatMmSs(seconds: Int): String = "%02d:%02d".format(seconds / 60, seconds % 60)

@Composable
private fun Badge(text: String) {
    Text(
        text,
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        color = Palette.PurpleDark,
        modifier = Modifier
            .clip(RoundedCornerShape(14.dp))
            .background(Palette.PurpleTint)
            .border(1.dp, Palette.Purple, RoundedCornerShape(14.dp))
            .padding(horizontal = 12.dp, vertical = 5.dp),
    )
}

/** `micro-feedback`: one line, auto-hides after 2.2 s. */
@Composable
private fun FeedbackToast(viewModel: TrainerViewModel, modifier: Modifier) {
    val feedback by viewModel.feedback.collectAsStateWithLifecycle()
    var visible by remember { mutableStateOf(false) }
    LaunchedEffect(feedback?.first) {
        if (feedback == null) return@LaunchedEffect
        visible = true
        delay(2200)
        visible = false
    }
    val item = feedback?.second ?: return
    val text = when (item) {
        is Feedback.Xp -> if (item.amount > 0) "+${item.amount} XP" else "${item.amount} XP"
        Feedback.BonusXp -> stringResource(R.string.toast_bonus_xp)
        is Feedback.Tier -> stringResource(R.string.toast_tier, item.xp, item.answered)
        is Feedback.LevelUp -> stringResource(R.string.toast_level_up, item.level.num, item.level.name)
        Feedback.TopicMastered -> stringResource(R.string.toast_mastered)
    }
    AnimatedVisibility(visible, modifier = modifier, enter = fadeIn(), exit = fadeOut()) {
        Text(
            text,
            color = Color.White,
            fontWeight = FontWeight.Bold,
            modifier = Modifier
                .clip(RoundedCornerShape(16.dp))
                .background(if (item.good) Palette.Green else Palette.Red)
                .padding(horizontal = 16.dp, vertical = 8.dp),
        )
    }
}

@Composable
private fun EmptyState(session: Session, onBack: () -> Unit) {
    Spacer(Modifier.height(24.dp))
    Text(stringResource(R.string.trainer_no_questions), fontSize = 22.sp, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(8.dp))
    Text(
        stringResource(
            if (session.mode == Session.Mode.SCHWAECHEN) R.string.schwaechen_body_no_errors else R.string.trainer_no_questions_body,
        ),
        textAlign = TextAlign.Center,
    )
    Spacer(Modifier.height(20.dp))
    SecondaryButton(stringResource(R.string.trainer_back), onClick = onBack)
}

@Composable
private fun LockedState(onOpenAccount: () -> Unit, onBack: () -> Unit) {
    Spacer(Modifier.height(24.dp))
    Text(stringResource(R.string.trainer_locked_title), fontSize = 22.sp, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(8.dp))
    Text(stringResource(R.string.trainer_locked_body), textAlign = TextAlign.Center)
    Spacer(Modifier.height(20.dp))
    PrimaryButton(stringResource(R.string.account_unlock), onClick = onOpenAccount)
    Spacer(Modifier.height(10.dp))
    SecondaryButton(stringResource(R.string.trainer_back), onClick = onBack)
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ResultScreen(
    result: SessionResult,
    snapshot: ProgressSnapshot,
    isPremium: Boolean,
    onRestart: () -> Unit,
    onBack: () -> Unit,
    onStartSession: (Session) -> Unit,
) {
    val expired = result.reason == FinishReason.TIME_EXPIRED
    val placement = result.placement
    Column(
        modifier = Modifier
            .widthIn(max = 520.dp)
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(Palette.Card)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        val headline = when {
            expired -> stringResource(R.string.result_time_expired_title)
            placement != null -> stringResource(R.string.result_placement_title, placement.level)
            result.pct >= 80 -> stringResource(R.string.result_excellent)
            result.pct >= 60 -> stringResource(R.string.result_good_job)
            else -> stringResource(R.string.result_keep_practicing)
        }
        Text(headline, fontSize = 24.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        Spacer(Modifier.height(6.dp))
        Text(
            when {
                expired -> stringResource(R.string.result_time_expired_message)
                placement != null -> stringResource(R.string.result_placement_done)
                else -> stringResource(R.string.result_session_ended)
            },
            color = Palette.Muted,
            textAlign = TextAlign.Center,
        )
        if (placement != null) {
            Spacer(Modifier.height(10.dp))
            Text(stringResource(R.string.result_placement_explain, placement.level), textAlign = TextAlign.Center, fontSize = 14.sp)
            Spacer(Modifier.height(8.dp))
            Session.LEVELS.forEach { lvl ->
                val sc = placement.scores[lvl] ?: return@forEach
                Row(Modifier.fillMaxWidth().padding(vertical = 2.dp), verticalAlignment = Alignment.CenterVertically) {
                    LevelPill(lvl, highlighted = lvl == placement.level)
                    Text(
                        "  ${sc.correct}/${sc.total} (${sc.pct}%)",
                        fontWeight = if (lvl == placement.level) FontWeight.Bold else FontWeight.Normal,
                    )
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            Stat(result.answered.toString(), stringResource(R.string.result_questions), Palette.Text)
            Stat(result.correct.toString(), stringResource(R.string.result_correct), Palette.Green)
            Stat(result.wrong.toString(), stringResource(R.string.result_wrong), Palette.Red)
            Stat("${result.pct}%", stringResource(R.string.result_score), Palette.Purple)
        }
        Spacer(Modifier.height(14.dp))
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally)) {
            if (snapshot.currentStreak > 0) Badge(stringResource(R.string.trainer_streak_badge, snapshot.currentStreak))
            if (result.xpGained > 0) Badge("+${result.xpGained} XP ⭐")
            Badge("Lv${snapshot.level.num} ${snapshot.level.name}")
        }
        Spacer(Modifier.height(18.dp))
        when {
            expired -> SecondaryButton(stringResource(R.string.result_tomorrow), onClick = onBack)
            placement != null -> {
                PrimaryButton(
                    stringResource(R.string.result_train_level, placement.level),
                    onClick = { onStartSession(Session(Session.Mode.LEVEL, placement.level)) },
                )
                Spacer(Modifier.height(10.dp))
                SecondaryButton(stringResource(R.string.trainer_back), onClick = onBack)
            }
            else -> {
                PrimaryButton(stringResource(R.string.result_new_round), onClick = onRestart)
                Spacer(Modifier.height(10.dp))
                SecondaryButton(stringResource(R.string.trainer_back), onClick = onBack)
                if (isPremium) {
                    Spacer(Modifier.height(10.dp))
                    SecondaryButton(
                        stringResource(R.string.result_test_level),
                        onClick = { onStartSession(Session(Session.Mode.PLACEMENT)) },
                    )
                }
            }
        }
    }

    if (result.wrongTopics.isNotEmpty() && placement == null) {
        Spacer(Modifier.height(16.dp))
        Column(
            modifier = Modifier
                .widthIn(max = 520.dp)
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(Palette.Card)
                .padding(16.dp),
        ) {
            Text(stringResource(R.string.result_wrong_topics), fontWeight = FontWeight.Bold)
            result.wrongTopics.forEach { topic ->
                Row(
                    Modifier.fillMaxWidth().padding(top = 10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    LevelPill(topic.level)
                    Column(Modifier.weight(1f)) {
                        Text(topic.name, fontWeight = FontWeight.Bold)
                        Text(stringResource(R.string.result_topic_errors, topic.count), color = Palette.Red, fontSize = 13.sp)
                    }
                    if (isPremium) {
                        SecondaryButton(
                            stringResource(R.string.result_train_topic),
                            onClick = {
                                val mode = if (topic.vocab) Session.Mode.VOCAB else Session.Mode.TOPIC
                                onStartSession(Session(mode, topic.level, topic.topic))
                            },
                        )
                    }
                }
            }
        }
    }
    Spacer(Modifier.height(24.dp))
}

@Composable
private fun Stat(value: String, label: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 26.sp, fontWeight = FontWeight.Bold, color = color)
        Text(label.uppercase(), fontSize = 11.sp, color = Palette.Muted)
    }
}
