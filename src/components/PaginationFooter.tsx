import { APP_STRINGS } from '../constants/strings';

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  entityName?: string;
  onPageChange: (page: number | ((p: number) => number)) => void;
  compact?: boolean;
}

export function PaginationFooter({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  entityName,
  onPageChange,
  compact = false
}: PaginationFooterProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-between items-center mt-2 pt-3 border-t border-border/50 shrink-0 bg-surface ${compact ? '' : 'p-4'}`}>
      {!compact && entityName && (
        <span className="text-[10px] sm:text-xs font-medium text-text-muted hidden sm:inline">
          {APP_STRINGS.UI.PAGINATION_SHOWING((currentPage - 1) * itemsPerPage + 1, Math.min(currentPage * itemsPerPage, totalItems), totalItems, entityName)}
        </span>
      )}
      <div className={`flex items-center gap-1 ${compact ? 'w-full justify-between' : ''}`}>
        <button 
          onClick={() => onPageChange((p: number) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="h-7 px-2 rounded bg-background border border-border text-xs font-bold text-text-main sm:hover:bg-surface disabled:opacity-50 transition-colors"
        >
          &larr; {APP_STRINGS.UI.PAGINATION_PREV}
        </button>
        
        {compact ? (
          <span className="text-[10px] sm:text-xs font-medium text-text-muted">
            {APP_STRINGS.UI.PAGINATION_PAGE(currentPage, totalPages)}
          </span>
        ) : (
          <div className="flex gap-1 hidden sm:flex">
            {Array.from({ length: totalPages }).map((_, i) => {
              if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage)) {
                return (
                  <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`w-7 h-7 rounded border text-xs font-bold transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-primary border-primary text-text-inverse' 
                        : 'bg-background border-border text-text-main sm:hover:bg-surface'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              }
              if (i === 1 || i === totalPages - 2) return <span key={i} className="px-1 text-text-muted">...</span>;
              return null;
            })}
          </div>
        )}

        <button 
          onClick={() => onPageChange((p: number) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="h-7 px-2 rounded bg-background border border-border text-xs font-bold text-text-main sm:hover:bg-surface disabled:opacity-50 transition-colors"
        >
          {APP_STRINGS.UI.PAGINATION_NEXT} &rarr;
        </button>
      </div>
    </div>
  );
}
