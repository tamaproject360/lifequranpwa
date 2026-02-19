import { Flame, Star, BookOpen, Target, ChevronRight, Award, Zap, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEVELS, DAILY_VERSES, SURAHS } from '../data/surahs';

function getLevelInfo(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

function getProgressPercent(xp: number) {
  const level = getLevelInfo(xp);
  const next = LEVELS.find(l => l.level === level.level + 1);
  if (!next) return 100;
  return Math.min(100, Math.round(((xp - level.minXp) / (next.minXp - level.minXp)) * 100));
}

function getDailyVerse() {
  return DAILY_VERSES[new Date().getDate() % DAILY_VERSES.length];
}

export default function HomePage() {
  const { profile, dailyChallenge, openReading, setActiveTab, darkMode, t } = useApp();
  const levelInfo = getLevelInfo(profile.xp);
  const progressPercent = getProgressPercent(profile.xp);
  const nextLevel = LEVELS.find(l => l.level === levelInfo.level + 1);
  const verse = getDailyVerse();
  const lastSurah = SURAHS.find(s => s.number === profile.last_surah_number);
  const quranProgressPercent = Math.min(100, Math.round((profile.total_pages_read / 604) * 100));

  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const h = t.home;

  return (
    <div className={`min-h-screen ${bg} pb-24`}>
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 40%, #34d399 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(20%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />
        <div className="relative px-5 pt-12 pb-8">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-emerald-100 text-sm font-medium">{h.greeting}</p>
              <h1 className="text-white text-2xl font-bold">{profile.username || h.guest}</h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
              {levelInfo.badge}
            </div>
          </div>
          <div className="mt-4 bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm">{h.level} {levelInfo.level}</span>
              <span className="text-emerald-100 text-sm">{profile.xp.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
            </div>
            {nextLevel && (
              <p className="text-emerald-100 text-xs mt-1">{nextLevel.minXp - profile.xp} {h.xpToNextLevel} {nextLevel.level}</p>
            )}
          </div>
        </div>
        <svg viewBox="0 0 375 40" className="w-full" style={{ marginBottom: -1 }}>
          <path d="M0,20 C100,40 275,0 375,20 L375,40 L0,40 Z" fill={darkMode ? '#030712' : '#f9fafb'} />
        </svg>
      </div>

      <div className="px-4 space-y-4 -mt-2">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Flame, val: profile.streak_count, label: h.streak, ibg: 'bg-orange-50', ic: 'text-orange-500' },
            { icon: BookOpen, val: profile.total_pages_read, label: h.pages, ibg: 'bg-emerald-50', ic: 'text-emerald-500' },
            { icon: Star, val: levelInfo.level, label: h.level, ibg: 'bg-yellow-50', ic: 'text-yellow-500' },
          ].map(({ icon: Icon, val, label, ibg, ic }) => (
            <div key={label} className={`${card} border rounded-2xl p-3 flex flex-col items-center shadow-sm`}>
              <div className={`w-9 h-9 rounded-xl ${ibg} flex items-center justify-center mb-1`}>
                <Icon size={18} className={ic} />
              </div>
              <span className={`text-xl font-bold ${text}`}>{val}</span>
              <span className={`text-xs ${muted}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Quran Progress */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Moon size={16} className="text-emerald-600" />
              </div>
              <span className={`font-semibold text-sm ${text}`}>{h.khatamProgress}</span>
            </div>
            <span className="text-emerald-600 font-bold text-sm">{quranProgressPercent}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${quranProgressPercent}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }} />
          </div>
          <p className={`text-xs ${muted} mt-2`}>{profile.total_pages_read} / 604 {h.pagesRead}</p>
        </div>

        {/* Daily Verse */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✨</span>
              <span className="text-emerald-700 font-semibold text-sm">{h.dailyVerse}</span>
            </div>
            <p className="text-right text-emerald-900 text-xl leading-loose mb-2"
              style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
              {verse.arabic}
            </p>
            <p className="text-emerald-800 text-sm leading-relaxed italic">&ldquo;{verse.translation}&rdquo;</p>
            <p className="text-emerald-600 text-xs mt-2 font-medium">— QS. {verse.surah}: {verse.ayah}</p>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target size={16} className="text-blue-500" />
              </div>
              <span className={`font-semibold text-sm ${text}`}>{h.dailyChallenge}</span>
            </div>
            {dailyChallenge?.completed && (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">{h.challengeDone}</span>
            )}
          </div>
          {dailyChallenge && (
            <>
              <p className={`text-sm ${muted} mb-3`}>
                {h.challengeDesc.replace('{pages}', String(dailyChallenge.target_pages))} <span className="text-yellow-500 font-semibold">+25 XP</span>
              </p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (dailyChallenge.pages_completed / dailyChallenge.target_pages) * 100)}%` }} />
              </div>
              <p className={`text-xs ${muted} mb-3`}>{dailyChallenge.pages_completed} / {dailyChallenge.target_pages} {h.challengePagesOf}</p>
              {!dailyChallenge.completed && (
                <button
                  onClick={() => openReading(profile.last_surah_number || 1, profile.last_ayah_number || 1)}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  {h.startReading}
                </button>
              )}
            </>
          )}
        </div>

        {/* Continue Reading */}
        {lastSurah && (
          <button
            onClick={() => openReading(profile.last_surah_number, profile.last_ayah_number)}
            className={`w-full ${card} border rounded-2xl p-4 shadow-sm flex items-center justify-between active:scale-95 transition-all duration-150`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className={`font-semibold text-sm ${text}`}>{h.continueReading}</p>
                <p className={`text-xs ${muted}`}>{lastSurah.englishName} — {h.ayatAyah} {profile.last_ayah_number}</p>
              </div>
            </div>
            <ChevronRight size={18} className={muted} />
          </button>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setActiveTab('quran')}
            className={`${card} border rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-95 transition-all`}>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <BookOpen size={18} className="text-green-600" />
            </div>
            <div className="text-left">
              <p className={`font-semibold text-sm ${text}`}>{h.surahList}</p>
              <p className={`text-xs ${muted}`}>114 {h.surahs}</p>
            </div>
          </button>
          <button onClick={() => setActiveTab('gamification')}
            className={`${card} border rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-95 transition-all`}>
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Award size={18} className="text-yellow-600" />
            </div>
            <div className="text-left">
              <p className={`font-semibold text-sm ${text}`}>{h.achievements}</p>
              <p className={`text-xs ${muted}`}>{h.badgeLevel}</p>
            </div>
          </button>
        </div>

        {/* XP Tips */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-yellow-500" />
            <span className={`font-semibold text-sm ${text}`}>{h.xpWays}</span>
          </div>
          <div className="space-y-2">
            {h.xpTips.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-xs ${muted}`}>{item.action}</span>
                <span className="text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-0.5 rounded-full">{item.xp}</span>
              </div>
            ))}
          </div>
        </div>

        <p className={`text-center text-xs ${muted} pb-2`}>{t.signature}</p>
      </div>
    </div>
  );
}
