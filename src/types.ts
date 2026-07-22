export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Milestone {
  title: string;
  description: string;
  tasks: Task[];
  estimatedHours: number;
}

export interface StudyPlan {
  planTitle: string;
  summary: string;
  milestones: Milestone[];
  customTips: string[];
}

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  quizTitle: string;
  questions: QuizQuestion[];
}

export type PetType = 'bunny' | 'panda' | 'cat' | 'penguin';

export interface PetStatus {
  type: PetType;
  name: string;
  level: number;
  xp: number;
  coins: number;
  hunger: number; // 0 to 100
  equippedAccessories: string[]; // shop item IDs
  equippedBackground: string | null; // theme ID
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'food' | 'accessory' | 'background';
  price: number;
  emoji: string;
  description: string;
  categoryName?: string;
}

export interface StudyLog {
  id: string;
  timestamp: string; // ISO string
  durationMinutes: number;
  subjects: string;
  coinsEarned: number;
  xpEarned: number;
}
