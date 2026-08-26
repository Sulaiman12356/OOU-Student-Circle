import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAuth } from '../../context/AuthContext';
import { AdminPermission } from '../../types/admin';
import { AdminAccessDeniedPage } from './AdminAccessDeniedPage';

interface AdminAccessGuardProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  requiredRole?: 'SUPER_ADMIN' | 'ADMIN';
  requiredPermission?: AdminPermission;
}

export const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({ 
  children, 
  onNavigate,
  requiredRole,
  requiredPermission
}) => {
  const { adminProfile, isAdminAuthenticated, isSuperAdmin, hasPermission, isLoading: adminLoading } = useAdminAuth();
  const { currentUser, isLoading: userLoading } = useAuth();

  if (adminLoading || userLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#061A4F]" />
      </div>
    );
  }

  // 1. Basic Admin Authentication Check (Firestore 'admins' collection verification)
  const isAuthorizedAdmin = isAdminAuthenticated && !!adminProfile && adminProfile.status === 'active';

  if (!isAuthorizedAdmin) {
    return <AdminAccessDeniedPage onNavigate={onNavigate} reason="unauthenticated" />;
  }

  // 2. SuperAdmin Only Check
  if (requiredRole === 'SUPER_ADMIN' && !isSuperAdmin) {
    return (
      <AdminAccessDeniedPage 
        onNavigate={onNavigate} 
        reason="superadmin_required" 
        currentRole={adminProfile.role}
      />
    );
  }

  // 3. Granular Permission Check
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <AdminAccessDeniedPage 
        onNavigate={onNavigate} 
        reason="permission_missing" 
        requiredPermission={requiredPermission}
        currentRole={adminProfile.role}
      />
    );
  }

  return <>{children}</>;
};

