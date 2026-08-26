import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { OouLogo } from '../../components/brand/OouLogo';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';
import { getRoleDashboardPath, normalizeUserRole } from '../../types';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, loginWithGoogle, resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resetMsg, setResetMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your registered email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success && res.user) {
      const dest = res.redirectPath || getRoleDashboardPath(res.role, res.user);
      setSuccessMessage(`Welcome back, ${res.user.fullName || 'User'}! Redirecting to your dashboard...`);
      setTimeout(() => {
        onNavigate(dest);
      }, 500);
    } else {
      setErrorMessage(res.error || 'Invalid email or password. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    const res = await loginWithGoogle();
    if (res.success && res.user) {
      const dest = res.redirectPath || getRoleDashboardPath(res.role, res.user);
      setSuccessMessage(`Signed in as ${res.user.fullName || res.user.email}! Redirecting...`);
      setTimeout(() => {
        onNavigate(dest);
      }, 500);
    } else {
      setErrorMessage(res.error || 'Google sign-in could not be completed.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetStatus('sending');
    const res = await resetPassword(resetEmail);
    if (res.success) {
      setResetStatus('sent');
      setResetMsg('Password reset instructions have been sent to your email. Check your inbox or spam folder.');
    } else {
      setResetStatus('error');
      setResetMsg(res.error || 'Failed to send reset email. Please ensure the email is correct.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#F5B400] selection:text-[#061A4F]">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div 
          onClick={() => onNavigate('/')} 
          className="cursor-pointer inline-flex items-center justify-center p-2 rounded-2xl hover:bg-white transition shadow-xs"
        >
          <OouLogo size="lg" />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#061A4F] tracking-tight">
            WELCOME BACK TO OOU STUDENTCIRCLE
          </h1>
          <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">
            Connect. Find services. Buy. Sell. Grow.
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">

          {/* Feedback banners */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Primary Action: LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@student.oouagoiwoye.edu.ng"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetModalOpen(true);
                  }}
                  className="text-xs text-[#061A4F] hover:text-[#0B2A6F] hover:underline font-bold transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] transition placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Action Button: LOGIN */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              <span>{isLoading ? 'Authenticating...' : 'LOGIN'}</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400] group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-bold">
              Or continue with
            </span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Secondary Action: CREATE AN ACCOUNT */}
          <div className="pt-5 border-t border-slate-100 space-y-3 text-center">
            <div className="text-xs text-slate-500 font-medium">
              Don't have an account on StudentCircle?
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/auth/register')}
              className="w-full py-3 px-4 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-[#061A4F] font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-4 h-4 text-[#F5B400]" />
              <span>CREATE AN ACCOUNT</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#061A4F] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('/')}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition"
            >
              ← Return to Home Page
            </button>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#061A4F]">Reset Your Password</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered StudentCircle email address below. We'll send you a secure link to reset your credentials.
              </p>
            </div>

            {resetStatus === 'sent' ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <span className="leading-relaxed font-medium">{resetMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResetModalOpen(false);
                    setResetStatus('idle');
                  }}
                  className="w-full py-3 bg-[#061A4F] text-white font-bold text-xs rounded-xl hover:bg-[#0B2A6F] transition"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {resetStatus === 'error' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    {resetMsg}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                  />
                </div>
                <div className="flex gap-2.5 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalOpen(false);
                      setResetStatus('idle');
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetStatus === 'sending'}
                    className="px-5 py-2.5 bg-[#061A4F] text-white font-bold text-xs rounded-xl hover:bg-[#0B2A6F] transition disabled:opacity-50"
                  >
                    {resetStatus === 'sending' ? 'Sending link...' : 'Send Reset Link'}
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
