const mapTilerKey = import.meta.env.VITE_MAPTILER_API_KEY || '';

const getMapTileUrl = (style: 'dataviz-dark' | 'streets-v2') => {
  if (mapTilerKey) {
    return `https://api.maptiler.com/maps/${style}/256/{z}/{x}/{y}.png?key=${mapTilerKey}`;
  }
  return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
};

export const APP_CONFIG = {
  NETWORK: {
    PING_INTERVAL_MS: 2000,
    PING_ENDPOINT: '/favicon.png',
    TIMEOUT_MS: 10000,
    PING_METHOD: 'HEAD',
    PING_CACHE: 'no-store',
    PING_QUERY_PARAM: '?t=',
  },
  CAMERA: {
    MAX_SIZE_MB: 0.2,
    MAX_DIMENSION: 1280,
    IDEAL_HEIGHT: 720,
    FORMAT: 'image/jpeg' as const,
    QUALITY: 1,
    FACING_MODE: 'environment',
  },
  AVATAR: {
    MAX_SIZE_MB: 0.5,
    MAX_DIMENSION: 512,
    FALLBACK_URL: 'https://ui-avatars.com/api/',
  },
  GPS: {
    HIGH_ACCURACY: true,
    TIMEOUT_MS: 5000,
    MAX_AGE_MS: 10000,
    WATCH_MAX_AGE_MS: 0,
    WATCH_TIMEOUT_MS: 10000,
  },
  SYNC: {
    STORAGE_CACHE_CONTROL: '3600',
  },
  CACHE: {
    STALE_TIME_MS: 300000,
    GC_TIME_MS: 1800000,
    RETRY: 1,
  },
  UI: {
    SUCCESS_FEEDBACK_MS: 3000,
    LONG_TOAST_DURATION_MS: 6000,
    COPY_FEEDBACK_MS: 2000,
    REDIRECT_MS: 1500,
    MAP_DEFAULT_ZOOM: 5,
    MAP_FLY_ZOOM: 16,
    MAP_MAX_ZOOM: 16,
    MAP_BOUNDS_PADDING: 50,
    REPORTS_QUERY_LIMIT: 100,
    ITEMS_PER_PAGE: 10,
  },
  MAP_TILES: {
    DARK: getMapTileUrl('dataviz-dark'),
    LIGHT: getMapTileUrl('streets-v2'),
  },
  MAP_CENTER: {
    LATITUDE: -6.2088,
    LONGITUDE: 106.8456,
  },
  LIMITS: {
    DEFAULT_MAX_WORKERS: 5,
    MAX_BIO_LENGTH: 100,
  },
  MARKER_ICON: {
    BORDER_COLOR: 'var(--text-inverse)',
    DOT_COLOR: 'var(--text-inverse)',
    SHADOW_COLOR: 'var(--brand-primary)',
  },
  SEED_DATA: {
    CATEGORIES: [
      { name: 'Serangan Hama', severity_level: 'CRITICAL' },
      { name: 'Panen / Produksi', severity_level: 'LOW' },
      { name: 'Infrastruktur Rusak', severity_level: 'MEDIUM' },
    ],
    ZONES: [
      { name: 'Blok A-1 (Utara)', hectares: 50, crop_type: 'Kelapa Sawit' },
      { name: 'Blok B-2 (Selatan)', hectares: 75, crop_type: 'Kelapa Sawit' },
    ],
  },
  FUNCTIONS: {
    CREATE_CHECKOUT: 'create-checkout',
  },
  PAYMENT: {
    MIDTRANS_SCRIPT_URL: 'https://app.sandbox.midtrans.com/snap/snap.js',
    MIDTRANS_CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-p8w3htk9-GWdgi_U',
  },
  APP_URL: import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://agrisync.rhankbrguw.xyz'),
} as const;
