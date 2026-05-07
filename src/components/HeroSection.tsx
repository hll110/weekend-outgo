import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, ChevronDown, Navigation, Search, Sparkles } from 'lucide-react';
import { CITIES } from '@/data/routes';

interface CityDropdownProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

function CityDropdown({ selectedCity, onCityChange, isOpen, onClose, anchorRef }: CityDropdownProps) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current!.getBoundingClientRect();
      const dropdownHeight = 280;
      const spaceBelow = window.innerHeight - rect.bottom;
      const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

      setStyle({
        position: 'fixed',
        left: rect.left,
        top: showAbove ? rect.top - dropdownHeight - 8 : rect.bottom + 8,
        width: rect.width,
        zIndex: 9999,
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, anchorRef]);

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
      style={style}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in"
    >
      <div className="p-2 max-h-64 overflow-y-auto">
        <div className="text-xs text-gray-400 px-3 py-2 font-medium">热门出发城市</div>
        {CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => {
              onCityChange(city.name);
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
        ))}
      </div>
    </div>
  );
}

interface HeroSectionProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestCity(lat: number, lng: number) {
  let nearest = CITIES[0];
  let minDist = Infinity;
  for (const city of CITIES) {
    const dist = getDistance(lat, lng, city.lat, city.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }
  return nearest.name;
}

export default function HeroSection({ selectedCity, onCityChange }: HeroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showText, setShowText] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLocate = useCallback(() => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestCity = findNearestCity(latitude, longitude);
          setTimeout(() => {
            onCityChange(nearestCity);
            setIsLocating(false);
          }, 600);
        },
        () => {
          setTimeout(() => {
            onCityChange('杭州市');
            setIsLocating(false);
          }, 600);
        }
      );
    } else {
      setTimeout(() => {
        onCityChange('杭州市');
        setIsLocating(false);
      }, 600);
    }
  }, [onCityChange]);

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
      <div className="relative z-10 px-5 pb-8 pt-20">
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
                <button
                  ref={buttonRef}
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between gap-2 pl-10 pr-3 py-3 rounded-2xl bg-white/15 border border-white/25 text-white backdrop-blur-md hover:bg-white/25 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF4D00]" />
                    <span className="font-medium text-sm">{selectedCity}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Fixed-position dropdown rendered via portal-like fixed positioning */}
                <CityDropdown
                  selectedCity={selectedCity}
                  onCityChange={onCityChange}
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  anchorRef={buttonRef}
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
