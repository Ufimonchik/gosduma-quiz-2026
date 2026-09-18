import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Zap, User, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeaderboardItem {
  user_id: number;
  username: string;
  first_name: string;
  score: number;
  accuracy: number;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leaderboard')
          .select('user_id, username, first_name, score, accuracy')
          .order('score', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Ошибка загрузки лидеров:', error);
        } else if (data) {
          setLeaders(data);
        }
      } catch (err) {
        console.error('Сетевой сбой при получении лидеров:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const getRankBadge = (index: number) => {
    if (index === 0) return <Medal className="w-5 h-5 text-amber-400 shrink-0" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-300 shrink-0" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700 shrink-0" />;
    return <span className="w-5 text-center text-xs font-mono font-bold text-slate-500">{index + 1}</span>;
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto min-h-screen p-4 pb-12 bg-slate-950 text-white select-none">
      {/* Шапка */}
      <div className="flex items-center justify-between py-4 mb-4 border-b border-slate-900">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h1 className="text-base font-bold tracking-wide text-slate-100">Таблица лидеров</h1>
        </div>
        <div className="w-7" />
      </div>

      {/* Список лидеров */}
      <div className="flex flex-col gap-2.5 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-xs">Загрузка рейтинга...</span>
          </div>
        ) : leaders.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-900 my-auto">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-300">Таблица пока пуста</p>
            <p className="text-xs text-slate-500 mt-1">Пройди квиз первым и возглавь топ!</p>
          </div>
        ) : (
          leaders.map((player, index) => {
            const isMe = currentUserId && Number(player.user_id) === Number(currentUserId);
            const displayName = player.first_name || player.username || 'Участник';

            return (
              <motion.div
                key={player.user_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-900/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-6">
                    {getRankBadge(index)}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/60">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {displayName}
                      </span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 bg-cyan-500/20 text-[10px] text-cyan-300 rounded font-medium">
                          Ты
                        </span>
                      )}
                    </div>
                    {player.username && (
                      <span className="text-[10px] text-slate-500 truncate">
                        @{player.username}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 pl-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-sm font-bold font-mono text-cyan-400">
                    {player.score}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Кнопка «Назад» */}
      <button
        onClick={onBack}
        className="w-full mt-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-2xl border border-slate-800 active:scale-[0.98] transition-all"
      >
        Вернуться к результатам
      </button>
    </div>
  );
};

export default LeaderboardScreen;
