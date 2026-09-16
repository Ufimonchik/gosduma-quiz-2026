import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import type { QuestionItem } from '../types/quiz';

interface QuestionCardProps {
  question: QuestionItem;
  currentIndex: number;
  totalQuestions: number;
  onAnswerSelected: (selectedId: string) => void;
  onNextQuestion: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswerSelected,
  onNextQuestion,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Сбрасываем выбранный вариант при смене вопроса
  useEffect(() => {
    setSelectedOptionId(null);
  }, [question.id]);

  const isAnswered = selectedOptionId !== null;

  const triggerHaptic = (type: 'success' | 'error') => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { notificationOccurred: (t: string) => void } } } })?.Telegram?.WebApp;
    tg?.HapticFeedback?.notificationOccurred(type);
  };

  const handleSelect = (optionId: string) => {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    const isCorrect = optionId === question.correct_option_id;

    triggerHaptic(isCorrect ? 'success' : 'error');
    onAnswerSelected(optionId);
  };

  return (
    <div className="relative flex flex-col justify-between w-full max-w-md mx-auto min-h-[560px] p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-white select-none overflow-hidden">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 rounded-full uppercase">
            #{question.category}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Вопрос {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.h2
            key={question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-lg md:text-xl font-bold leading-snug text-slate-100 mb-6"
          >
            {question.question}
          </motion.h2>
        </AnimatePresence>

        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.id === question.correct_option_id;

            let buttonStyle = "bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-slate-600 active:scale-[0.98]";

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
              } else if (isSelected) {
                buttonStyle = "bg-rose-950/70 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.2)]";
              } else {
                buttonStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed";
              }
            }

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                disabled={isAnswered}
                onClick={() => handleSelect(option.id)}
                className={`relative flex items-center justify-between w-full p-4 text-left font-medium text-sm rounded-2xl border transition-all duration-150 ${buttonStyle}`}
              >
                <div className="flex items-center gap-3 pr-2">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 transition-colors ${
                    isSelected ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option.text}</span>
                </div>

                {isAnswered && (
                  <div className="shrink-0">
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="mt-6 pt-4 border-t border-slate-800"
          >
            <div className="p-3.5 mb-4 rounded-xl bg-slate-800/60 border border-slate-700/50 flex gap-2.5 items-start">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                {question.explanation}
              </p>
            </div>

            <button
              onClick={onNextQuestion}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 font-semibold text-sm bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-2xl shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-transform"
            >
              <span>{currentIndex + 1 === totalQuestions ? 'Завершить квиз' : 'Следующий вопрос'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};