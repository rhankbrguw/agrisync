import { motion, type Variants } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, LogOut, TrendingUp, Users, Activity, Loader2 } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { AccessRequests } from '../../components/AccessRequests';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { APP_CONFIG } from '../../constants/config';

type UserData = {
  company_name?: string;
  company_id?: string;
  full_name?: string;
  subscription_tier?: string;
  email: string;
  avatar_url?: string;
};

const HeaderBrand = ({ user }: { user: UserData | null }) => (
  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 border border-primary/20 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner shrink-0">
      <LayoutDashboard size={TOKENS.ICON_SIZES.MD} className="sm:hidden" />
      <LayoutDashboard size={TOKENS.ICON_SIZES.LG} className="hidden sm:block" />
    </div>
    <div className="min-w-0 flex flex-col justify-center">
      <h1 className="text-sm sm:text-base font-extrabold tracking-tight leading-none text-text-main truncate">{user?.company_name || APP_STRINGS.DASHBOARD.TITLE}</h1>
      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 min-w-0">
        <p className="text-[10px] sm:text-xs-tight text-primary uppercase font-bold tracking-widest flex items-center gap-1 shrink-0">
          <ShieldCheck size={TOKENS.ICON_SIZES.SM} className="shrink-0" /> 
          {APP_STRINGS.DASHBOARD.ROLE_ADMIN}
        </p>
        <span className="w-1 h-1 rounded-full bg-border shrink-0"></span>
        <p className={`text-[10px] sm:text-xs-tight uppercase font-bold tracking-widest truncate ${user?.subscription_tier === 'PRO' ? 'text-warning' : 'text-text-muted'}`}>
          {user?.subscription_tier === 'PRO' ? (
            <><span className="hidden sm:inline">{APP_STRINGS.WORKER.PRO_PLAN_LABEL}</span><span className="sm:hidden">PRO</span></>
          ) : (
            <><span className="hidden sm:inline">{APP_STRINGS.WORKER.PACKAGE_PREFIX} {APP_STRINGS.BILLING.FREE_TIER}</span><span className="sm:hidden">{APP_STRINGS.WORKER.FREE_PLAN_LABEL}</span></>
          )}
        </p>
      </div>
    </div>
  </div>
);

const HeaderActions = ({ user, setShowSettings, handleLogout }: { user: UserData | null; setShowSettings: (s: boolean) => void; handleLogout: () => void }) => (
  <div className="flex flex-nowrap items-center gap-1.5 sm:gap-3 shrink-0">
    <AccessRequests />
    <ThemeToggle />
    <div className="h-5 w-px bg-border/50 mx-0.5 hidden sm:block" />
    <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 p-1 sm:pr-3 bg-background/50 hover:bg-surface border border-border rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-primary/30 shrink-0">
      <img src={user?.avatar_url || `${APP_CONFIG.AVATAR.FALLBACK_URL}?name=${user?.full_name || user?.email}&background=random`} alt={APP_STRINGS.UI.PROFILE_ALT} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover bg-surface" />
      <div className="hidden lg:block text-left">
        <p className="text-xs-tight font-bold text-text-main truncate max-w-[100px]">{user?.full_name || user?.email?.split('@')[0]}</p>
      </div>
    </button>
    <button onClick={handleLogout} className="p-2 text-text-muted hover:text-danger sm:hover:bg-danger/10 rounded-xl transition-all cursor-pointer">
      <LogOut size={TOKENS.ICON_SIZES.MD} />
    </button>
  </div>
);

export const DashboardHeader = ({ user, setShowSettings, handleLogout }: { user: UserData | null; setShowSettings: (show: boolean) => void; handleLogout: () => void }) => (
  <header className="px-3 py-3 sm:px-6 sm:py-4 border-b border-border flex flex-nowrap items-center justify-between gap-2 sm:gap-3 bg-surface/90 sm:bg-transparent backdrop-blur-2xl sticky top-0 z-30">
    <HeaderBrand user={user} />
    <HeaderActions user={user} setShowSettings={setShowSettings} handleLogout={handleLogout} />
  </header>
);

const containerVars: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVars: Variants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: 'spring', bounce: 0.4 } } };

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  themeColor: string;
  className?: string;
}

const StatCard = ({ label, value, icon, themeColor, className = '' }: StatCardProps) => (
  <motion.div variants={itemVars} className={`bg-surface/90 sm:bg-surface/50 border border-border p-3.5 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl flex flex-row items-center sm:items-start sm:flex-col gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:border-border-hover transition-all cursor-default ${className}`}>
    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${themeColor} flex items-center justify-center shadow-inner shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] sm:text-xs-loose text-text-muted uppercase font-bold tracking-widest mb-0.5 sm:mb-1 truncate">{label}</p>
      <p className="text-xl sm:text-3xl font-extrabold text-text-main tracking-tight">{value}</p>
    </div>
  </motion.div>
);

export const StatsGrid = ({ stats, isLoading }: { stats: { totalReports: number; activeWorkers: number; pendingSync: number }, isLoading: boolean }) => (
  <motion.div variants={containerVars} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
    <StatCard label={APP_STRINGS.DASHBOARD.STATS_TOTAL_REPORTS} value={isLoading ? <Loader2 size={TOKENS.ICON_SIZES.LG} className="animate-spin text-text-muted" /> : stats.totalReports} icon={<><TrendingUp size={TOKENS.ICON_SIZES.LG} className="sm:hidden" /><TrendingUp size={TOKENS.ICON_SIZES.XXL} className="hidden sm:block" /></>} themeColor="bg-info/10 border border-info/20 text-info" />
    <StatCard label={APP_STRINGS.DASHBOARD.STATS_ACTIVE_WORKERS} value={isLoading ? <Loader2 size={TOKENS.ICON_SIZES.LG} className="animate-spin text-text-muted" /> : stats.activeWorkers} icon={<><Users size={TOKENS.ICON_SIZES.LG} className="sm:hidden" /><Users size={TOKENS.ICON_SIZES.XXL} className="hidden sm:block" /></>} themeColor="bg-primary/10 border border-primary/20 text-primary" />
    <StatCard label={APP_STRINGS.DASHBOARD.STATS_PENDING_SYNC} value={stats.pendingSync} icon={<><Activity size={TOKENS.ICON_SIZES.LG} className="sm:hidden" /><Activity size={TOKENS.ICON_SIZES.XXL} className="hidden sm:block" /></>} themeColor="bg-warning/10 border border-warning/20 text-warning" className="sm:col-span-2 lg:col-span-1" />
  </motion.div>
);
