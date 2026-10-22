import React from 'react';
import { UserCog, MoreVertical, ShieldAlert, UserX, ShieldCheck, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { USER_ROLE, type UserRole } from '../../constants/enums';
import type { Employee } from '../../services/employee.service';
import type { User } from '../../store/authStore';

export const RevokeAccessModal = ({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
  isLoading
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
  isLoading: boolean;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" onClick={!isLoading ? onClose : undefined} role="presentation" />
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3.5 sm:p-4 pointer-events-none">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }} className="w-full max-w-sm bg-surface border border-border rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-danger/10 text-danger flex items-center justify-center mb-3 sm:mb-5">
                <AlertTriangle size={20} className="sm:hidden" /><AlertTriangle size={24} className="hidden sm:block" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-text-main mb-1.5">{APP_STRINGS.DASHBOARD.EMP_ACTION_REVOKE}</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-1">{APP_STRINGS.ACTION_MESSAGES.ACCESS_REVOKE_CONFIRM_DESC}<strong className="text-text-main font-bold">{employeeName}</strong>?</p>
              <p className="text-2xs sm:text-xs text-danger/80 font-medium">{APP_STRINGS.ACTION_MESSAGES.ACCESS_REVOKE_WARNING}</p>
            </div>
            <div className="p-3 sm:p-4 bg-background/50 border-t border-border flex gap-2.5 sm:gap-3">
              <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 sm:py-3 text-2xs sm:text-xs font-bold uppercase tracking-widest text-text-main bg-surface border border-border hover:bg-background rounded-xl transition-colors disabled:opacity-50">{APP_STRINGS.UI.CANCEL}</button>
              <button type="button" onClick={onConfirm} disabled={isLoading} className="flex-1 py-2.5 sm:py-3 text-2xs sm:text-xs font-bold uppercase tracking-widest text-text-inverse bg-danger hover:bg-danger-hover rounded-xl shadow-lg shadow-danger/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading ? APP_STRINGS.UI.PROCESSING : APP_STRINGS.ACTION_MESSAGES.CONFIRM_REVOKE}
              </button>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

const EmployeeActionDropdown = ({
  emp,
  handleRoleChange,
  handleRevoke
}: {
  emp: Employee;
  handleRoleChange: (id: string, role: UserRole) => void;
  handleRevoke: (id: string) => void;
}) => (
  <div className="absolute right-10 top-8 w-44 sm:w-48 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col py-1">
    {emp.role === USER_ROLE.Worker ? (
      <button onClick={() => handleRoleChange(emp.id, USER_ROLE.Supervisor)} className="w-full text-left px-3.5 sm:px-4 py-2 sm:py-2.5 text-2xs sm:text-xs font-semibold hover:bg-primary/10 text-primary flex items-center gap-2 transition-colors"><ShieldAlert size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.DASHBOARD.EMP_ACTION_MAKE_SPV}</button>
    ) : (
      <button onClick={() => handleRoleChange(emp.id, USER_ROLE.Worker)} className="w-full text-left px-3.5 sm:px-4 py-2 sm:py-2.5 text-2xs sm:text-xs font-semibold hover:bg-primary/10 text-primary flex items-center gap-2 transition-colors"><UserCog size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.DASHBOARD.EMP_ACTION_MAKE_WORKER}</button>
    )}
    <div className="h-px w-full bg-border my-1" />
    <button onClick={() => handleRevoke(emp.id)} className="w-full text-left px-3.5 sm:px-4 py-2 sm:py-2.5 text-2xs sm:text-xs font-semibold hover:bg-danger/10 text-danger flex items-center gap-2 transition-colors"><UserX size={TOKENS.ICON_SIZES.SM} /> {APP_STRINGS.DASHBOARD.EMP_ACTION_REVOKE}</button>
  </div>
);

export const EmployeeRow = React.memo(({
  emp,
  currentUser,
  isOpen,
  setOpenDropdownId,
  handleRoleChange,
  handleRevoke
}: {
  emp: Employee;
  currentUser: User | null;
  isOpen: boolean;
  setOpenDropdownId: (id: string | null) => void;
  handleRoleChange: (id: string, role: UserRole) => void;
  handleRevoke: (id: string) => void;
}) => (
  <tr className="border-b border-border/50 hover:bg-surface/30 transition-colors group">
    <td className="px-2 sm:px-3 py-2 text-center align-middle">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-background/50 border border-border mx-auto overflow-hidden shadow-inner flex items-center justify-center">
        {emp.avatar_url ? <img src={emp.avatar_url} alt={emp.full_name || emp.email} className="w-full h-full object-cover" /> : <UserCog size={TOKENS.ICON_SIZES.SM} className="text-text-muted" />}
      </div>
    </td>
    <td className="px-2 sm:px-3 py-2 align-middle text-center">
      <div className="flex flex-col items-center justify-center">
        <span className="text-xs sm:text-sm font-bold text-text-main leading-tight truncate max-w-[120px] sm:max-w-none">{emp.full_name || emp.email.split('@')[0]}</span>
        <span className="text-2xs sm:text-xs-tight text-text-muted mt-0.5 bg-background/50 px-2 py-0.5 rounded-full border border-border/50 truncate max-w-[120px] sm:max-w-none">{emp.email}</span>
      </div>
    </td>
    <td className="px-3 py-2 align-middle hidden sm:table-cell">
      <span className="text-xs font-semibold text-text-muted">{format(new Date(emp.created_at), 'dd MMM yyyy', { locale: id })}</span>
    </td>
    <td className="px-2 sm:px-3 py-2 text-center align-middle">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-2xs sm:text-xs-tight font-bold uppercase tracking-widest border bg-primary/10 text-primary border-primary/20">
        {emp.role === USER_ROLE.Supervisor ? <ShieldCheck size={12} className="sm:hidden" /> : <UserCog size={12} className="sm:hidden" />}
        {emp.role === USER_ROLE.Supervisor ? <ShieldCheck size={TOKENS.ICON_SIZES.SM} className="hidden sm:inline" /> : <UserCog size={TOKENS.ICON_SIZES.SM} className="hidden sm:inline" />}
        {emp.role}
      </span>
    </td>
    <td className="px-2 sm:px-3 py-2 text-center align-middle relative">
      {currentUser?.employee_id !== emp.id ? (
        <>
          <button aria-label={APP_STRINGS.DASHBOARD.EMP_TABLE_COL_ACTION} onClick={() => setOpenDropdownId(isOpen ? null : emp.id)} className="p-1 sm:p-1.5 text-text-muted hover:text-text-main hover:bg-background rounded-lg transition-colors inline-flex"><MoreVertical size={TOKENS.ICON_SIZES.MD} /></button>
          {isOpen && <EmployeeActionDropdown emp={emp} handleRoleChange={handleRoleChange} handleRevoke={handleRevoke} />}
        </>
      ) : (
        <span className="text-2xs sm:text-xs-tight font-bold text-primary uppercase tracking-widest px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary/10 rounded-md">{APP_STRINGS.DASHBOARD.EMP_YOU}</span>
      )}
    </td>
  </tr>
));
