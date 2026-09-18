import React, { useEffect, useState } from 'react';
import { useQuizStore } from './store/useQuizStore';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import questionsData from './data/questions.json';
import type { QuestionItem } from './types/quiz';

export const App: React.FC = () => {
  const store = useQuizStore() as any;
  const [view, setView] = useState<'quiz' | 'result' | 'leaderboard'>('quiz');

  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (typeof tg.enableClosingConfirmation === 'function') {
        tg.enableClosingConfirmation();
      }
    }

    if (typeof store.initQuiz === 'function') {
      store.initQuiz(questionsData as QuestionItem[]);
    }
  }, []);

  // Переключаем на результаты, когда ответили на все вопросы
  useEffect(() => {
    const total = store.questions?.length || 0;
    const answered = store.answersHistory?.length || 0;
    const isCompleted = (total > 0 && answered >= total) ||
      (typeof store.currentQuestionIndex === 'number' && total > 0 && store.currentQuestionIndex >= total);

    if (isCompleted && view === 'quiz') {
      setView('result');
    }
  }, [store.answersHistory, store.currentQuestionIndex, store.questions, view]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {view === 'leaderboard' && (
        <LeaderboardScreen onBack={() => setView('result')} />
      )}

      {view === 'result' && (
        <ResultScreen
          onRestart={() => {
            if (typeof store.resetQuiz === 'function') {
              store.resetQuiz();
            }
            if (typeof store.initQuiz === 'function') {
              store.initQuiz(questionsData as QuestionItem[]);
            }
            setView('quiz');
          }}
          onOpenLeaderboard={() => {
            setView('leaderboard');
          }}
        />
      )}

      {view === 'quiz' && <QuizScreen />}
    </main>
  );
};

export default App;
