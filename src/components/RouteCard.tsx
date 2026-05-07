import { useState, memo, useMemo } from 'react';
import { Clock, MapPin, Wallet, ChevronRight, Star, UtensilsCrossed, Mountain, Heart } from 'lucide-react';
import type { Route } from '@/data/routes';
import RouteDetail from './RouteDetail';

interface RouteCardProps {
  route: Route;
  index: number;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

function RouteCard({ route, index, isFavorited, onToggleFavorite }: RouteCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const foodSpots = useMemo(() => route.spots.filter((s) => s.type === 'food'), [route.spots]);
  const scenicSpots = useMemo(() => route.spots.filter((s) => s.type === 'scenic'), [route.spots]);

  return (
    <>
      <div
        className="route-card cursor-pointer animate-float-up"
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => setShowDetail(true)}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={route.image}
            alt={route.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {route.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="pill-tag text-xs bg-white/90 text-gray-800 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(route.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/40"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorited ? 'text-red-500 fill-red-500' : 'text-white/80'
              }`}
            />
          </button>
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-1 bg-[#FF4D00] text-white text-xs font-bold rounded-full">
              {route.duration}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-gray-900 leading-tight mb-1">
            {route.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">{route.subtitle}</p>

          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{route.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{route.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>{route.budget}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <UtensilsCrossed className="w-3 h-3" />
                <span>美食 {foodSpots.length} 处</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {foodSpots.slice(0, 3).map((spot) => (
                  <span key={spot.name} className="text-xs text-gray-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    {spot.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <Mountain className="w-3 h-3" />
                <span>景点 {scenicSpots.length} 处</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {scenicSpots.slice(0, 3).map((spot) => (
                  <span key={spot.name} className="text-xs text-gray-600 bg-green-50 px-2 py-0.5 rounded-md">
                    {spot.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">4.8</span>
            </div>
            <div className="flex items-center gap-1 text-[#FF4D00] text-sm font-medium">
              <span>查看详情</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {showDetail && (
        <RouteDetail
          route={route}
          onClose={() => setShowDetail(false)}
          isFavorited={isFavorited}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  );
}

export default memo(RouteCard);
