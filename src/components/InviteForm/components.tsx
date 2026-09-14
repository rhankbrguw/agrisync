import { APP_STRINGS } from '../../constants/strings';
import { APP_CONFIG } from '../../constants/config';
import { useState } from 'react';
import { Copy, Check, Hash, Users } from 'lucide-react';

export const InviteLimitBadge = ({ loadingLimits, workerCount, maxWorkers }: { loadingLimits: boolean, workerCount: number, maxWorkers: number }) => (
  <div className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-background border border-border flex items-center gap-1">
    {loadingLimits ? (
      <span className="text-text-muted">...</span>
    ) : (
      <>
        <span className={workerCount >= maxWorkers ? 'text-danger' : 'text-text-main'}>
          {workerCount}/{maxWorkers}
        </span>
        <div className="flex items-center gap-1 text-text-muted ml-0.5"><Users size={11} /><span className="hidden sm:inline uppercase tracking-widest text-[9px]">{APP_STRINGS.DASHBOARD.INVITE_WORKER_COUNT_LABEL}</span></div>
      </>
    )}
  </div>
);

export const ShareModal = ({ worker, onClose }: { worker: { name: string; email: string; role: string } | null, onClose: () => void }) => {
  if (!worker) return null;
  const loginUrl = APP_CONFIG.APP_URL || window.location.origin;
  const roleName = worker.role === 'SUPERVISOR' ? APP_STRINGS.SHARE.ROLE_SUPERVISOR : APP_STRINGS.SHARE.ROLE_WORKER;
  const message = APP_STRINGS.SHARE.GREETING(worker.name, roleName, worker.email, loginUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-surface/90 border border-border p-6 rounded-3xl shadow-2xl flex flex-col">
        <h3 className="text-lg font-bold text-text-main mb-2">{APP_STRINGS.SHARE.SUCCESS_TITLE}</h3>
        <p className="text-xs text-text-muted mb-6 leading-relaxed">
          {APP_STRINGS.SHARE.SUCCESS_DESC}
        </p>
        <div className="flex gap-3">
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')} className="flex-1 h-11 bg-success/10 sm:hover:bg-success/20 text-success border border-success/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            {APP_STRINGS.SHARE.WHATSAPP}
          </button>
          <button onClick={() => window.location.href = `mailto:${worker.email}?subject=Akses AgriSync&body=${encodeURIComponent(message)}`} className="flex-1 h-11 bg-success/10 sm:hover:bg-success/20 text-success border border-success/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            {APP_STRINGS.SHARE.EMAIL}
          </button>
        </div>
        <button onClick={onClose} className="w-full h-11 mt-3 bg-background border border-border sm:hover:bg-surface rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-text-muted">
          {APP_STRINGS.SHARE.CLOSE}
        </button>
      </div>
    </div>
  );
};


export const WorkspaceCodeBadge = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), APP_CONFIG.UI.COPY_FEEDBACK_MS);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group relative flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-border sm:hover:border-primary/50 sm:hover:bg-primary/5 rounded-lg transition-all overflow-hidden active:scale-95"
      title={APP_STRINGS.SHARE.COPY_CODE}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <Hash size={12} className="text-primary/70 group-hover:text-primary transition-colors" />
      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-text-main group-hover:text-primary transition-colors">{code}</span>
      <div className="w-px h-3 bg-border mx-0.5" />
      {copied ? (
        <Check size={12} className="text-success" />
      ) : (
        <Copy size={12} className="text-text-muted group-hover:text-primary transition-colors" />
      )}
    </button>
  );
};
