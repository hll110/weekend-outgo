import { useCallback, useEffect, useMemo, useState } from 'react';
import { getOrCreateDeviceId } from '@/lib/deviceId';
import { fetchProfile, upsertProfile, type PersistedUserProfile } from '@/services/userDataService';

const STORAGE_KEY = 'tripweave-user-profile';

const DEFAULT_PROFILE: PersistedUserProfile = {
  nickname: '周末旅行者',
  bio: '探索周边，发现精彩',
};

function readLocalProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PROFILE;
    }

    const parsed = JSON.parse(raw) as PersistedUserProfile;
    if (typeof parsed.nickname === 'string' && typeof parsed.bio === 'string') {
      return parsed;
    }
  } catch {
    // ignore local parse error
  }
  return DEFAULT_PROFILE;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<PersistedUserProfile>(() => readLocalProfile());
  const [saving, setSaving] = useState(false);
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  const persistLocal = useCallback((next: PersistedUserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore local save error
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const syncRemote = async () => {
      const remoteProfile = await fetchProfile(deviceId);
      if (!cancelled && remoteProfile) {
        setProfile(remoteProfile);
        persistLocal(remoteProfile);
      }
    };

    void syncRemote();

    return () => {
      cancelled = true;
    };
  }, [deviceId, persistLocal]);

  const updateProfile = useCallback(
    async (nextProfile: PersistedUserProfile) => {
      setSaving(true);
      setProfile(nextProfile);
      persistLocal(nextProfile);

      try {
        await upsertProfile(deviceId, nextProfile);
      } finally {
        setSaving(false);
      }
    },
    [deviceId, persistLocal]
  );

  return {
    profile,
    saving,
    updateProfile,
  };
}
