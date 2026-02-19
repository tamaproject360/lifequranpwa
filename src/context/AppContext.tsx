import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, Bookmark, DailyChallenge, Achievement, TabName, AppView, UserSettings } from '../types';
import { LEVELS } from '../data/surahs';
import { translations, Language, TranslationKeys } from '../i18n/translations';

interface AppContextType {
  profile: UserProfile | null;
  bookmarks: Bookmark[];
  achievements: Achievement[];
  dailyChallenge: DailyChallenge | null;
  activeTab: TabName;
  appView: AppView;
  selectedSurahNumber: number;
  selectedAyahNumber: number;
  darkMode: boolean;
  language: Language;
  t: TranslationKeys;
  isLoading: boolean;
  setActiveTab: (tab: TabName) => void;
  setAppView: (view: AppView) => void;
  openReading: (surahNumber: number, ayahNumber?: number) => void;
  addXP: (amount: number) => void;
  toggleBookmark: (surahNumber: number, surahName: string, ayahNumber: number, ayahText: string) => void;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  completeDailyChallenge: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  recordReadingSession: (surahNumber: number, surahName: string, ayahStart: number, ayahEnd: number, pages: number, minutes: number) => void;
  checkAndUpdateStreak: () => void;
}

const defaultSettings: UserSettings = {
  darkMode: false,
  fontSize: 'medium',
  reminderEnabled: false,
  reminderTime: '07:00',
  dailyTargetPages: 1,
  showTranslation: true,
  showTransliteration: false,
  selectedQari: 'ar.alafasy',
  language: 'id',
};

const defaultProfile: UserProfile = {
  id: 'guest',
  username: 'Tamu',
  avatar_url: '',
  xp: 0,
  level: 1,
  streak_count: 0,
  streak_last_date: null,
  streak_freeze_available: true,
  total_pages_read: 0,
  total_time_minutes: 0,
  last_surah_number: 1,
  last_ayah_number: 1,
  settings: defaultSettings,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'lifequran_profile';
const BOOKMARKS_KEY = 'lifequran_bookmarks';
const ACHIEVEMENTS_KEY = 'lifequran_achievements';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

function getLevelFromXP(xp: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i].level;
  }
  return 1;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = loadFromStorage(STORAGE_KEY, defaultProfile);
    if (!stored.settings?.language) {
      stored.settings = { ...defaultSettings, ...stored.settings, language: 'id' };
    }
    return stored;
  });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() =>
    loadFromStorage(BOOKMARKS_KEY, [])
  );
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    loadFromStorage(ACHIEVEMENTS_KEY, [])
  );
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [appView, setAppView] = useState<AppView>('main');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(1);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState(1);
  const [isLoading] = useState(false);

  const darkMode = profile.settings?.darkMode ?? false;
  const language: Language = profile.settings?.language ?? 'id';
  const t = translations[language];

  useEffect(() => {
    saveToStorage(STORAGE_KEY, profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage(BOOKMARKS_KEY, bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    saveToStorage(ACHIEVEMENTS_KEY, achievements);
  }, [achievements]);

  useEffect(() => {
    const today = getTodayString();
    const storedChallenge = loadFromStorage<DailyChallenge | null>('lifequran_challenge_' + today, null);
    if (storedChallenge) {
      setDailyChallenge(storedChallenge);
    } else {
      const newChallenge: DailyChallenge = {
        id: crypto.randomUUID(),
        user_id: 'guest',
        challenge_date: today,
        target_pages: profile.settings?.dailyTargetPages ?? 1,
        pages_completed: 0,
        completed: false,
        xp_earned: 0,
        created_at: new Date().toISOString(),
      };
      setDailyChallenge(newChallenge);
      saveToStorage('lifequran_challenge_' + today, newChallenge);
    }
  }, [profile.settings?.dailyTargetPages]);

  const checkAndUpdateStreak = useCallback(() => {
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    setProfile(prev => {
      if (prev.streak_last_date === today) return prev;

      let newStreak = prev.streak_count;
      if (prev.streak_last_date === yesterdayStr) {
        newStreak = prev.streak_count + 1;
      } else if (prev.streak_last_date !== today) {
        newStreak = 1;
      }

      return {
        ...prev,
        streak_count: newStreak,
        streak_last_date: today,
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setProfile(prev => {
      const newXP = prev.xp + amount;
      const newLevel = getLevelFromXP(newXP);
      return { ...prev, xp: newXP, level: newLevel, updated_at: new Date().toISOString() };
    });
  }, []);

  const openReading = useCallback((surahNumber: number, ayahNumber = 1) => {
    setSelectedSurahNumber(surahNumber);
    setSelectedAyahNumber(ayahNumber);
    setAppView('reading');
  }, []);

  const toggleBookmark = useCallback((surahNumber: number, surahName: string, ayahNumber: number, ayahText: string) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.surah_number === surahNumber && b.ayah_number === ayahNumber);
      if (exists) {
        return prev.filter(b => !(b.surah_number === surahNumber && b.ayah_number === ayahNumber));
      }
      const newBookmark: Bookmark = {
        id: crypto.randomUUID(),
        user_id: 'guest',
        surah_number: surahNumber,
        surah_name: surahName,
        ayah_number: ayahNumber,
        ayah_text_preview: ayahText.slice(0, 100),
        created_at: new Date().toISOString(),
      };
      return [...prev, newBookmark];
    });
  }, []);

  const isBookmarked = useCallback((surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(b => b.surah_number === surahNumber && b.ayah_number === ayahNumber);
  }, [bookmarks]);

  const completeDailyChallenge = useCallback(() => {
    if (!dailyChallenge || dailyChallenge.completed) return;
    const updated = { ...dailyChallenge, completed: true, xp_earned: 25 };
    setDailyChallenge(updated);
    saveToStorage('lifequran_challenge_' + dailyChallenge.challenge_date, updated);
    addXP(25);
  }, [dailyChallenge, addXP]);

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    setProfile(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
      updated_at: new Date().toISOString(),
    }));
  }, []);

  const recordReadingSession = useCallback((
    surahNumber: number,
    surahName: string,
    ayahStart: number,
    ayahEnd: number,
    pages: number,
    minutes: number
  ) => {
    checkAndUpdateStreak();
    addXP(pages * 10);

    setProfile(prev => ({
      ...prev,
      last_surah_number: surahNumber,
      last_ayah_number: ayahEnd,
      total_pages_read: prev.total_pages_read + pages,
      total_time_minutes: prev.total_time_minutes + minutes,
      updated_at: new Date().toISOString(),
    }));

    const today = getTodayString();
    const sessions = loadFromStorage<object[]>('lifequran_sessions', []);
    sessions.push({ surahNumber, surahName, ayahStart, ayahEnd, pages, minutes, date: today, created_at: new Date().toISOString() });
    saveToStorage('lifequran_sessions', sessions);

    if (dailyChallenge && !dailyChallenge.completed) {
      const updatedPages = dailyChallenge.pages_completed + pages;
      const isCompleted = updatedPages >= dailyChallenge.target_pages;
      const updated = { ...dailyChallenge, pages_completed: updatedPages, completed: isCompleted, xp_earned: isCompleted ? 25 : 0 };
      setDailyChallenge(updated);
      saveToStorage('lifequran_challenge_' + today, updated);
      if (isCompleted) addXP(25);
    }
  }, [checkAndUpdateStreak, addXP, dailyChallenge]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <AppContext.Provider value={{
      profile,
      bookmarks,
      achievements,
      dailyChallenge,
      activeTab,
      appView,
      selectedSurahNumber,
      selectedAyahNumber,
      darkMode,
      language,
      t,
      isLoading,
      setActiveTab,
      setAppView,
      openReading,
      addXP,
      toggleBookmark,
      isBookmarked,
      completeDailyChallenge,
      updateSettings,
      recordReadingSession,
      checkAndUpdateStreak,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
