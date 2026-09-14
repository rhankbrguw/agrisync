import React, { useEffect } from 'react';
import { parseReportData } from '../utils/reportParser';
import { RefreshCw, Send, MessageSquare, MapPin } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { APP_STRINGS } from '../constants/strings';
import { useReportUpdate } from '../hooks/useReportUpdate';
import { REPORT_STATUS } from '../constants/enums';
import { TOKENS } from '../constants/tokens';
import type { FieldReport } from '../services/report.service';
import { supabase } from '../lib/supabase';
import { TABLES } from '../constants/tables';

const updateSchema = z.object({ status: z.string(), comment: z.string().optional() });
type UpdateFormValues = z.infer<typeof updateSchema>;

const ReportStatusForm = ({ form, onSubmit, isPending, statusValue, commentValue, currentStatus }: {
  form: ReturnType<typeof useForm<UpdateFormValues>>;
  onSubmit: (data: UpdateFormValues) => void;
  isPending: boolean;
  statusValue: string;
  commentValue: string;
  currentStatus: string;
}) => (
  <div className="w-full flex flex-col gap-1 mt-0.5">
    <div className="flex gap-1">
      <select {...form.register('status')} className="flex-1 h-7 text-[10px] font-bold bg-surface border border-border rounded-md px-1.5 outline-none text-text-main uppercase shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
        <option value={REPORT_STATUS.Pending}>{APP_STRINGS.MAP.STATUS_PENDING}</option>
        <option value={REPORT_STATUS.Investigating}>{APP_STRINGS.MAP.STATUS_INVESTIGATING}</option>
        <option value={REPORT_STATUS.Resolved}>{APP_STRINGS.MAP.STATUS_RESOLVED}</option>
      </select>
      <button 
        type="button" 
        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(onSubmit)(e as unknown as React.BaseSyntheticEvent); }}
        disabled={isPending || (statusValue === currentStatus && !commentValue.trim())} 
        className="h-7 px-3 bg-primary sm:hover:bg-primary-hover disabled:bg-surface disabled:text-text-muted disabled:border disabled:border-border text-text-inverse text-[10px] font-bold uppercase rounded-md transition-all flex items-center justify-center gap-1 shadow-sm"
      >
        {isPending ? <RefreshCw className="animate-spin" size={TOKENS.ICON_SIZES.SM} /> : <Send size={TOKENS.ICON_SIZES.SM} />}
      </button>
    </div>
    <div className="relative">
      <MessageSquare size={10} className="absolute top-1/2 -translate-y-1/2 left-2 text-text-muted/70" />
      <input 
        type="text" 
        {...form.register('comment')} 
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); form.handleSubmit(onSubmit)(); } }}
        placeholder={APP_STRINGS.MAP.COMMENT_PLACEHOLDER} 
        className="w-full h-7 text-[10px] pl-6 pr-2 bg-background border border-border rounded-md outline-none text-text-main placeholder-text-muted/50 focus:border-primary/50 transition-colors shadow-sm" 
      />
    </div>
  </div>
);

export function ReportDetailsCard({ report }: { report: FieldReport }) {
  const updateReport = useReportUpdate();
  const form = useForm<UpdateFormValues>({ resolver: zodResolver(updateSchema), defaultValues: { status: report.status, comment: '' } });
  const statusValue = useWatch({ control: form.control, name: 'status' }) || report.status;
  const commentValue = useWatch({ control: form.control, name: 'comment' }) || '';

  useEffect(() => { form.setValue('status', report.status); }, [report.status, form]);

  const onSubmit = async (data: UpdateFormValues) => {
    updateReport.mutate({
      reportId: report.id,
      status: data.status !== report.status ? data.status : undefined,
      comment: data.comment?.trim() ? data.comment : undefined,
    }, { onSuccess: (updated) => { if (updated) form.setValue('comment', ''); } });
  };

  const imageUrl = supabase.storage.from(TABLES.REPORTS_MEDIA).getPublicUrl(report.image_url).data.publicUrl;
  const { reporterName, zoneName, severity } = parseReportData(report);

  return (
    <div className="w-[75vw] max-w-[220px] sm:max-w-[260px] flex flex-col font-sans relative shadow-2xl rounded-xl border border-border/50 bg-background overflow-hidden">
      <div className="h-24 sm:h-32 w-full bg-surface relative group">
        <img 
          src={imageUrl} 
          alt={APP_STRINGS.MAP.REPORT_IMAGE_ALT} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-surface" 
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('data:image')) {
              target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2RiZTJhZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='; 
            }
          }} 
        />
      </div>
      <div className="p-2 sm:p-2.5 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div className="min-w-0 pr-1.5">
            <p className="text-[8px] sm:text-[9px] text-text-muted font-bold uppercase tracking-wider leading-none mb-0.5">{APP_STRINGS.MAP.REPORT_BY}</p>
            <p className="text-[10px] sm:text-xs text-text-main font-bold truncate w-full leading-none" title={reporterName}>{reporterName}</p>
          </div>
          {severity && <div className={`shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm ${severity === 'CRITICAL' ? 'bg-danger shadow-danger/30' : severity === 'MEDIUM' ? 'bg-warning shadow-warning/30' : 'bg-success shadow-success/30'}`} />}
        </div>
        <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1 mt-0.5">
          {zoneName ? (
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-text-muted font-medium min-w-0">
              <MapPin size={10} className="text-primary shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-[140px] leading-none">{zoneName}</span>
            </div>
          ) : <div />}
          <button onClick={() => window.open(`https://maps.google.com/?q=${report.latitude},${report.longitude}`, '_blank')} className="text-[8px] sm:text-[9px] text-primary sm:hover:text-primary-hover font-extrabold uppercase shrink-0 transition-colors leading-none">GMAPS ↗</button>
        </div>
        {report.notes && <p className="text-[9px] sm:text-[10px] text-text-muted italic bg-surface/50 px-1.5 py-1 rounded border border-border/50 line-clamp-2 leading-tight mt-0.5">"{report.notes}"</p>}
        <ReportStatusForm form={form} onSubmit={onSubmit} isPending={updateReport.isPending} statusValue={statusValue} commentValue={commentValue} currentStatus={report.status} />
      </div>
    </div>
  );
}

