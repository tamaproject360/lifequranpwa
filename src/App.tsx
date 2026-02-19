import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import ReadingPage from './pages/ReadingPage';
import ProgressPage from './pages/ProgressPage';
import GamificationPage from './pages/GamificationPage';
import ProfilePage from './pages/ProfilePage';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl text-5xl"
          style={{ animation: 'pulse 2s infinite' }}>
          📖
        </div>
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold tracking-wide">LifeQuran</h1>
          <p className="text-emerald-100 text-sm mt-1">Istiqomah Setiap Hari</p>
        </div>
      </div>
      <div className="absolute bottom-12 text-center">
        <p className="text-emerald-100 text-xs">Dipersembahkan untuk Umat Muslim di Seluruh Dunia 🤲</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { activeTab, appView, darkMode } = useApp();
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem('lifequran_launched');
  });

  useEffect(() => {
    if (!showSplash) {
      localStorage.setItem('lifequran_launched', '1');
    }
  }, [showSplash]);

  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className={`${bg} h-screen overflow-hidden relative`} style={{ maxWidth: 480, margin: '0 auto' }}>
      {appView === 'reading' && (
        <div className="absolute inset-0 z-30 overflow-y-auto">
          <ReadingPage />
        </div>
      )}

      <div className={`h-full overflow-y-auto ${appView === 'reading' ? 'invisible pointer-events-none' : ''}`}>
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'quran' && <QuranPage />}
        {activeTab === 'progress' && <ProgressPage />}
        {activeTab === 'gamification' && <GamificationPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </div>

      {appView !== 'reading' && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
