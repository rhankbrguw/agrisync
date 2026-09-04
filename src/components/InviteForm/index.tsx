import { Key, Send, Loader2 } from 'lucide-react';
import { APP_STRINGS } from '../../constants/strings';
import { InviteLimitBadge, ShareModal, WorkspaceCodeBadge } from './components';
import { useInviteForm } from '../../hooks/useInviteForm';
import { TOKENS } from '../../constants/tokens';
import { USER_ROLE } from '../../constants/enums';

export function InviteForm() {
  const {
    user,
    form,
    loadingLimits,
    workerCount,
    maxWorkers,
    sharedWorker,
    setSharedWorker,
    inviteMutation,
    onSubmit,
    handleValidationError
  } = useInviteForm();

  return (
    <div className="bg-surface/80 sm:bg-surface/50 border border-border rounded-2xl sm:rounded-[2rem] shadow-sm h-full flex flex-col overflow-hidden">
      <div className="px-3.5 py-2.5 sm:px-5 sm:py-4 border-b border-border flex items-center sm:flex-wrap justify-between gap-2 sm:gap-3 bg-surface/30 overflow-x-auto custom-scrollbar">
        <h2 className="text-2xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 text-text-main whitespace-nowrap">
          <Key size={TOKENS.ICON_SIZES.SM} className="text-primary shrink-0 sm:hidden" />
          <Key size={TOKENS.ICON_SIZES.MD} className="text-primary shrink-0 hidden sm:inline" />
          <span>{APP_STRINGS.DASHBOARD.INVITE_TITLE}</span>
        </h2>
        <div className="flex items-center gap-1.5 shrink-0">
          {user?.workspace_code && <WorkspaceCodeBadge code={user.workspace_code} />}
          <InviteLimitBadge loadingLimits={loadingLimits} workerCount={workerCount} maxWorkers={maxWorkers} />
        </div>
      </div>
      <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-center">
        <p className="text-2xs sm:text-xs-loose text-text-muted mb-3 sm:mb-5 leading-relaxed">{APP_STRINGS.DASHBOARD.INVITE_DESC}</p>
        <form noValidate onSubmit={form.handleSubmit(onSubmit, handleValidationError)} className="space-y-2.5 sm:space-y-3">
          <div>
            <label htmlFor="inviteFullName" className="block text-2xs sm:text-xs-tight font-bold text-text-muted uppercase tracking-wider mb-1 sm:mb-1.5">{APP_STRINGS.AUTH.FULL_NAME_LABEL}</label>
            <input id="inviteFullName" type="text" {...form.register('fullName')} placeholder={APP_STRINGS.PLACEHOLDERS.FULL_NAME} className="w-full h-10 sm:h-11 bg-background/80 sm:bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm outline-none transition-all" />
            {form.formState.errors.fullName && <p className="text-xs-tight text-danger mt-1 px-1">{form.formState.errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="inviteEmail" className="block text-2xs sm:text-xs-tight font-bold text-text-muted uppercase tracking-wider mb-1 sm:mb-1.5">{APP_STRINGS.DASHBOARD.INVITE_PLACEHOLDER}</label>
            <input id="inviteEmail" type="email" {...form.register('email')} placeholder={APP_STRINGS.PLACEHOLDERS.EMAIL} className="w-full h-10 sm:h-11 bg-background/80 sm:bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm outline-none transition-all" />
            {form.formState.errors.email && <p className="text-xs-tight text-danger mt-1 px-1">{form.formState.errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="inviteRole" className="block text-2xs sm:text-xs-tight font-bold text-text-muted uppercase tracking-wider mb-1 sm:mb-1.5">{APP_STRINGS.DASHBOARD.ROLE_LABEL}</label>
            <select id="inviteRole" {...form.register('role')} className="w-full h-10 sm:h-11 bg-background/80 sm:bg-background/50 border border-border rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm outline-none font-medium cursor-pointer">
              <option value={USER_ROLE.Worker}>{APP_STRINGS.WORKER.ROLE_WORKER}</option>
              <option value={USER_ROLE.Supervisor}>{APP_STRINGS.DASHBOARD.ROLE_SUPERVISOR_OPT}</option>
            </select>
            {form.formState.errors.role && <p className="text-xs-tight text-danger mt-1 px-1">{form.formState.errors.role.message}</p>}
          </div>
          <button type="submit" disabled={inviteMutation.isPending || loadingLimits} className="w-full h-10 sm:h-11 mt-1 bg-primary hover:bg-primary-hover active:scale-[0.98] sm:hover:scale-[1.02] disabled:hover:scale-100 disabled:active:scale-100 disabled:bg-surface disabled:text-text-muted text-text-inverse text-2xs sm:text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            {inviteMutation.isPending ? <Loader2 size={TOKENS.ICON_SIZES.SM} className="animate-spin" /> : <Send size={TOKENS.ICON_SIZES.SM} />}
            {inviteMutation.isPending ? APP_STRINGS.UI.LOADING : APP_STRINGS.DASHBOARD.INVITE_BUTTON}
          </button>
        </form>
      </div>
      <ShareModal worker={sharedWorker} onClose={() => setSharedWorker(null)} />
    </div>
  );
}
