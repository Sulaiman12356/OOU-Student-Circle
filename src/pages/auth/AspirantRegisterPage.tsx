import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone,
  Building,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OouLogo } from '../../components/brand/OouLogo';

interface AspirantRegisterPageProps {
  onNavigate: (path: string) => void;
}

export const AspirantRegisterPage: React.FC<AspirantRegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jambRegNumber, setJambRegNumber] = useState('');
  const [faculty, setFaculty] = useState('Faculty of Science');
  const [intendedCourse, setIntendedCourse] = useState('Computer Science');
  const [entrySession, setEntrySession] = useState('2024/2025');
  const [homeLocation, setHomeLocation] = useState('Lagos State');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !jambRegNumber) {
      setError('Please fill in all required fields including your JAMB registration number.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        role: 'student',
        userType: 'aspirant',
        isAspirant: true,
        jambRegNumber: jambRegNumber.trim().toUpperCase(),
        faculty,
        department: intendedCourse,
        intendedCourse,
        entrySession,
        location: homeLocation,
        level: '100L'
      }, password);

      if (result.success) {
        // Direct directly to Campus Hub with Aspirant document package ready!
        onNavigate('/campus');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Top Brand Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div onClick={() => onNavigate('/')} className="inline-block cursor-pointer">
          <OouLogo size="md" />
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>OOU Aspirant & Candidate Gateway</span>
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
          Get Your Campus Documents Ready
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Upload your credentials before traveling to Ago-Iwoye. Collect your verified screening pack immediately on arrival at Motion Ground.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200">
          
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chidinma Okafor"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Phone / WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+234 812 345 6789"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aspirant@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                  />
                </div>
              </div>
            </div>

            {/* JAMB Registration Number */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>JAMB Registration Number *</span>
                <span className="text-[10px] text-slate-400 font-normal">Stored securely & private</span>
              </label>
              <input
                type="text"
                required
                value={jambRegNumber}
                onChange={(e) => setJambRegNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 202410984723AB"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#061A4F] uppercase"
              />
            </div>

            {/* Intended Course & Faculty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Faculty *</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                >
                  <option value="Faculty of Science">Faculty of Science</option>
                  <option value="Faculty of Social and Management Sciences">Faculty of Social & Management Sciences</option>
                  <option value="Faculty of Arts">Faculty of Arts</option>
                  <option value="Faculty of Law">Faculty of Law</option>
                  <option value="Faculty of Basic Medical Sciences">Faculty of Basic Medical Sciences</option>
                  <option value="Faculty of Clinical Sciences">Faculty of Clinical Sciences</option>
                  <option value="Faculty of Education">Faculty of Education</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="Faculty of Pharmacy">Faculty of Pharmacy</option>
                  <option value="Faculty of Agricultural Sciences">Faculty of Agricultural Sciences</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Intended Course of Study</label>
                <input
                  type="text"
                  value={intendedCourse}
                  onChange={(e) => setIntendedCourse(e.target.value)}
                  placeholder="e.g. Medicine, Computer Science, Law"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                />
              </div>
            </div>

            {/* City & Session */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Current Location / State</label>
                <input
                  type="text"
                  value={homeLocation}
                  onChange={(e) => setHomeLocation(e.target.value)}
                  placeholder="e.g. Lagos, Ibadan, Abeokuta"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Entry Academic Session</label>
                <input
                  type="text"
                  value={entrySession}
                  onChange={(e) => setEntrySession(e.target.value)}
                  placeholder="2024/2025"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#061A4F]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#061A4F] hover:bg-[#0A2265] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Setting up account...</span>
                ) : (
                  <>
                    <span>Create Aspirant Account & Prepare Docs</span>
                    <ArrowRight className="w-4 h-4 text-[#F5B400]" />
                  </>
                )}
              </button>
            </div>

          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <button
              onClick={() => onNavigate('/auth/login')}
              className="text-[#061A4F] font-bold hover:underline"
            >
              Sign in to your account
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
