import { Link } from 'react-router-dom';
import { Map, Leaf, Mail, ShieldCheck, Clock, Globe } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { LANDING_STRINGS } from '../constants/landingStrings';
import { TOKENS } from '../constants/tokens';

export function LandingFooter() {
  const strings = LANDING_STRINGS.FOOTER;

  return (
    <footer className="border-t border-border bg-surface/60 backdrop-blur-xl py-8 sm:py-12 px-4 sm:px-6 mt-12 sm:mt-16 text-text-main">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        
        {/* Col 1: Brand & Status */}
        <div className="space-y-3 sm:space-y-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center justify-center relative">
              <Map size={TOKENS.ICON_SIZES.MD} />
              <div className="absolute -bottom-0.5 -right-0.5 bg-surface border border-border rounded-full p-0.5">
                <Leaf size={TOKENS.ICON_SIZES.SM} className="text-success" />
              </div>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-text-main">{strings.BRAND}</span>
          </Link>
          <p className="text-xs text-text-muted leading-relaxed max-w-xs">{strings.TAGLINE}</p>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-surface border border-border text-2xs font-semibold text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span>{strings.STATUS}</span>
          </div>
        </div>

        {/* Col 2: Products */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-2xs sm:text-xs font-black uppercase tracking-wider text-text-main">{strings.COL_PRODUCTS_TITLE}</h4>
          <ul className="space-y-1.5 text-xs text-text-muted">
            {strings.PRODUCTS.map((p, i) => (
              <li key={i}>
                <a href={p.href} className="hover:text-primary transition-colors">{p.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Documentation */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-2xs sm:text-xs font-black uppercase tracking-wider text-text-main">{strings.COL_DOCS_TITLE}</h4>
          <ul className="space-y-1.5 text-xs text-text-muted">
            {strings.DOCS.map((d, i) => (
              <li key={i}>
                <Link to={d.href} className="hover:text-primary transition-colors">{d.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact & SLA */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-2xs sm:text-xs font-black uppercase tracking-wider text-text-main">{strings.COL_CONTACT_TITLE}</h4>
          <div className="space-y-2 text-xs">
            <a
              href={`mailto:${strings.CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface border border-border text-primary hover:border-primary/40 transition-all font-semibold break-all text-xs"
            >
              <Mail size={TOKENS.ICON_SIZES.SM} className="shrink-0" />
              <span>{strings.CONTACT_EMAIL}</span>
            </a>
            <div className="flex items-center gap-1.5 text-2xs text-text-muted">
              <Clock size={TOKENS.ICON_SIZES.SM} className="shrink-0" />
              <span>{strings.CONTACT_SLA}</span>
            </div>
            <div className="flex items-center gap-1.5 text-2xs text-text-muted">
              <Globe size={TOKENS.ICON_SIZES.SM} className="shrink-0" />
              <span>{strings.LOCATION}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium text-text-muted">
        <span>{strings.COPYRIGHT}</span>
        <div className="flex items-center gap-2">
          <ShieldCheck size={TOKENS.ICON_SIZES.MD} className="text-primary shrink-0" />
          <span className="text-text-main/80">{strings.LEGAL}</span>
        </div>
      </div>
    </footer>
  );
}

