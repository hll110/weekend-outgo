const STORAGE_KEY = 'tripweave-device-id';

function createFallbackId() {
  return `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateDeviceId() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return existing;
    }

    const nextId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : createFallbackId();
    localStorage.setItem(STORAGE_KEY, nextId);
    return nextId;
  } catch {
    return createFallbackId();
  }
}
