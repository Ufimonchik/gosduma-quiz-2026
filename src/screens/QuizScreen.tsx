import React, { useEffect } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { useQuizSounds } from '../hooks/useQuizSounds';
import { QuestionCard } from '../components/QuestionCard';

export const QuizScreen: React.FC = () => {
  const {
    questions,
    currentIndex,
    score,
    streak,
    multiplier,
    timeLeft,
    isCurrentAnswered,
    answerQuestion,
    nextQuestion,
  } = useQuizStore();

  const { playSound, playClick } = useQuizSounds();

  useEffect(() => {
    if (timeLeft <= 4 && timeLeft > 0 && !isCurrentAnswered) {
      playSound('tick', { isUrgent: timeLeft <= 2 });
    }
  }, [timeLeft, isCurrentAnswered, playSound]);

  const handleAnswer = (optionId: string) => {
    const currentQ = questions[currentIndex];
    const isCorrect = optionId === currentQ.correct_option_id;

    if (isCorrect) {
      if ((streak + 1) >= 3 && (streak + 1) % 3 === 0) {
        playSound('streak');
      } else {
        playSound('correct');
      }
    } else {
      playSound('wrong');
    }

    answerQuestion(optionId);
  };

  const handleNext = () => {
    playClick();
    nextQuestion();
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-3 px-2 text-white text-sm font-semibold">
        <div>Очки: <span className="text-cyan-400 font-mono text-base">{score}</span></div>
        <div className="flex items-center gap-1">
          <span>Стрик:</span>
          <span className="text-amber-400">🔥 {streak}</span>
          {multiplier > 1 && (
            <span className="text-xs text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-700/50">
              x{multiplier}
            </span>
          )}
        </div>
        <div>
          Таймер: <span className={`font-mono text-base ${timeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>{timeLeft}с</span>
        </div>
      </div>

      <QuestionCard
        question={currentQ}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onAnswerSelected={handleAnswer}
        onNextQuestion={handleNext}
      />
    </div>
  );
};