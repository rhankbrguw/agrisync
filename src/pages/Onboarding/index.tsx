import { AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { OnboardingChoice, OnboardingWorkerWait, OnboardingAdminForm, OnboardingWorkerForm } from './components';
import { useOnboardingFlow } from '../../hooks/useOnboardingFlow';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function Onboarding() {
  useDocumentTitle(APP_STRINGS.TITLES.ONBOARDING);
  const {
    view,
    setView,
    loading,
    form,
    workerForm,
    user,
    refreshUser,
    handleRegister,
    handleRequestAccess,
    handleLogout,
  } = useOnboardingFlow();

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-surface/80 backdrop-blur-md border border-border rounded-xl text-text-muted hover:text-text-main sm:hover:bg-surface transition-all text-xs font-bold uppercase tracking-widest shadow-lg">
          <LogOut size={TOKENS.ICON_SIZES.MD} /> {APP_STRINGS.ONBOARDING.LOGOUT}
        </button>
        <ThemeToggle />
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
        <div className="absolute -top-1/4 right-12 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 -left-12 w-1/2 h-1/2 bg-info/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm sm:max-w-md bg-surface/80 backdrop-blur-xl border border-border p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl relative z-10 overflow-hidden min-h-80 sm:min-h-96 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {view === 'CHOICE' && <OnboardingChoice setView={setView} />}
          {view === 'WORKER_FORM' && <OnboardingWorkerForm form={workerForm} onSubmit={handleRequestAccess} isLoading={loading} setView={setView} />}
          {view === 'WORKER_WAIT' && <OnboardingWorkerWait email={user?.email} setView={setView} onRefresh={refreshUser} />}
          {view === 'ADMIN' && <OnboardingAdminForm form={form} onSubmit={handleRegister} isLoading={loading} setView={setView} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
