/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Coordinates } from '@/utils/geo';

const STORAGE_KEY = 'tripweave-route-history';
const MAX_HISTORY_SIZE = 50;

export interface RouteHistoryEntry {
  routeId: string;
  city: string;
  viewedAt: string;
  location?: Coordinates;
}

interface RouteHistoryContextValue {
  history: RouteHistoryEntry[];
  loaded: boolean;
  recordRouteView: (entry: Omit<RouteHistoryEntry, 'viewedAt'>) => void;
  clearHistory: () => void;
}

const RouteHistoryContext = createContext<RouteHistoryContextValue>({
  history: [],
  loaded: false,
  recordRouteView: () => {},
  clearHistory: () => {},
});

export function RouteHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<RouteHistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RouteHistoryEntry[];
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch {
      // ignore malformed history
    } finally {
      setLoaded(true);
    }
  }, []);

  const persist = useCallback((next: RouteHistoryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore persistence error
    }
  }, []);

  const recordRouteView = useCallback(
    (entry: Omit<RouteHistoryEntry, 'viewedAt'>) => {
      setHistory((prev) => {
        const nextItem: RouteHistoryEntry = { ...entry, viewedAt: new Date().toISOString() };
        const deduped = prev.filter((item) => item.routeId !== entry.routeId);
        const next = [nextItem, ...deduped].slice(0, MAX_HISTORY_SIZE);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore persistence error
    }
  }, []);

  const value = useMemo(
    () => ({
      history,
      loaded,
      recordRouteView,
      clearHistory,
    }),
    [history, loaded, recordRouteView, clearHistory]
  );

  return <RouteHistoryContext.Provider value={value}>{children}</RouteHistoryContext.Provider>;
}

export function useRouteHistory() {
  return useContext(RouteHistoryContext);
}
