import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminService } from '../../services/adminService';
import { SUPER_ADMIN_PERMISSIONS } from '../../types/admin';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  ShieldAlert,
  Server,
  Image as ImageIcon
} from 'lucide-react';

interface AdminSetupPageProps {
  onNavigate: (path: string) => void;
}

export const AdminSetupPage: React.FC<AdminSetupPageProps> = ({ onNavigate }) => {
  const { isAdminAuthenticated, isSuperAdmin, adminProfile } = useAdminAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [existingAdminInfo, setExistingAdminInfo] = useState<{ email?: string; name?: string } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      setIsCheckingStatus(true);
      try {
        const result = await AdminService.checkSuperAdminExists();
        if (result.exists) {
          setIsLocked(true);
          setExistingAdminInfo({ email: result.email, name: result.name });
        }
      } catch (err) {
        console.warn('SuperAdmin existence check notice:', err);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, []);

  // If already authenticated as SuperAdmin
  if (isAdminAuthenticated && isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#040E29] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#061A4F] p-8 rounded-3xl border border-[#F5B400]/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#F5B400]/20 rounded-2xl flex items-center justify-center mx-auto border border-[#F5B400]/40">
            <ShieldCheck className="w-8 h-8 text-[#F5B400]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">SuperAdmin Configured</h2>
            <p className="text-xs text-slate-300">
              You are currently authenticated as the platform Super Administrator (<span className="text-[#F5B400] font-bold">{adminProfile?.email}</span>).
            </p>
          </div>
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate('/admin/superadmin')}
              className="w-full py-3.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-black rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Enter SuperAdmin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/admin/dashboard')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl transition text-xs border border-white/10 cursor-pointer"
            >
              Open Standard Admin View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If setup is locked because a SuperAdmin is already provisioned
  if (!isCheckingStatus && isLocked) {
    return (
      <div className="min-h-screen bg-[#040E29] text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-[#061A4F] p-8 sm:p-10 rounded-3xl border border-rose-500/40 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/40 text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
              Setup Provisioning Locked
            </span>
            <h2 className="text-2xl font-black">Initial SuperAdmin Already Configured</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              The primary root Super Administrator account has already been created in Firestore for this platform. Random user registration for administrative roles is strictly prevented.
            </p>
          </div>

          <div className="p-4 bg-[#040E29] rounded-2xl border border-white/10 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Setup Status:</span>
              <span className="font-mono text-[#F5B400] font-bold">Active & Configured</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Security State:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero-Trust RBAC Active
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onNavigate('/secure-admin')}
              className="w-full py-3.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-black rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl transition text-xs border border-white/10 cursor-pointer"
            >
              Return to Public Platform
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required setup fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters with letters, numbers, and symbols.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    setIsLoading(true);
    try {
      const res = await AdminService.setupFirstSuperAdmin({
        fullName: fullName.trim(),
        email: cleanEmail,
        password,
        profilePhoto,
        verificationCode: securityKey
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onNavigate('/admin/superadmin');
        }, 1200);
      } else {
        setError(res.error || 'Failed to initialize SuperAdmin account.');
      }
    } catch (err: any) {
      setError(err.message || 'Setup error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040E29] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#061A4F]/80 to-transparent pointer-events-none blur-3xl opacity-50" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 space-y-6">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/secure-admin')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Portal</span>
        </button>

        {/* Title Card */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#061A4F] border border-[#F5B400]/40 rounded-2xl mx-auto flex items-center justify-center text-[#F5B400] shadow-xl">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5B400]/10 border border-[#F5B400]/30 rounded-full text-[#F5B400] text-[10px] font-black uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            <span>Authorized Setup Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            SuperAdmin Account Initialization
          </h1>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Provision the primary platform Super Administrator with full governance, RBAC management, and audit capabilities.
          </p>
        </div>

        {/* Setup Form Card */}
        <div className="bg-[#061A4F] py-8 px-6 shadow-2xl rounded-3xl border border-white/10 sm:px-8 space-y-6">
          
          {error && (
            <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-start gap-3 text-emerald-300 text-xs">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">SuperAdmin Account Initialized!</p>
                <p className="text-[11px] text-emerald-400/90 mt-0.5">Redirecting to SuperAdmin Center...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSetupSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sulaiman Ipesola"
                className="w-full px-4 py-3 bg-[#040E29] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-[#F5B400] transition"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>SuperAdmin Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@ooustudentcircle.com"
                className="w-full px-4 py-3 bg-[#040E29] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-[#F5B400] transition"
              />
              <p className="text-[10px] text-slate-400">
                Primary platform owner email configured in zero-trust policy.
              </p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Master Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 bg-[#040E29] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-[#F5B400] transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Confirm Master Password</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                className="w-full px-4 py-3 bg-[#040E29] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-[#F5B400] transition"
              />
            </div>

            {/* Profile Picture URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Profile Photo URL (Optional)</span>
              </label>
              <input
                type="url"
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-[#040E29] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-[#F5B400] transition"
              />
            </div>

            {/* Security / Bootstrap Verification */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Security / Bootstrap Verification Code</span>
              </label>
              <input
                type="password"
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                placeholder="Required if not root owner email"
                className="w-full px-4 py-3 bg-[#040E29] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-[#F5B400] transition"
              />
              <p className="text-[10px] text-slate-400">
                Verified platform ownership authorization guard.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-black rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-xs cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Server className="w-4 h-4 animate-spin" />
                    <span>Initializing SuperAdmin Record...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Initialize SuperAdmin Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="p-4 bg-[#040E29] rounded-2xl border border-white/5 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-[#F5B400] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Setup Policy</span>
            </div>
            <p>
              Once initialized, this setup portal will lock automatically. Additional administrators must be created and accredited by the SuperAdmin from inside the governance console.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
