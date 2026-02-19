export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  xp: number;
  level: number;
  streak_count: number;
  streak_last_date: string | null;
  streak_freeze_available: boolean;
  total_pages_read: number;
  total_time_minutes: number;
  last_surah_number: number;
  last_ayah_number: number;
  settings: UserSettings;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  reminderEnabled: boolean;
  reminderTime: string;
  dailyTargetPages: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  selectedQari: string;
  language: 'id' | 'en';
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  juz: number[];
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export interface Bookmark {
  id: string;
  user_id: string;
  surah_number: number;
  surah_name: string;
  ayah_number: number;
  ayah_text_preview: string;
  created_at: string;
}

export interface ReadingSession {
  id: string;
  user_id: string;
  surah_number: number;
  surah_name: string;
  ayah_start: number;
  ayah_end: number;
  pages_read: number;
  time_spent_minutes: number;
  date: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  unlocked_at: string;
}

export interface DailyChallenge {
  id: string;
  user_id: string;
  challenge_date: string;
  target_pages: number;
  pages_completed: number;
  completed: boolean;
  xp_earned: number;
  created_at: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
  category: 'streak' | 'reading' | 'completion' | 'special';
}

export interface LevelDefinition {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  badge: string;
}

export type TabName = 'home' | 'quran' | 'progress' | 'gamification' | 'profile';
export type AppView = 'main' | 'reading' | 'surah-list' | 'juz-list' | 'bookmarks' | 'search';
