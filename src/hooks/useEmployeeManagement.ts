import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { APP_STRINGS } from '../constants/strings';
import { TOAST_IDS } from '../constants/toastIds';
import { useEmployees } from './useEmployees';
import { type UserRole } from '../constants/enums';
import { toAppError } from '../utils/errors';
import { APP_CONFIG } from '../constants/config';

export function useEmployeeManagement() {
  const { data: employees = [], isLoading: loading, updateRole, revokeAccess } = useEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(emp => emp.full_name?.toLowerCase().includes(q) || emp.email?.toLowerCase().includes(q));
  }, [employees, searchQuery]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery]);

  const itemsPerPage = APP_CONFIG.UI.ITEMS_PER_PAGE;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRoleChange = async (employeeId: string, newRole: UserRole) => {
    try {
      await updateRole.mutateAsync({ employeeId, newRole: newRole as Extract<UserRole, 'WORKER' | 'SUPERVISOR'> });
      toast.success(APP_STRINGS.ACTION_MESSAGES.ROLE_UPDATE_SUCCESS);
    } catch (err: unknown) {
      toast.error(toAppError(err).message, { id: TOAST_IDS.ROLE_ERROR });
    }
  };

  const handleRevoke = async (employeeId: string) => {
    try {
      await revokeAccess.mutateAsync(employeeId);
      toast.success(APP_STRINGS.ACTION_MESSAGES.ACCESS_REVOKE_SUCCESS);
    } catch (err: unknown) {
      toast.error(toAppError(err).message, { id: TOAST_IDS.REVOKE_ERROR });
    }
  };

  return { 
    employees, loading, handleRoleChange, handleRevoke,
    searchQuery, setSearchQuery, currentPage, setCurrentPage,
    paginatedEmployees, totalPages, itemsPerPage, totalFiltered: filteredEmployees.length
  };
}
