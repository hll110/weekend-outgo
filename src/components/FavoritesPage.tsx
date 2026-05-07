import { useState, useMemo } from 'react';
import { Heart, MapPin, Clock, Wallet, Trash2, Compass } from 'lucide-react';
import { ROUTES } from '@/data/routes';
import type { Route } from '@/data/routes';
import { useFavorites } from '@/hooks/useFavorites';
import RouteDetail from './RouteDetail';

export default function FavoritesPage() {
  const { favorites, toggle, isFavorited, loaded } = useFavorites();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const favoriteRoutes = useMemo(
    () => ROUTES.filter((r) => favorites.includes(r.id)),
    [favorites]
  );

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 rounded-b-2xl shadow-sm">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">我的收藏</h1>
        <p className="text-sm text-gray-500">
          {favoriteRoutes.length > 0 ? `已收藏 ${favoriteRoutes.length} 条路线` : '收藏喜欢的路线，下次出行不迷路'}
        </p>
      </div>

      {favoriteRoutes.length > 0 ? (
        <div className="px-5 pt-4 space-y-3">
          {favoriteRoutes.map((route) => (
            <div
              key={route.id}
              className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setSelectedRoute(route)}
                className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50 transition-all"
              >
                <img
                  src={route.image}
                  alt={route.name}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="font-medium text-sm text-gray-900">{route.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{route.subtitle}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {route.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {route.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      {route.budget}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {route.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-md text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(route.id);
                }}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white transition-all border border-gray-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-2">还没有收藏</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            看到喜欢的路线点击爱心图标即可收藏
          </p>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Compass className="w-3 h-3" />
            去首页探索精彩路线
          </div>
        </div>
      )}

      {selectedRoute && (
        <RouteDetail
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
          isFavorited={isFavorited(selectedRoute.id)}
          onToggleFavorite={toggle}
        />
      )}
    </div>
  );
}