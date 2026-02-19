import { Trophy, Star, Flame, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEVELS, BADGES } from '../data/surahs';

function getLevelInfo(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

const LEADERBOARD_MOCK = [
  { rank: 1, name: 'Ahmad F.', xp: 12500, streak: 45, badge: '💎' },
  { rank: 2, name: 'Siti R.', xp: 9800, streak: 38, badge: '🌙' },
  { rank: 3, name: 'Budi S.', xp: 7200, streak: 25, badge: '🌙' },
  { rank: 4, name: 'Dewi K.', xp: 5600, streak: 19, badge: '⭐' },
  { rank: 5, name: 'Rizki M.', xp: 3400, streak: 14, badge: '⭐' },
];

export default function GamificationPage() {
  const { profile, achievements, darkMode, t } = useApp();
  const levelInfo = getLevelInfo(profile.xp);
  const nextLevel = LEVELS.find(l => l.level === levelInfo.level + 1);
  const progressPercent = nextLevel
    ? Math.min(100, Math.round(((profile.xp - levelInfo.minXp) / (nextLevel.minXp - levelInfo.minXp)) * 100))
    : 100;
  const unlockedBadgeIds = achievements.map(a => a.badge_id);
  const g = t.gamification;

  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${bg} pb-24`}>
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }} className="px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">{g.title}</h1>
        <p className="text-emerald-100 text-sm">{g.subtitle}</p>
        <svg viewBox="0 0 375 24" className="w-full mt-4" style={{ marginBottom: -1 }}>
          <path d="M0,12 C100,24 275,0 375,12 L375,24 L0,24 Z" fill={darkMode ? '#030712' : '#f9fafb'} />
        </svg>
      </div>

      <div className="px-4 space-y-4 -mt-1">
        {/* Level Card */}
        <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-emerald-100 text-sm">{g.currentLevel}</p>
                <p className="text-white text-3xl font-bold">{levelInfo.level}</p>
                <p className="text-emerald-100 text-lg font-semibold">{levelInfo.name}</p>
              </div>
              <div className="text-6xl">{levelInfo.badge}</div>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-emerald-100 text-xs">
              <span>{profile.xp.toLocaleString()} {g.xpRange}</span>
              {nextLevel && <span>{g.xpTarget} {nextLevel.minXp.toLocaleString()} {g.xpRange}</span>}
            </div>
          </div>
        </div>

        {/* All Levels */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <h3 className={`font-semibold text-sm ${text} mb-3`}>{g.allLevels}</h3>
          <div className="space-y-2">
            {LEVELS.map(level => {
              const isCurrentLevel = level.level === levelInfo.level;
              const isUnlocked = profile.xp >= level.minXp;
              return (
                <div
                  key={level.level}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCurrentLevel ? 'bg-emerald-50 border border-emerald-200' : darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{level.badge}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${isCurrentLevel ? 'text-emerald-700' : text}`}>
                        Level {level.level} — {level.name}
                      </span>
                      {isCurrentLevel && (
                        <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{g.youAreHere}</span>
                      )}
                    </div>
                    <p className={`text-xs ${muted}`}>{level.minXp.toLocaleString()} — {level.maxXp === 999999 ? '∞' : level.maxXp.toLocaleString()} {g.xpRange}</p>
                  </div>
                  {isUnlocked ? <Star size={16} className="text-yellow-400" /> : <Lock size={14} className={muted} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Flame, label: g.bestStreak, value: `${profile.streak_count} ${g.days}`, color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Star, label: g.totalXP, value: profile.xp.toLocaleString(), color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { icon: Trophy, label: g.badges, value: `${unlockedBadgeIds.length}/${BADGES.length}`, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map(({ icon: Icon, label, value, color, bg: ibg }) => (
            <div key={label} className={`${card} border rounded-2xl p-3 text-center shadow-sm`}>
              <div className={`w-9 h-9 rounded-xl ${ibg} flex items-center justify-center mx-auto mb-1`}>
                <Icon size={16} className={color} />
              </div>
              <p className={`font-bold text-sm ${text}`}>{value}</p>
              <p className={`text-xs ${muted}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Badge Gallery */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <h3 className={`font-semibold text-sm ${text} mb-3`}>{g.badgeGallery}</h3>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map(badge => {
              const isUnlocked = unlockedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-3 rounded-xl text-center ${
                    isUnlocked ? 'bg-emerald-50 border border-emerald-200' : darkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-3xl mb-1.5 ${!isUnlocked ? 'grayscale opacity-40' : ''}`}>{badge.icon}</div>
                  <p className={`text-xs font-semibold leading-tight ${isUnlocked ? 'text-emerald-700' : muted}`}>{badge.name}</p>
                  <p className={`text-xs ${muted} mt-0.5 leading-tight`}>{badge.requirement}</p>
                  {isUnlocked && (
                    <span className="mt-1 bg-emerald-100 text-emerald-600 text-xs px-1.5 py-0.5 rounded-full">+{badge.xpReward} XP</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold text-sm ${text}`}>{g.weeklyLeaderboard}</h3>
            <span className={`text-xs ${muted} bg-gray-100 px-2 py-1 rounded-full`}>{g.demo}</span>
          </div>
          <div className="space-y-2">
            {LEADERBOARD_MOCK.map(user => (
              <div key={user.rank}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  user.rank === 1 ? 'bg-yellow-50' : user.rank === 2 ? 'bg-gray-100' : user.rank === 3 ? 'bg-amber-50' : darkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  user.rank === 1 ? 'bg-yellow-400 text-white' : user.rank === 2 ? 'bg-gray-400 text-white' : user.rank === 3 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>{user.rank}</div>
                <span className="text-xl">{user.badge}</span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${text}`}>{user.name}</p>
                  <p className={`text-xs ${muted}`}>{user.streak} {g.streakDays}</p>
                </div>
                <span className="text-yellow-600 font-bold text-sm">{user.xp.toLocaleString()} XP</span>
              </div>
            ))}
            <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-emerald-200 bg-emerald-50">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">?</div>
              <span className="text-xl">{getLevelInfo(profile.xp).badge}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-emerald-700">{profile.username || g.you}</p>
                <p className="text-xs text-emerald-600">{profile.streak_count} {g.streakDays}</p>
              </div>
              <span className="text-emerald-600 font-bold text-sm">{profile.xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
