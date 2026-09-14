import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Globe, Loader2 } from 'lucide-react';
import { APP_STRINGS } from '../constants/strings';
import { TOKENS } from '../constants/tokens';
import { useThemeStore } from '../store/themeStore';
import { APP_CONFIG } from '../constants/config';
import { ReportDetailsCard } from './ReportDetailsCard';
import { useReports } from '../hooks/useReports';
import type { FieldReport } from '../services/report.service';
import { REPORT_STATUS } from '../constants/enums';

const getMarkerIcon = (status: string) => {
  let color = 'var(--color-primary)';
  let bgClass = 'bg-primary';
  
  if (status === REPORT_STATUS.Pending) { color = 'var(--color-warning)'; bgClass = 'bg-warning'; }
  else if (status === REPORT_STATUS.Investigating) { color = 'var(--color-primary)'; bgClass = 'bg-primary'; }
  else if (status === REPORT_STATUS.Resolved) { color = 'var(--color-success)'; bgClass = 'bg-success'; }

  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="w-6 h-6 ${bgClass} rounded-full border-2 border-surface flex items-center justify-center shadow-[0_0_15px_${color}]">
            <div class="w-2 h-2 bg-text-inverse rounded-full"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

function AutoBounds({ reports }: { reports: FieldReport[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (reports && reports.length > 0) {
      const bounds = L.latLngBounds(reports.map((r: FieldReport) => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [APP_CONFIG.UI.MAP_BOUNDS_PADDING, APP_CONFIG.UI.MAP_BOUNDS_PADDING], maxZoom: APP_CONFIG.UI.MAP_MAX_ZOOM });
    }
  }, [reports, map]);

  useEffect(() => {
    const handleFocus = (e: CustomEvent<{ lat: number, lng: number }>) => {
      map.flyTo([e.detail.lat, e.detail.lng], APP_CONFIG.UI.MAP_FLY_ZOOM, { animate: true, duration: 1.5 });
    };
    window.addEventListener('focus-map-report', handleFocus as EventListener);
    return () => window.removeEventListener('focus-map-report', handleFocus as EventListener);
  }, [map]);

  return null;
}

export function GlobalMap() {
  const theme = useThemeStore(state => state.theme);
  const { data: reports = [], isLoading } = useReports();
  
  const tileUrl = theme === 'dark' ? APP_CONFIG.MAP_TILES.DARK : APP_CONFIG.MAP_TILES.LIGHT;

  return (
    <div className="w-full bg-background/50 border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-sm flex flex-col h-64 sm:h-[28rem] relative">
      <div className="px-3.5 py-2.5 sm:px-5 sm:py-4 bg-surface/50 border-b border-border flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Globe size={TOKENS.ICON_SIZES.SM} className="text-primary sm:hidden" />
          <Globe size={TOKENS.ICON_SIZES.MD} className="text-primary hidden sm:block" />
          <span className="text-2xs sm:text-sm font-bold text-text-main uppercase tracking-widest">{APP_STRINGS.MAP.SPV_TITLE}</span>
        </div>
        <span className="text-2xs sm:text-xs-tight text-text-muted font-medium bg-background px-2 py-0.5 sm:py-1 rounded-md border border-border flex items-center gap-1.5 sm:gap-2">
          {isLoading && <Loader2 size={TOKENS.ICON_SIZES.SM} className="animate-spin text-primary" />}
          {APP_STRINGS.MAP.DATA_COUNT(reports.length)}
        </span>
      </div>
      <div className="flex-1 relative z-0">
        <MapContainer center={[APP_CONFIG.MAP_CENTER.LATITUDE, APP_CONFIG.MAP_CENTER.LONGITUDE]} zoom={APP_CONFIG.UI.MAP_DEFAULT_ZOOM} zoomControl={false} className="w-full h-full !bg-background">
          <TileLayer url={tileUrl} detectRetina={true} maxNativeZoom={19} maxZoom={20} />
          {reports.map((report: FieldReport) => (
            <Marker key={report.id} position={[report.latitude, report.longitude]} icon={getMarkerIcon(report.status)}>
              <Popup minWidth={200} maxWidth={320} className="custom-leaflet-popup font-sans">
                <ReportDetailsCard report={report} />
              </Popup>
            </Marker>
          ))}
          <AutoBounds reports={reports} />
        </MapContainer>
      </div>
    </div>
  );
}
