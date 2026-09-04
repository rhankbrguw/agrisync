import { useLocalQueue } from '../hooks/useLocalQueue';
import type { ReportQueue } from '../lib/db';
import { APP_STRINGS } from '../constants/strings';
import { Clock, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKENS } from '../constants/tokens';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const formatTime = (timestamp: string | number) => {
  return format(new Date(timestamp), 'EEEE, dd MMM yyyy • HH:mm', { locale: id });
};

const QueueItem = ({ report }: { report: ReportQueue }) => (
  <motion.li
    layout
    variants={{
      hidden: { opacity: 0, x: -20, height: 0 },
      visible: { opacity: 1, x: 0, height: 'auto' }
    }}
    exit={{ opacity: 0, x: 20, height: 0, margin: 0 }}
    transition={{ type: TOKENS.ANIMATION.SPRING, stiffness: 300, damping: 25 }}
    className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 bg-background rounded-xl sm:rounded-2xl border border-border/40 hover:border-primary/30 transition-colors"
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-surface rounded-lg sm:rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0 border border-border/50">
      <ImageIcon size={TOKENS.ICON_SIZES.MD} strokeWidth={1.5} className="sm:hidden" />
      <ImageIcon size={TOKENS.ICON_SIZES.LG} strokeWidth={1.5} className="hidden sm:block" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-2xs sm:text-xs text-text-main font-bold truncate tracking-tight">
        {APP_STRINGS.UI.LAT_LABEL}: {report.latitude.toFixed(5)}, {APP_STRINGS.UI.LNG_LABEL}: {report.longitude.toFixed(5)}
      </p>
      <div className="flex items-center gap-1.5 text-xs-tight sm:text-xs-loose text-text-muted mt-0.5 sm:mt-1 font-medium">
        <Clock size={TOKENS.ICON_SIZES.SM} />
        {formatTime(report.timestamp)}
      </div>
    </div>
  </motion.li>
);

export function ReportQueueUI() {
  const { pendingReports } = useLocalQueue();

  if (pendingReports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full text-center p-4 sm:p-6 bg-surface rounded-2xl sm:rounded-3xl border border-border/50 shadow-sm"
      >
        <p className="text-text-muted text-xs sm:text-sm font-medium">{APP_STRINGS.UI.QUEUE_EMPTY}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-surface rounded-2xl sm:rounded-3xl border border-border/50 shadow-lg overflow-hidden flex flex-col"
    >
      <div className="bg-background/50 px-3.5 py-3 sm:px-5 sm:py-4 border-b border-border/50 flex justify-between items-center backdrop-blur-md">
        <h3 className="font-bold text-text-main text-xs sm:text-sm tracking-tight">{APP_STRINGS.UI.QUEUE_TITLE}</h3>
        <motion.span
          key={pendingReports.length}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="bg-warning text-surface text-2xs sm:text-xs-tight font-extrabold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-wider shadow-sm"
        >
          {pendingReports.length} {APP_STRINGS.UI.ITEMS_WAITING}
        </motion.span>
      </div>

      <motion.ul 
        initial={TOKENS.ANIMATION.HIDDEN}
        animate={TOKENS.ANIMATION.VISIBLE}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="max-h-56 overflow-y-auto custom-scrollbar p-3 space-y-2 relative"
      >
        <AnimatePresence>
          {pendingReports.map((report) => (
            <QueueItem key={report.id} report={report} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}
