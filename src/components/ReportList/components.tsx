import { useRef } from 'react';
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

export const DateFilterControl = ({ filterDate, onDateChange, onDateClear }: DateFilterProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      input.showPicker();
    } else {
      input.focus();
    }
  };

  return (
    <div className="relative inline-flex items-center shrink-0">
      <input
        ref={dateInputRef}
        type="date"
        value={filterDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
      {filterDate ? (
        <div className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/30 text-primary shrink-0 transition-all shadow-xs">
          <button
            type="button"
            onClick={handleOpenPicker}
            className="inline-flex items-center gap-1.5 h-7 sm:h-8 pl-2 sm:pl-2.5 pr-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:text-primary-hover focus:outline-hidden cursor-pointer"
            title={APP_STRINGS.MAP.CLEAR_DATE_FILTER}
          >
            <Calendar size={TOKENS.ICON_SIZES.SM} className="text-primary shrink-0" />
            <span>{format(new Date(filterDate), 'd MMM', { locale: id })}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDateClear();
            }}
            className="h-7 sm:h-8 w-6 sm:w-7 flex items-center justify-center hover:bg-primary/20 rounded-r-lg text-primary transition-colors cursor-pointer"
            aria-label={APP_STRINGS.MAP.CLEAR_DATE_FILTER}
            title={APP_STRINGS.MAP.CLEAR_DATE_FILTER}
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpenPicker}
          className="inline-flex items-center gap-1.5 h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-background border border-border text-text-muted hover:border-primary/50 hover:text-text-main shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
          title={APP_STRINGS.UI.DATE_COLUMN}
        >
          <Calendar size={TOKENS.ICON_SIZES.SM} className="text-text-muted shrink-0" />
          <span>{APP_STRINGS.UI.DATE_COLUMN}</span>
        </button>
      )}
    </div>
  );
};

const STATUS_OPTIONS = ['ALL', REPORT_STATUS.Pending, REPORT_STATUS.Investigating, REPORT_STATUS.Resolved] as const;

export const StatusChips = ({ filterStatus, setFilterStatus }: { filterStatus: string; setFilterStatus: (s: string) => void }) => (
  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-hide w-full sm:w-auto sm:justify-end sm:ml-auto min-w-0 shrink-0">
    <Filter size={12} className="text-text-muted shrink-0 mr-0.5" />
    {STATUS_OPTIONS.map((status) => (
      <button
        key={status}
        type="button"
        onClick={() => setFilterStatus(status)}
        className={`shrink-0 h-7 sm:h-8 px-2.5 sm:px-3 rounded-md text-[9px] sm:text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${filterStatus === status ? 'bg-primary text-text-inverse shadow-sm' : 'bg-background border border-border text-text-muted sm:hover:border-primary/50'}`}
      >
        {status === 'ALL' ? 'Semua' : status === REPORT_STATUS.Pending ? APP_STRINGS.MAP.STATUS_PENDING : status === REPORT_STATUS.Investigating ? APP_STRINGS.MAP.STATUS_INVESTIGATING : APP_STRINGS.MAP.STATUS_RESOLVED}
      </button>
    ))}
  </div>
);
