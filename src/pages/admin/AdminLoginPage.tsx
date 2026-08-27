import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { SUPER_ADMIN_EMAIL } from '../../types/admin';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Server
} from 'lucide-react';
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { loginAdmin, bootstrapSuperAdmin, isAdminAuthenticated, isSuperAdmin, adminProfile } = useAdminAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // If already logged in, show redirect button
  if (isAdminAuthenticated && adminProfile) {
    return (
      <div className="min-h-screen bg-[#040E29] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#061A4F] p-8 rounded-3xl border border-[#F5B400]/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#F5B400]/20 rounded-2xl flex items-center justify-center mx-auto border border-[#F5B400]/40">
            <ShieldCheck className="w-8 h-8 text-[#F5B400]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">Administrator Session Active</h2>
            <p className="text-xs text-slate-300">
              Authenticated as <span className="text-[#F5B400] font-bold">{adminProfile.name}</span> ({adminProfile.role})
            </p>
          </div>
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate(isSuperAdmin ? '/admin/superadmin' : '/admin/dashboard')}
              className="w-full py-3.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-black rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{isSuperAdmin ? 'Open SuperAdmin Center' : 'Proceed to Admin Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl transition text-xs border border-white/10 cursor-pointer"
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setIsLoading(true);
    const res = await loginAdmin(email, password);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Authentication verified. Redirecting to workspace...');
      setTimeout(() => {
        if (res.isSuperAdmin || res.role === 'SUPER_ADMIN' || res.role === 'super_admin') {
          onNavigate('/admin/superadmin');
        } else {
          onNavigate('/admin/dashboard');
        }
      }, 500);
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError('Please enter your administrator email.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    try {
      if (auth) {
        await sendPasswordResetEmail(auth, forgotEmail.trim());
        setForgotSuccess(true);
      } else {
        setForgotError('Authentication service is initializing. Please try again.');
      }
    } catch (err: any) {
      setForgotError(err.message || 'Could not send password reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBootstrapSuperAdmin = async () => {
    setIsLoading(true);
    setError(null);
    const res = await bootstrapSuperAdmin();
    setIsLoading(false);
    if (res.success) {
      setSuccessMsg('Super Administrator initialized in database! Redirecting...');
      setTimeout(() => {
        onNavigate('/admin/superadmin');
      }, 700);
    } else {
      setError(res.error || 'Failed to bootstrap Super Admin.');
    }
  };

  return (
    <div className="min-h-screen bg-[#040E29] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#061A4F]/80 to-transparent pointer-events-none blur-3xl opacity-50" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to OOU StudentCircle</span>
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#061A4F] border-2 border-[#F5B400] shadow-xl text-[#F5B400]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            OOU StudentCircle Administration
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Authorized personnel gateway for platform governance, identity verification, and financial arbitration.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#061A4F]/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-[#F5B400]/30 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Authentication Notice</span>
                <p className="text-rose-300/90">{error}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ooustudentcircle.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#040E29]/80 border border-slate-700 focus:border-[#F5B400] text-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F5B400] transition placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] font-semibold text-[#F5B400] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#040E29]/80 border border-slate-700 focus:border-[#F5B400] text-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F5B400] transition placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 bg-[#040E29] text-[#F5B400] focus:ring-[#F5B400]"
                />
                <span>Remember Me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#F5B400] hover:bg-[#e0a400] disabled:opacity-50 text-[#061A4F] text-xs font-black rounded-xl transition flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#061A4F] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* First-Run SuperAdmin Setup helper */}
          <div className="pt-4 border-t border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Server className="w-3 h-3 text-[#F5B400]" />
                <span>SuperAdmin Platform Setup</span>
              </span>
              <span className="text-[10px] text-slate-500">Authorized</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/admin/setup')}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-bold rounded-xl transition border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3 h-3 text-[#F5B400]" />
                <span>First-Time Setup</span>
              </button>
              
              <button
                type="button"
                onClick={handleBootstrapSuperAdmin}
                disabled={isLoading}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-bold rounded-xl transition border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#F5B400]" />
                <span>Quick Bootstrap</span>
              </button>
            </div>
          </div>

        </div>

        {/* Security Notice Footer */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Protected by OOU StudentCircle Zero-Trust Security Architecture.</p>
          <p>All administrative logins, queries, and mutations are immutably audited in Firestore.</p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#061A4F] border border-[#F5B400]/40 max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#F5B400]" />
                <span>Reset Administrator Password</span>
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Reset Email Dispatched</span>
                  </div>
                  <p>
                    Instructions to reset your password have been sent to <span className="font-bold text-white">{forgotEmail}</span>.
                  </p>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 bg-[#F5B400] text-[#061A4F] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4 text-xs">
                <p className="text-slate-300">
                  Enter your registered administrator email to receive a secure Firebase password reset link.
                </p>

                {forgotError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-[11px]">
                    {forgotError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@ooustudentcircle.com"
                    className="w-full px-3 py-2 bg-[#040E29] border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F5B400]"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
