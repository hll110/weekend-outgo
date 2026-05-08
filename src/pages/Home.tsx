import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTES, type Route } from '@/data/routes';
import { FavoritesProvider, useFavorites } from '@/hooks/useFavorites';
import { RouteHistoryProvider, useRouteHistory } from '@/hooks/useRouteHistory';
import HeroSection from '@/components/HeroSection';
import BottomNav from '@/components/BottomNav';
import ExplorePage from '@/components/ExplorePage';
import FavoritesPage from '@/components/FavoritesPage';
import ProfilePage from '@/components/ProfilePage';
import RouteDetail from '@/components/RouteDetail';
import RouteMapPanel from '@/components/RouteMapPanel';
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
    const timer = window.setTimeout(() => {
      locateUser(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [locateUser]);

  const routes = useMemo(() => ROUTES, []);

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
              routes={routes}
              isLocating={isLocating}
              onSelectRoute={handleMapRouteSelect}
            />
            <div className="px-4 pb-28 pt-4">
              <p className="rounded-xl border border-[rgba(38,37,30,0.1)] bg-[#ebeae5] px-4 py-3 text-xs text-[rgba(38,37,30,0.68)]">
                首页已聚焦地图推荐，点击上方地图中的路线或路线条目即可查看详情，不再展示底部图片列表。
              </p>
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
