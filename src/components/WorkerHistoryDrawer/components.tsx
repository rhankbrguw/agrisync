import { parseReportData } from '../../utils/reportParser';
import { MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { APP_STRINGS } from '../../constants/strings';
import type { FieldReport } from '../../services/report.service';

export function ReportThreadView({ 
  report, 
  onBack 
}: { 
  report: FieldReport; 
  onBack: () => void 
}) {
  const { categoryName, zoneName } = parseReportData(report);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background/50">
      <button 
        onClick={onBack}
        className="px-5 py-3 border-b border-border/50 text-xs font-bold text-text-muted hover:text-text-main flex items-center gap-2 bg-background shrink-0"
      >
        &larr; {APP_STRINGS.WORKER.HISTORY_BACK}
      </button>
      
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 custom-scrollbar">
        <div className="flex flex-col gap-2 pb-4 border-b border-border/50">
          <h3 className="text-sm font-bold text-text-main">{categoryName}</h3>
          <div className="text-[10px] text-text-muted flex gap-3">
            <span className="flex items-center gap-1"><MapPin size={10} /> {zoneName}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {report.status}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Worker's own note */}
          {report.notes && (
            <div className="flex flex-col gap-1 items-end ml-8">
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-2xl rounded-tr-sm">
                <p className="text-xs text-text-main">{report.notes}</p>
              </div>
              <span className="text-[8px] text-text-muted font-bold uppercase">{APP_STRINGS.WORKER.HISTORY_YOUR_REPORT}</span>
            </div>
          )}

          {/* Supervisor's replies */}
          {report.report_comments?.map((c, i) => (
            <div key={i} className="flex flex-col gap-1 items-start mr-8">
              <div className="bg-surface border border-border p-3 rounded-2xl rounded-tl-sm shadow-sm">
                <p className="text-xs text-text-main leading-relaxed">{c.content}</p>
              </div>
              <span className="text-[8px] text-text-muted font-bold uppercase">
                {Array.isArray(c.employees) ? c.employees[0]?.full_name : c.employees?.full_name || APP_STRINGS.SHARE.ROLE_SUPERVISOR} • {format(new Date(c.created_at), 'dd/MM HH:mm')}
              </span>
            </div>
          ))}
          
          {(!report.report_comments || report.report_comments.length === 0) && (
            <div className="text-center py-4 opacity-50 text-xs text-text-muted italic">{APP_STRINGS.WORKER.HISTORY_NO_REPLY}</div>
          )}
        </div>
      </div>
    </div>
  );
}
