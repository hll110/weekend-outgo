import { useEffect, memo } from 'react';
import { X, Clock, MapPin, Wallet, UtensilsCrossed, Mountain, Camera, Sun, Moon, ChevronRight, Heart } from 'lucide-react';
import type { Route } from '@/data/routes';

interface RouteDetailProps {
  route: Route;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

function RouteDetail({ route, onClose, isFavorited, onToggleFavorite }: RouteDetailProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const foodSpots = route.spots.filter((s) => s.type === 'food');
  const scenicSpots = route.spots.filter((s) => s.type === 'scenic');

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[90vh] sm:rounded-2xl rounded-t-2xl bg-white overflow-hidden animate-slide-in-right">
        <div className="relative h-56 overflow-hidden">
          <img
            src={route.image}
            alt={route.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onToggleFavorite(route.id)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorited ? 'text-red-500 fill-red-500' : 'text-white'
              }`}
            />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2 mb-2 flex-wrap">
              {route.tags.map((tag) => (
                <span key={tag} className="pill-tag text-xs bg-white/90 text-gray-800">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-display text-xl font-bold text-white">{route.name}</h2>
            <p className="text-sm text-white/80">{route.subtitle}</p>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-14rem)] pb-safe">
          <div className="p-4">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF4D00]" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF4D00]" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#FF4D00]" />
                <span>{route.budget}</span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#FF4D00]" />
                必吃美食 ({foodSpots.length})
              </h3>
              <div className="space-y-2">
                {foodSpots.map((spot) => (
                  <div key={spot.name} className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/60">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{spot.name}</span>
                        {spot.mustTry && (
                          <span className="pill-tag pill-tag-outline text-xs">必吃</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{spot.description}</p>
                      {spot.mustTry && (
                        <p className="text-xs text-[#FF4D00] mt-1">推荐：{spot.mustTry}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-green-600" />
                必游景点 ({scenicSpots.length})
              </h3>
              <div className="space-y-2">
                {scenicSpots.map((spot) => (
                  <div key={spot.name} className="flex items-start gap-3 p-3 rounded-xl bg-green-50/60">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-gray-900">{spot.name}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{spot.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">行程规划</h3>
              {route.itinerary.map((day) => (
                <div key={day.day} className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {day.day === 1 ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-400" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      第{day.day}天：{day.title}
                    </span>
                  </div>
                  <div className="space-y-2 pl-6 border-l-2 border-gray-100">
                    {day.items.map((item, i) => (
                      <div key={i} className="relative text-sm text-gray-600 py-1">
                        <span className="absolute -left-[25px] top-2 w-2 h-2 rounded-full bg-gray-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">路线亮点</h3>
              <div className="flex flex-wrap gap-2">
                {route.highlights.map((h) => (
                  <span key={h} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                    <ChevronRight className="w-3 h-3 text-[#FF4D00]" />
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RouteDetail);
