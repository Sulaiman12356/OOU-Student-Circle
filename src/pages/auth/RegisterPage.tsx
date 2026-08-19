import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { OouLogo } from '../../components/brand/OouLogo';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('Ago-Iwoye Main Campus');

  // Student specific
  const [faculty, setFaculty] = useState('Faculty of Science');
  const [department, setDepartment] = useState('Computer Science');
  const [level, setLevel] = useState<'100L' | '200L' | '300L' | '400L' | '500L' | 'Postgraduate'>('300L');
  const [matricNumber, setMatricNumber] = useState('');
  const [skillsInput, setSkillsInput] = useState('Graphic Design, Logo Design, Branding');
  const [shortBio, setShortBio] = useState('Enthusiastic OOU student looking forward to taking on client projects.');

  // Client specific
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Brand & Creative Agency');
  const [businessDescription, setBusinessDescription] = useState('');

  const faculties = [
    'Faculty of Science',
    'Faculty of Arts',
    'Faculty of Social Sciences',
    'Faculty of Administration & Management',
    'Faculty of Education',
    'Faculty of Law',
    'Faculty of Engineering',
    'College of Health Sciences',
    'Faculty of Pharmacy',
    'Faculty of Agricultural Sciences'
  ];

  const campuses = [
    'Ago-Iwoye Main Campus',
    'Sagamu Medical Campus',
    'Ayetoro Agricultural Campus',
    'Ibogun Engineering Campus',
    'Remote / Online'
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !password || !phoneNumber) {
      setErrorMessage('Please fill in all required account fields.');
      return;
    }

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const res = await register(
      {
        fullName,
        email,
        phoneNumber,
        role: selectedRole,
        location,
        faculty: selectedRole === 'student' ? faculty : undefined,
        department: selectedRole === 'student' ? department : undefined,
        level: selectedRole === 'student' ? level : undefined,
        matricNumber: selectedRole === 'student' ? matricNumber : undefined,
        skills: selectedRole === 'student' ? skills : undefined,
        shortBio: selectedRole === 'student' ? shortBio : undefined,
        businessName: selectedRole === 'client' ? businessName : undefined,
        businessCategory: selectedRole === 'client' ? businessCategory : undefined,
        businessDescription: selectedRole === 'client' ? businessDescription : undefined
      },
      password
    );

    if (res.success) {
      if (selectedRole === 'student') {
        onNavigate('/student/dashboard');
      } else {
        onNavigate('/client/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <div onClick={() => onNavigate('/')} className="cursor-pointer inline-block">
          <OouLogo size="md" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#061A4F]">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-500">
          Join the trusted Olabisi Onabanjo University student opportunity network
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          
          {/* Role selector buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                selectedRole === 'student'
                  ? 'border-[#061A4F] bg-blue-50/40 text-[#061A4F]'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <GraduationCap className={`w-6 h-6 ${selectedRole === 'student' ? 'text-[#061A4F]' : 'text-slate-400'}`} />
                {selectedRole === 'student' && <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />}
              </div>
              <div className="mt-3">
                <div className="text-xs font-extrabold">I am an OOU Student</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Offer skills, build portfolio & earn</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('client')}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                selectedRole === 'client'
                  ? 'border-[#061A4F] bg-amber-50/40 text-[#061A4F]'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <Briefcase className={`w-6 h-6 ${selectedRole === 'client' ? 'text-[#061A4F]' : 'text-slate-400'}`} />
                {selectedRole === 'client' && <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />}
              </div>
              <div className="mt-3">
                <div className="text-xs font-extrabold">I am a Client</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Post jobs & hire student talent</div>
              </div>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Common Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Babatunde Fashola"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number / WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="08123456789"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Campus Location *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                >
                  {campuses.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Specific Fields */}
            {selectedRole === 'student' && (
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div className="text-xs font-bold text-[#061A4F] uppercase tracking-wider">
                  OOU Academic Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Faculty</label>
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    >
                      {faculties.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science, Accounting"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Current Academic Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    >
                      <option value="100L">100L</option>
                      <option value="200L">200L</option>
                      <option value="300L">300L</option>
                      <option value="400L">400L</option>
                      <option value="500L">500L</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Matric Number (For Verification)</label>
                    <input
                      type="text"
                      value={matricNumber}
                      onChange={(e) => setMatricNumber(e.target.value)}
                      placeholder="e.g. FOS/21/22/0458"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Key Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. Graphic Design, Figma, React, Proofreading"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                </div>
              </div>
            )}

            {/* Client Specific Fields */}
            {selectedRole === 'client' && (
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div className="text-xs font-bold text-[#061A4F] uppercase tracking-wider">
                  Client / Business Info
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Business or Brand Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Digital Studios, Campus Store"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Business Category</label>
                    <input
                      type="text"
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      placeholder="e.g. Media Agency, Retail, Tech"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Brief Overview of your Hiring Needs</label>
                  <textarea
                    rows={2}
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Describe what kind of talent or services you frequently hire for..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  ></textarea>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>
          </form>

          {/* Footer link */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/auth/login')}
              className="font-bold text-[#061A4F] hover:underline"
            >
              Log in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
