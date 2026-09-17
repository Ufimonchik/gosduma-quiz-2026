import React, { useEffect } from 'react';
import { useQuizStore } from './store/useQuizStore';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import questionsData from './data/questions.json';
import type { QuestionItem } from './types/quiz';

export const App: React.FC = () => {
  const store = useQuizStore() as any;

  useEffect(() => {
    // Безопасная интеграция Telegram WebApp
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (typeof tg.enableClosingConfirmation === 'function') {
        tg.enableClosingConfirmation();
      }
    }

    // Инициализируем квиз, передавая загруженные 15 вопросов
    if (typeof store.initQuiz === 'function') {
      store.initQuiz(questionsData as QuestionItem[]);
    }
  }, []);

  const showLeaderboard = Boolean(store.showLeaderboard || store.currentScreen === 'leaderboard');
  const isFinished = Boolean(
    store.isFinished || 
    store.isCompleted || 
    store.status === 'finished' ||
    (Array.isArray(store.questions) && store.questions.length > 0 && store.currentQuestionIndex >= store.questions.length)
  );

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
            if (typeof store.initQuiz === 'function') {
              store.initQuiz(questionsData as QuestionItem[]);
            } else if (typeof store.resetQuiz === 'function') {
              store.resetQuiz();
            } else {
              window.location.reload();
            }
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
