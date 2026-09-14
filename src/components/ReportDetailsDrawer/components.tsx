import { useRef, useEffect } from 'react';
import { Calendar, MapPin, Send, RefreshCw, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FieldReport } from '../../services/report.service';
import { REPORT_STATUS } from '../../constants/enums';
import { APP_STRINGS } from '../../constants/strings';
import { supabase } from '../../lib/supabase';
import { TABLES } from '../../constants/tables';

const parseReportData = (report: FieldReport) => {
  const emp = Array.isArray(report.employees) ? report.employees[0] : report.employees;
  const reporterName = emp?.full_name || emp?.email?.split('@')[0] || APP_STRINGS.MAP.UNKNOWN_REPORTER;
  const zoneName = Array.isArray(report.zones) ? report.zones[0]?.name : report.zones?.name;
  const categoryName = Array.isArray(report.report_categories) ? report.report_categories[0]?.name : report.report_categories?.name;
  return { reporterName, zoneName, categoryName };
};

export function ReportImage({ report }: { report: FieldReport }) {
  const imageUrl = supabase.storage.from(TABLES.REPORTS_MEDIA).getPublicUrl(report.image_url).data.publicUrl;
  const isResolved = report.status === REPORT_STATUS.Resolved;
  const isPending = report.status === REPORT_STATUS.Pending;

  return (
    <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-background relative shrink-0">
      <img src={imageUrl} alt={APP_STRINGS.MAP.REPORT_IMAGE_ALT} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2RiZTJhZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='; }} />
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-background/90 backdrop-blur-sm border border-border text-[9px] sm:text-[10px] font-bold uppercase flex items-center gap-1 shadow-sm">
        {isResolved ? <CheckCircle size={10} className="text-success" /> : isPending ? <Clock size={10} className="text-warning" /> : <AlertTriangle size={10} className="text-danger" />}
        <span className={isResolved ? 'text-success' : isPending ? 'text-warning' : 'text-danger'}>{report.status}</span>
      </div>
    </div>
  );
}

export function ReportMeta({ report, onClose }: { report: FieldReport; onClose: () => void }) {
  const { reporterName, zoneName, categoryName } = parseReportData(report);

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-border/50">
      <h3 className="text-sm sm:text-base font-bold text-text-main">{categoryName || APP_STRINGS.MAP.NEW_REPORT_RECEIVED}</h3>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-2xs sm:text-xs text-text-muted">
          <Calendar size={12} className="text-primary" />
          <span>{report.created_at ? format(new Date(report.created_at), 'dd MMM yyyy, HH:mm', { locale: id }) : APP_STRINGS.MAP.UNKNOWN_REPORTER}</span>
        </div>
        <div className="bg-background/50 rounded-xl overflow-hidden border border-border/50">
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-surface/50">
            <div className="flex items-center gap-1.5 text-2xs sm:text-xs text-text-main font-bold truncate">
              <MapPin size={12} className="text-primary shrink-0" />
              <span className="truncate">{zoneName || APP_STRINGS.MAP.UNKNOWN_REPORTER}</span>
            </div>
            <button onClick={() => { window.dispatchEvent(new CustomEvent('focus-map-report', { detail: { lat: report.latitude, lng: report.longitude } })); onClose(); }} className="px-2 py-1 sm:px-2.5 sm:py-1.5 bg-primary sm:hover:bg-primary-hover text-text-inverse text-[9px] font-bold uppercase tracking-wider rounded-md transition-all shrink-0">
              Lihat di Peta
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2.5 mt-1 bg-background/50 p-2.5 rounded-lg border border-border/50">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">{reporterName.substring(0, 1)}</div>
        <div className="min-w-0"><p className="text-[9px] text-text-muted uppercase tracking-wider font-bold">{APP_STRINGS.MAP.REPORTER}</p><p className="text-xs font-bold text-text-main truncate">{reporterName}</p></div>
      </div>
      {report.notes && <div className="mt-1 bg-surface border border-border rounded-lg p-2.5 relative"><MessageSquare size={10} className="absolute top-2.5 left-2.5 text-text-muted/50" /><p className="text-xs text-text-main pl-5 leading-relaxed italic">"{report.notes}"</p></div>}
    </div>
  );
}

export function ReportThread({ report }: { report: FieldReport }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [report?.report_comments]);

  return (
    <div className="flex-1 flex flex-col gap-3">
      <h4 className="text-2xs sm:text-xs font-bold text-text-muted uppercase tracking-wider">{APP_STRINGS.MAP.ACTIVITY_LOG}</h4>
      <div className="flex flex-col gap-2">
        {report.report_comments?.map((comment: { employees?: { full_name?: string } | { full_name?: string }[], created_at: string, content: string }, idx: number) => (
          <div key={idx} className="flex flex-col gap-0.5 bg-background/50 p-2.5 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-primary">{Array.isArray(comment.employees) ? comment.employees[0]?.full_name : comment.employees?.full_name || APP_STRINGS.MAP.SYSTEM}</span>
              <span className="text-[9px] text-text-muted">{format(new Date(comment.created_at), 'dd MMM, HH:mm', { locale: id })}</span>
            </div>
            <p className="text-xs text-text-main leading-relaxed">{comment.content}</p>
          </div>
        ))}
        {(!report.report_comments || report.report_comments.length === 0) && (
          <div className="text-center py-4 text-text-muted/50 flex flex-col items-center"><MessageSquare size={20} className="mb-1 opacity-50" /><p className="text-2xs">{APP_STRINGS.MAP.NO_COMMENTS}</p></div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

const updateSchema = z.object({ status: z.string(), comment: z.string().optional() });
export type UpdateFormValues = z.infer<typeof updateSchema>;

export function ReportActionForm({ report, isPending, onSubmit }: { report: FieldReport, isPending: boolean, onSubmit: (data: UpdateFormValues) => void }) {
  const form = useForm<UpdateFormValues>({ resolver: zodResolver(updateSchema), defaultValues: { status: report.status || REPORT_STATUS.Pending, comment: '' } });
  const statusValue = useWatch({ control: form.control, name: 'status' }) || report.status;
  const commentValue = useWatch({ control: form.control, name: 'comment' }) || '';

  useEffect(() => { form.setValue('status', report.status); }, [report.status, form]);

  return (
    <div className="p-3 sm:p-4 border-t border-border bg-background shrink-0">
      <form onSubmit={form.handleSubmit((d) => { onSubmit(d); form.setValue('comment', ''); })} className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider w-14">{APP_STRINGS.MAP.STATUS}</span>
          <select {...form.register('status')} className="flex-1 h-8 sm:h-9 text-2xs sm:text-xs font-bold bg-surface border border-border rounded-md px-2 outline-none text-text-main uppercase shadow-sm cursor-pointer sm:hover:border-primary/50 transition-colors">
            <option value={REPORT_STATUS.Pending}>{APP_STRINGS.MAP.STATUS_PENDING}</option>
            <option value={REPORT_STATUS.Investigating}>{APP_STRINGS.MAP.STATUS_INVESTIGATING}</option>
            <option value={REPORT_STATUS.Resolved}>{APP_STRINGS.MAP.STATUS_RESOLVED}</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input type="text" {...form.register('comment')} placeholder={APP_STRINGS.MAP.COMMENT_PLACEHOLDER} className="flex-1 h-8 sm:h-9 text-2xs sm:text-xs px-3 bg-surface border border-border rounded-md outline-none text-text-main placeholder-text-muted/50 focus:border-primary/50 transition-colors shadow-sm" autoComplete="off" />
          <button type="submit" disabled={isPending || (statusValue === report.status && !commentValue.trim())} className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-primary sm:hover:bg-primary-hover disabled:bg-surface disabled:text-text-muted disabled:border disabled:border-border text-text-inverse rounded-md transition-all flex items-center justify-center shadow-sm">
            {isPending ? <RefreshCw className="animate-spin" size={12} /> : <Send size={12} />}
          </button>
        </div>
      </form>
    </div>
  );
}

