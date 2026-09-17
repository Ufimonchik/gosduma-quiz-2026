import React, { useEffect } from 'react';
import { useQuizStore } from './store/useQuizStore';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';

export const App: React.FC = () => {
  const store = useQuizStore() as any;

  useEffect(() => {
    // Безопасное подключение Telegram WebApp без сбоев
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (typeof tg.enableClosingConfirmation === 'function') {
        tg.enableClosingConfirmation();
      }
    }

    // Запуск инициализации квиза, если метод существует
    if (typeof store.initQuiz === 'function') {
      store.initQuiz();
    } else if (typeof store.init === 'function') {
      store.init();
    }
  }, []);

  // Если в сторе есть статус завершения/экрана — используем его
  const isFinished = store.isFinished || store.isCompleted || store.status === 'finished';
  const showLeaderboard = store.showLeaderboard || store.currentScreen === 'leaderboard';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {showLeaderboard ? (
        <LeaderboardScreen
          onBack={() => {
            if (typeof store.setShowLeaderboard === 'function') store.setShowLeaderboard(false);
            if (typeof store.setScreen === 'function') store.setScreen('result');
          }}
        />
      ) : isFinished ? (
        <ResultScreen
          onRestart={() => {
            if (typeof store.restartQuiz === 'function') store.restartQuiz();
            else if (typeof store.resetQuiz === 'function') store.resetQuiz();
            else window.location.reload();
          }}
          onOpenLeaderboard={() => {
            if (typeof store.setShowLeaderboard === 'function') store.setShowLeaderboard(true);
            if (typeof store.setScreen === 'function') store.setScreen('leaderboard');
          }}
        />
      ) : (
        <QuizScreen />
      )}
    </main>
  );
};

export default App;
