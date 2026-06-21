import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import { EntrantButtons } from '../components/EntrantButtons';
import { ArrowLeftIcon, ClockIcon, FlameIcon } from '../components/icons';
import { QuestionCard } from '../components/QuestionCard';
import { Scoreboard } from '../components/Scoreboard';
import { SoundToggle } from '../components/SoundToggle';
import { SpeechSettings } from '../components/SpeechSettings';
import {
  award,
  clearSession,
  currentQuestion,
  finishGame,
  reveal,
  sessionSignal,
  standings,
} from '../session/session';
import { playCorrect, playStreak } from '../sound';
import { isSpeakingSignal, speak, stopSpeech } from '../speech';
import type { GameSession } from '../types';

function fmtTime(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function ProgressLabel({
  session,
  now,
}: {
  session: GameSession;
  now: number;
}) {
  const { config, cursor } = session;
  if (config.endMode === 'count') {
    return (
      <span>
        Question {Math.min(cursor + 1, config.target)} of {config.target}
      </span>
    );
  }
  if (config.endMode === 'race') {
    return <span>First to {config.target} points</span>;
  }
  if (config.endMode === 'timed') {
    const remaining = (session.endsAt ?? now) - now;
    return (
      <span class="progress-timer">
        <ClockIcon size={14} /> {fmtTime(remaining)}
      </span>
    );
  }
  return <span>Question {cursor + 1}</span>;
}

export function Game() {
  const [, navigate] = useLocation();
  const session = sessionSignal.value;
  const [now, setNow] = useState(Date.now());
  const [flash, setFlash] = useState<{
    name: string;
    points: number;
    bonus: number;
    streak: number;
  } | null>(null);

  const cursor = session?.cursor ?? -1;
  const status = session?.status;
  const timed = session?.config.endMode === 'timed';

  // Redirect out when there's no active game.
  useEffect(() => {
    if (!session) navigate('/');
    else if (session.status === 'finished') navigate('/results');
  }, [status, session, navigate]);

  // Stop narration on each new question, and flash the award that just landed.
  useEffect(() => {
    stopSpeech();
    const a = sessionSignal.value?.lastAward;
    const s = sessionSignal.value;
    if (a?.entrantId && s) {
      const name =
        s.config.entrants.find((e) => e.id === a.entrantId)?.name ?? '';
      setFlash({
        name,
        points: a.base + a.bonus,
        bonus: a.bonus,
        streak: a.streak,
      });
      playCorrect(a.base);
      if (a.bonus > 0) playStreak();
      const t = setTimeout(() => setFlash(null), 1200);
      return () => clearTimeout(t);
    }
  }, [cursor]);

  // Timed mode: tick the clock and end the game when it runs out.
  useEffect(() => {
    if (!timed) return;
    const id = setInterval(() => {
      const s = sessionSignal.value;
      if (s?.endsAt && Date.now() >= s.endsAt) {
        finishGame();
      } else {
        setNow(Date.now());
      }
    }, 1000);
    return () => clearInterval(id);
  }, [timed]);

  if (session?.status !== 'active') return null;

  const question = currentQuestion(session);
  if (!question) {
    finishGame();
    return null;
  }

  const ranked = standings(session);
  const leaderId = ranked[0]?.score.score > 0 ? ranked[0].entrant.id : null;

  return (
    <div class="screen game">
      <header class="game-header">
        <button
          type="button"
          class="icon-btn"
          onClick={() => navigate('/')}
          aria-label="Quit to home"
        >
          <ArrowLeftIcon size={18} />
        </button>
        <div class="game-progress">
          <ProgressLabel session={session} now={now} />
        </div>
        <SoundToggle />
        <SpeechSettings />
      </header>

      <Scoreboard
        entrants={session.config.entrants}
        scores={session.scores}
        leaderId={leaderId}
      />

      <main class="game-main">
        <QuestionCard
          question={question}
          revealed={session.revealed}
          speaking={isSpeakingSignal.value}
          onSpeak={() => speak(question.prompt)}
          onStopSpeak={stopSpeech}
          actions={
            session.revealed ? (
              <EntrantButtons
                entrants={session.config.entrants}
                onPick={award}
              />
            ) : (
              <button type="button" class="primary reveal-btn" onClick={reveal}>
                Reveal answer
              </button>
            )
          }
        />

        {flash && (
          <div class="award-flash" key={cursor}>
            <strong>{flash.name}</strong> +{flash.points}
            {flash.bonus > 0 && (
              <em class="award-flash-streak">
                <FlameIcon size={13} /> {flash.streak} streak
              </em>
            )}
          </div>
        )}
      </main>

      <footer class="game-footer">
        <button
          type="button"
          class="ghost"
          onClick={() => {
            finishGame();
            navigate('/results');
          }}
        >
          Finish game
        </button>
        <button
          type="button"
          class="ghost"
          onClick={() => {
            clearSession();
            navigate('/');
          }}
        >
          Quit
        </button>
      </footer>
    </div>
  );
}
