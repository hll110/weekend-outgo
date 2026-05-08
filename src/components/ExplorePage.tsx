import { useState, useMemo, useCallback } from 'react';
import { MapPin, Mountain, UtensilsCrossed, Tent, Camera, Building2, TreePine, Waves, ChevronRight, Search, X, Loader2 } from 'lucide-react';
import { CITIES, ROUTES } from '@/data/routes';
import { useFavorites } from '@/hooks/useFavorites';
import RouteCard from './RouteCard';

const THEMES = [
  { id: 'food', label: '美食之旅', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-600' },
  { id: 'hike', label: '户外徒步', icon: Mountain, color: 'bg-green-100 text-green-600' },
  { id: 'scenic', label: '人文景点', icon: Camera, color: 'bg-blue-100 text-blue-600' },
  { id: 'camping', label: '露营野趣', icon: Tent, color: 'bg-amber-100 text-amber-600' },
  { id: 'forest', label: '森林氧吧', icon: TreePine, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'water', label: '水乡古镇', icon: Waves, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'city', label: '城市漫步', icon: Building2, color: 'bg-purple-100 text-purple-600' },
];

interface ExplorePageProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onOpenRoute: (routeId: string) => void;
}

export default function ExplorePage({ selectedCity, onCityChange, onOpenRoute }: ExplorePageProps) {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { isFavorited, toggle } = useFavorites();

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setIsSearching(value.length > 0);
    setActiveTheme(null);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  const filteredRoutes = useMemo(() => {
    let routes = ROUTES;

    // Filter by theme
    if (activeTheme) {
      routes = routes.filter((r) => r.filters.includes(activeTheme));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      routes = routes.filter((r) => {
        // Search in route name and subtitle
        if (r.name.toLowerCase().includes(q)) return true;
        if (r.subtitle.toLowerCase().includes(q)) return true;
        // Search in food spots
        if (r.spots.some((s) => s.type === 'food' && s.name.toLowerCase().includes(q))) return true;
        // Search in scenic spots
        if (r.spots.some((s) => s.type === 'scenic' && s.name.toLowerCase().includes(q))) return true;
        // Search in tags
        if (r.tags.some((t) => t.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    // Filter by city relevance (simplified matching)
    if (selectedCity) {
      const cityName = selectedCity.replace('市', '');
      routes = routes.filter((r) => {
        // If route name contains city name
        if (r.name.includes(cityName)) return true;
        // Special rules for different cities
        if (selectedCity === '杭州市') {
          return ['西湖', '莫干山', '安吉', '西塘', '同里'].some((k) => r.name.includes(k));
        }
        if (selectedCity === '上海市') {
          return ['西塘', '同里', '莫干山', '西湖', '绍兴'].some((k) => r.name.includes(k));
        }
        if (selectedCity === '苏州市') {
          return ['同里', '西塘', '莫干山', '西湖'].some((k) => r.name.includes(k));
        }
        if (selectedCity === '南京市') {
          return ['莫干山', '安吉'].some((k) => r.name.includes(k));
        }
        if (selectedCity === '宁波市') {
          return ['绍兴', '莫干山', '安吉'].some((k) => r.name.includes(k));
        }
        if (selectedCity === '无锡市') {
          return ['同里', '西塘', '莫干山'].some((k) => r.name.includes(k));
        }
        return true;
      });
    }

    return routes;
  }, [activeTheme, searchQuery, selectedCity]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const suggestions = new Set<string>();

    ROUTES.forEach((r) => {
      r.spots.forEach((s) => {
        if (s.name.toLowerCase().includes(q)) {
          suggestions.add(s.name);
        }
      });
      if (r.name.toLowerCase().includes(q)) {
        suggestions.add(r.name);
      }
    });

    return Array.from(suggestions).slice(0, 6);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 rounded-b-2xl shadow-sm">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">探索目的地</h1>
        <p className="text-sm text-gray-500">发现周边隐藏的宝藏短途游</p>
      </div>

      {/* Search Bar */}
      <div className="px-5 mt-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索目的地、美食、景点..."
            className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00]/10 transition-all"
          />
          {searchQuery ? (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          )}
        </div>

        {/* Search Suggestions */}
        {isSearching && searchSuggestions.length > 0 && (
          <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-scale-in">
            <div className="text-xs text-gray-400 px-3 py-2 font-medium">相关搜索</div>
            {searchSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all text-left"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* City Selector */}
      <div className="px-5 mb-4">
        <button
          onClick={() => setShowCityPicker(!showCityPicker)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-300 transition-all shadow-sm"
        >
          <MapPin className="w-3.5 h-3.5 text-[#FF4D00]" />
          {selectedCity}
          <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showCityPicker ? 'rotate-90' : ''}`} />
        </button>

        {showCityPicker && (
          <div className="mt-2 p-3 bg-white rounded-xl shadow-lg border border-gray-100 animate-scale-in">
            <div className="text-xs text-gray-400 mb-2 font-medium">切换出发城市</div>
            <div className="grid grid-cols-3 gap-2">
              {CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    onCityChange(city.name);
                    setShowCityPicker(false);
                  }}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCity === city.name
                      ? 'bg-[#FF4D00] text-white shadow-md shadow-orange-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {city.name.replace('市', '')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Themes */}
      {!isSearching && (
        <div className="px-5 mb-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">旅行主题</h2>
          <div className="grid grid-cols-4 gap-2.5">
            {THEMES.map((theme) => {
              const Icon = theme.icon;
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(isActive ? null : theme.id)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 ${
                    isActive
                      ? 'bg-[#FF4D00]/10 ring-1.5 ring-[#FF4D00]/40 shadow-sm'
                      : 'bg-white border border-gray-100 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${theme.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[11px] font-medium ${isActive ? 'text-[#FF4D00]' : 'text-gray-600'}`}>
                    {theme.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">
            {isSearching
              ? `「${searchQuery}」搜索结果`
              : activeTheme
                ? THEMES.find((t) => t.id === activeTheme)?.label
                : '热门推荐'}
          </h2>
          <span className="text-xs text-gray-400">{filteredRoutes.length} 条路线</span>
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
                onOpenDetail={() => onOpenRoute(route.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 bg-white rounded-2xl">
            <Search className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-sm text-gray-500 mb-1">
              {isSearching ? '未找到相关路线' : '该主题暂无路线'}
            </p>
            <button
              onClick={() => {
                setActiveTheme(null);
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="mt-2 text-sm text-[#FF4D00] font-medium"
            >
              查看全部路线
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
