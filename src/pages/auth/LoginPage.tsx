import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { OouLogo } from '../../components/brand/OouLogo';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, GraduationCap, Briefcase, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, loginWithGoogle, resetPassword, loginAsDemo, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resetMsg, setResetMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'ipesolasulaiman@gmail.com') {
        onNavigate('/admin');
      } else if (email.toLowerCase().includes('client') || email.toLowerCase().includes('apex')) {
        onNavigate('/client/dashboard');
      } else {
        onNavigate('/student/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    const res = await loginWithGoogle();
    if (res.success) {
      onNavigate('/student/dashboard');
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
      setResetMsg('Password reset email sent! Check your inbox.');
    } else {
      setResetStatus('error');
      setResetMsg(res.error || 'Failed to send reset email.');
    }
  };

  const handleQuickDemoLogin = (role: 'student' | 'client' | 'admin', id?: string) => {
    loginAsDemo(role, id);
    if (role === 'admin') onNavigate('/admin');
    else if (role === 'client') onNavigate('/client/dashboard');
    else onNavigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#F5B400] selection:text-[#061A4F]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div onClick={() => onNavigate('/')} className="cursor-pointer inline-block">
          <OouLogo size={48} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#061A4F]">
          Sign in to StudentCircle
        </h2>
        <p className="text-xs text-slate-500">
          Connecting OOU Student Talent to Real Opportunities
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          
          {/* Quick Demo Selector */}
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-2.5">
            <div className="text-[11px] font-bold text-[#061A4F] uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Instant Test Accounts (1-Click)</span>
              </div>
              <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded font-bold">DEMO</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student', 'student-1')}
                className="p-2 bg-white rounded-xl border border-blue-200 hover:border-[#061A4F] text-[11px] font-bold text-[#061A4F] shadow-sm transition text-center"
              >
                <GraduationCap className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('client', 'client-1')}
                className="p-2 bg-white rounded-xl border border-blue-200 hover:border-[#061A4F] text-[11px] font-bold text-[#061A4F] shadow-sm transition text-center"
              >
                <Briefcase className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                <span>Client</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'admin-1')}
                className="p-2 bg-white rounded-xl border border-blue-200 hover:border-[#061A4F] text-[11px] font-bold text-[#061A4F] shadow-sm transition text-center"
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sulaiman@ooustudentcircle.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-[11px] text-blue-700 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In with Email'}</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium">Or continue with</span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Bottom links */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('/auth/register')}
              className="font-bold text-[#061A4F] hover:underline"
            >
              Register here
            </button>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-[#061A4F]">Reset Password</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered email address and we'll send you instructions to reset your password.
            </p>

            {resetStatus === 'sent' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span>{resetMsg}</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                {resetStatus === 'error' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    {resetMsg}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalOpen(false);
                      setResetStatus('idle');
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetStatus === 'sending'}
                    className="px-5 py-2 bg-[#061A4F] text-white font-bold text-xs rounded-xl hover:bg-[#0B2A6F]"
                  >
                    {resetStatus === 'sending' ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}

            {resetStatus === 'sent' && (
              <button
                onClick={() => {
                  setResetModalOpen(false);
                  setResetStatus('idle');
                }}
                className="w-full py-2.5 bg-[#061A4F] text-white font-bold text-xs rounded-xl hover:bg-[#0B2A6F]"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
