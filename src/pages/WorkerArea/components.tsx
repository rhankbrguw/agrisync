import { motion } from 'framer-motion';
import { Camera, Wifi, WifiOff, LogOut, Send, RefreshCw, CheckCircle2, MessageSquare, HardHat } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { ThemeToggle } from '../../components/ThemeToggle';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { APP_CONFIG } from '../../constants/config';

type UserData = {
  company_name?: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  subscription_tier?: string;
};

interface ReportFormData {
  notes?: string;
  categoryId: string;
  zoneId: string;
}

const WorkerBrand = ({ user }: { user: UserData }) => (
  <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[50%] sm:max-w-none">
    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/20 shrink-0 shadow-inner">
      <Camera size={16} className="text-primary sm:hidden" />
      <Camera size={TOKENS.ICON_SIZES.LG} className="text-primary hidden sm:block" />
    </div>
    <div className="min-w-0 flex flex-col justify-center">
      <h1 className="text-sm sm:text-base font-extrabold tracking-tight leading-none text-text-main truncate">{user?.company_name || APP_STRINGS.WORKER.TITLE}</h1>
      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 min-w-0">
        <p className="text-[10px] sm:text-xs-tight text-primary uppercase font-bold tracking-widest flex items-center gap-1 shrink-0">
          <HardHat size={TOKENS.ICON_SIZES.SM} className="shrink-0" /> 
          {APP_STRINGS.WORKER.ROLE_WORKER}
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

const WorkerActions = ({ user, isOnline, setShowSettings, handleLogout, onOpenHistory }: { user: UserData; isOnline: boolean; setShowSettings: (s: boolean) => void; handleLogout: () => void; onOpenHistory?: () => void }) => (
  <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0 sm:ml-auto flex-1 sm:flex-none overflow-x-auto sm:overflow-visible scrollbar-hide pb-1 sm:pb-0">
    <div className={`flex items-center gap-1 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs-tight font-bold uppercase tracking-wider border shadow-sm shrink-0 ${isOnline ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
      {isOnline ? <Wifi size={12} className="sm:hidden" /> : <WifiOff size={12} className="sm:hidden" />} 
      {isOnline ? <Wifi size={TOKENS.ICON_SIZES.SM} className="hidden sm:block" /> : <WifiOff size={TOKENS.ICON_SIZES.SM} className="hidden sm:block" />} 
      <span className="hidden sm:inline">{isOnline ? APP_STRINGS.UI.ONLINE_MODE : APP_STRINGS.UI.OFFLINE_MODE}</span>
    </div>
    <div className="h-4 sm:h-5 w-px bg-border/50 mx-0 shrink-0" />
    {onOpenHistory && (
      <button onClick={onOpenHistory} className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 bg-background/50 hover:bg-surface border border-border rounded-lg sm:rounded-xl transition-all cursor-pointer shadow-sm hover:border-primary/30 text-text-muted sm:hover:text-primary shrink-0">
        <MessageSquare size={14} className="sm:hidden" />
        <MessageSquare size={16} className="hidden sm:block" />
        <span className="text-xs-tight font-bold hidden sm:block">{APP_STRINGS.WORKER.INBOX_LABEL}</span>
      </button>
    )}
    <div className="shrink-0 scale-75 sm:scale-100 origin-center"><ThemeToggle /></div>
    <div className="h-4 sm:h-5 w-px bg-border/50 mx-0 shrink-0" />
    <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 p-1 sm:pr-3 bg-background/50 hover:bg-surface border border-border rounded-lg sm:rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-primary/30 min-w-0 shrink-0">
      <img src={user?.avatar_url || `${APP_CONFIG.AVATAR.FALLBACK_URL}?name=${user?.full_name || user?.email}&background=random`} alt={APP_STRINGS.UI.PROFILE_ALT} className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg object-cover bg-surface shrink-0" />
      <span className="text-xs-tight font-bold text-text-main hidden sm:block truncate max-w-[80px] text-left">{user?.full_name || user?.email?.split('@')[0]}</span>
    </button>
    <button onClick={handleLogout} className="p-1.5 sm:p-2 text-text-muted hover:text-danger sm:hover:bg-danger/10 rounded-lg sm:rounded-xl transition-all cursor-pointer shrink-0">
      <LogOut size={16} className="sm:hidden" />
      <LogOut size={TOKENS.ICON_SIZES.MD} className="hidden sm:block" />
    </button>
  </div>
);

export const WorkerHeader = ({ user, isOnline, setShowSettings, handleLogout, onOpenHistory }: { user: UserData; isOnline: boolean; setShowSettings: (s: boolean) => void; handleLogout: () => void; onOpenHistory?: () => void }) => (
  <header className="flex flex-nowrap sm:flex-wrap items-center justify-between gap-2 sm:gap-3 px-3 py-3 sm:px-6 sm:py-4 bg-surface/90 sm:bg-transparent border-b border-border shadow-sm backdrop-blur-2xl sticky top-0 z-30">
    <WorkerBrand user={user} />
    <WorkerActions user={user} isOnline={isOnline} setShowSettings={setShowSettings} handleLogout={handleLogout} onOpenHistory={onOpenHistory} />
  </header>
);

interface SelectOptions {
  zones: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

const ReportFormFields = ({ form, companyData }: { form: UseFormReturn<ReportFormData>; companyData?: SelectOptions | null }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
      <div className="w-full">
        <label htmlFor="zoneId" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1.5">{APP_STRINGS.WORKER.ZONE_PLACEHOLDER}</label>
        <select id="zoneId" {...form.register('zoneId')} className="w-full h-11 sm:h-13 bg-background border border-border focus:border-primary rounded-xl sm:rounded-2xl px-3.5 sm:px-5 text-xs sm:text-sm text-text-main outline-none shadow-sm transition-all cursor-pointer hover:border-primary/50">
          <option value="">{APP_STRINGS.WORKER.ZONE_PLACEHOLDER}</option>
          {companyData?.zones?.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
        {form.formState.errors.zoneId && <p className="text-xs-tight text-danger mt-1 px-1">{form.formState.errors.zoneId.message?.toString()}</p>}
      </div>
      <div className="w-full">
        <label htmlFor="categoryId" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1.5">{APP_STRINGS.WORKER.CATEGORY_PLACEHOLDER}</label>
        <select id="categoryId" {...form.register('categoryId')} className="w-full h-11 sm:h-13 bg-background border border-border focus:border-primary rounded-xl sm:rounded-2xl px-3.5 sm:px-5 text-xs sm:text-sm text-text-main outline-none shadow-sm transition-all cursor-pointer hover:border-primary/50">
          <option value="">{APP_STRINGS.WORKER.CATEGORY_PLACEHOLDER}</option>
          {companyData?.categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {form.formState.errors.categoryId && <p className="text-xs-tight text-danger mt-1 px-1">{form.formState.errors.categoryId.message?.toString()}</p>}
      </div>
    </div>
    <div>
      <label htmlFor="notes" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1.5">{APP_STRINGS.WORKER.NOTES_PLACEHOLDER}</label>
      <textarea id="notes" {...form.register('notes')} placeholder={APP_STRINGS.WORKER.NOTES_PLACEHOLDER} className="w-full p-3.5 sm:p-5 bg-background border border-border focus:border-primary rounded-2xl sm:rounded-3xl text-xs sm:text-sm min-h-24 sm:min-h-32 resize-none outline-none shadow-sm transition-all placeholder:text-text-muted/50 hover:border-primary/50" />
    </div>
  </>
);

const ReportSubmitButton = ({ isSubmitting, showSuccess }: { isSubmitting: boolean; showSuccess: boolean }) => (
  <motion.button
    type="submit"
    whileHover={{ scale: 1.01, y: -1 }}
    whileTap={{ scale: 0.98 }}
    disabled={isSubmitting || showSuccess}
    className="w-full h-12 sm:h-14 bg-primary sm:hover:bg-primary-hover disabled:bg-surface disabled:text-text-muted disabled:border disabled:border-border text-text-inverse text-xs sm:text-sm font-bold uppercase tracking-widest rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl shadow-primary/20 flex items-center justify-center gap-2.5 sm:gap-3 relative overflow-hidden cursor-pointer"
  >
    {showSuccess && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 bg-success z-0" />}
    <div className="relative z-10 flex items-center gap-2 sm:gap-3">
      {isSubmitting ? <RefreshCw className="animate-spin" size={TOKENS.ICON_SIZES.MD} /> : showSuccess ? <CheckCircle2 size={TOKENS.ICON_SIZES.MD} /> : <motion.div animate={{ x: [0, 4, 0] }} transition={TOKENS.TRANSITION.ARROW}><Send size={TOKENS.ICON_SIZES.MD} /></motion.div>}
      {isSubmitting ? APP_STRINGS.UI.LOADING : showSuccess ? APP_STRINGS.UI.REPORT_SAVED_LOCAL : APP_STRINGS.UI.SUBMIT_REPORT}
    </div>
  </motion.button>
);

export const ReportForm = ({ form, onSubmit, isSubmitting, showSuccess, photoBlob, companyData }: { form: UseFormReturn<ReportFormData>; onSubmit: (d: ReportFormData) => void; isSubmitting: boolean; showSuccess: boolean; photoBlob: Blob | null; companyData?: SelectOptions | null }) => {
  if (!photoBlob) return null;
  return (
    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-3.5 sm:gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <ReportFormFields form={form} companyData={companyData} />
      <ReportSubmitButton isSubmitting={isSubmitting} showSuccess={showSuccess} />
    </motion.form>
  );
};
