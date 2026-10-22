import { parseReportData } from '../../utils/reportParser';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, ChevronRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useReports } from '../../hooks/useReports';
import { REPORT_STATUS } from '../../constants/enums';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { supabase } from '../../lib/supabase';
import { TABLES } from '../../constants/tables';
import type { FieldReport } from '../../services/report.service';
import { useAuthStore, type AuthState } from '../../store/authStore';
import { APP_CONFIG } from '../../constants/config';
import { ReportThreadView } from './components';
import { PaginationFooter } from '../PaginationFooter';

export function WorkerHistoryDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: reports = [], isLoading } = useReports();
  const user = useAuthStore((state: AuthState) => state.user);
  const [selectedReport, setSelectedReport] = useState<FieldReport | null>(null);

  const myReports = useMemo(() => {
    return reports.filter((r: FieldReport) => {
      const { employeeData } = parseReportData(r);
      return employeeData?.email === user?.email;
    });
  }, [reports, user]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = APP_CONFIG.UI.ITEMS_PER_PAGE;
  const totalPages = Math.ceil(myReports.length / itemsPerPage);
  const paginatedReports = myReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={TOKENS.TRANSITION.DRAWER} className="relative w-full sm:w-[400px] h-full bg-surface border-l border-border shadow-2xl flex flex-col z-10">
            <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border flex items-center justify-between bg-surface/50 backdrop-blur-md shrink-0">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-text-main">{APP_STRINGS.WORKER.HISTORY_TITLE}</h2>
                <p className="text-[9px] sm:text-[10px] text-text-muted mt-0.5">{APP_STRINGS.WORKER.HISTORY_COUNT(myReports.length)}</p>
              </div>
              <button onClick={onClose} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background sm:hover:bg-border/50 flex items-center justify-center text-text-main transition-colors">
                <X size={14} className="sm:hidden" /><X size={16} className="hidden sm:block" />
              </button>
            </div>

            {!selectedReport ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center"><RefreshCw className="animate-spin text-primary opacity-50" size={20} /></div>
                ) : myReports.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50 py-8">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={TOKENS.TRANSITION.FLOAT}>
                      <MessageSquare size={40} className="mb-3 text-primary/50" />
                    </motion.div>
                    <p className="text-xs font-medium">{APP_STRINGS.WORKER.HISTORY_EMPTY}</p>
                    <p className="text-[10px] mt-1">{APP_STRINGS.WORKER.HISTORY_EMPTY_SUB}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 sm:gap-3">
                      {paginatedReports.map((report: FieldReport) => {
                        const { categoryName } = parseReportData(report);
                        const isResolved = report.status === REPORT_STATUS.Resolved;
                        const isPending = report.status === REPORT_STATUS.Pending;
                        return (
                          <div key={report.id} onClick={() => setSelectedReport(report)} className="p-2.5 sm:p-3 bg-background border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-all flex items-center gap-2.5 sm:gap-3 shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surface shrink-0 overflow-hidden">
                              <img src={supabase.storage.from(TABLES.REPORTS_MEDIA).getPublicUrl(report.image_url).data.publicUrl} alt={APP_STRINGS.MAP.REPORT_IMAGE_ALT} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-text-main truncate">{categoryName}</h4>
                              <p className="text-[9px] text-text-muted mt-0.5">{report.created_at ? format(new Date(report.created_at), 'dd MMM yyyy', { locale: id }) : ''}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${isResolved ? 'bg-success/10 text-success' : isPending ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                                  {isResolved ? APP_STRINGS.MAP.STATUS_RESOLVED : isPending ? APP_STRINGS.MAP.STATUS_PENDING : APP_STRINGS.MAP.STATUS_INVESTIGATING}
                                </span>
                                {report.report_comments && report.report_comments.length > 0 && (
                                  <span className="text-[8px] sm:text-[9px] text-primary flex items-center gap-1 font-bold"><MessageSquare size={10} /> {report.report_comments.length} Balasan</span>
                                )}
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-text-muted shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                    <PaginationFooter currentPage={currentPage} totalPages={totalPages} itemsPerPage={itemsPerPage} totalItems={myReports.length} onPageChange={setCurrentPage} compact />
                  </>
                )}
              </div>
            ) : (
              <ReportThreadView report={selectedReport} onBack={() => setSelectedReport(null)} />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

