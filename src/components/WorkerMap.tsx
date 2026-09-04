import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, MapPinOff, Navigation } from 'lucide-react';
import { APP_STRINGS } from '../constants/strings';
import { TOKENS } from '../constants/tokens';
import { useThemeStore } from '../store/themeStore';
import { APP_CONFIG } from '../constants/config';

const pulseIcon = L.divIcon({
  className: 'bg-transparent border-none',
  html: `<div class="w-5 h-5 bg-primary rounded-full border-2 border-surface flex items-center justify-center shadow-[0_0_15px_var(--color-primary)] animate-pulse">
          <div class="w-1.5 h-1.5 bg-text-inverse rounded-full"></div>
         </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

function LocationUpdater({ pos }: { pos: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.flyTo(pos, APP_CONFIG.UI.MAP_FLY_ZOOM); }, [pos, map]);
  return null;
}

const MapErrorState = ({ error }: { error: string }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-surface/30 px-6 text-center">
    <MapPinOff className="text-danger mb-2" size={TOKENS.ICON_SIZES.XL} />
    <p className="text-xs text-danger font-medium leading-relaxed">{error}</p>
  </div>
);

const MapLoadingState = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-surface/30">
    <MapPin className="text-primary animate-bounce mb-2" size={TOKENS.ICON_SIZES.XL} />
    <div className="w-24 h-1 bg-primary/20 rounded-full overflow-hidden"><div className="h-full bg-primary animate-pulse w-1/2 rounded-full" /></div>
  </div>
);

function useWorkerGeolocation() {
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let fallbackTimeout: ReturnType<typeof setTimeout>;
    
    if (import.meta.env.DEV) {
      fallbackTimeout = setTimeout(() => {
        setPos((currentPos) => {
          if (!currentPos) {
            setError(null);
            return [-6.2088, 106.8456];
          }
          return currentPos;
        });
      }, 3000);
    }

    const watchId = navigator.geolocation.watchPosition(
      (p) => { 
        if (fallbackTimeout) clearTimeout(fallbackTimeout);
        setPos([p.coords.latitude, p.coords.longitude]); 
        setError(null); 
      },
      (err) => {
        if (fallbackTimeout) clearTimeout(fallbackTimeout);
        if (import.meta.env.DEV) {
          setPos([-6.2088, 106.8456]);
          setError(null);
          return;
        }
        if (err.code === 1) setError(APP_STRINGS.ERRORS.GPS_UNAVAILABLE);
        else if (err.code === 3) setError(APP_STRINGS.ERRORS.GPS_TIMEOUT);
        else setError(APP_STRINGS.ERRORS.GPS_GENERIC);
      },
      { enableHighAccuracy: APP_CONFIG.GPS.HIGH_ACCURACY, maximumAge: APP_CONFIG.GPS.WATCH_MAX_AGE_MS, timeout: APP_CONFIG.GPS.WATCH_TIMEOUT_MS }
    );
    return () => {
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { pos, error };
}

export function WorkerMap() {
  const { pos, error } = useWorkerGeolocation();
  const theme = useThemeStore(state => state.theme);
  const tileUrl = theme === 'dark' ? APP_CONFIG.MAP_TILES.DARK : APP_CONFIG.MAP_TILES.LIGHT;

  return (
    <div className="w-full bg-background/50 border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-sm flex flex-col h-52 sm:h-72 relative">
      <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-surface/50 border-b border-border flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Navigation size={TOKENS.ICON_SIZES.SM} className="text-primary sm:hidden" />
          <Navigation size={TOKENS.ICON_SIZES.MD} className="text-primary hidden sm:block" />
          <span className="text-2xs sm:text-xs font-bold text-text-main uppercase tracking-widest">{APP_STRINGS.MAP.WORKER_TITLE}</span>
        </div>
        <span className="text-2xs sm:text-xs-tight text-text-muted font-medium bg-background px-2 py-0.5 sm:py-1 rounded-md border border-border flex items-center gap-1.5">
          {error ? <span className="text-danger">{APP_STRINGS.ERRORS.GPS_DENIED}</span> : pos ? <><div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> {APP_STRINGS.MAP.FOUND}</> : APP_STRINGS.MAP.LOCATING}
        </span>
      </div>
      <div className="flex-1 relative z-0">
        {error ? (
          <MapErrorState error={error} />
        ) : pos ? (
          <MapContainer 
            center={pos} 
            zoom={APP_CONFIG.UI.MAP_FLY_ZOOM} 
            zoomControl={false} 
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            className="w-full h-full !bg-background"
          >
            <TileLayer url={tileUrl} detectRetina={true} maxNativeZoom={19} maxZoom={20} />
            <Marker position={pos} icon={pulseIcon}>
              <Popup className="font-sans">
                <span className="text-xs font-bold text-text-main">{APP_STRINGS.MAP.FOUND}</span>
              </Popup>
            </Marker>
            <LocationUpdater pos={pos} />
          </MapContainer>
        ) : (
          <MapLoadingState />
        )}
      </div>
    </div>
  );
}
