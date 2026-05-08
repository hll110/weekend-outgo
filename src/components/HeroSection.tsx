import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapPin, ChevronDown, Navigation, Search, Sparkles } from 'lucide-react';
import { CITIES } from '@/data/routes';

interface CityDropdownProps {
  selectedCity: string;
  cities: typeof CITIES;
  onSelectCity: (city: string) => void;
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

function CityDropdown({ selectedCity, cities, onSelectCity, isOpen, onClose, anchorRef }: CityDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 right-0 top-[calc(100%+8px)] z-[3200] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in"
    >
      <div className="p-2 max-h-64 overflow-y-auto">
        <div className="text-xs text-gray-400 px-3 py-2 font-medium">搜索匹配城市</div>
        {cities.length > 0 ? (
          cities.map((city) => (
            <button
              key={city.name}
              onClick={() => {
                onSelectCity(city.name);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                selectedCity === city.name
                  ? 'bg-[#FF4D00]/10 text-[#FF4D00] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {city.name}
            </button>
          ))
        ) : (
          <div className="px-3 py-4 text-xs text-gray-400">未匹配到城市，请尝试输入关键字</div>
        )}
      </div>
    </div>
  );
}

interface HeroSectionProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  isLocating: boolean;
  onLocate: () => void;
}

export default function HeroSection({ selectedCity, onCityChange, isLocating, onLocate }: HeroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(selectedCity);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchKeyword(selectedCity);
    }
  }, [selectedCity, isOpen]);

  const filteredCities = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      return CITIES;
    }

    return CITIES.filter((city) => {
      const fullName = city.name.toLowerCase();
      const shortName = city.name.replace('市', '').toLowerCase();
      return fullName.includes(keyword) || shortName.includes(keyword);
    });
  }, [searchKeyword]);

  const handleSelectCity = useCallback(
    (city: string) => {
      onCityChange(city);
      setSearchKeyword(city);
      setIsOpen(false);
    },
    [onCityChange]
  );

  const handleLocate = useCallback(() => {
    onLocate();
  }, [onLocate]);

  return (
    <div className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col justify-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Weekend getaway"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      </div>

      {/* Aurora Effect Overlay */}
      <div className="hero-aurora-bg" style={{ opacity: 0.5 }} />

      {/* Content */}
      <div className="relative z-[3000] px-5 pb-8 pt-20">
        <div className="max-w-xl mx-auto">
          {/* Title */}
          <div className="mb-6">
            <h1
              className={`font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-3 transition-all duration-1000 ${
                showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              周末不宅家
            </h1>
            <p
              className={`text-lg text-white/80 font-light transition-all duration-1000 delay-300 ${
                showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              发现城市周边的每一面精彩
            </p>
          </div>

          {/* Location Picker */}
          <div
            className={`transition-all duration-700 delay-500 ${
              showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none z-10" />
                <div
                  ref={inputWrapperRef}
                  className="w-full flex items-center gap-2 pl-10 pr-2 py-2 rounded-2xl bg-white/15 border border-white/25 text-white backdrop-blur-md hover:bg-white/25 transition-all"
                >
                  <input
                    type="text"
                    value={searchKeyword}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setIsOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsOpen(false);
                        setSearchKeyword(selectedCity);
                      }

                      if (e.key === 'Enter' && filteredCities.length > 0) {
                        handleSelectCity(filteredCities[0].name);
                      }
                    }}
                    placeholder="输入城市名进行搜索"
                    className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/60 focus:outline-none"
                    aria-label="搜索出发城市"
                  />
                  <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="rounded-xl p-2 text-white/70 hover:bg-white/15 hover:text-white transition-all"
                    aria-label="展开城市下拉"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Anchored dropdown to avoid viewport offset */}
                <CityDropdown
                  selectedCity={selectedCity}
                  cities={filteredCities}
                  onSelectCity={handleSelectCity}
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  anchorRef={inputWrapperRef}
                />
              </div>

              <button
                onClick={handleLocate}
                disabled={isLocating}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF4D00] text-white shadow-lg shadow-orange-500/30 hover:bg-[#E04400] transition-all active:scale-95 disabled:opacity-70"
              >
                <Navigation className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            {/* Quick Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-white/60">
                <Sparkles className="w-3 h-3" />
                热门筛选
              </span>
              {['1日游', '美食优先', '徒步', '2日游'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs backdrop-blur-sm hover:bg-white/25 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse-soft">
        <span className="text-[10px] text-white/50">下滑探索</span>
        <ChevronDown className="w-4 h-4 text-white/50" />
      </div>
    </div>
  );
}
