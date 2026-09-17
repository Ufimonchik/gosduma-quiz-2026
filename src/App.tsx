import React, { useEffect, useState } from 'react';
import { useQuizStore } from './store/useQuizStore';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';

type Screen = 'quiz' | 'result' | 'leaderboard';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('quiz');
  const store = useQuizStore() as any;

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { expand: () => void; enableClosingConfirmation: () => void; ready: () => void } } })?.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
    }
  }, []);

  useEffect(() => {
    // Отслеживаем завершение по любому возможному флагу стора
    const isEnded = 
      store.isFinished || 
      store.isCompleted || 
      store.status === 'finished' || 
      (typeof store.currentQuestionIndex === 'number' && store.questions && store.currentQuestionIndex >= store.questions.length);

    if (isEnded) {
      setScreen('result');
    }
  }, [store]);

  const handleRestart = () => {
    if (typeof store.restartQuiz === 'function') store.restartQuiz();
    else if (typeof store.resetQuiz === 'function') store.resetQuiz();
    else if (typeof store.reset === 'function') store.reset();
    setScreen('quiz');
  };

  const handleOpenLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleBack = () => {
    setScreen('result');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {screen === 'quiz' && <QuizScreen />}
      {screen === 'result' && (
        <ResultScreen
          onRestart={handleRestart}
          onOpenLeaderboard={handleOpenLeaderboard}
        />
      )}
      {screen === 'leaderboard' && (
        <LeaderboardScreen onBack={handleBack} />
      )}
    </main>
  );
};

export default App;
