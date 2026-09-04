import { APP_STRINGS } from '../constants/strings';
import { APP_CONFIG } from '../constants/config';
import { AppError } from './errors';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

let cachedLocation: LocationData | null = null;
let watchId: number | null = null;

export const startGPSPreWarming = (): void => {
  if (!('geolocation' in navigator)) return;

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      cachedLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    },
    () => {
      // Pre-warming is non-critical background operation
    },
    {
      enableHighAccuracy: APP_CONFIG.GPS.HIGH_ACCURACY,
      maximumAge: APP_CONFIG.GPS.MAX_AGE_MS,
      timeout: APP_CONFIG.GPS.TIMEOUT_MS,
    },
  );
};

export const stopGPSPreWarming = (): void => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
};

const getFallbackLocation = (): LocationData => ({
  latitude: APP_CONFIG.MAP_CENTER.LATITUDE,
  longitude: APP_CONFIG.MAP_CENTER.LONGITUDE,
  accuracy: 100,
});

export const getCurrentLocation = async (): Promise<LocationData> => {
  if (cachedLocation) return cachedLocation;

  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new AppError('VALIDATION_ERROR', APP_STRINGS.ERRORS.GPS_UNAVAILABLE));
      return;
    }

    let devTimeout: ReturnType<typeof setTimeout> | undefined;
    if (import.meta.env.DEV) {
      devTimeout = setTimeout(() => resolve(getFallbackLocation()), 3000);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (devTimeout) clearTimeout(devTimeout);
        const resolved: LocationData = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        cachedLocation = resolved;
        resolve(resolved);
      },
      (err) => {
        if (devTimeout) clearTimeout(devTimeout);
        if (cachedLocation) {
          resolve(cachedLocation);
          return;
        }
        if (import.meta.env.DEV) {
          resolve(getFallbackLocation());
          return;
        }
        const message = err.code === 1 ? APP_STRINGS.ERRORS.GPS_UNAVAILABLE : APP_STRINGS.ERRORS.GPS_TIMEOUT;
        reject(new AppError('INTERNAL_ERROR', message));
      },
      {
        enableHighAccuracy: APP_CONFIG.GPS.HIGH_ACCURACY,
        timeout: APP_CONFIG.GPS.TIMEOUT_MS,
        maximumAge: APP_CONFIG.GPS.WATCH_MAX_AGE_MS,
      },
    );
  });
};
