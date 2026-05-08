/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useContext, useCallback, useState, useEffect, useMemo, type ReactNode } from 'react';
import { getOrCreateDeviceId } from '@/lib/deviceId';
import { addFavorite, fetchFavorites, removeFavorite } from '@/services/userDataService';

const STORAGE_KEY = 'tripweave-favorites';

interface FavoritesContextType {
  favorites: string[];
  loaded: boolean;
  toggle: (id: string) => void;
  isFavorited: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  loaded: false,
  toggle: () => {},
  isFavorited: () => false,
});

function readFavoritesFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    // ignore local parse error
  }
  return [];
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readFavoritesFromLocalStorage());
  const loaded = true;
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  useEffect(() => {
    let cancelled = false;

    const syncRemoteFavorites = async () => {
      const remoteFavorites = await fetchFavorites(deviceId);
      if (cancelled || !remoteFavorites) {
        return;
      }

      setFavorites((prev) => {
        const merged = Array.from(new Set([...remoteFavorites, ...prev]));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // ignore local save error
        }
        return merged;
      });
    };

    void syncRemoteFavorites();

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore local save error
      }

      if (exists) {
        void removeFavorite(deviceId, id);
      } else {
        void addFavorite(deviceId, id);
      }

      return next;
    });
  }, [deviceId]);

  const isFavorited = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, loaded, toggle, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
