import { useMemo } from 'react';
import { BarChart2, Clock, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SURAHS } from '../data/surahs';

function loadSessions(): Array<{
  surahNumber: number; surahName: string;
  pages: number; minutes: number; date: string;
}> {
  try {
    const stored = localStorage.getItem('lifequran_sessions');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });
}

function getWeeklyData(sessions: ReturnType<typeof loadSessions>) {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days.map(date => {
    const daySessions = sessions.filter(s => s.date === date);
    const pages = daySessions.reduce((sum, s) => sum + s.pages, 0);
    const d = new Date(date);
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const labelsId = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return { date, pages, labelEn: labels[d.getDay()], labelId: labelsId[d.getDay()] };
  });
}

export default function ProgressPage() {
  const { profile, darkMode, t, language } = useApp();
  const p = t.progress;
  const sessions = useMemo(loadSessions, []);
  const last30Days = getLast30Days();
  const weeklyData = getWeeklyData(sessions);

  const readDates = new Set(sessions.map(s => s.date));
  const maxWeeklyPages = Math.max(...weeklyData.map(d => d.pages), 1);
  const totalQuranPages = 604;
  const quranProgressPercent = Math.min(100, Math.round((profile.total_pages_read / totalQuranPages) * 100));
  const pagesPerDay = sessions.length > 0
    ? (profile.total_pages_read / Math.max(1, readDates.size)).toFixed(1)
    : '0';
  const estimatedDaysLeft = profile.total_pages_read > 0
    ? Math.ceil((totalQuranPages - profile.total_pages_read) / parseFloat(pagesPerDay))
    : null;

  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';

  const isEnglish = language === 'en';

  return (
    <div className={`min-h-screen ${bg} pb-24`}>
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }} className="px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">{p.title}</h1>
        <p className="text-emerald-100 text-sm">{p.subtitle}</p>
        <svg viewBox="0 0 375 24" className="w-full mt-4" style={{ marginBottom: -1 }}>
          <path d="M0,12 C100,24 275,0 375,12 L375,24 L0,24 Z" fill={darkMode ? '#030712' : '#f9fafb'} />
        </svg>
      </div>

      <div className="px-4 space-y-4 -mt-1">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: BookOpen, label: p.totalPages, value: profile.total_pages_read, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: Clock, label: p.totalTime, value: `${Math.floor(profile.total_time_minutes / 60)}h ${profile.total_time_minutes % 60}m`, color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: TrendingUp, label: p.avgPerDay, value: `${pagesPerDay} ${p.pages}`, color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: Calendar, label: p.activeDays, value: `${readDates.size} ${p.days}`, color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map(({ icon: Icon, label, value, color, bg: ibg }) => (
            <div key={label} className={`${card} border rounded-2xl p-4 shadow-sm`}>
              <div className={`w-10 h-10 rounded-xl ${ibg} flex items-center justify-center mb-2`}>
                <Icon size={18} className={color} />
              </div>
              <p className={`font-bold text-lg ${text}`}>{value}</p>
              <p className={`text-xs ${muted}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Quran Progress */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold text-sm ${text}`}>{p.khatamProgress}</h3>
            <span className="text-emerald-600 font-bold text-sm">{quranProgressPercent}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${quranProgressPercent}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }} />
          </div>
          <p className={`text-xs ${muted}`}>{profile.total_pages_read} / 604 {p.pagesOf}</p>
          {estimatedDaysLeft !== null && estimatedDaysLeft > 0 && (
            <p className="text-xs text-emerald-600 mt-1 font-medium">
              {p.estimateKhatam.replace('{days}', String(estimatedDaysLeft))}
            </p>
          )}
        </div>

        {/* Weekly Chart */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-emerald-500" />
            <h3 className={`font-semibold text-sm ${text}`}>{p.weeklyChart}</h3>
          </div>
          <div className="flex items-end gap-2 h-28">
            {weeklyData.map(({ labelEn, labelId, pages, date }) => {
              const label = isEnglish ? labelEn : labelId;
              const heightPercent = (pages / maxWeeklyPages) * 100;
              const today = new Date().toISOString().split('T')[0];
              const isToday = date === today;
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`text-xs font-medium ${pages > 0 ? 'text-emerald-600' : muted}`}>{pages > 0 ? pages : ''}</span>
                  <div className="w-full flex flex-col justify-end" style={{ height: 80 }}>
                    <div className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${Math.max(4, heightPercent)}%`,
                        background: pages > 0
                          ? isToday ? 'linear-gradient(180deg, #059669, #10b981)' : 'linear-gradient(180deg, #6ee7b7, #a7f3d0)'
                          : darkMode ? '#374151' : '#f3f4f6',
                      }} />
                  </div>
                  <span className={`text-xs ${isToday ? 'text-emerald-600 font-bold' : muted}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heatmap */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-emerald-500" />
            <h3 className={`font-semibold text-sm ${text}`}>{p.heatmapTitle}</h3>
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
            {last30Days.map(date => {
              const dayData = sessions.filter(s => s.date === date);
              const pages = dayData.reduce((sum, s) => sum + s.pages, 0);
              const isActive = pages > 0;
              const isToday = date === new Date().toISOString().split('T')[0];
              return (
                <div key={date} title={`${date}: ${pages} ${p.pagesOf}`}
                  className={`aspect-square rounded-md transition-all ${isToday ? 'ring-2 ring-emerald-400' : ''}`}
                  style={{
                    background: isActive
                      ? pages >= 3 ? '#059669' : pages >= 2 ? '#10b981' : '#6ee7b7'
                      : darkMode ? '#1f2937' : '#f3f4f6',
                  }} />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className={`text-xs ${muted}`}>{p.little}</span>
            {['#a7f3d0', '#6ee7b7', '#10b981', '#059669'].map(color => (
              <div key={color} className="w-3 h-3 rounded-sm" style={{ background: color }} />
            ))}
            <span className={`text-xs ${muted}`}>{p.much}</span>
          </div>
        </div>

        {/* Reading History */}
        <div className={`${card} border rounded-2xl p-4 shadow-sm`}>
          <h3 className={`font-semibold text-sm ${text} mb-3`}>{p.recentHistory}</h3>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={36} className="mx-auto text-gray-200 mb-2" />
              <p className={`text-sm ${muted}`}>{p.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...sessions].reverse().slice(0, 10).map((session, i) => {
                const surah = SURAHS.find(s => s.number === session.surahNumber);
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                      {session.surahNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-xs ${text} truncate`}>{session.surahName || surah?.englishName}</p>
                      <p className={`text-xs ${muted}`}>{session.pages} {p.pagesOf} · {session.minutes}m</p>
                    </div>
                    <span className={`text-xs ${muted} flex-shrink-0`}>{session.date}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
