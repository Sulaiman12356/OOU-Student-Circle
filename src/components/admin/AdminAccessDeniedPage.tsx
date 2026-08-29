import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, ShieldCheck, AlertTriangle, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminPermission } from '../../types/admin';

interface AdminAccessDeniedPageProps {
  onNavigate: (path: string) => void;
  reason?: 'unauthenticated' | 'superadmin_required' | 'permission_missing' | 'suspended';
  requiredPermission?: AdminPermission;
  currentRole?: string;
}

export const AdminAccessDeniedPage: React.FC<AdminAccessDeniedPageProps> = ({ 
  onNavigate,
  reason = 'unauthenticated',
  requiredPermission,
  currentRole
}) => {
  const { currentUser } = useAuth();
  const { adminProfile } = useAdminAuth();

  const getReasonDetails = () => {
    switch (reason) {
      case 'superadmin_required':
        return {
          title: 'SuperAdmin Authorization Required',
          description: 'This platform governance view is strictly restricted to the Super Administrator. Standard Administrator credentials do not have clearance for root access.',
          badge: 'SuperAdmin Clearance Required'
        };
      case 'permission_missing':
        return {
          title: 'Insufficient Administrative Privileges',
          description: `Your administrator account is missing the required permission (${requiredPermission || 'restricted'}). Contact the SuperAdmin to adjust your access matrix.`,
          badge: 'Missing Permission'
        };
      case 'suspended':
        return {
          title: 'Administrator Account Suspended',
          description: 'This administrative profile has been suspended by the Super Administrator. Administrative operations are disabled.',
          badge: 'Account Suspended'
        };
      case 'unauthenticated':
      default:
        return {
          title: 'Administrator Authorization Required',
          description: 'The OOU StudentCircle Control Center is strictly restricted to authenticated platform administrators. Your session does not possess verified administrator credentials.',
          badge: '403 Forbidden • Access Denied'
        };
    }
  };

  const details = getReasonDetails();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>{details.badge}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#061A4F]">
            {details.title}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            {details.description}
          </p>
        </div>

        {/* Current User Role Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Session Status</div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">User Identity:</span>
            <span className="font-bold text-[#061A4F]">{adminProfile?.name || currentUser?.fullName || 'Unauthenticated'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Account Role:</span>
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-900 uppercase text-[10px]">
              {currentRole || adminProfile?.role || currentUser?.role || 'None'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Admin Authorization:</span>
            <span className="font-bold text-rose-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>DENIED</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-1/2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>
          <button
            onClick={() => onNavigate('/secure-admin')}
            className="w-full sm:w-1/2 px-4 py-2.5 bg-[#061A4F] hover:bg-[#08226b] text-[#F5B400] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>Administrator Access</span>
          </button>
        </div>

      </div>
    </div>
  );
};

