import { motion } from 'framer-motion';
import { Send, RefreshCw, MailCheck } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';

export type Mode = 'LOGIN' | 'SENT_MAGIC';

export const LoginForm = ({ form, onSubmit, isLoading, }: { form: UseFormReturn<{ email: string }>, onSubmit: (data: { email: string }) => void, isLoading: boolean }) => (
  <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
    <div className="space-y-1.5">
      <label htmlFor="loginEmail" className="text-xs-tight font-bold text-text-muted uppercase tracking-widest ml-1">{APP_STRINGS.AUTH.EMAIL_LABEL}</label>
      <input id="loginEmail" type="email" {...form.register('email')} className="w-full h-11 bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 text-sm text-text-main placeholder-text-muted/50 transition-all outline-none" placeholder={APP_STRINGS.PLACEHOLDERS.EMAIL} />
      {form.formState.errors.email && <p className="text-xs-tight text-danger ml-1">{form.formState.errors.email.message?.toString()}</p>}
    </div>
    <button type="submit" disabled={isLoading} className="group w-full h-11 mt-2 bg-primary hover:bg-primary-hover active:scale-[0.98] sm:hover:scale-[1.02] disabled:hover:scale-100 disabled:active:scale-100 disabled:bg-surface disabled:text-text-muted disabled:border disabled:border-border text-text-inverse text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
      {isLoading ? <RefreshCw className="animate-spin" size={TOKENS.ICON_SIZES.MD} /> : <Send size={TOKENS.ICON_SIZES.MD} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />} {APP_STRINGS.AUTH.LOGIN_BUTTON}
    </button>
  </motion.form>
);

export const MagicLinkSent = ({ lastEmail, setMode }: { lastEmail: string, setMode: (m: Mode) => void }) => (
  <motion.div key="success-magic" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-4">
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-14 h-14 bg-success/10 text-success rounded-full flex items-center justify-center mb-4"><MailCheck size={TOKENS.ICON_SIZES.XXL} /></motion.div>
    <h2 className="text-base font-bold text-text-main mb-1.5">{APP_STRINGS.AUTH.MAGIC_LINK_SENT}</h2>
    <p className="text-xs text-text-muted leading-relaxed">{APP_STRINGS.AUTH.MAGIC_LINK_CHECK} <br/><span className="font-semibold text-text-main mt-1 block">{lastEmail}</span></p>
    <button type="button" onClick={() => setMode('LOGIN')} className="text-xs text-primary font-semibold mt-6 hover:underline">
      {APP_STRINGS.AUTH.REQUEST_BACK}
    </button>
  </motion.div>
);
