import { useState } from 'react';
import { Bell, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { APP_STRINGS } from '../../constants/strings';
import { APP_CONFIG } from '../../constants/config';
import { TOKENS } from '../../constants/tokens';
import { TOAST_IDS } from '../../constants/toastIds';
import { useAccessRequests } from '../../hooks/useAccessRequests';
import { useCompanyLimits } from '../../hooks/useCompanyLimits';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import type { AccessRequest } from '../../services/access-request.service';
import { AccessRequestCard } from './components';
import { Skeleton } from '../Skeleton';
import { EmptyState } from '../EmptyState';
import { toAppError } from '../../utils/errors';

function useAccessRequestHandler() {
  const { data: requests = [], isLoading, approveRequest, rejectRequest } = useAccessRequests();
  const { isLimitReached, maxWorkers } = useCompanyLimits();

  const handleAccept = async (req: AccessRequest) => {
    if (isLimitReached) {
      toast.error(APP_STRINGS.DASHBOARD.INVITE_UPGRADE_REQUIRED(maxWorkers), { id: TOAST_IDS.INVITE_ERROR, duration: APP_CONFIG.UI.LONG_TOAST_DURATION_MS });
      return;
    }
    
    try {
      await approveRequest.mutateAsync(req);
      toast.success(APP_STRINGS.ACTION_MESSAGES.REQ_ACCEPT_SUCCESS, { id: TOAST_IDS.ACCESS_SUCCESS });
    } catch (err: unknown) {
      toast.error(toAppError(err).message, { id: TOAST_IDS.ACCESS_ERROR });
    }
  };

  const handleReject = async (req: AccessRequest) => {
    try {
      await rejectRequest.mutateAsync(req.id);
      toast.success(APP_STRINGS.ACTION_MESSAGES.REQ_REJECT_SUCCESS, { id: TOAST_IDS.ACCESS_REJECTED });
    } catch (err: unknown) {
      toast.error(toAppError(err).message, { id: TOAST_IDS.ACCESS_REJECTED_ERROR });
    }
  };

  return { requests, isLoading, approveRequest, rejectRequest, handleAccept, handleReject };
}

interface RequestDropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  requests: AccessRequest[];
  isLoading: boolean;
  approveRequest: { isPending: boolean };
  rejectRequest: { isPending: boolean };
  handleAccept: (req: AccessRequest) => void;
  handleReject: (req: AccessRequest) => void;
}

const RequestDropdown = ({ isOpen, setIsOpen, requests, isLoading, approveRequest, rejectRequest, handleAccept, handleReject }: RequestDropdownProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} role="presentation" onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: TOKENS.DURATION.INSTANT / 1000, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-[360px] sm:w-96 bg-surface border border-border shadow-2xl rounded-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <UserPlus size={TOKENS.ICON_SIZES.MD} className="text-primary" /> {APP_STRINGS.DASHBOARD.REQ_TITLE}
              </h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{requests.length} {APP_STRINGS.DASHBOARD.STATUS_PENDING}</span>
            </div>
            
            <div className="flex-1 overflow-auto custom-scrollbar p-2">
              {isLoading ? (
                <div className="p-2 space-y-2">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" variant="rectangular" />)}
                </div>
              ) : requests.length === 0 ? (
                <div className="p-4">
                  <EmptyState icon={UserPlus} title={APP_STRINGS.DASHBOARD.REQ_TITLE} description={APP_STRINGS.DASHBOARD.REQ_EMPTY} />
                </div>
              ) : (
                requests.map((req: AccessRequest) => (
                  <AccessRequestCard key={req.id} req={req} handleAccept={handleAccept} handleReject={handleReject} isPending={approveRequest.isPending || rejectRequest.isPending} />
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export function AccessRequests() {
  const { requests, isLoading, approveRequest, rejectRequest, handleAccept, handleReject } = useAccessRequestHandler();
  const [isOpen, setIsOpen] = useState(false);
  useDocumentTitle(isOpen ? APP_STRINGS.TITLES.NOTIFICATIONS : APP_STRINGS.TITLES.DASHBOARD);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label={APP_STRINGS.DASHBOARD.REQ_TITLE}
        className="relative p-2.5 text-text-muted hover:text-text-main hover:bg-background/80 rounded-xl transition-colors bg-background/50 border border-border"
      >
        <Bell size={TOKENS.ICON_SIZES.MD} />
        {requests.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface animate-pulse" />
        )}
      </button>

      <RequestDropdown 
        isOpen={isOpen} setIsOpen={setIsOpen} requests={requests} isLoading={isLoading} 
        approveRequest={approveRequest} rejectRequest={rejectRequest} handleAccept={handleAccept} handleReject={handleReject} 
      />
    </div>
  );
}
