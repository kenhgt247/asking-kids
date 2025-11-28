
// Application View States (Legacy support)
export enum AppView {
  HOME = 'HOME',
  GAMES = 'GAMES',
  WORKSHEETS = 'WORKSHEETS',
  BLOG = 'BLOG',
  QNA = 'QNA',
  PROFILE = 'PROFILE',
  STATIC_PAGE = 'STATIC_PAGE',
  SEARCH = 'SEARCH'
}

// User & Auth
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rank: string;
  points: number;
  badges: string[];
  role: 'USER' | 'ADMIN' | 'GUEST';
}

export interface Notification {
  id: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
}

// Gamification Logic
export const RANK_SYSTEM = [
  { name: 'Thành viên mới', minPoints: 0, icon: '🌱' },
  { name: 'Thành viên tích cực', minPoints: 100, icon: '🔥' },
  { name: 'Người hiểu biết', minPoints: 300, icon: '📚' },
  { name: 'Chuyên gia', minPoints: 1000, icon: '👑' } 
];

export const calculateRank = (points: number): string => {
  const sortedRanks = [...RANK_SYSTEM].sort((a, b) => b.minPoints - a.minPoints);
  const rank = sortedRanks.find(r => points >= r.minPoints);
  return rank ? rank.name : 'Thành viên mới';
};

// Game specific types
export enum GameType {
  NONE = 'NONE',
  COLOR = 'COLOR',
  MATH = 'MATH',
  SPEAKING = 'SPEAKING',
}

export interface BlogComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: BlogComment[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author?: string;
  authorAvatar?: string;
  date?: string;
  likes: number;
  comments: BlogComment[];
}

export interface WorksheetReview {
  id: string;
  author: string;
  avatar: string;
  rating: number; 
  content: string;
  timestamp: string;
}

export interface Worksheet {
  id: string;
  title: string;
  subject: string;
  age: string;
  imageUrl: string;
  reviews?: WorksheetReview[];
}

// Q&A Types
export enum QnACategory {
  EDUCATION = 'Giáo dục',
  ABROAD = 'Du học',
  TECH = 'Công nghệ',
  PARENTS = 'Cha mẹ',
  KIDS = 'Trẻ em',
}

export interface Answer {
  id: string;
  author: string;
  avatar: string;
  content: string;
  isAI: boolean; 
  likes: number;
  timestamp: string;
  isAccepted?: boolean;
  replies: Answer[];
}

export interface Question {
  id: string;
  title: string;
  content: string;
  category: QnACategory;
  author: string;
  avatar: string;
  answers: Answer[];
  likes: number;
  views: number;
  timestamp: string;
  tags: string[];
}

// Web Speech API Type Definitions
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

export interface SpeechRecognitionErrorEvent {
  error: string;
}
