export type Screen = 'chat' | 'study' | 'support' | 'admin';

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}
