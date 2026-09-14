import { useRef, type RefObject } from 'react';
import { Filter, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { REPORT_STATUS } from '../../constants/enums';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';

export interface DateFilterProps {
  filterDate: string;
  onDateChange: (date: string) => void;
  onDateClear: () => void;
}

interface DateSubProps {
  filterDate: string;
  onDateChange: (date: string) => void;
  onOpenPicker: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

const ActiveDateBadge = ({ filterDate, onDateChange, onDateClear, onOpenPicker, inputRef }: DateSubProps & { onDateClear: () => void }) => (
  <div onClick={onOpenPicker} className="relative inline-flex items-center rounded-lg bg-primary/10 border border-primary/30 text-primary shrink-0 transition-all shadow-xs overflow-hidden cursor-pointer">
    <input
      ref={inputRef}
      type="date"
      value={filterDate}
      onChange={(e) => onDateChange(e.target.value)}
      onClick={(e) => { try { if (typeof e.currentTarget.showPicker === 'function') e.currentTarget.showPicker(); } catch { /* Fallback */ } }}
      className="absolute inset-y-0 left-0 right-6 opacity-0 cursor-pointer z-10 w-[calc(100%-1.5rem)] h-full"
      aria-label={APP_STRINGS.MAP.CLEAR_DATE_FILTER}
    />
    <div className="inline-flex items-center gap-1.5 h-7 sm:h-8 pl-2 sm:pl-2.5 pr-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary" title={APP_STRINGS.MAP.CLEAR_DATE_FILTER}>
      <Calendar size={TOKENS.ICON_SIZES.SM} className="text-primary shrink-0" />
      <span>{format(new Date(filterDate), 'd MMM', { locale: id })}</span>
    </div>
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onDateClear(); }}
      className="relative z-20 h-7 sm:h-8 w-6 sm:w-7 flex items-center justify-center hover:bg-primary/20 text-primary transition-colors cursor-pointer"
      aria-label={APP_STRINGS.MAP.CLEAR_DATE_FILTER}
      title={APP_STRINGS.MAP.CLEAR_DATE_FILTER}
    >
      <X size={12} />
    </button>
  </div>
);

const EmptyDateButton = ({ filterDate, onDateChange, onOpenPicker, inputRef }: DateSubProps) => (
  <div onClick={onOpenPicker} className="relative inline-flex items-center rounded-lg bg-background border border-border hover:border-primary/50 text-text-muted hover:text-text-main shrink-0 transition-all shadow-xs overflow-hidden cursor-pointer">
    <input
      ref={inputRef}
      type="date"
      value={filterDate}
      onChange={(e) => onDateChange(e.target.value)}
      onClick={(e) => { try { if (typeof e.currentTarget.showPicker === 'function') e.currentTarget.showPicker(); } catch { /* Fallback */ } }}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      aria-label={APP_STRINGS.UI.DATE_COLUMN}
    />
    <div className="inline-flex items-center justify-center gap-1.5 h-7 sm:h-8 w-7.5 sm:w-auto px-0 sm:px-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider" title={APP_STRINGS.UI.DATE_COLUMN}>
      <Calendar size={TOKENS.ICON_SIZES.SM} className="text-text-muted shrink-0" />
      <span className="hidden sm:inline">{APP_STRINGS.UI.DATE_COLUMN}</span>
    </div>
  </div>
);

export const DateFilterControl = ({ filterDate, onDateChange, onDateClear }: DateFilterProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    const input = dateInputRef.current;
    if (input && typeof input.showPicker === 'function') {
      try { input.showPicker(); } catch { /* Handled natively by input click */ }
    }
  };

  return filterDate ? (
    <ActiveDateBadge filterDate={filterDate} onDateChange={onDateChange} onDateClear={onDateClear} onOpenPicker={handleOpenPicker} inputRef={dateInputRef} />
  ) : (
    <EmptyDateButton filterDate={filterDate} onDateChange={onDateChange} onOpenPicker={handleOpenPicker} inputRef={dateInputRef} />
  );
};

const STATUS_OPTIONS = ['ALL', REPORT_STATUS.Pending, REPORT_STATUS.Investigating, REPORT_STATUS.Resolved] as const;

const getStatusLabel = (status: string) => {
  if (status === 'ALL') return APP_STRINGS.MAP.ALL;
  if (status === REPORT_STATUS.Pending) return APP_STRINGS.MAP.STATUS_PENDING;
  if (status === REPORT_STATUS.Investigating) return APP_STRINGS.MAP.STATUS_INVESTIGATING;
  return APP_STRINGS.MAP.STATUS_RESOLVED;
};

export const StatusChips = ({ filterStatus, setFilterStatus }: { filterStatus: string; setFilterStatus: (s: string) => void }) => (
  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 shrink-0">
    <Filter size={12} className="text-text-muted shrink-0 mr-1.5 sm:mr-2" />
    {STATUS_OPTIONS.map((status) => {
      const isActive = filterStatus === status;
      return (
        <button
          key={status}
          type="button"
          onClick={() => setFilterStatus(status)}
          className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
            isActive ? 'bg-primary text-text-inverse shadow-xs' : 'bg-background border border-border text-text-muted hover:border-primary/50 hover:text-text-main'
          }`}
        >
          {getStatusLabel(status)}
        </button>
      );
    })}
  </div>
);
