import { APP_STRINGS } from '../../constants/strings';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { FieldReport } from '../../services/report.service';
import { useReportUpdate } from '../../hooks/useReportUpdate';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { TOKENS } from '../../constants/tokens';
import { ReportImage, ReportMeta, ReportThread, ReportActionForm, type UpdateFormValues } from './components';

export function ReportDetailsDrawer({ 
  report, 
  onClose 
}: { 
  report: FieldReport | null; 
  onClose: () => void;
}) {
  const updateReport = useReportUpdate();
  useDocumentTitle(APP_STRINGS.TITLES.INBOX);

  if (!report) return null;

  const onSubmit = (data: UpdateFormValues) => {
    updateReport.mutate({
      reportId: report.id,
      status: data.status !== report.status ? data.status : undefined,
      comment: data.comment?.trim() ? data.comment : undefined,
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={TOKENS.TRANSITION.DRAWER}
          className="relative w-full sm:w-[400px] h-full bg-surface border-l border-border shadow-2xl flex flex-col z-10"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface/50 backdrop-blur-md shrink-0">
            <div>
              <h2 className="text-sm font-bold text-text-main">{APP_STRINGS.MAP.REPORT_DETAILS}</h2>
              <p className="text-[10px] text-text-muted mt-0.5">{report.id.substring(0, 8)}</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-background sm:hover:bg-border/50 flex items-center justify-center text-text-main transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-5">
            <ReportImage report={report} />
            <ReportMeta report={report} onClose={onClose} />
            <ReportThread report={report} />
          </div>

          <ReportActionForm 
            report={report} 
            isPending={updateReport.isPending} 
            onSubmit={onSubmit} 
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
