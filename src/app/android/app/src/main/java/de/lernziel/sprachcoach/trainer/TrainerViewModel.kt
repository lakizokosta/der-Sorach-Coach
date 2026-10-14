package de.lernziel.sprachcoach.trainer

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import de.lernziel.sprachcoach.account.Tier
import de.lernziel.sprachcoach.data.LevelScore
import de.lernziel.sprachcoach.data.ProgressStore
import de.lernziel.sprachcoach.data.Question
import de.lernziel.sprachcoach.data.QuestionRepository
import de.lernziel.sprachcoach.data.TopicInfo
import de.lernziel.sprachcoach.data.XpLevel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

enum class FinishReason { QUESTIONS_DONE, MANUAL, TIME_EXPIRED }

/** Short-lived trainer toast (`micro-feedback` on the web). */
sealed interface Feedback {
    val good: Boolean
    data class Xp(val amount: Int) : Feedback { override val good get() = amount > 0 }
    data object BonusXp : Feedback { override val good = true }
    data class Tier(val xp: Int, val answered: Int) : Feedback { override val good = true }
    data class LevelUp(val level: XpLevel) : Feedback { override val good = true }
    data object TopicMastered : Feedback { override val good = true }
}

/** A topic (or Wortschatz set, when [vocab]) answered wrongly in this session. */
data class WrongTopic(val level: String, val topic: String, val name: String, val count: Int, val vocab: Boolean = false)

/** Einstufungstest outcome: detected level and per-level scores (A1…B2). */
data class PlacementResult(val level: String, val scores: Map<String, LevelScore>)

data class SessionResult(
    val reason: FinishReason,
    val answered: Int,
    val correct: Int,
    val wrong: Int,
    val xpGained: Int,
    val wrongTopics: List<WrongTopic>,
    val placement: PlacementResult? = null,
) {
    val pct: Int get() = if (answered == 0) 0 else Math.round(correct * 100f / answered)
}

sealed interface TrainerState {
    data object Loading : TrainerState
    data object Empty : TrainerState
    /** A Premium mode opened without Premium (the web redirects to `/premium?hub=1`). */
    data object Locked : TrainerState
    data class Active(
        val question: Question,
        /** Changes on every Weiter, so widgets reset even if a question comes back. */
        val questionKey: Int,
        val current: Int,
        val total: Int,
        val progressPct: Int,
        val topic: TopicInfo?,
        val showRetry: Boolean,
        val resolved: Boolean,
        /** Topic whose Grammatik-Tipp to show (Premium, after an error). */
        val tipTopic: String? = null,
    ) : TrainerState
    data class Finished(val result: SessionResult) : TrainerState
}

data class Score(val correct: Int = 0, val wrong: Int = 0) {
    val answered: Int get() = correct + wrong
    val pct: Int get() = if (answered == 0) 0 else Math.round(correct * 100f / answered)
}

/** Timer shown in the circle: free countdown, Premium count-up, none for Basis. */
enum class TimerMode { COUNTDOWN, COUNT_UP, HIDDEN }

/**
 * One trainer session (spec 02-trainer §2 modes, §4 flow, §8 scoring):
 * adaptive queue, XP (±1, ±2 for Premium), daily goal, streak, bonus tiers,
 * the free 10-minute countdown, and the Einstufungstest.
 */
class TrainerViewModel(
    val session: Session,
    private val tier: Tier,
    private val repository: QuestionRepository,
    private val progress: ProgressStore,
) : ViewModel() {

    val isPremium: Boolean = tier == Tier.PREMIUM
    val timerMode: TimerMode = when (tier) {
        Tier.FREE -> TimerMode.COUNTDOWN
        Tier.BASIS -> TimerMode.HIDDEN
        Tier.PREMIUM -> TimerMode.COUNT_UP
    }
    private val xpPerAnswer = if (isPremium) 2 else 1
    private val placement = session.mode == Session.Mode.PLACEMENT

    private val _state = MutableStateFlow<TrainerState>(TrainerState.Loading)
    val state: StateFlow<TrainerState> = _state.asStateFlow()

    private val _score = MutableStateFlow(Score())
    val score: StateFlow<Score> = _score.asStateFlow()

    /** Countdown: seconds left today. Count-up: seconds elapsed. */
    private val _seconds = MutableStateFlow(0)
    val seconds: StateFlow<Int> = _seconds.asStateFlow()

    private val _feedback = MutableStateFlow<Pair<Int, Feedback>?>(null)
    /** Latest toast with a sequence number, so equal toasts still re-trigger. */
    val feedback: StateFlow<Pair<Int, Feedback>?> = _feedback.asStateFlow()

    /** Header line: mode, level, topic/set names (resolved once the pool is loaded). */
    private val _label = MutableStateFlow(SessionLabel(session, tier))
    val label: StateFlow<SessionLabel> = _label.asStateFlow()

    val progressSnapshot = progress.snapshot

    private var pool: List<Question> = emptyList()
    private var queue: AdaptiveQueue? = null
    private var questionKey = 0
    private var feedbackSeq = 0

    /** Whether the current question's wrong answer has already been counted. */
    private var firstWrongCounted = false
    private var sessionXp = 0
    private val wrongTopics = linkedMapOf<String, Int>()
    private val placementScores = linkedMapOf<String, LevelScore>()

    private var timerStarted = false
    private var visible = true
    private var unsavedSeconds = 0
    private var tickJob: Job? = null

    init {
        viewModelScope.launch {
            if (session.mode.premiumOnly && !isPremium) {
                _state.value = TrainerState.Locked
                return@launch
            }
            pool = runCatching { loadPool() }.getOrDefault(emptyList())
            startSession()
        }
    }

    private suspend fun loadPool(): List<Question> = when (session.mode) {
        Session.Mode.LEVEL -> repository.questionsForLevel(session.level)
        Session.Mode.TOPIC -> {
            _label.update { it.copy(name = repository.hubTopic(session.level, session.key)?.name ?: session.key) }
            repository.questionsForTopic(session.level, session.key)
        }
        Session.Mode.VOCAB -> {
            _label.update { it.copy(name = repository.vocabSet(session.level, session.key)?.name ?: session.key) }
            repository.questionsForVocabSet(session.level, session.key)
        }
        Session.Mode.SCHWAECHEN -> {
            val weak = progress.weakestTopics(Session.LEVELS.associateWith { repository.hubLevel(it).topics })
            _label.update { it.copy(name = weak.joinToString(" · ") { w -> w.topic.name }) }
            weak.flatMap { repository.questionsForTopic(it.level, it.topic.key) }.distinctBy { it.id }
        }
        Session.Mode.PLACEMENT -> buildProgressiveOrder(
            Session.LEVELS.associateWith { lvl ->
                repository.questionsForLevel(lvl).filter { it.level == lvl }.shuffled().take(PLACEMENT_PER_LEVEL)
            },
        )
    }

    private suspend fun startSession() {
        val q = AdaptiveQueue(pool, shuffle = !placement)
        queue = q
        _score.value = Score()
        sessionXp = 0
        wrongTopics.clear()
        placementScores.clear()
        timerStarted = false
        _seconds.value = if (timerMode == TimerMode.COUNTDOWN) progress.freeSecondsRemaining() else 0
        when {
            q.total == 0 -> _state.value = TrainerState.Empty
            timerMode == TimerMode.COUNTDOWN && _seconds.value == 0 -> finish(FinishReason.TIME_EXPIRED)
            else -> showCurrent(showRetry = false, resolved = false)
        }
    }

    fun restart() {
        viewModelScope.launch { startSession() }
    }

    private suspend fun showCurrent(showRetry: Boolean, resolved: Boolean) {
        val q = queue ?: return
        val question = q.peek() ?: return
        firstWrongCounted = showRetry
        _state.value = TrainerState.Active(
            question = question,
            questionKey = questionKey,
            current = minOf(q.solvedCount + 1, q.total),
            total = q.total,
            progressPct = q.progressPct,
            topic = if (session.mode == Session.Mode.TOPIC) null else repository.topicInfo(question.level, question.topic),
            showRetry = showRetry,
            resolved = resolved,
        )
    }

    /** First wrong attempt on a question: counted once, the question stays. */
    fun onFirstWrong() {
        val active = _state.value as? TrainerState.Active ?: return
        if (active.resolved || firstWrongCounted) return
        ensureTimerStarted()
        firstWrongCounted = true
        countWrong(active.question)
        _state.value = active.copy(showRetry = true, tipTopic = tipFor(active.question))
    }

    /** Final answer from a widget. A question with an earlier wrong attempt scores as wrong. */
    fun onAnswer(isCorrect: Boolean) {
        val active = _state.value as? TrainerState.Active ?: return
        if (active.resolved) return
        ensureTimerStarted()
        val q = queue ?: return
        val effective = isCorrect && !firstWrongCounted
        if (!firstWrongCounted) {
            if (effective) countCorrect(active.question) else countWrong(active.question)
        }
        // Placement never repeats a question.
        if (effective || placement) q.consumeCorrect() else q.consumeWrong()
        _state.value = active.copy(
            resolved = true,
            progressPct = q.progressPct,
            tipTopic = active.tipTopic ?: tipFor(active.question).takeIf { !effective },
        )
    }

    private fun tipFor(question: Question) = question.topic.takeIf { isPremium }

    /** Weiter: shows the next question, or ends the session when the queue is empty. */
    fun next() {
        val active = _state.value as? TrainerState.Active ?: return
        if (!active.resolved) return
        val q = queue ?: return
        if (!q.hasNext()) {
            finish(FinishReason.QUESTIONS_DONE)
            return
        }
        questionKey += 1
        viewModelScope.launch { showCurrent(showRetry = false, resolved = false) }
    }

    fun finishManually() = finish(FinishReason.MANUAL)

    private fun recordPlacement(question: Question, correct: Boolean) {
        val s = placementScores[question.level] ?: LevelScore()
        placementScores[question.level] = LevelScore(s.correct + if (correct) 1 else 0, s.total + 1)
    }

    private fun countCorrect(question: Question) {
        _score.update { it.copy(correct = it.correct + 1) }
        if (placement) {
            recordPlacement(question, true)
            return
        }
        progress.recordQuestionAnswered(isPremium)
        val change = awardXp(xpPerAnswer, question.topic, +1)
        if (progress.todayCount() > ProgressStore.DAILY_GOAL_QUESTIONS) {
            awardXp(1, null, 0)
            emit(Feedback.BonusXp)
        }
        claimTier()
        change.levelUp?.let { emit(Feedback.LevelUp(it)) }
        if (change.topicMastered) emit(Feedback.TopicMastered)
    }

    private fun countWrong(question: Question) {
        _score.update { it.copy(wrong = it.wrong + 1) }
        if (placement) {
            recordPlacement(question, false)
            return
        }
        progress.recordQuestionAnswered(isPremium)
        awardXp(-xpPerAnswer, question.topic, -1)
        progress.recordTopicWrong(question.topic)
        val key = "${question.level}|${question.topic}"
        wrongTopics[key] = (wrongTopics[key] ?: 0) + 1
        claimTier()
    }

    private fun awardXp(amount: Int, topic: String?, correctDelta: Int) =
        progress.addXp(amount, topic, correctDelta).also {
            sessionXp += amount
            if (topic != null) emit(Feedback.Xp(amount))
        }

    private fun claimTier() {
        val answered = progress.todayCount()
        val bonus = progress.claimBonusTier(answered)
        if (bonus > 0) {
            awardXp(bonus, null, 0)
            emit(Feedback.Tier(bonus, answered))
        }
    }

    private fun emit(feedback: Feedback) {
        feedbackSeq += 1
        _feedback.value = feedbackSeq to feedback
    }

    private fun finish(reason: FinishReason) {
        tickJob?.cancel()
        saveUsedTime()
        // Like the web, only a completed test yields a level (a manual end does not).
        val placementResult = if (placement && reason == FinishReason.QUESTIONS_DONE) {
            val scores = Session.LEVELS.associateWith { placementScores[it] ?: LevelScore() }
            PlacementResult(evaluatePlacementLevel(scores), scores).also { progress.setCefrLevel(it.level, it.scores) }
        } else {
            null
        }
        viewModelScope.launch {
            val topics = wrongTopics.entries
                .sortedByDescending { it.value }
                .map { (key, count) ->
                    val (lvl, topic) = key.split('|', limit = 2)
                    val grammar = repository.topicInfo(lvl, topic)
                    val set = if (grammar == null) repository.vocabSet(lvl, topic) else null
                    WrongTopic(lvl, topic, grammar?.name ?: set?.name ?: topic, count, vocab = set != null)
                }
            val s = _score.value
            _state.value = TrainerState.Finished(
                SessionResult(reason, s.answered, s.correct, s.wrong, sessionXp, topics, placementResult),
            )
        }
    }

    // --- Timer -----------------------------------------------------------------

    private fun ensureTimerStarted() {
        if (timerStarted || timerMode == TimerMode.HIDDEN) return
        timerStarted = true
        startTicking()
    }

    private fun startTicking() {
        if (!timerStarted || !visible || tickJob?.isActive == true) return
        if (_state.value is TrainerState.Finished) return
        tickJob = viewModelScope.launch {
            while (isActive) {
                if (timerMode == TimerMode.COUNTDOWN && _seconds.value <= 0) break
                delay(1000)
                if (timerMode == TimerMode.COUNTDOWN) {
                    _seconds.update { (it - 1).coerceAtLeast(0) }
                    unsavedSeconds += 1
                } else {
                    _seconds.update { it + 1 }
                }
            }
            if (timerMode == TimerMode.COUNTDOWN && _seconds.value == 0) finish(FinishReason.TIME_EXPIRED)
        }
    }

    /** The timer only runs while the trainer is on screen. */
    fun onVisibilityChanged(isVisible: Boolean) {
        visible = isVisible
        if (isVisible) {
            startTicking()
        } else {
            tickJob?.cancel()
            saveUsedTime()
        }
    }

    private fun saveUsedTime() {
        progress.addFreeSecondsUsed(unsavedSeconds)
        unsavedSeconds = 0
    }

    override fun onCleared() {
        saveUsedTime()
    }

    companion object {
        const val PLACEMENT_PER_LEVEL = 15
    }
}

/** Header label parts; [name] is the topic, set or weak-topic list once loaded. */
data class SessionLabel(val session: Session, val tier: Tier, val name: String = "")
