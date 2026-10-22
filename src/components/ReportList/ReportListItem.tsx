import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Maximize2, MessageSquare } from 'lucide-react';
import type { FieldReport } from '../../services/report.service';
import { REPORT_STATUS } from '../../constants/enums';
import { supabase } from '../../lib/supabase';
import { TABLES } from '../../constants/tables';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { parseReportData, parseLatestCommentData } from '../../utils/reportParser';

const ReportThumbnail = ({ imageUrl, status }: { imageUrl: string; status: string }) => {
  const isResolved = status === REPORT_STATUS.Resolved;
  const isPending = status === REPORT_STATUS.Pending;

  return (
    <div className="w-18 h-18 sm:w-32 sm:h-auto shrink-0 rounded-lg overflow-hidden bg-background relative group/img self-center sm:self-stretch">
      <img
        src={imageUrl}
        alt={APP_STRINGS.MAP.REPORT_IMAGE_ALT}
        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('data:image')) {
            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2RiZTJhZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
          }
        }}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
        <Maximize2 className="text-white" size={20} />
      </div>
      <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-background/90 backdrop-blur-sm border border-border text-[8px] sm:text-[9px] font-bold uppercase flex items-center gap-0.5 sm:gap-1 shadow-xs">
        {isResolved ? <CheckCircle size={9} className="text-success" /> : isPending ? <Clock size={9} className="text-warning" /> : <AlertTriangle size={9} className="text-danger" />}
        <span className={isResolved ? 'text-success' : isPending ? 'text-warning' : 'text-danger'}>
          {isResolved ? APP_STRINGS.MAP.STATUS_RESOLVED : isPending ? APP_STRINGS.MAP.STATUS_PENDING : APP_STRINGS.MAP.STATUS_INVESTIGATING}
        </span>
      </div>
    </div>
  );
};

interface ReportMetaProps {
  categoryName?: string;
  severity?: string | null;
  zoneName?: string;
  createdAt?: string;
  notes?: string;
}

const ReportMeta = ({ categoryName, severity, zoneName, createdAt, notes }: ReportMetaProps) => (
  <div>
    <div className="flex justify-between items-start gap-1 mb-0.5">
      <h3 className="text-xs sm:text-sm font-bold text-text-main truncate">{categoryName || APP_STRINGS.MAP.REPORT_FIELD}</h3>
      {severity && (
        <span className={`shrink-0 px-1.5 py-0.2 rounded text-[7px] sm:text-[8px] font-bold uppercase tracking-wider border ${
          severity === 'CRITICAL' ? 'bg-danger/10 text-danger border-danger/20' : severity === 'MEDIUM' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20'
        }`}>
          {severity}
        </span>
      )}
    </div>
    <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-text-muted font-medium mb-1">
      <span className="flex items-center gap-0.5 truncate"><MapPin size={9} className="shrink-0" /> {zoneName || APP_STRINGS.MAP.UNKNOWN_ZONE}</span>
      <span className="flex items-center gap-0.5 shrink-0"><Calendar size={9} className="shrink-0" /> {createdAt ? format(new Date(createdAt), 'dd MMM yyyy, HH:mm', { locale: id }) : APP_STRINGS.MAP.JUST_NOW}</span>
    </div>
    {notes && <p className="text-[10px] sm:text-xs text-text-muted/80 line-clamp-1 italic bg-background/50 px-1.5 py-0.5 sm:p-1.5 rounded border border-border/50 hidden sm:block">"{notes}"</p>}
  </div>
);

const ReportFooter = ({ reporterName, latestComment }: { reporterName: string; latestComment: { commenterName: string; content: string } | null }) => (
  <div className="mt-1.5 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-border/50 flex items-center justify-between gap-2">
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] sm:text-[10px] font-bold uppercase">{reporterName.substring(0, 1)}</div>
      <span className="text-[9px] sm:text-[10px] font-bold text-text-main truncate max-w-[90px] sm:max-w-[120px]">{reporterName}</span>
    </div>
    <div className="flex items-center gap-1.5 justify-end flex-1 min-w-0">
      {latestComment ? (
        <div className="text-[8px] sm:text-[9px] text-text-muted flex items-center gap-1 bg-surface px-1.5 py-0.5 rounded border border-border truncate max-w-[140px] sm:max-w-[200px]">
          <MessageSquare size={9} className="text-primary shrink-0" /><span className="font-bold truncate">{latestComment.commenterName}</span>: <span className="truncate">{latestComment.content}</span>
        </div>
      ) : (
        <div className="text-[8px] sm:text-[9px] text-text-muted/60 hidden sm:flex items-center gap-1"><MessageSquare size={9} /><span>{APP_STRINGS.MAP.NO_COMMENTS}</span></div>
      )}
      <button className="shrink-0 h-6 sm:h-7 px-2 sm:px-2.5 bg-background border border-border group-hover:border-primary/50 text-text-main text-[9px] sm:text-[10px] font-bold uppercase rounded transition-all flex items-center gap-1 shadow-xs">
        <span className="hidden sm:inline">{APP_STRINGS.MAP.DETAIL_AND_CHAT}</span><span className="text-primary group-hover:translate-x-0.5 transition-transform">&rarr;</span>
      </button>
    </div>
  </div>
);

export const ReportListItem = React.memo(({ report, onClick }: { report: FieldReport, onClick: (report: FieldReport) => void }) => {
  const imageUrl = supabase.storage.from(TABLES.REPORTS_MEDIA).getPublicUrl(report.image_url).data.publicUrl;
  const { reporterName, zoneName, severity, categoryName } = parseReportData(report);
  const latestComment = parseLatestCommentData(report);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={TOKENS.TRANSITION.FAST}
      onClick={() => onClick(report)}
      className="w-full bg-surface border border-border rounded-xl p-2.5 sm:p-3.5 flex flex-row gap-2.5 sm:gap-4 sm:hover:border-primary/50 transition-colors shadow-xs cursor-pointer group relative"
    >
      <ReportThumbnail imageUrl={imageUrl} status={report.status} />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <ReportMeta categoryName={categoryName} severity={severity} zoneName={zoneName} createdAt={report.created_at} notes={report.notes} />
        <ReportFooter reporterName={reporterName} latestComment={latestComment} />
      </div>
    </motion.div>
  );
});
