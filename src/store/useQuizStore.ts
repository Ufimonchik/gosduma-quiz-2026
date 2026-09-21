import { create } from 'zustand';
import type { QuestionItem, UserAnswerRecord } from '../types/quiz';

interface QuizState {
  questions: QuestionItem[];
  currentIndex: number;
  isCompleted: boolean;

  score: number;
  streak: number;
  maxStreak: number;
  multiplier: number;

  timeLeft: number;
  totalTime: number;
  timerActive: boolean;

  selectedOptionId: string | null;
  isCurrentAnswered: boolean;

  answersHistory: UserAnswerRecord[];

  initQuiz: (questionsList: QuestionItem[]) => void;
  startTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
  answerQuestion: (optionId: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

const QUESTION_TIMEOUT_SEC = 15;
const BASE_POINTS = 100;
const SPEED_BONUS_PER_SEC = 10;

const calculateMultiplier = (currentStreak: number): number => {
  if (currentStreak >= 5) return 2.0;
  if (currentStreak >= 3) return 1.5;
  if (currentStreak >= 2) return 1.25;
  return 1.0;
};

// Алгоритм Фишера-Йетса для непредсказуемой тасовки вариантов
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

let timerInterval: ReturnType<typeof setInterval> | null = null;

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  isCompleted: false,

  score: 0,
  streak: 0,
  maxStreak: 0,
  multiplier: 1.0,

  timeLeft: QUESTION_TIMEOUT_SEC,
  totalTime: QUESTION_TIMEOUT_SEC,
  timerActive: false,

  selectedOptionId: null,
  isCurrentAnswered: false,
  answersHistory: [],

  initQuiz: (questionsList) => {
    if (timerInterval) clearInterval(timerInterval);

    // Перемешиваем варианты ответов внутри каждого вопроса перед стартом
    const randomizedQuestions = questionsList.map((q) => ({
      ...q,
      options: shuffleArray(q.options || []),
    }));

    set({
      questions: randomizedQuestions,
      currentIndex: 0,
      isCompleted: false,
      score: 0,
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      timeLeft: QUESTION_TIMEOUT_SEC,
      totalTime: QUESTION_TIMEOUT_SEC,
      timerActive: false,
      selectedOptionId: null,
      isCurrentAnswered: false,
      answersHistory: [],
    });

    get().startTimer();
  },

  startTimer: () => {
    if (timerInterval) clearInterval(timerInterval);
    set({ timerActive: true });

    timerInterval = setInterval(() => {
      get().tickTimer();
    }, 1000);
  },

  stopTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({ timerActive: false });
  },

  tickTimer: () => {
    const { timeLeft, isCurrentAnswered, answerQuestion } = get();
    if (isCurrentAnswered) return;

    if (timeLeft <= 1) {
      get().stopTimer();
      set({ timeLeft: 0 });
      answerQuestion('TIMEOUT_EXPIRED');
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  answerQuestion: (optionId: string) => {
    const {
      questions,
      currentIndex,
      isCurrentAnswered,
      timeLeft,
      totalTime,
      streak,
      maxStreak,
      score,
      answersHistory,
    } = get();

    if (isCurrentAnswered) return;
    get().stopTimer();

    const currentQuestion = questions[currentIndex];
    const isTimeout = optionId === 'TIMEOUT_EXPIRED';
    const isCorrect = !isTimeout && optionId === currentQuestion.correct_option_id;

    let pointsAwarded = 0;
    let nextStreak = 0;
    let nextMultiplier = 1.0;

    if (isCorrect) {
      nextStreak = streak + 1;
      nextMultiplier = calculateMultiplier(nextStreak);
      const speedBonus = timeLeft * SPEED_BONUS_PER_SEC;
      pointsAwarded = Math.round((BASE_POINTS + speedBonus) * nextMultiplier);
    } else {
      nextStreak = 0;
      nextMultiplier = 1.0;
    }

    const answerRecord: UserAnswerRecord = {
      questionId: currentQuestion.id,
      selectedOptionId: isTimeout ? null : optionId,
      isCorrect,
      timeSpentSec: totalTime - timeLeft,
      pointsAwarded,
    };

    set({
      selectedOptionId: isTimeout ? null : optionId,
      isCurrentAnswered: true,
      score: score + pointsAwarded,
      streak: nextStreak,
      maxStreak: Math.max(maxStreak, nextStreak),
      multiplier: nextMultiplier,
      answersHistory: [...answersHistory, answerRecord],
    });
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();

    if (currentIndex + 1 < questions.length) {
      set({
        currentIndex: currentIndex + 1,
        selectedOptionId: null,
        isCurrentAnswered: false,
        timeLeft: QUESTION_TIMEOUT_SEC,
      });
      get().startTimer();
    } else {
      get().stopTimer();
      set({ isCompleted: true });
    }
  },

  resetQuiz: () => {
    if (timerInterval) clearInterval(timerInterval);
    set({
      questions: [],
      currentIndex: 0,
      isCompleted: false,
      score: 0,
      streak: 0,
      maxStreak: 0,
      multiplier: 1.0,
      timeLeft: QUESTION_TIMEOUT_SEC,
      timerActive: false,
      selectedOptionId: null,
      isCurrentAnswered: false,
      answersHistory: [],
    });
  },
}));
