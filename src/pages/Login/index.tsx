import { Map, Leaf } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '../../components/ThemeToggle';
import { LoginForm, MagicLinkSent } from './components';
import { useLoginForm } from '../../hooks/useLoginForm';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';

export function Login() {
  const { isLoading, mode, setMode, lastEmail, loginForm, handleLoginSubmit } = useLoginForm();
  useDocumentTitle(APP_STRINGS.TITLES.LOGIN);

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50"><ThemeToggle /></div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
        <div className="absolute -top-1/4 right-12 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 -left-12 w-1/2 h-1/2 bg-info/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm sm:max-w-md bg-surface/80 backdrop-blur-xl border border-border p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl relative z-10 overflow-hidden flex flex-col justify-center min-h-80 sm:min-h-96">
        <div className="flex flex-col items-center mb-6 sm:mb-8 relative z-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 border border-primary/20 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-inner relative">
            <Map size={TOKENS.ICON_SIZES.XL} className="sm:hidden" />
            <Map size={TOKENS.ICON_SIZES.XXL} className="hidden sm:block" />
            <div className="absolute -bottom-1 -right-1 bg-surface border border-border rounded-full p-0.5 sm:p-1 shadow-sm"><Leaf size={TOKENS.ICON_SIZES.SM} className="text-success" /></div>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-text-main mb-1">{APP_STRINGS.APP_NAME}</h1>
          <p className="text-xs text-text-muted font-medium text-center">{APP_STRINGS.AUTH.TITLE}</p>
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {mode === 'LOGIN' && <LoginForm form={loginForm} onSubmit={handleLoginSubmit} isLoading={isLoading} />}
            {mode === 'SENT_MAGIC' && <MagicLinkSent lastEmail={lastEmail} setMode={setMode} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
