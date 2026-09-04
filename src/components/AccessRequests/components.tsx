import { Check, X } from 'lucide-react';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import type { AccessRequest } from '../../services/access-request.service';

export const AccessRequestCard = ({
  req,
  handleAccept,
  handleReject,
  isPending
}: {
  req: AccessRequest;
  handleAccept: (req: AccessRequest) => void;
  handleReject: (req: AccessRequest) => void;
  isPending: boolean;
}) => (
  <div className="p-2.5 mb-1.5 bg-background/50 border border-border rounded-xl flex flex-col gap-2">
    <div>
      <p className="text-xs font-semibold text-text-main">{req.full_name || req.email}</p>
      <p className="text-2xs text-text-muted mt-0.5">{req.email} • {APP_STRINGS.DASHBOARD.REQ_WA_PREFIX} {req.phone}</p>
    </div>
    <div className="flex items-center gap-1.5 mt-1">
      <button disabled={isPending} onClick={() => handleAccept(req)} aria-label={APP_STRINGS.DASHBOARD.REQ_ACCEPT} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-success/10 text-success sm:hover:bg-success sm:hover:text-text-inverse rounded-md transition-colors text-xs-tight uppercase tracking-wider font-bold disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed disabled:opacity-50">
        <Check size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.DASHBOARD.REQ_ACCEPT}
      </button>
      <button disabled={isPending} onClick={() => handleReject(req)} aria-label={APP_STRINGS.DASHBOARD.REQ_REJECT} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-danger/10 text-danger sm:hover:bg-danger sm:hover:text-text-inverse rounded-md transition-colors text-xs-tight uppercase tracking-wider font-bold disabled:bg-surface-muted disabled:text-text-muted disabled:cursor-not-allowed disabled:opacity-50">
        <X size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.DASHBOARD.REQ_REJECT}
      </button>
    </div>
  </div>
);
