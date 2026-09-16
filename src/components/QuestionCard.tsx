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

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswerSelected,
  onNextQuestion,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

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
    onAnswerSelected(optionId);

    const isCorrect = optionId === question.correct_option_id;
    triggerHaptic(isCorrect ? 'success' : 'error');
  };

  return (
    <div className="w-full max-w-md flex flex-col font-sans select-none">
      {/* Прогресс-бар */}
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 mb-5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Верхняя плашка вопроса */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-950/70 text-cyan-300 border border-cyan-800/50 font-display">
          {question.category}
        </span>
        <span className="text-xs font-mono text-slate-400 font-semibold">
          Вопрос {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Заголовок вопроса */}
      <h2 className="text-lg md:text-xl font-bold text-white leading-snug tracking-tight mb-5 min-h-[56px] flex items-center font-display">
        {question.question}
      </h2>

      {/* Список вариантов ответов */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option, idx) => {
          let btnStyle = 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-700 active:scale-[0.99]';
          let letterStyle = 'bg-slate-800 text-slate-400 border-slate-700 font-display';

          if (isAnswered) {
            const isCorrect = option.id === question.correct_option_id;
            const isChosen = option.id === selectedOptionId;

            if (isCorrect) {
              btnStyle = 'bg-emerald-950/70 text-emerald-100 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
              letterStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 font-display';
            } else if (isChosen && !isCorrect) {
              btnStyle = 'bg-rose-950/70 text-rose-100 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
              letterStyle = 'bg-rose-500 text-white font-bold border-rose-400 font-display';
            } else {
              btnStyle = 'bg-slate-950/50 text-slate-500 border-slate-900 opacity-40';
              letterStyle = 'bg-slate-900 text-slate-600 border-slate-800 font-display';
            }
          }

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isAnswered}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-150 backdrop-blur-sm ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border shrink-0 transition-colors ${letterStyle}`}>
                  {OPTION_LETTERS[idx] || idx + 1}
                </span>
                <span className="text-sm font-medium leading-tight">
                  {option.text}
                </span>
              </div>

              {isAnswered && (
                <div className="shrink-0 pl-2">
                  {option.id === question.correct_option_id && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in zoom-in duration-200" />
                  )}
                  {option.id === selectedOptionId && option.id !== question.correct_option_id && (
                    <XCircle className="w-5 h-5 text-rose-400 animate-in zoom-in duration-200" />
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Блок пояснения и кнопка Дальше */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col gap-3"
          >
            <div className="p-3 bg-cyan-950/30 border border-cyan-900/50 rounded-xl flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200/90 leading-relaxed font-normal">
                {question.explanation}
              </p>
            </div>

            <button
              onClick={onNextQuestion}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 active:scale-[0.99] transition-all font-display text-sm uppercase tracking-wider"
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
