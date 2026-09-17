import React, { useEffect, useState } from 'react';
import { useQuizStore } from './store/useQuizStore';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';

type Screen = 'quiz' | 'result' | 'leaderboard';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('quiz');
  const { isFinished, restartQuiz } = useQuizStore();

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { expand: () => void; enableClosingConfirmation: () => void; ready: () => void } } })?.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
    }
  }, []);

  useEffect(() => {
    if (isFinished) {
      setScreen('result');
    }
  }, [isFinished]);

  const handleRestart = () => {
    restartQuiz();
    setScreen('quiz');
  };

  const handleShowLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleBackToResult = () => {
    setScreen('result');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {screen === 'quiz' && <QuizScreen />}
      {screen === 'result' && (
        <ResultScreen
          onRestart={handleRestart}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}
      {screen === 'leaderboard' && (
        <LeaderboardScreen onBack={handleBackToResult} />
      )}
    </main>
  );
};

export default App;
