import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  RotateCcw, 
  Share2, 
  CheckCircle, 
  Flame, 
  Zap, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { useQuizSounds } from '../hooks/useQuizSounds';
import { supabase } from '../lib/supabase';

interface ResultRank {
  title: string;
  badge: string;
  color: string;
  borderColor: string;
  desc: string;
}

const getRankDetails = (percentage: number): ResultRank => {
  if (percentage >= 90) {
    return {
      title: 'Председатель ЦИК',
      badge: '👑 Эксперт высшей лиги',
      color: 'from-amber-400 to-yellow-500',
      borderColor: 'border-amber-500/50',
      desc: 'Абсолютное знание процедур, Конституции и избирательного права РФ.',
    };
  }
  if (percentage >= 70) {
    return {
      title: 'Осознанный избиратель',
      badge: '🗳️ Федеральный уровень',
      color: 'from-indigo-400 to-cyan-400',
      borderColor: 'border-indigo-500/50',
      desc: 'Тебя невозможно запутать популистскими обещаниями или фейковыми вбросами.',
    };
  }
  if (percentage >= 50) {
    return {
      title: 'Начинающий наблюдатель',
      badge: '👀 Есть база',
      color: 'from-emerald-400 to-teal-500',
      borderColor: 'border-emerald-500/50',
      desc: 'Базовые понятия усвоены, но в нюансах распределения мандатов еще есть пробелы.',
    };
  }
  return {
    title: 'Диванный аналитик',
    badge: '🛋️ Нужен ресерч',
    color: 'from-rose-400 to-orange-500',
    borderColor: 'border-rose-500/50',
    desc: 'Пора освежить знания по обществознанию перед реальным походом на выборы.',
  };
};

interface ResultScreenProps {
  onRestart: () => void;
  onOpenLeaderboard?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ onRestart, onOpenLeaderboard }) => {
  const { score, maxStreak, answersHistory, questions, resetQuiz } = useQuizStore();
  const { playClick } = useQuizSounds();

  const totalQuestions = questions.length || answersHistory.length;
  const correctCount = useMemo(
    () => answersHistory.filter((a) => a.isCorrect).length,
    [answersHistory]
  );
  const accuracyPercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const rank = useMemo(() => getRankDetails(accuracyPercentage), [accuracyPercentage]);

  const wrongAnswers = useMemo(() => {
    return answersHistory
      .filter((a) => !a.isCorrect)
      .map((a) => {
        const questionObj = questions.find((q) => q.id === a.questionId);
        return {
          ...a,
          questionText: questionObj?.question || 'Вопрос',
          explanation: questionObj?.explanation || '',
        };
      });
  }, [answersHistory, questions]);

  useEffect(() => {
    const saveRecord = async () => {
      try {
        const tg = (window as any)?.Telegram?.WebApp;
        if (tg) {
          tg.ready();
        }

        let tgUser = tg?.initDataUnsafe?.user;

        // Принудительно парсим из initData, если initDataUnsafe не успел заполниться
        if (!tgUser && tg?.initData) {
          try {
            const params = new URLSearchParams(tg.initData);
            const userStr = params.get('user');
            if (userStr) {
              tgUser = JSON.parse(userStr);
            }
          } catch (err) {
            console.error('Ошибка парсинга initData:', err);
          }
        }

        let localId = localStorage.getItem('quiz_user_id');
        if (!localId) {
          localId = String(Math.floor(100000 + Math.random() * 900000));
          localStorage.setItem('quiz_user_id', localId);
        }

        const userId = tgUser?.id ? Number(tgUser.id) : Number(localId);
        const firstName = tgUser?.first_name || tgUser?.username || 'Участник';
        const username = tgUser?.username || '';

        if (score > 0) {
          await supabase.from('leaderboard').upsert(
            {
              user_id: userId,
              username: username,
              first_name: firstName,
              score: Number(score) || 0,
              accuracy: Number(accuracyPercentage) || 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        }
      } catch (e) {
        console.error('Ошибка сохранения в таблицу лидеров:', e);
      }
    };

    saveRecord();
  }, [score, accuracyPercentage]);

  const handleShare = () => {
    const botUrl = 'https://t.me/gosduma_2026_quiz_bot';
    const shareText = `🏛️ Я набрал ${score} очков в квизе «Выборы в Госдуму 2026»!\nСможешь превзойти мой результат? 🗳️`;
    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(shareText)}`;

    const tg = (window as any)?.Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(tgShareUrl);
    } else {
      window.open(tgShareUrl, '_blank');
    }
  };

  const handlePlayAgain = () => {
    playClick();
    resetQuiz();
    onRestart();
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto min-h-screen p-4 pb-12 bg-slate-950 text-white select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative mt-4 p-6 rounded-3xl bg-slate-900 border ${rank.borderColor} shadow-2xl text-center overflow-hidden`}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>{rank.badge}</span>
        </div>

        <h1 className={`text-2xl font-black bg-gradient-to-r ${rank.color} bg-clip-text text-transparent mb-1`}>
          {rank.title}
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
          {rank.desc}
        </p>

        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[11px] font-medium">Счет</span>
            <span className="text-lg font-black font-mono text-cyan-400 flex items-center gap-0.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              {score}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-800">
            <span className="text-slate-400 text-[11px] font-medium">Точность</span>
            <span className="text-lg font-black font-mono text-emerald-400 flex items-center gap-0.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {accuracyPercentage}%
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[11px] font-medium">Макс. стрик</span>
            <span className="text-lg font-black font-mono text-amber-400 flex items-center gap-0.5">
              <Flame className="w-4 h-4 text-amber-400" />
              {maxStreak}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 my-5">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3.5 px-4 font-semibold text-sm bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 active:scale-[0.98] text-white rounded-2xl shadow-lg shadow-indigo-500/25 transition-transform"
        >
          <Share2 className="w-4 h-4" />
          <span>Поделиться</span>
        </button>

        <button
          onClick={handlePlayAgain}
          className="flex items-center justify-center gap-2 py-3.5 px-4 font-semibold text-sm bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white border border-slate-700 rounded-2xl transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Еще раунд</span>
        </button>
      </div>

      {onOpenLeaderboard && (
        <button
          onClick={() => {
            playClick();
            onOpenLeaderboard();
          }}
          className="w-full flex items-center justify-between p-4 mb-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl active:scale-[0.99] transition-all text-sm font-medium"
        >
          <div className="flex items-center gap-2.5 text-amber-400">
            <Trophy className="w-5 h-5" />
            <span className="text-slate-200">Посмотреть таблицу лидеров</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase px-1">
          Разбор ошибок ({wrongAnswers.length})
        </h3>

        {wrongAnswers.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-center">
            <p className="text-xs text-emerald-300 font-medium">
              Идеальный результат! Ни одной ошибки за весь раунд.
            </p>
          </div>
        ) : (
          wrongAnswers.map((item, idx) => (
            <motion.div
              key={item.questionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800"
            >
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <h4 className="text-xs font-semibold text-slate-200 leading-snug">
                  {item.questionText}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                {item.explanation}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
