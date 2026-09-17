import React, { useEffect } from 'react';
import { useQuizStore } from './store/useQuizStore';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';

export const App: React.FC = () => {
  const { currentScreen, initQuiz } = useQuizStore();

  useEffect(() => {
    // Разворачиваем окно на максимум и включаем подтверждение выхода
    const tg = (window as unknown as { Telegram?: { WebApp?: { expand: () => void; enableClosingConfirmation: () => void; ready: () => void } } })?.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
    }
    initQuiz();
  }, [initQuiz]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {currentScreen === 'quiz' && <QuizScreen />}
      {currentScreen === 'result' && <ResultScreen />}
      {currentScreen === 'leaderboard' && <LeaderboardScreen />}
    </main>
  );
};

export default App;
