import { useState, useMemo } from 'react';
import { Search, BookmarkCheck, Grid3x3, List, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SURAHS } from '../data/surahs';

type ViewMode = 'surah' | 'juz' | 'bookmarks';

const juzList = Array.from({ length: 30 }, (_, i) => {
  const juzNum = i + 1;
  const surahsInJuz = SURAHS.filter(s => s.juz.includes(juzNum));
  return { number: juzNum, startSurah: surahsInJuz[0], surahCount: surahsInJuz.length };
});

export default function QuranPage() {
  const { openReading, bookmarks, darkMode, t } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const q = t.quran;

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return SURAHS;
    const qs = searchQuery.toLowerCase();
    return SURAHS.filter(s =>
      s.englishName.toLowerCase().includes(qs) ||
      s.name.includes(qs) ||
      s.number.toString().includes(qs) ||
      s.englishNameTranslation.toLowerCase().includes(qs)
    );
  }, [searchQuery]);

  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${bg} pb-24`}>
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }} className="px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">{q.title}</h1>
        <p className="text-emerald-100 text-sm">{q.subtitle}</p>
        <div className="mt-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-200" />
          <input
            type="text"
            placeholder={q.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none bg-white/20 text-white placeholder-emerald-200 backdrop-blur-sm"
          />
        </div>
        <svg viewBox="0 0 375 24" className="w-full mt-4" style={{ marginBottom: -1 }}>
          <path d="M0,12 C100,24 275,0 375,12 L375,24 L0,24 Z" fill={darkMode ? '#030712' : '#f9fafb'} />
        </svg>
      </div>

      <div className="px-4 -mt-1">
        {!searchQuery && (
          <div className={`flex gap-1 p-1 rounded-xl mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {[
              { id: 'surah' as ViewMode, label: q.tabSurah, icon: List },
              { id: 'juz' as ViewMode, label: q.tabJuz, icon: Grid3x3 },
              { id: 'bookmarks' as ViewMode, label: q.tabBookmark, icon: Bookmark },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === id
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Surah List */}
        {(viewMode === 'surah' || searchQuery) && (
          <div className="space-y-2">
            {filteredSurahs.map(surah => (
              <button
                key={surah.number}
                onClick={() => openReading(surah.number, 1)}
                className={`w-full ${card} border rounded-2xl p-3 flex items-center gap-3 shadow-sm active:scale-98 transition-all duration-150`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  {surah.number}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${text} truncate`}>{surah.englishName}</span>
                    <span className="text-lg ml-2 flex-shrink-0" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>{surah.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${muted}`}>{surah.englishNameTranslation}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className={`text-xs ${muted}`}>{surah.numberOfAyahs} {q.ayahs}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      surah.revelationType === 'Meccan' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>{surah.revelationType === 'Meccan' ? q.meccan : q.medinan}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Juz List */}
        {viewMode === 'juz' && !searchQuery && (
          <div className="grid grid-cols-2 gap-3">
            {juzList.map(juz => (
              <button
                key={juz.number}
                onClick={() => openReading(juz.startSurah?.number || 1, 1)}
                className={`${card} border rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-all`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold mb-2"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  {juz.number}
                </div>
                <p className={`font-semibold text-sm ${text}`}>Juz {juz.number}</p>
                <p className={`text-xs ${muted} mt-0.5`}>{q.juzStartFrom} {juz.startSurah?.englishName}</p>
                <p className={`text-xs ${muted}`}>{juz.surahCount} {q.juzSurahs}</p>
              </button>
            ))}
          </div>
        )}

        {/* Bookmarks */}
        {viewMode === 'bookmarks' && !searchQuery && (
          <div>
            {bookmarks.length === 0 ? (
              <div className="text-center py-16">
                <BookmarkCheck size={48} className="mx-auto text-gray-200 mb-4" />
                <p className={`font-semibold ${text}`}>{q.noBookmark}</p>
                <p className={`text-sm ${muted} mt-1`}>{q.noBookmarkDesc}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map(bm => (
                  <button
                    key={bm.id}
                    onClick={() => openReading(bm.surah_number, bm.ayah_number)}
                    className={`w-full ${card} border rounded-2xl p-4 text-left shadow-sm active:scale-98 transition-all`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-emerald-600 font-semibold text-sm">{bm.surah_name}</span>
                      <span className={`text-xs ${muted}`}>{q.ayah} {bm.ayah_number}</span>
                    </div>
                    <p className={`text-xs ${muted} line-clamp-2`}>{bm.ayah_text_preview}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
