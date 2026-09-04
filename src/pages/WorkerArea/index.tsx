import { useWorkerStore } from '../../store/workerStore';
import { motion } from 'framer-motion';
import { CameraCapture } from '../../components/CameraCapture';
import { ReportQueueUI } from '../../components/ReportQueueUI';
import { WorkerMap } from '../../components/WorkerMap';
import { SettingsModal } from '../../components/SettingsModal';
import { WorkerHistoryDrawer } from '../../components/WorkerHistoryDrawer';
import { WorkerHeader, ReportForm } from './components';
import { useWorkerReport } from '../../hooks/useWorkerReport';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import type { User } from '../../store/authStore';

const WorkerBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none hidden sm:block">
    <div className="absolute -top-1/4 -left-12 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
    <div className="absolute top-3/4 -right-12 w-1/2 h-1/2 bg-info/10 rounded-full blur-3xl" />
  </div>
);

export function WorkerArea() {
  const {
    user,
    companyData,
    isOnline,
    form,
    photoBlob,
    setPhotoBlob,
    showSettings,
    setShowSettings,
    isSubmitting,
    showSuccess,
    onSubmit,
    handleLogout
  } = useWorkerReport();

  const showHistory = useWorkerStore(state => state.showHistory);
  const setShowHistory = useWorkerStore(state => state.setShowHistory);

  useDocumentTitle(showSettings ? APP_STRINGS.TITLES.PROFILE : showHistory ? APP_STRINGS.TITLES.INBOX : APP_STRINGS.TITLES.WORKER_AREA);

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-0 sm:p-6 lg:p-10 bg-background overflow-hidden relative">
      <WorkerBackground />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={TOKENS.TRANSITION.PAGE} className="w-full max-w-2xl min-h-dvh sm:min-h-0 bg-background sm:bg-surface/60 sm:backdrop-blur-3xl sm:rounded-3xl sm:border sm:border-border sm:shadow-2xl flex flex-col relative z-10">
        <WorkerHeader user={user as User} isOnline={isOnline} setShowSettings={setShowSettings} handleLogout={handleLogout} onOpenHistory={() => setShowHistory(true)} />
        <main className="flex-1 w-full p-3.5 sm:p-6 lg:p-8 flex flex-col justify-center gap-4 sm:gap-6 overflow-y-auto custom-scrollbar">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full">
            <CameraCapture onCapture={setPhotoBlob} />
          </motion.div>
          
          <ReportForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} showSuccess={showSuccess} photoBlob={photoBlob} companyData={companyData} />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col gap-4 sm:gap-6">
            <WorkerMap />
            <ReportQueueUI />
          </motion.div>
        </main>
      </motion.div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <WorkerHistoryDrawer isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}
