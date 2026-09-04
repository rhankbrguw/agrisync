 
import { useAuthStore, type AuthState } from '../../store/authStore';
import { useDashboardStore, useMapFocus } from '../../store/dashboardStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, List } from 'lucide-react';
import { EmployeeManagement } from '../../components/EmployeeManagement';
import { SettingsModal } from '../../components/SettingsModal';
import { InviteForm } from '../../components/InviteForm';
import { GlobalMap } from '../../components/GlobalMap';
import { ReportList } from '../../components/ReportList';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DashboardHeader, StatsGrid } from './components';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';

const DashboardBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none hidden sm:block">
    <div className="absolute -top-1/4 right-12 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
    <div className="absolute top-3/4 -left-12 w-1/2 h-1/2 bg-info/10 rounded-full blur-3xl" />
  </div>
);

export function SupervisorDashboard() {
  const user = useAuthStore((state: AuthState) => state.user);
  const { data: stats = { totalReports: 0, activeWorkers: 0, pendingSync: 0 }, isLoading } = useDashboardStats();
  const showSettings = useDashboardStore((state) => state.showSettings);
  const setShowSettings = useDashboardStore((state) => state.setShowSettings);
  const viewMode = useDashboardStore((state) => state.viewMode);
  const setViewMode = useDashboardStore((state) => state.setViewMode);

  useDocumentTitle(showSettings ? APP_STRINGS.TITLES.PROFILE : viewMode === 'LIST' ? APP_STRINGS.TITLES.REPORTS : APP_STRINGS.TITLES.DASHBOARD);

  useMapFocus();

  const handleLogout = async () => {
    useAuthStore.getState().logout();
  };

  return (
    <div className="min-h-dvh w-full max-w-full flex items-center justify-center p-0 sm:p-4 lg:p-6 bg-background overflow-x-hidden relative">
      <DashboardBackground />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={TOKENS.TRANSITION.PAGE}
        className="w-full max-w-7xl min-h-dvh sm:min-h-[90vh] bg-background sm:bg-surface/60 sm:backdrop-blur-3xl sm:rounded-3xl sm:border sm:border-border sm:shadow-2xl flex flex-col relative z-10 max-w-full min-w-0 overflow-hidden"
      >
        <DashboardHeader user={user} setShowSettings={setShowSettings} handleLogout={handleLogout} />
        <main className="flex-1 w-full max-w-full min-w-0 p-3.5 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden space-y-4 sm:space-y-6 lg:space-y-8 custom-scrollbar">
          <StatsGrid stats={stats} isLoading={isLoading} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full space-y-3">
            <div className="flex justify-end">
              <div className="flex bg-surface border border-border rounded-lg p-1 shadow-sm">
                <button 
                  onClick={() => setViewMode('MAP')} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${viewMode === 'MAP' ? 'bg-primary text-text-inverse shadow' : 'text-text-muted hover:text-text-main hover:bg-background/50'}`}
                >
                  <Map size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.DASHBOARD.VIEW_MAP_LABEL}
                </button>
                <button 
                  onClick={() => setViewMode('LIST')} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${viewMode === 'LIST' ? 'bg-primary text-text-inverse shadow' : 'text-text-muted hover:text-text-main hover:bg-background/50'}`}
                >
                  <List size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.DASHBOARD.VIEW_LIST_LABEL}
                </button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {viewMode === 'MAP' ? (
                <motion.div key="map" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={TOKENS.TRANSITION.FAST}>
                  <GlobalMap />
                </motion.div>
              ) : (
                <motion.div key="list" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={TOKENS.TRANSITION.FAST}>
                  <ReportList />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: 'spring' }} className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            <div className="xl:col-span-1 h-full"><InviteForm /></div>
            <div className="xl:col-span-2 min-h-96 h-full"><EmployeeManagement /></div>
          </motion.div>
        </main>
      </motion.div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
