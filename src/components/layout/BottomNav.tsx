import { Home, BookOpen, BarChart2, Trophy, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabName } from '../../types';

export default function BottomNav() {
  const { activeTab, setActiveTab, setAppView, darkMode, t } = useApp();

  const tabs: { id: TabName; icon: typeof Home; label: string }[] = [
    { id: 'home', icon: Home, label: t.nav.home },
    { id: 'quran', icon: BookOpen, label: t.nav.quran },
    { id: 'progress', icon: BarChart2, label: t.nav.progress },
    { id: 'gamification', icon: Trophy, label: t.nav.gamification },
    { id: 'profile', icon: User, label: t.nav.profile },
  ];

  const handleTabClick = (tab: TabName) => {
    setActiveTab(tab);
    setAppView('main');
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-t shadow-2xl`}
      style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-emerald-600' : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-50' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'text-emerald-600' : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
