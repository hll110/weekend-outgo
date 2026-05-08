/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getOrCreateDeviceId } from '@/lib/deviceId';
import { addRouteHistory, clearRouteHistory as clearRemoteRouteHistory, fetchRouteHistory } from '@/services/userDataService';
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

function readHistoryFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is RouteHistoryEntry =>
          typeof item === 'object' &&
          item !== null &&
          'routeId' in item &&
          'city' in item &&
          'viewedAt' in item
      );
    }
  } catch {
    // ignore malformed history
  }
  return [];
}

export function RouteHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<RouteHistoryEntry[]>(() => readHistoryFromLocalStorage());
  const loaded = true;
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  useEffect(() => {
    let cancelled = false;

    const syncRemoteHistory = async () => {
      const remoteHistory = await fetchRouteHistory(deviceId);
      if (cancelled || !remoteHistory) {
        return;
      }

      setHistory(() => {
        const next = remoteHistory.slice(0, MAX_HISTORY_SIZE);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore local persistence error
        }
        return next;
      });
    };

    void syncRemoteHistory();

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

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
        void addRouteHistory(deviceId, nextItem);
        return next;
      });
    },
    [deviceId, persist]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore persistence error
    }
    void clearRemoteRouteHistory(deviceId);
  }, [deviceId]);

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
