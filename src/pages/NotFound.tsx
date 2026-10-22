import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { TOKENS } from '../constants/tokens';
import { APP_STRINGS } from '../constants/strings';

export function NotFound() {
  useDocumentTitle(APP_STRINGS.TITLES.NOT_FOUND);
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-12 w-1/2 h-1/2 bg-danger/5 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-12 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={TOKENS.TRANSITION.PAGE}
        className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl relative z-10"
      >
        <div className="w-20 h-20 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-6">
          <AlertTriangle size={TOKENS.ICON_SIZES.XXXL} />
        </div>
        
        <h1 className="text-6xl font-black text-text-main tracking-tighter mb-2">404</h1>
        <h2 className="text-xl font-bold text-text-main mb-4">{APP_STRINGS.UI.PAGE_NOT_FOUND}</h2>
        
        <p className="text-sm text-text-muted mb-8 leading-relaxed">
          {APP_STRINGS.UI.NOT_FOUND_DESC}
        </p>

        <button 
          onClick={() => navigate(ROUTES.HOME, { replace: true })}
          className="w-full h-12 bg-primary hover:bg-primary-hover text-text-inverse rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Home size={TOKENS.ICON_SIZES.MD} />
          {APP_STRINGS.DOCS.BACK_TO_HOME}
        </button>
      </motion.div>
    </div>
  );
}
