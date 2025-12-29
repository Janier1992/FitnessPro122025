
import React from 'react';

export interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

export interface NavItem {
    name: string;
    icon: React.ReactNode;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number;
  description: string;
  imageSearchQuery: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  warmUp: string;
  exercises: Exercise[];
  coolDown: string;
}

export interface WorkoutPlan {
  weeklyPlan: DailyWorkout[];
}

export interface UserProfile {
  goal: 'build_muscle' | 'lose_fat' | 'improve_endurance' | 'general_fitness';
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  equipment: string[];
  notes?: string;
  restPreference?: string;
  exercisesToAvoid?: string;
}

export type ExerciseDifficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface LibraryExercise {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string; // Added video support
  difficulty: ExerciseDifficulty;
  tags: string[];
  duration: number;
  caloriesPerMin: number;
  isFavorite?: boolean;
  isPremium?: boolean;
  category: string;
  equipment: string;
  instructions: string[];
}

export interface ClassSchedule {
    day: string;
    time: string;
}

export interface GroupClass {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string; // Added video support
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  coach: string;
  capacity: number;
  duration: number;
  schedule: ClassSchedule[];
  price?: number;
  locationType: 'Gimnasio' | 'A Domicilio';
  clientAddress?: string;
  bookedBy?: string; // For personal training
  status?: 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled';
}

export interface WeeklyVolumeData {
    week: string;
    volume: number;
}

export interface PersonalRecord {
    exercise: string;
    weight: number;
    date: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    dateUnlocked?: string;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
    sources?: { uri: string; title: string }[];
}

export interface Client {
    id: number;
    name: string;
    email: string;
    goal: string;
    lastActivity: string;
    progress: number;
    notes: string[];
}

export interface CoachService {
    id: number;
    serviceName: string;
    description: string;
    imageUrl: string;
    videoUrl?: string; // Added video support for services
    coach: string;
    duration: number;
    price: number;
    locationType: 'Gimnasio' | 'A Domicilio' | 'Virtual';
    availability: { day: string; hours: string[] }[];
}

export type Theme = 'light' | 'dark';

// Daily Bio-Feedback
export interface DailyCheckin {
    date: string;
    energyLevel: number; 
    sleepQuality: 'poor' | 'average' | 'good' | 'excellent';
    soreness: 'none' | 'low' | 'medium' | 'high';
    mood: 'stressed' | 'neutral' | 'motivated' | 'tired';
}

// AI Insight Structure
export interface AIInsight {
    type: 'recovery' | 'performance' | 'caution' | 'motivation';
    title: string;
    message: string;
    actionLabel: string;
    suggestedActivity?: string;
}

// --- GAMIFICATION TYPES ---

export interface LevelData {
    currentLevel: number;
    currentXP: number;
    nextLevelXP: number;
    title: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string; 
    rewardXP: number;
    deadline: string;
    participants: number; 
}

export interface LeaderboardEntry {
    rank: number;
    userName: string;
    xp: number;
    avatar?: string;
    trend: 'up' | 'down' | 'same';
}

export interface SocialActivity {
    id: string;
    user: string;
    action: string; 
    timeAgo: string;
    type: 'workout' | 'level_up' | 'achievement';
    likes: number;
}

// Comparison Data Type
export interface WeeklyComparisonItem {
    label: string;
    current: number;
    previous: number;
    unit: string;
}

export interface User {
  name: string;
  email: string;
  password?: string;
  accountType: 'user' | 'gym' | 'entrenador';
  plan: 'básico' | 'premium';
  subscriptionStatus: 'trial' | 'subscribed' | 'expired';
  isGymMember: boolean;
  trialEndDate: Date | null;
  notifications: Notification[];
  hasCompletedOnboarding?: boolean;
  profile?: UserProfile;
  profession?: string;
  professionalDescription?: string;
  phone?: string;
  address?: string;
  cc?: string;
  availability?: { day: string; hours: string[] }[];
  dailyCheckins?: DailyCheckin[];
  
  // Gamification Props
  gamification?: {
      xp: number;
      level: number;
      title: string;
      achievements: Achievement[];
  };
}
