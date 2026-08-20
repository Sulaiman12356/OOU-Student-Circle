import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminAccessDeniedPage } from './AdminAccessDeniedPage';

interface AdminAccessGuardProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({ children, onNavigate }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#061A4F]" />
      </div>
    );
  }

  // Security Check: strictly enforce role === 'admin'
  const isAuthorizedAdmin = currentUser && currentUser.role === 'admin';

  if (!isAuthorizedAdmin) {
    return <AdminAccessDeniedPage onNavigate={onNavigate} />;
  }

  return <>{children}</>;
};
