
import { useMemo } from 'react';
import { useAppContext } from '../state/AppContext.tsx';
import { EmployeePermission, UserRole } from '../types.ts';
import { useAuth } from '../state/AuthContext';

export const usePermissions = () => {
    const { state } = useAppContext();
    const { authState } = useAuth();
    const { currentUser } = authState;
    const { companyData } = state;

    const hasPermission = useMemo(() => (permission: EmployeePermission): boolean => {
        if (!currentUser) return false;

        if (currentUser.role === UserRole.COMPANY_ADMIN || currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.BRANCH_MANAGER) {
            return true;
        }

        if (currentUser.role === UserRole.EMPLOYEE && currentUser.companyId && currentUser.roleId) {
            const company = companyData[currentUser.companyId];
            const role = company?.roles.find(r => r.id === currentUser.roleId);
            
            if (!role) return false;

            // If the user has general permissions, they have all permissions.
            if (role.permissions.includes(EmployeePermission.HAS_GENERAL_PERMISSIONS)) {
                return true;
            }

            return role.permissions.includes(permission);
        }

        return false;
    }, [currentUser, companyData]);

    return { hasPermission };
};
