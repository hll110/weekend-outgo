import { Home, Compass, Heart, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  favoritesCount?: number;
}

export default function BottomNav({ activeTab, onTabChange, favoritesCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'explore', label: '探索', icon: Compass },
    { id: 'favorites', label: '收藏', icon: Heart },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all ${
                isActive ? 'text-[#FF4D00]' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                {tab.id === 'favorites' && favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-1 h-1 rounded-full bg-[#FF4D00]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
