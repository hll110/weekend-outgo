import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTES, type Route } from '@/data/routes';
import { FavoritesProvider, useFavorites } from '@/hooks/useFavorites';
import { RouteHistoryProvider, useRouteHistory } from '@/hooks/useRouteHistory';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import RouteCard from '@/components/RouteCard';
import BottomNav from '@/components/BottomNav';
import ExplorePage from '@/components/ExplorePage';
import FavoritesPage from '@/components/FavoritesPage';
import ProfilePage from '@/components/ProfilePage';
import RouteDetail from '@/components/RouteDetail';
import RouteMapPanel from '@/components/RouteMapPanel';
import { MapPin, Compass } from 'lucide-react';
import { findNearestCity, type Coordinates } from '@/utils/geo';

const FALLBACK_CITY = '杭州市';
const LAST_CITY_STORAGE_KEY = 'tripweave-last-city';
const LAST_LOCATION_STORAGE_KEY = 'tripweave-last-location';

function getInitialCity() {
  try {
    return localStorage.getItem(LAST_CITY_STORAGE_KEY) || FALLBACK_CITY;
  } catch {
    return FALLBACK_CITY;
  }
}

function getInitialLocation(): Coordinates | null {
  try {
    const raw = localStorage.getItem(LAST_LOCATION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Coordinates;
    if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
      return parsed;
    }
  } catch {
    // ignore malformed cache
  }
  return null;
}

function HomeContent() {
  const [selectedCity, setSelectedCity] = useState(getInitialCity);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(getInitialLocation);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [isLocating, setIsLocating] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const { favorites, toggle, isFavorited } = useFavorites();
  const { recordRouteView } = useRouteHistory();

  const updateCity = useCallback((city: string) => {
    setSelectedCity(city);
    try {
      localStorage.setItem(LAST_CITY_STORAGE_KEY, city);
    } catch {
      // ignore persistence error
    }
  }, []);

  const updateLocation = useCallback((coords: Coordinates) => {
    setUserLocation(coords);
    try {
      localStorage.setItem(LAST_LOCATION_STORAGE_KEY, JSON.stringify(coords));
    } catch {
      // ignore persistence error
    }
  }, []);

  const locateUser = useCallback(
    (silent = false) => {
      if (!navigator.geolocation) {
        if (!silent) {
          updateCity(FALLBACK_CITY);
        }
        return;
      }

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          updateLocation(coords);
          updateCity(findNearestCity(coords));
          setIsLocating(false);
        },
        () => {
          if (!silent) {
            updateCity(FALLBACK_CITY);
          }
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60_000,
        }
      );
    },
    [updateCity, updateLocation]
  );

  useEffect(() => {
    locateUser(true);
  }, [locateUser]);

  const filteredRoutes = useMemo(() => {
    let routes = ROUTES;
    if (activeFilter !== 'all') {
      routes = routes.filter((route) => route.filters.includes(activeFilter));
    }
    return routes;
  }, [activeFilter]);

  const handleOpenRoute = useCallback(
    (routeId: string) => {
      recordRouteView({
        routeId,
        city: selectedCity,
        location: userLocation ?? undefined,
      });
    },
    [recordRouteView, selectedCity, userLocation]
  );

  const handleMapRouteSelect = useCallback(
    (route: Route) => {
      handleOpenRoute(route.id);
      setSelectedRoute(route);
    },
    [handleOpenRoute]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExplorePage selectedCity={selectedCity} onCityChange={updateCity} onOpenRoute={handleOpenRoute} />;
      case 'favorites':
        return <FavoritesPage onOpenRoute={handleOpenRoute} />;
      case 'profile':
        return <ProfilePage onOpenRoute={handleOpenRoute} />;
      default:
        return (
          <>
            <HeroSection
              selectedCity={selectedCity}
              onCityChange={updateCity}
              isLocating={isLocating}
              onLocate={() => locateUser(false)}
            />
            <RouteMapPanel
              selectedCity={selectedCity}
              userLocation={userLocation}
              routes={filteredRoutes}
              isLocating={isLocating}
              onSelectRoute={handleMapRouteSelect}
            />
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
                      onOpenDetail={() => handleOpenRoute(route.id)}
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
    <div className="min-h-screen bg-[#f2f1ed]">
      {renderContent()}
      {selectedRoute && (
        <RouteDetail
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
          isFavorited={isFavorited(selectedRoute.id)}
          onToggleFavorite={toggle}
        />
      )}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} favoritesCount={favorites.length} />
    </div>
  );
}

export default function Home() {
  return (
    <FavoritesProvider>
      <RouteHistoryProvider>
        <HomeContent />
      </RouteHistoryProvider>
    </FavoritesProvider>
  );
}
