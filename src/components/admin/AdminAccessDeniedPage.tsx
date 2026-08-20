import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, UserCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AdminAccessDeniedPageProps {
  onNavigate: (path: string) => void;
}

export const AdminAccessDeniedPage: React.FC<AdminAccessDeniedPageProps> = ({ onNavigate }) => {
  const { currentUser, loginAsDemo } = useAuth();

  const handleTestRole = (role: UserRole, userId?: string) => {
    loginAsDemo(role, userId);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-red-200 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-sm animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>403 Forbidden • Access Denied</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
            Administrator Privilege Required
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            The OOU StudentCircle Control Center is strictly restricted to authenticated platform administrators. Your current account does not hold administrative authorization.
          </p>
        </div>

        {/* Current User Role Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Session Status</div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">User:</span>
            <span className="font-bold text-[#061A4F]">{currentUser?.fullName || 'Guest User'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Account Role:</span>
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-900 uppercase text-[11px]">
              {currentUser?.role || 'anonymous'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Admin Authorization:</span>
            <span className="font-bold text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>DENIED</span>
            </span>
          </div>
        </div>

        {/* Security Test Switcher (Requirement: Test access as Normal Student, Vendor, Client, and Admin) */}
        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#061A4F] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F5B400]" />
              <span>Admin Security & Role Test Suite</span>
            </span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Interactive Test Mode
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Select an account role below to test the access control enforcement:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => handleTestRole('student', 'student-1')}
              className={`p-2 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                currentUser?.role === 'student' && currentUser?.id === 'student-1'
                  ? 'bg-[#061A4F] text-white border-[#061A4F]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-[11px]">Normal Student</span>
              <span className="text-[9px] font-mono text-red-500 font-bold">[DENIED]</span>
            </button>

            <button
              onClick={() => handleTestRole('student', 'student-4')}
              className={`p-2 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                currentUser?.id === 'student-4'
                  ? 'bg-[#061A4F] text-white border-[#061A4F]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-[11px]">Campus Vendor</span>
              <span className="text-[9px] font-mono text-red-500 font-bold">[DENIED]</span>
            </button>

            <button
              onClick={() => handleTestRole('client', 'client-1')}
              className={`p-2 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                currentUser?.role === 'client'
                  ? 'bg-[#061A4F] text-white border-[#061A4F]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-[11px]">External Client</span>
              <span className="text-[9px] font-mono text-red-500 font-bold">[DENIED]</span>
            </button>

            <button
              onClick={() => handleTestRole('admin', 'admin-1')}
              className={`p-2 rounded-xl border text-center font-bold transition flex flex-col items-center gap-1 ${
                currentUser?.role === 'admin'
                  ? 'bg-emerald-700 text-white border-emerald-800'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <span className="text-[11px]">Platform Admin</span>
              <span className="text-[9px] font-mono text-emerald-600 font-bold">[AUTHORIZED]</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Marketplace</span>
          </button>
          <button
            onClick={() => onNavigate('/login')}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#061A4F] hover:bg-[#08226b] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md"
          >
            <UserCheck className="w-4 h-4 text-[#F5B400]" />
            <span>Sign In with Admin Account</span>
          </button>
        </div>

      </div>
    </div>
  );
};
