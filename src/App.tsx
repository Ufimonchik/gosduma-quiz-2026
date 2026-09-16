import React, { useState, useEffect } from 'react';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { useQuizStore } from './store/useQuizStore';
import questionsData from './data/questions.json';

export const App: React.FC = () => {
  const { isCompleted, initQuiz } = useQuizStore();
  const [screen, setScreen] = useState<'quiz' | 'result' | 'leaderboard'>('quiz');

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void } } })?.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }

    initQuiz(questionsData);
  }, [initQuiz]);

  useEffect(() => {
    if (isCompleted) {
      setScreen('result');
    }
  }, [isCompleted]);

  const handleRestart = () => {
    initQuiz(questionsData);
    setScreen('quiz');
  };

  if (screen === 'leaderboard') {
    return <LeaderboardScreen onBack={() => setScreen(isCompleted ? 'result' : 'quiz')} />;
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        onRestart={handleRestart}
        onOpenLeaderboard={() => setScreen('leaderboard')}
      />
    );
  }

  return <QuizScreen />;
};

export default App;