import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import type { FieldReport } from '../../services/report.service';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { ReportListItem } from './ReportListItem';
import { DateFilterControl, StatusChips } from './components';
import { ReportDetailsDrawer } from '../ReportDetailsDrawer';
import { PaginationFooter } from '../PaginationFooter';
import { useReportList } from '../../hooks/useReportList';

export function ReportList() {
  const {
    isLoading, filterStatus, setFilterStatus, searchQuery, setSearchQuery,
    filterDate, setFilterDate, selectedReport, setSelectedReport,
    currentPage, setCurrentPage, itemsPerPage, totalPages, paginatedReports,
    totalFiltered
  } = useReportList();

  if (isLoading) {
    return (
      <div className="w-full h-64 sm:h-[28rem] flex items-center justify-center bg-background/50 border border-border rounded-xl sm:rounded-2xl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 h-64 sm:h-[28rem] bg-background/50 border border-border rounded-xl sm:rounded-2xl overflow-hidden flex flex-col relative shadow-sm">
      <div className="px-3 py-2.5 sm:px-5 sm:py-3 bg-surface/80 border-b border-border backdrop-blur-md flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-between sm:items-center z-10 relative w-full max-w-full min-w-0">
        <div className="relative w-full sm:w-60 lg:w-72 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={APP_STRINGS.MAP.SEARCH_REPORT_PLACEHOLDER}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 sm:h-9 pl-9 pr-3 bg-background border border-border rounded-lg text-xs text-text-main placeholder-text-muted/50 focus:border-primary outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-hide w-full sm:w-auto sm:justify-end sm:ml-auto min-w-0 shrink-0">
          <StatusChips filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
          <div className="h-4 w-px bg-border mx-0.5 shrink-0" />
          <DateFilterControl filterDate={filterDate} onDateChange={setFilterDate} onDateClear={() => setFilterDate('')} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2.5 sm:p-5 flex flex-col bg-background/30 custom-scrollbar">
        <div className="space-y-2.5 sm:space-y-3 flex-1">
          <AnimatePresence mode="popLayout">
            {paginatedReports.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-text-muted py-6">
                <motion.div animate={{ y: [0, -8, 0] }} transition={TOKENS.TRANSITION.FLOAT}><Filter size={40} className="mb-3 text-primary/30" /></motion.div>
                <p className="text-xs sm:text-sm font-medium">{APP_STRINGS.UI.NO_MATCHING_REPORTS}</p>
              </motion.div>
            ) : (
              paginatedReports.map((report: FieldReport) => <ReportListItem key={report.id} report={report} onClick={setSelectedReport} />)
            )}
          </AnimatePresence>
        </div>
        <PaginationFooter currentPage={currentPage} totalPages={totalPages} itemsPerPage={itemsPerPage} totalItems={totalFiltered} entityName={APP_STRINGS.MAP.REPORTS_LOWER} onPageChange={setCurrentPage} />
      </div>
      {selectedReport && <ReportDetailsDrawer report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  );
}
