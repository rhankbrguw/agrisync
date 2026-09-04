import { Link } from 'react-router-dom';
import { Map, Leaf, Search, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ROUTES } from '../constants/routes';
import { TOKENS } from '../constants/tokens';
import { APP_STRINGS } from '../constants/strings';

interface DocsNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DocsNav({ searchQuery, onSearchChange }: DocsNavProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-xl px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center justify-center relative">
              <Map size={TOKENS.ICON_SIZES.MD} />
              <div className="absolute -bottom-0.5 -right-0.5 bg-surface border border-border rounded-full p-0.5">
                <Leaf size={TOKENS.ICON_SIZES.SM} className="text-success" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-text-main">{APP_STRINGS.APP_NAME}</span>
              <span className="text-xs font-bold text-primary">{APP_STRINGS.DOCS.DOCS_TITLE}</span>
            </div>
          </Link>
          <Link to={ROUTES.HOME} className="hidden sm:flex items-center gap-1 text-xs font-bold text-text-muted hover:text-text-main transition-colors">
            <ArrowLeft size={TOKENS.ICON_SIZES.SM} />
            <span>{APP_STRINGS.DOCS.BACK_TO_HOME}</span>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-2 relative">
          <Search size={TOKENS.ICON_SIZES.MD} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={APP_STRINGS.DOCS.SEARCH_PLACEHOLDER}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-background border border-border text-xs text-text-main placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-text-inverse rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <ShieldCheck size={TOKENS.ICON_SIZES.SM} />
            <span className="hidden sm:inline">{APP_STRINGS.DOCS.LOGIN_PORTAL}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
