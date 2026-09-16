import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Users, Globe, Zap } from 'lucide-react';
import { useQuizSounds } from '../hooks/useQuizSounds';

export interface LeaderboardPlayer {
  rank: number;
  userId: number;
  name: string;
  score: number;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'school'>('global');
  const { playClick } = useQuizSounds();

  const mockPlayers: LeaderboardPlayer[] = [
    { rank: 1, userId: 101, name: 'Александр_ГД', score: 2840 },
    { rank: 2, userId: 102, name: 'София Юрист', score: 2610 },
    { rank: 3, userId: 103, name: 'Даня_Избирком', score: 2450 },
    { rank: 4, userId: 104, name: 'Полина С.', score: 2190 },
    { rank: 5, userId: 105, name: 'Макс_11Б', score: 1980 },
    { rank: 6, userId: 106, name: 'Екатерина В.', score: 1820 },
    { rank: 7, userId: 107, name: 'Артем_Политолог', score: 1710 },
    { rank: 8, userId: 108, name: 'Лера_Право', score: 1590 },
  ];

  const top3 = mockPlayers.slice(0, 3);
  const listPlayers = mockPlayers.slice(3);

  const handleTabSwitch = (tab: 'global' | 'school') => {
    playClick();
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto min-h-screen bg-slate-950 text-white select-none relative pb-28">
      <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Рейтинг знатоков
        </h1>
        <div className="w-9" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex p-1 mb-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => handleTabSwitch('global')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'global'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Общий зачет
          </button>
          <button
            onClick={() => handleTabSwitch('school')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'school'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Моя школа / Класс
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 items-end pt-6 pb-6 px-1">
          {/* 2 место */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-2">
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center font-bold text-slate-200 text-sm shadow-lg">
                {top3[1].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-400 text-slate-950 font-black text-[11px] flex items-center justify-center border-2 border-slate-950">
                2
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-200 truncate w-full text-center mb-0.5">
              {top3[1].name}
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              {top3[1].score}
            </span>
            <div className="w-full h-16 mt-2 bg-gradient-to-t from-slate-800/80 to-slate-800/20 rounded-t-xl border-t border-slate-400/40" />
          </motion.div>

          {/* 1 место */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col items-center -mt-4"
          >
            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center font-black text-amber-200 text-base shadow-[0_0_20px_rgba(251,191,36,0.25)]">
                {top3[0].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-400">👑</span>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-950">
                1
              </span>
            </div>
            <span className="text-xs font-bold text-amber-200 truncate w-full text-center mb-0.5">
              {top3[0].name}
            </span>
            <span className="text-xs font-mono text-amber-400 font-black">
              {top3[0].score}
            </span>
            <div className="w-full h-24 mt-2 bg-gradient-to-t from-amber-500/20 to-amber-500/5 rounded-t-xl border-t-2 border-amber-400" />
          </motion.div>

          {/* 3 место */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-2">
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-700 flex items-center justify-center font-bold text-amber-600 text-sm shadow-lg">
                {top3[2].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-amber-100 font-black text-[11px] flex items-center justify-center border-2 border-slate-950">
                3
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-200 truncate w-full text-center mb-0.5">
              {top3[2].name}
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              {top3[2].score}
            </span>
            <div className="w-full h-12 mt-2 bg-gradient-to-t from-slate-800/80 to-slate-800/20 rounded-t-xl border-t border-amber-700/60" />
          </motion.div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <AnimatePresence>
            {listPlayers.map((player, idx) => (
              <motion.div
                key={player.userId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono text-xs font-bold text-slate-500">
                    #{player.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {player.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[150px]">
                    {player.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs font-bold text-cyan-400">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  {player.score}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Фиксированная плашка текущего игрока */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-slate-950/90 backdrop-blur-lg border-t border-indigo-500/30 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-950/90 to-slate-900 border border-indigo-500/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center px-2 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-xs font-mono font-bold text-indigo-300">
              #14
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Вы</span>
                <span className="px-1.5 py-0.5 bg-indigo-500 text-[10px] rounded text-white font-medium">Ты</span>
              </div>
              <div className="text-[10px] text-slate-400">Твой личный рекорд</div>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-sm font-black text-cyan-400">
            <Zap className="w-4 h-4 text-cyan-400" />
            1250
          </div>
        </div>
      </div>
    </div>
  );
};