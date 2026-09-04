import { TOAST_IDS } from '../../constants/toastIds';
import { motion } from 'framer-motion';
import { UserSquare, ShieldCheck, ArrowLeft, RefreshCw, Building2, ArrowRight } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';

type ViewType = 'CHOICE' | 'WORKER_FORM' | 'WORKER_WAIT' | 'ADMIN';
const anim = { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3, ease: 'easeOut' as const } };

export const OnboardingChoice = ({ setView }: { setView: (v: ViewType) => void }) => (
  <motion.div key="choice" {...anim} className="space-y-4 sm:space-y-6">
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl font-extrabold text-text-main mb-1.5 sm:mb-2">{APP_STRINGS.ONBOARDING.WELCOME_TITLE}</h1>
      <p className="text-xs sm:text-sm text-text-muted">{APP_STRINGS.ONBOARDING.WELCOME_DESC}</p>
    </div>
    <button onClick={() => setView('WORKER_FORM')} className="w-full p-3.5 sm:p-5 bg-background/50 border border-border hover:border-primary hover:bg-primary/5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 transition-all group text-left">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><UserSquare size={TOKENS.ICON_SIZES.LG} /></div>
      <div><h3 className="text-xs sm:text-sm font-bold text-text-main">{APP_STRINGS.ONBOARDING.SPLIT_WORKER_TITLE}</h3><p className="text-2xs sm:text-xs text-text-muted mt-0.5 sm:mt-1">{APP_STRINGS.ONBOARDING.SPLIT_WORKER_DESC}</p></div>
    </button>
    <button onClick={() => setView('ADMIN')} className="w-full p-3.5 sm:p-5 bg-background/50 border border-border hover:border-primary hover:bg-primary/5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 transition-all group text-left">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"><ShieldCheck size={TOKENS.ICON_SIZES.LG} /></div>
      <div><h3 className="text-xs sm:text-sm font-bold text-text-main">{APP_STRINGS.ONBOARDING.SPLIT_ADMIN_TITLE}</h3><p className="text-2xs sm:text-xs text-text-muted mt-0.5 sm:mt-1">{APP_STRINGS.ONBOARDING.SPLIT_ADMIN_DESC}</p></div>
    </button>
  </motion.div>
);

export const OnboardingWorkerWait = ({ email, setView, onRefresh }: { email: string | undefined, setView: (v: ViewType) => void, onRefresh: () => void }) => (
  <motion.div key="worker" {...anim} className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 border border-primary/20 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner mb-1 sm:mb-2">
      <UserSquare size={TOKENS.ICON_SIZES.XL} />
    </motion.div>
    <h1 className="text-xl sm:text-2xl font-extrabold text-text-main">{APP_STRINGS.ONBOARDING.WAITING_INVITE_TITLE}</h1>
    <p className="text-xs sm:text-sm text-text-muted">{APP_STRINGS.ONBOARDING.WAITING_INVITE_DESC}</p>
    <div className="bg-background/80 border border-border px-4 py-3 sm:px-6 sm:py-4 rounded-xl w-full">
      <p className="font-mono text-primary font-bold text-xs sm:text-sm select-all break-all">{email}</p>
    </div>
    <div className="w-full flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 mt-3 sm:mt-4">
      <button onClick={() => setView('CHOICE')} className="w-full sm:flex-1 h-11 sm:h-12 bg-background border border-border hover:bg-surface rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"><ArrowLeft size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.ONBOARDING.BACK_BUTTON}</button>
      <button onClick={onRefresh} className="w-full sm:flex-1 h-11 sm:h-12 bg-primary sm:hover:bg-primary-hover text-text-inverse rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"><RefreshCw size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.ONBOARDING.REFRESH_BUTTON}</button>
    </div>
  </motion.div>
);

export const OnboardingAdminForm = ({ form, onSubmit, isLoading, setView }: { form: UseFormReturn<{ companyName: string; fullName: string; phone: string; confirm: boolean }>, onSubmit: (data: { companyName: string; fullName: string; phone: string; confirm: boolean }) => void, isLoading: boolean, setView: (v: ViewType) => void }) => (
  <motion.div key="admin" {...anim}>
    <button onClick={() => setView('CHOICE')} className="mb-4 sm:mb-6 text-text-muted hover:text-text-main flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold transition-colors"><ArrowLeft size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.ONBOARDING.BACK_BUTTON}</button>
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 border border-primary/20 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner mb-4 sm:mb-6 mx-auto"><Building2 size={TOKENS.ICON_SIZES.XL} /></div>
    <h1 className="text-xl sm:text-2xl font-extrabold text-center text-text-main mb-1.5 sm:mb-2">{APP_STRINGS.ONBOARDING.TITLE}</h1>
    <p className="text-2xs sm:text-xs text-text-muted text-center mb-4 sm:mb-6">{APP_STRINGS.ONBOARDING.SUBTITLE}</p>

    <form onSubmit={form.handleSubmit(onSubmit, () => toast.error(APP_STRINGS.DASHBOARD.FORM_VALIDATION_ERROR, { id: TOAST_IDS.FORM_ERROR }))} className="space-y-3 sm:space-y-4">
      <div>
        <label htmlFor="companyName" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1 sm:mb-1.5">{APP_STRINGS.ONBOARDING.COMPANY_LABEL}</label>
        <input id="companyName" type="text" {...form.register('companyName')} placeholder={APP_STRINGS.ONBOARDING.COMPANY_PLACEHOLDER} className="w-full h-10 sm:h-11 bg-background/50 border border-border focus:border-primary rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm outline-none transition-all" />
        {form.formState.errors.companyName && <p className="text-xs-tight text-danger mt-1">{form.formState.errors.companyName.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="fullName" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1 sm:mb-1.5">{APP_STRINGS.ONBOARDING.FULL_NAME_LABEL}</label>
        <input id="fullName" type="text" {...form.register('fullName')} placeholder={APP_STRINGS.ONBOARDING.FULL_NAME_PLACEHOLDER} className="w-full h-11 bg-background/50 border border-border focus:border-primary rounded-xl px-4 text-sm outline-none transition-all" />
        {form.formState.errors.fullName && <p className="text-xs-tight text-danger mt-1">{form.formState.errors.fullName.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1.5">{APP_STRINGS.ONBOARDING.PHONE_LABEL}</label>
        <input id="phone" type="tel" {...form.register('phone', { onChange: (e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '') })} placeholder={APP_STRINGS.ONBOARDING.PHONE_PLACEHOLDER} className="w-full h-11 bg-background/50 border border-border focus:border-primary rounded-xl px-4 text-sm outline-none transition-all" />
        {form.formState.errors.phone && <p className="text-xs-tight text-danger mt-1">{form.formState.errors.phone.message?.toString()}</p>}
      </div>

      <label htmlFor="adminConfirm" className="flex items-start gap-3 p-3 mt-4 bg-primary/10 border border-primary/20 rounded-xl cursor-pointer group hover:bg-primary/20 transition-colors">
        <div className="pt-0.5">
          <input id="adminConfirm" type="checkbox" {...form.register('confirm')} className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary/50 bg-background/50 cursor-pointer" />
        </div>
        <p className="text-xs-tight text-primary font-medium leading-relaxed">{APP_STRINGS.ONBOARDING.ADMIN_CONFIRM}</p>
      </label>
      {form.formState.errors.confirm && <p className="text-xs-tight text-danger text-center">{form.formState.errors.confirm.message?.toString()}</p>}

      <button type="submit" disabled={isLoading} className="group w-full h-12 mt-2 bg-primary sm:hover:bg-primary-hover disabled:bg-surface disabled:text-text-muted text-text-inverse text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
        {isLoading ? APP_STRINGS.UI.PROCESSING : APP_STRINGS.ONBOARDING.SUBMIT_BUTTON} <ArrowRight size={TOKENS.ICON_SIZES.LG} className="transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  </motion.div>
);

export const OnboardingWorkerForm = ({ form, onSubmit, isLoading, setView }: { form: UseFormReturn<{ workspaceCode: string; fullName: string; phone: string }>, onSubmit: (data: { workspaceCode: string; fullName: string; phone: string }) => void, isLoading: boolean, setView: (v: ViewType) => void }) => (
  <motion.div key="worker_form" {...anim}>
    <button onClick={() => setView('CHOICE')} className="mb-4 sm:mb-6 text-text-muted hover:text-text-main flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold transition-colors"><ArrowLeft size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.ONBOARDING.BACK_BUTTON}</button>
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 border border-primary/20 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner mb-4 sm:mb-6 mx-auto"><UserSquare size={TOKENS.ICON_SIZES.XL} /></div>
    <h1 className="text-xl sm:text-2xl font-extrabold text-center text-text-main mb-1.5 sm:mb-2">{APP_STRINGS.ONBOARDING.WORKER_REQ_TITLE}</h1>
    <p className="text-2xs sm:text-xs text-text-muted text-center mb-4 sm:mb-6">{APP_STRINGS.ONBOARDING.WORKER_REQ_DESC}</p>

    <form onSubmit={form.handleSubmit(onSubmit, () => toast.error(APP_STRINGS.DASHBOARD.FORM_VALIDATION_ERROR, { id: TOAST_IDS.FORM_ERROR }))} className="space-y-3 sm:space-y-4">
      <div>
        <label htmlFor="workspaceCode" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1 sm:mb-1.5">{APP_STRINGS.ONBOARDING.WORKSPACE_CODE_LABEL}</label>
        <input id="workspaceCode" type="text" {...form.register('workspaceCode')} placeholder={APP_STRINGS.ONBOARDING.WORKSPACE_CODE_PLACEHOLDER} className="w-full h-10 sm:h-11 bg-background/50 border border-border focus:border-primary rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm outline-none transition-all uppercase" />
        {form.formState.errors.workspaceCode && <p className="text-xs-tight text-danger mt-1">{form.formState.errors.workspaceCode.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="workerFullName" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1 sm:mb-1.5">{APP_STRINGS.ONBOARDING.FULL_NAME_LABEL}</label>
        <input id="workerFullName" type="text" {...form.register('fullName')} placeholder={APP_STRINGS.ONBOARDING.FULL_NAME_PLACEHOLDER} className="w-full h-10 sm:h-11 bg-background/50 border border-border focus:border-primary rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm outline-none transition-all" />
        {form.formState.errors.fullName && <p className="text-xs-tight text-danger mt-1">{form.formState.errors.fullName.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="workerPhone" className="block text-xs-tight font-bold text-text-muted uppercase tracking-widest mb-1 sm:mb-1.5">{APP_STRINGS.ONBOARDING.PHONE_LABEL}</label>
        <input id="workerPhone" type="tel" {...form.register('phone', { onChange: (e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '') })} placeholder={APP_STRINGS.ONBOARDING.PHONE_PLACEHOLDER} className="w-full h-10 sm:h-11 bg-background/50 border border-border focus:border-primary rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm outline-none transition-all" />
        {form.formState.errors.phone && <p className="text-xs-tight text-danger mt-1">{form.formState.errors.phone.message?.toString()}</p>}
      </div>

      <button type="submit" disabled={isLoading} className="group w-full h-11 sm:h-12 mt-2 bg-primary sm:hover:bg-primary-hover disabled:bg-surface disabled:text-text-muted text-text-inverse text-2xs sm:text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
        {isLoading ? APP_STRINGS.UI.PROCESSING : APP_STRINGS.ONBOARDING.WORKER_REQ_BTN} <ArrowRight size={TOKENS.ICON_SIZES.MD} className="transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  </motion.div>
);

