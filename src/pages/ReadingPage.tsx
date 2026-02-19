import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, BookOpen, Loader2, Settings2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchSurahWithTranslation } from '../services/quranApi';
import { SurahDetail } from '../types';
import { SURAHS } from '../data/surahs';

const FONT_SIZES = {
  small: { arabic: 'text-xl', translation: 'text-xs' },
  medium: { arabic: 'text-2xl', translation: 'text-sm' },
  large: { arabic: 'text-3xl', translation: 'text-base' },
  xlarge: { arabic: 'text-4xl', translation: 'text-lg' },
};

export default function ReadingPage() {
  const { selectedSurahNumber, selectedAyahNumber, setAppView, toggleBookmark, isBookmarked, recordReadingSession, profile, darkMode, updateSettings, t, openReading } = useApp();
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showTranslation, setShowTranslation] = useState(profile.settings?.showTranslation ?? true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>(profile.settings?.fontSize ?? 'medium');
  const startTimeRef = useRef(Date.now());
  const startAyahRef = useRef(selectedAyahNumber);

  const surahInfo = SURAHS.find(s => s.number === selectedSurahNumber);
  const r = t.reading;

  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const card = darkMode ? 'bg-gray-900' : 'bg-white';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-800' : 'border-gray-100';

  useEffect(() => {
    setLoading(true);
    setError('');
    startTimeRef.current = Date.now();
    fetchSurahWithTranslation(selectedSurahNumber)
      .then(data => { setSurahDetail(data); setLoading(false); })
      .catch(() => { setError(r.error); setLoading(false); });
  }, [selectedSurahNumber, r.error]);

  const handleBack = useCallback(() => {
    if (surahDetail) {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 60000);
      const estimatedPages = Math.max(1, Math.floor(surahDetail.numberOfAyahs / 15));
      recordReadingSession(selectedSurahNumber, surahDetail.englishName, startAyahRef.current, selectedAyahNumber, estimatedPages, elapsed);
    }
    setAppView('main');
  }, [surahDetail, selectedSurahNumber, selectedAyahNumber, recordReadingSession, setAppView]);

  if (loading) {
    return (
      <div className={`min-h-screen ${bg} flex flex-col items-center justify-center`}>
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <BookOpen size={24} className="text-emerald-500" />
        </div>
        <Loader2 size={24} className="text-emerald-500 animate-spin mb-2" />
        <p className={`text-sm ${muted}`}>{r.loading} {surahInfo?.englishName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${bg} flex flex-col items-center justify-center px-6`}>
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button onClick={handleBack} className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-semibold">{r.back}</button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${card} border-b ${border} px-4 py-3 flex items-center justify-between`}>
        <button onClick={handleBack} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className={text} />
        </button>
        <div className="text-center">
          <p className={`font-bold text-sm ${text}`}>{surahDetail?.englishName}</p>
          <p className={`text-xs ${muted}`}>{surahDetail?.numberOfAyahs} {t.quran.ayahs} · {surahDetail?.revelationType}</p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Settings2 size={18} className={text} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`${card} border-b ${border} px-4 py-4`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-semibold ${text}`}>{r.textSize}</span>
            <div className="flex gap-1">
              {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => { setFontSize(size); updateSettings({ fontSize: size }); }}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                    fontSize === size ? 'bg-emerald-500 text-white' : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                  }`}
                >
                  {size === 'small' ? 'S' : size === 'medium' ? 'M' : size === 'large' ? 'L' : 'XL'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${text}`}>{r.translation}</span>
            <button
              onClick={() => { setShowTranslation(!showTranslation); updateSettings({ showTranslation: !showTranslation }); }}
              className={`w-12 h-6 rounded-full transition-all duration-200 ${showTranslation ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${showTranslation ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Bismillah */}
      {selectedSurahNumber !== 9 && selectedSurahNumber !== 1 && (
        <div className="py-6 text-center">
          <p className="text-2xl" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className={`text-xs ${muted} mt-1`}>{r.bismillah}</p>
        </div>
      )}

      {/* Surah Name */}
      <div className="py-4 text-center">
        <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
          <p className="text-2xl" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>{surahDetail?.name}</p>
          <p className="text-emerald-700 text-sm font-semibold">{surahDetail?.englishName}</p>
          <p className="text-emerald-600 text-xs">{surahDetail?.englishNameTranslation}</p>
        </div>
      </div>

      {/* Ayahs */}
      <div className="px-4 pb-32 space-y-4">
        {surahDetail?.ayahs.map((ayah) => {
          const bookmarked = isBookmarked(selectedSurahNumber, ayah.numberInSurah);
          return (
            <div key={ayah.numberInSurah} className={`${card} rounded-2xl p-4 shadow-sm border ${border}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  {ayah.numberInSurah}
                </div>
                <button
                  onClick={() => toggleBookmark(selectedSurahNumber, surahDetail.englishName, ayah.numberInSurah, ayah.text)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                >
                  {bookmarked ? <BookmarkCheck size={16} className="text-emerald-500" /> : <Bookmark size={16} className={muted} />}
                </button>
              </div>
              <p className={`text-right leading-loose mb-4 ${FONT_SIZES[fontSize].arabic} ${text}`}
                style={{ fontFamily: 'Amiri, serif', direction: 'rtl', lineHeight: '2.2' }}>
                {ayah.text}
              </p>
              {showTranslation && ayah.translation && (
                <div className={`pt-3 border-t ${border}`}>
                  <p className={`${FONT_SIZES[fontSize].translation} ${muted} leading-relaxed`}>
                    {ayah.numberInSurah}. {ayah.translation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 ${card} border-t ${border} px-4 py-3 flex items-center justify-between`}
        style={{ maxWidth: 480, margin: '0 auto' }}>
        <button
          onClick={() => { if (selectedSurahNumber > 1) { handleBack(); setTimeout(() => openReading(selectedSurahNumber - 1, 1), 50); } }}
          disabled={selectedSurahNumber <= 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedSurahNumber <= 1 ? 'text-gray-300' : 'text-emerald-600 bg-emerald-50'
          }`}
        >
          <ChevronLeft size={16} />
          {r.previous}
        </button>
        <div className="text-center">
          <p className={`text-xs ${muted}`}>{r.surahOf}</p>
          <p className={`font-bold text-sm ${text}`}>{selectedSurahNumber} / 114</p>
        </div>
        <button
          onClick={() => { if (selectedSurahNumber < 114) { handleBack(); setTimeout(() => openReading(selectedSurahNumber + 1, 1), 50); } }}
          disabled={selectedSurahNumber >= 114}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedSurahNumber >= 114 ? 'text-gray-300' : 'text-emerald-600 bg-emerald-50'
          }`}
        >
          {r.next}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
