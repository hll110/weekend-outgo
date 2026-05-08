import { supabase } from '@/lib/supabase';
import type { Coordinates } from '@/utils/geo';

export interface PersistedUserProfile {
  nickname: string;
  bio: string;
}

export interface PersistedRouteHistory {
  routeId: string;
  city: string;
  viewedAt: string;
  location?: Coordinates;
}

export async function fetchProfile(deviceId: string): Promise<PersistedUserProfile | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('app_profiles')
    .select('nickname, bio')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    nickname: data.nickname ?? '周末旅行者',
    bio: data.bio ?? '探索周边，发现精彩',
  };
}

export async function upsertProfile(deviceId: string, profile: PersistedUserProfile) {
  if (!supabase) {
    return;
  }

  await supabase.from('app_profiles').upsert(
    {
      device_id: deviceId,
      nickname: profile.nickname,
      bio: profile.bio,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'device_id' }
  );
}

export async function fetchFavorites(deviceId: string): Promise<string[] | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('app_favorites')
    .select('route_id')
    .eq('device_id', deviceId);

  if (error || !data) {
    return null;
  }

  return data.map((item) => item.route_id).filter((item): item is string => typeof item === 'string');
}

export async function addFavorite(deviceId: string, routeId: string) {
  if (!supabase) {
    return;
  }

  await supabase.from('app_favorites').upsert(
    {
      device_id: deviceId,
      route_id: routeId,
    },
    { onConflict: 'device_id,route_id' }
  );
}

export async function removeFavorite(deviceId: string, routeId: string) {
  if (!supabase) {
    return;
  }

  await supabase.from('app_favorites').delete().eq('device_id', deviceId).eq('route_id', routeId);
}

export async function fetchRouteHistory(deviceId: string): Promise<PersistedRouteHistory[] | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('app_route_history')
    .select('route_id, city, lat, lng, viewed_at')
    .eq('device_id', deviceId)
    .order('viewed_at', { ascending: false })
    .limit(50);

  if (error || !data) {
    return null;
  }

  return data.map((item) => ({
    routeId: item.route_id,
    city: item.city,
    viewedAt: item.viewed_at,
    location:
      typeof item.lat === 'number' && typeof item.lng === 'number'
        ? { lat: item.lat, lng: item.lng }
        : undefined,
  }));
}

export async function addRouteHistory(
  deviceId: string,
  entry: { routeId: string; city: string; viewedAt: string; location?: Coordinates }
) {
  if (!supabase) {
    return;
  }

  await supabase.from('app_route_history').insert({
    device_id: deviceId,
    route_id: entry.routeId,
    city: entry.city,
    lat: entry.location?.lat ?? null,
    lng: entry.location?.lng ?? null,
    viewed_at: entry.viewedAt,
  });
}

export async function clearRouteHistory(deviceId: string) {
  if (!supabase) {
    return;
  }

  await supabase.from('app_route_history').delete().eq('device_id', deviceId);
}
