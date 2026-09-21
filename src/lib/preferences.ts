export function getPreference(key: string, fallback = false): boolean {
  try {
    const value = localStorage.getItem(`makers-room:${key}`);
    return value === null ? fallback : value === 'true';
  } catch {
    return fallback;
  }
}

export function setPreference(key: string, value: boolean): void {
  try {
    localStorage.setItem(`makers-room:${key}`, String(value));
  } catch {
    // The experience remains usable when storage is unavailable.
  }
}