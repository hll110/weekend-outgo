import { FILTERS } from '@/data/routes';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`pill-tag flex-shrink-0 transition-all active:scale-95 ${
                activeFilter === filter.id ? 'pill-tag-active' : 'pill-tag-default'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
