import { useState } from 'react';
import { Moon, Sun, Bell, BellOff, Target, Type, User, ChevronRight, Shield, Info, Trash2, Share2, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEVELS } from '../data/surahs';
import { Language } from '../i18n/translations';

function getLevelInfo(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export default function ProfilePage() {
  const { profile, updateSettings, darkMode, t, language } = useApp();
  const [username, setUsername] = useState(profile.username || '');
  const [editingName, setEditingName] = useState(false);
  const levelInfo = getLevelInfo(profile.xp);

  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200';
  const divider = darkMode ? 'divide-gray-800' : 'divide-gray-50';
  const borderB = darkMode ? 'border-gray-800' : 'border-gray-50';

  const settings = profile.settings;
  const p = t.profile;

  return (
    <div className={`min-h-screen ${bg} pb-24`}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }} className="px-5 pt-12 pb-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white/30 backdrop-blur-sm flex items-center justify-center mb-3 text-4xl shadow-lg">
            {levelInfo.badge}
          </div>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="bg-white/20 text-white placeholder-emerald-200 px-3 py-1.5 rounded-xl text-center text-lg font-bold outline-none border border-white/30"
                autoFocus
              />
              <button
                onClick={() => {
                  setEditingName(false);
                  const stored = JSON.parse(localStorage.getItem('lifequran_profile') || '{}');
                  localStorage.setItem('lifequran_profile', JSON.stringify({ ...stored, username }));
                  window.location.reload();
                }}
                className="bg-white text-emerald-600 px-3 py-1.5 rounded-xl text-sm font-semibold"
              >
                {language === 'en' ? 'Save' : 'Simpan'}
              </button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="flex items-center gap-2">
              <h2 className="text-white text-xl font-bold">{profile.username || (language === 'en' ? 'Guest' : 'Tamu')}</h2>
              <User size={14} className="text-emerald-200" />
            </button>
          )}
          <div className="mt-2">
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              {levelInfo.badge} Level {levelInfo.level}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <div className="text-center">
              <p className="text-white font-bold">{profile.xp.toLocaleString()}</p>
              <p className="text-emerald-200 text-xs">XP</p>
            </div>
            <div className="w-px h-8 bg-white/30" />
            <div className="text-center">
              <p className="text-white font-bold">{profile.streak_count}</p>
              <p className="text-emerald-200 text-xs">{t.home.streak}</p>
            </div>
            <div className="w-px h-8 bg-white/30" />
            <div className="text-center">
              <p className="text-white font-bold">{profile.total_pages_read}</p>
              <p className="text-emerald-200 text-xs">{t.home.pages}</p>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 375 24" className="w-full mt-4" style={{ marginBottom: -1 }}>
          <path d="M0,12 C100,24 275,0 375,12 L375,24 L0,24 Z" fill={darkMode ? '#030712' : '#f9fafb'} />
        </svg>
      </div>

      <div className="px-4 space-y-4 -mt-1">
        {/* Appearance */}
        <div className={`${card} border rounded-2xl overflow-hidden shadow-sm`}>
          <div className={`px-4 py-3 border-b ${borderB}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>{p.appearance}</p>
          </div>
          <div className={`divide-y ${divider}`}>
            {/* Dark Mode */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  {darkMode ? <Moon size={16} className="text-blue-500" /> : <Sun size={16} className="text-yellow-500" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>{p.darkMode}</p>
                  <p className={`text-xs ${muted}`}>{settings?.darkMode ? p.darkModeOn : p.darkModeOff}</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ darkMode: !darkMode })}
                className={`w-12 h-6 rounded-full transition-all duration-200 ${settings?.darkMode ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${settings?.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Type size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>{p.fontSize}</p>
                  <p className={`text-xs ${muted} capitalize`}>{settings?.fontSize || 'medium'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      settings?.fontSize === size ? 'bg-emerald-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`
                    }`}
                  >
                    {size === 'small' ? 'S' : size === 'medium' ? 'M' : size === 'large' ? 'L' : 'XL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Globe size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>{p.language}</p>
                  <p className={`text-xs ${muted}`}>{p.languageValue}</p>
                </div>
              </div>
              <div className={`flex p-1 rounded-xl gap-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {([
                  { code: 'id' as Language, label: 'ID', flag: '🇮🇩' },
                  { code: 'en' as Language, label: 'EN', flag: '🇬🇧' },
                ]).map(({ code, label, flag }) => (
                  <button
                    key={code}
                    onClick={() => updateSettings({ language: code })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      language === code
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <span>{flag}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Target & Reminder */}
        <div className={`${card} border rounded-2xl overflow-hidden shadow-sm`}>
          <div className={`px-4 py-3 border-b ${borderB}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>{p.targetReminder}</p>
          </div>
          <div className={`divide-y ${divider}`}>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Target size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>{p.dailyTarget}</p>
                  <p className={`text-xs ${muted}`}>{settings?.dailyTargetPages || 1} {p.dailyTargetDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSettings({ dailyTargetPages: Math.max(1, (settings?.dailyTargetPages || 1) - 1) })}
                  className={`w-7 h-7 rounded-lg font-bold text-lg flex items-center justify-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                >−</button>
                <span className={`w-8 text-center font-bold text-sm ${text}`}>{settings?.dailyTargetPages || 1}</span>
                <button
                  onClick={() => updateSettings({ dailyTargetPages: Math.min(20, (settings?.dailyTargetPages || 1) + 1) })}
                  className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-lg flex items-center justify-center"
                >+</button>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                  {settings?.reminderEnabled ? <Bell size={16} className="text-yellow-500" /> : <BellOff size={16} className="text-gray-400" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${text}`}>{p.reminder}</p>
                  <p className={`text-xs ${muted}`}>{settings?.reminderEnabled ? settings.reminderTime : p.reminderOff}</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ reminderEnabled: !settings?.reminderEnabled })}
                className={`w-12 h-6 rounded-full transition-all duration-200 ${settings?.reminderEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${settings?.reminderEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {settings?.reminderEnabled && (
              <div className="px-4 py-3">
                <label className={`text-xs ${muted} mb-1 block`}>{p.reminderTime}</label>
                <input
                  type="time"
                  value={settings.reminderTime || '07:00'}
                  onChange={e => updateSettings({ reminderTime: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border text-sm outline-none focus:border-emerald-400 transition-colors ${inputBg}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Others */}
        <div className={`${card} border rounded-2xl overflow-hidden shadow-sm`}>
          <div className={`px-4 py-3 border-b ${borderB}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>{p.others}</p>
          </div>
          <div className={`divide-y ${divider}`}>
            {[
              { icon: Share2, label: p.shareApp, color: 'text-blue-500', bg: 'bg-blue-50', action: () => {
                if (navigator.share) navigator.share({ title: 'LifeQuran', text: language === 'en' ? 'Quran app with gamification!' : 'Al-Quran digital dengan gamifikasi!', url: window.location.href });
              }},
              { icon: Shield, label: p.privacyPolicy, color: 'text-gray-500', bg: 'bg-gray-100', action: () => {} },
              { icon: Info, label: p.about, color: 'text-emerald-500', bg: 'bg-emerald-50', action: () => {} },
            ].map(({ icon: Icon, label, color, bg: ibg, action }) => (
              <button key={label} onClick={action} className="w-full flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${ibg} flex items-center justify-center`}>
                    <Icon size={16} className={color} />
                  </div>
                  <p className={`text-sm font-medium ${text}`}>{label}</p>
                </div>
                <ChevronRight size={16} className={muted} />
              </button>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            if (window.confirm(p.resetConfirm)) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200 text-red-500 text-sm font-medium"
        >
          <Trash2 size={16} />
          {p.resetData}
        </button>

        <div className="text-center py-4">
          <p className={`text-xs ${muted}`}>{p.version}</p>
          <p className={`text-xs ${muted} mt-1`}>{t.signature}</p>
        </div>
      </div>
    </div>
  );
}
