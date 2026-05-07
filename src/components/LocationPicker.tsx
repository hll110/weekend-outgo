import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Navigation, Search } from 'lucide-react';
import { CITIES } from '@/data/routes';

interface LocationPickerProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export default function LocationPicker({ selectedCity, onCityChange }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocate = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            onCityChange('杭州市');
            setIsLocating(false);
          }, 1000);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-2 pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm backdrop-blur-sm hover:bg-white/20 transition-all"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#FF4D00]" />
              <span className="font-medium">{selectedCity}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <button
          onClick={handleLocate}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FF4D00]/20 border border-[#FF4D00]/30 text-[#FF4D00] text-sm font-medium backdrop-blur-sm hover:bg-[#FF4D00]/30 transition-all disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">{isLocating ? '定位中...' : '定位'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-scale-in">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2 font-medium">热门城市</div>
            {CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  onCityChange(city.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
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
      )}
    </div>
  );
}
