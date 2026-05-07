import { useState, useMemo } from 'react';
import { ROUTES } from '@/data/routes';
import { FavoritesProvider, useFavorites } from '@/hooks/useFavorites';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import RouteCard from '@/components/RouteCard';
import BottomNav from '@/components/BottomNav';
import ExplorePage from '@/components/ExplorePage';
import FavoritesPage from '@/components/FavoritesPage';
import ProfilePage from '@/components/ProfilePage';
import { MapPin, Compass } from 'lucide-react';

function HomeContent() {
  const [selectedCity, setSelectedCity] = useState('杭州市');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const { favorites, toggle, isFavorited } = useFavorites();

  const filteredRoutes = useMemo(() => {
    let routes = ROUTES;
    if (activeFilter !== 'all') {
      routes = routes.filter((route) => route.filters.includes(activeFilter));
    }
    return routes;
  }, [activeFilter]);

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExplorePage selectedCity={selectedCity} onCityChange={setSelectedCity} />;
      case 'favorites':
        return <FavoritesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <>
            <HeroSection selectedCity={selectedCity} onCityChange={setSelectedCity} />
            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <div className="px-4 py-6 pb-28">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#FF4D00]" />
                <span className="text-sm font-medium text-gray-700">{selectedCity} 出发</span>
                <span className="text-xs text-gray-400">· {filteredRoutes.length} 条路线</span>
              </div>
              {filteredRoutes.length > 0 ? (
                <div className="space-y-4">
                  {filteredRoutes.map((route, index) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      index={index}
                      isFavorited={isFavorited(route.id)}
                      onToggleFavorite={toggle}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Compass className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">暂无符合条件的路线</p>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="mt-3 text-sm text-[#FF4D00] font-medium"
                  >
                    查看全部路线
                  </button>
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} favoritesCount={favorites.length} />
    </div>
  );
}

export default function Home() {
  return (
    <FavoritesProvider>
      <HomeContent />
    </FavoritesProvider>
  );
}
