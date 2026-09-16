export interface Option {
  id: string;
  text: string;
}

export interface QuestionItem {
  id: string;
  category: string;
  question: string;
  options: Option[];
  correct_option_id: string;
  explanation: string;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  timeSpentSec: number;
  pointsAwarded: number;
}

// Обязательный реальный экспорт для сборщика Vite и браузера
export const TYPES_READY = true;