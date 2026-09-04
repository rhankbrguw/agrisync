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

export const ReportListItem = React.memo(({ report, onClick }: { report: FieldReport, onClick: (report: FieldReport) => void }) => {
  const imageUrl = supabase.storage.from(TABLES.REPORTS_MEDIA).getPublicUrl(report.image_url).data.publicUrl;
  
  const { reporterName, zoneName, severity, categoryName } = parseReportData(report);
  const latestComment = parseLatestCommentData(report);
  
  const isResolved = report.status === REPORT_STATUS.Resolved;
  const isPending = report.status === REPORT_STATUS.Pending;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={TOKENS.TRANSITION.FAST}
      onClick={() => onClick(report)}
      className="w-full bg-surface border border-border rounded-xl p-3 flex flex-col sm:flex-row gap-4 sm:hover:border-primary/50 transition-colors shadow-sm cursor-pointer group relative"
    >
      <div className="w-full sm:w-36 h-32 sm:h-auto shrink-0 rounded-lg overflow-hidden bg-background relative group/img">
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
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
          <Maximize2 className="text-white" size={24} />
        </div>
        <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border text-[9px] font-bold uppercase flex items-center gap-1">
          {isResolved ? <CheckCircle size={10} className="text-success" /> : isPending ? <Clock size={10} className="text-warning" /> : <AlertTriangle size={10} className="text-danger" />}
          <span className={isResolved ? 'text-success' : isPending ? 'text-warning' : 'text-danger'}>
            {isResolved ? APP_STRINGS.MAP.STATUS_RESOLVED : isPending ? APP_STRINGS.MAP.STATUS_PENDING : APP_STRINGS.MAP.STATUS_INVESTIGATING}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-bold text-text-main truncate pr-2">{categoryName || APP_STRINGS.MAP.REPORT_FIELD}</h3>
            {severity && (
              <span className={`shrink-0 px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-wider border ${severity === 'CRITICAL' ? 'bg-danger/10 text-danger border-danger/20' : severity === 'MEDIUM' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-success/10 text-success border-success/20'}`}>
                {severity}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-[10px] text-text-muted font-medium mb-2">
            <span className="flex items-center gap-1"><MapPin size={10} /> {zoneName || APP_STRINGS.MAP.UNKNOWN_ZONE}</span>
            <span className="flex items-center gap-1"><Calendar size={10} /> {report.created_at ? format(new Date(report.created_at), 'dd MMM yyyy, HH:mm', { locale: id }) : APP_STRINGS.MAP.JUST_NOW}</span>
          </div>
          
          {report.notes && (
            <p className="text-xs text-text-muted/80 line-clamp-2 leading-relaxed italic bg-background/50 p-2 rounded-md border border-border/50">
              "{report.notes}"
            </p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold uppercase">
              {reporterName.substring(0, 1)}
            </div>
            <span className="text-[10px] font-bold text-text-main">{reporterName}</span>
          </div>
          
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-end sm:items-center gap-2 justify-end flex-1">
            {latestComment ? (
              <div className="text-[9px] text-text-muted flex items-center gap-1 bg-surface px-2 py-1 rounded-md border border-border mr-auto sm:mr-2 w-full sm:w-auto truncate">
                <MessageSquare size={10} className="text-primary shrink-0" />
                <span className="font-bold truncate max-w-[60px] sm:max-w-[80px]">
                  {latestComment.commenterName}
                </span>: 
                <span className="truncate flex-1 min-w-[50px]">{latestComment.content}</span>
              </div>
            ) : (
              <div className="text-[9px] text-text-muted/60 flex items-center gap-1">
                <MessageSquare size={10} />
                <span>{APP_STRINGS.MAP.NO_COMMENTS}</span>
              </div>
            )}
            
            <button className="shrink-0 h-7 px-3 bg-background border border-border group-hover:border-primary/50 text-text-main text-[10px] font-bold uppercase rounded-md transition-all flex items-center gap-1.5 shadow-sm">
              <span>{APP_STRINGS.MAP.DETAIL_AND_CHAT}</span>
              <span className="text-primary group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});


