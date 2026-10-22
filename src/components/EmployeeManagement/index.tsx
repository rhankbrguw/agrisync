import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { APP_STRINGS } from '../../constants/strings';
import { TOKENS } from '../../constants/tokens';
import { useAuthStore, type AuthState } from '../../store/authStore';
import { useEmployeeManagement } from '../../hooks/useEmployeeManagement';
import { EmployeeRow, RevokeAccessModal } from './components';
import { Skeleton } from '../Skeleton';
import { EmptyState } from '../EmptyState';
import { PaginationFooter } from '../PaginationFooter';
import { type UserRole } from '../../constants/enums';

export function EmployeeManagement() {
  const currentUser = useAuthStore((state: AuthState) => state.user);
  const { 
    employees, loading, handleRoleChange, handleRevoke,
    searchQuery, setSearchQuery, currentPage, setCurrentPage,
    paginatedEmployees, totalPages, itemsPerPage, totalFiltered
  } = useEmployeeManagement();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<{ id: string; name: string } | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleRoleChangeWrapper = React.useCallback(async (id: string, role: UserRole) => {
    await handleRoleChange(id, role);
    setOpenDropdownId(null);
  }, [handleRoleChange]);

  const handleRevokeWrapper = React.useCallback((id: string, name: string) => {
    setRevokeTarget({ id, name });
    setOpenDropdownId(null);
  }, []);

  const confirmRevoke = async () => {
    if (!revokeTarget) return;
    setIsRevoking(true);
    await handleRevoke(revokeTarget.id);
    setIsRevoking(false);
    setRevokeTarget(null);
  };

  return (
    <div className="bg-surface/80 sm:bg-surface/50 rounded-2xl sm:rounded-[2rem] border border-border overflow-hidden flex flex-col h-full shadow-sm">
      <div className="px-3.5 py-2.5 sm:px-5 sm:py-4 border-b border-border flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center justify-between bg-surface/30">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-3 text-text-main">
            <UserCog size={TOKENS.ICON_SIZES.SM} className="text-primary sm:hidden" />
            <UserCog size={TOKENS.ICON_SIZES.MD} className="text-primary hidden sm:inline" /> 
            <span className="hidden sm:inline">{APP_STRINGS.DASHBOARD.EMP_TABLE_TITLE}</span>
            <span className="sm:hidden">{APP_STRINGS.DASHBOARD.MEMBERS.toUpperCase()}</span>
          </h2>
          <Link to={ROUTES.BILLING} className="flex sm:hidden items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-primary to-info text-text-inverse rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-md">
            <Sparkles size={10} /> {APP_STRINGS.BILLING.UPGRADE_SHORT}
          </Link>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-56 lg:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder={APP_STRINGS.DASHBOARD.SEARCH_EMP_PLACEHOLDER} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 sm:h-9 pl-9 pr-4 bg-background border border-border rounded-lg text-xs sm:text-sm text-text-main placeholder-text-muted/50 focus:border-primary outline-none transition-colors shadow-sm"
            />
          </div>
          <Link to={ROUTES.BILLING} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-info text-text-inverse rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 hover:brightness-110 shrink-0">
            <Sparkles size={14} /> {APP_STRINGS.BILLING.UPGRADE_LONG}
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface/20">
              <th className="px-2 sm:px-3 py-2.5 sm:py-3 text-2xs sm:text-xs-tight font-bold text-text-muted uppercase tracking-widest w-12">{APP_STRINGS.DASHBOARD.EMP_TABLE_COL_PROFILE}</th>
              <th className="px-2 sm:px-3 py-2.5 sm:py-3 text-2xs sm:text-xs-tight font-bold text-text-muted uppercase tracking-widest">{APP_STRINGS.DASHBOARD.EMP_TABLE_COL_INFO}</th>
              <th className="px-2 sm:px-3 py-2.5 sm:py-3 text-2xs sm:text-xs-tight font-bold text-text-muted uppercase tracking-widest hidden sm:table-cell">{APP_STRINGS.DASHBOARD.EMP_TABLE_COL_JOINED}</th>
              <th className="px-2 sm:px-3 py-2.5 sm:py-3 text-2xs sm:text-xs-tight font-bold text-text-muted uppercase tracking-widest">{APP_STRINGS.DASHBOARD.EMP_TABLE_COL_ROLE}</th>
              <th className="px-2 sm:px-3 py-2.5 sm:py-3 text-2xs sm:text-xs-tight font-bold text-text-muted uppercase tracking-widest w-12 sm:w-16">{APP_STRINGS.DASHBOARD.EMP_TABLE_COL_ACTION}</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={5} className="p-4">
                    <div className="space-y-2.5 sm:space-y-3">
                      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 sm:h-12 w-full rounded-lg" variant="rectangular" />)}
                    </div>
                  </td>
                </motion.tr>
              ) : employees.length === 0 ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={5} className="p-6 sm:p-8">
                    <EmptyState icon={UserCog} title={APP_STRINGS.DASHBOARD.EMP_TABLE_TITLE} description={APP_STRINGS.DASHBOARD.EMP_EMPTY} />
                  </td>
                </motion.tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <EmployeeRow 
                    key={emp.id} 
                    emp={emp} 
                    currentUser={currentUser} 
                    isOpen={openDropdownId === emp.id} 
                    setOpenDropdownId={setOpenDropdownId} 
                    handleRoleChange={handleRoleChangeWrapper} 
                    handleRevoke={(id) => handleRevokeWrapper(id, emp.full_name || emp.email)} 
                  />
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      <PaginationFooter 
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalFiltered}
        entityName={APP_STRINGS.DASHBOARD.MEMBERS_LOWER}
        onPageChange={setCurrentPage}
      />

      <RevokeAccessModal
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={confirmRevoke}
        employeeName={revokeTarget?.name || ''}
        isLoading={isRevoking}
      />
    </div>
  );
}

