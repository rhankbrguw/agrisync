import { Link } from 'react-router-dom';
import { Map, Leaf, ArrowRight, BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ROUTES } from '../constants/routes';
import { LANDING_STRINGS } from '../constants/landingStrings';
import { TOKENS } from '../constants/tokens';
import { useAuthStore } from '../store/authStore';
import { USER_ROLE } from '../constants/enums';

export function LandingNav() {
  const strings = LANDING_STRINGS.NAV;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const targetRoute = !isAuthenticated
    ? ROUTES.LOGIN
    : user?.role === USER_ROLE.Supervisor
      ? ROUTES.DASHBOARD
      : user?.role === USER_ROLE.Worker
        ? ROUTES.WORKER
        : ROUTES.ONBOARDING;

  const targetLabel = !isAuthenticated
    ? strings.PORTAL_BTN
    : user?.role === USER_ROLE.Supervisor
      ? strings.OPEN_DASHBOARD
      : strings.OPEN_WORKSPACE;

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full max-w-7xl mx-auto px-3 sm:px-6">
      <nav className="w-full bg-surface/80 backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-3.5 flex items-center justify-between shadow-lg shadow-black/5">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-primary/10 border border-primary/20 text-primary rounded-lg sm:rounded-xl flex items-center justify-center relative transition-transform group-hover:scale-105">
            <Map size={TOKENS.ICON_SIZES.MD} className="sm:hidden" />
            <Map size={TOKENS.ICON_SIZES.LG} className="hidden sm:block" />
            <div className="absolute -bottom-0.5 -right-0.5 bg-surface border border-border rounded-full p-0.5">
              <Leaf size={TOKENS.ICON_SIZES.SM} className="text-success" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-text-main leading-none">
              {strings.BRAND}
            </span>
            <span className="text-2xs font-bold uppercase tracking-widest text-text-muted">
              {strings.TAGLINE}
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text-main transition-colors">
            {strings.NAV_FEATURES}
          </a>
          <a href="#architecture" className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text-main transition-colors">
            {strings.NAV_ARCHITECTURE}
          </a>
          <a href="#pricing" className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text-main transition-colors">
            {strings.NAV_PRICING}
          </a>
          <Link to={ROUTES.DOCS} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors">
            <BookOpen size={TOKENS.ICON_SIZES.SM} />
            {strings.NAV_DOCS}
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to={targetRoute}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-primary hover:bg-primary-hover text-text-inverse rounded-lg sm:rounded-xl text-2xs sm:text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-primary/20 active:scale-95 whitespace-nowrap"
          >
            <span>{targetLabel}</span>
            <ArrowRight size={12} className="sm:hidden" />
            <ArrowRight size={TOKENS.ICON_SIZES.SM} className="hidden sm:inline" />
          </Link>
        </div>
      </nav>
    </header>
  );
}


