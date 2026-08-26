import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CampusStore } from '../../services/campusStore';
import { DataStore } from '../../services/dataStore';
import { 
  GraduationCap, 
  FileText, 
  MapPin, 
  Printer, 
  Users, 
  Compass, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  MessageSquare, 
  Calculator, 
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AspirantDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AspirantDashboardPage: React.FC<AspirantDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const campusLocations = CampusStore.getLocations();
  const verifiedStudents = DataStore.getUsers().filter(u => u.role === 'student' && u.isVerified);
  
  // Cut-off Calculator state
  const [jambScore, setJambScore] = useState<number>(240);
  const [olevelCredits, setOlevelCredits] = useState<number>(5);
  const [targetFaculty, setTargetFaculty] = useState<string>('Faculty of Science');
  const [targetDepartment, setTargetDepartment] = useState<string>('Computer Science');

  // Screening Checklist state
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Original JAMB Result Slip with passport', done: true },
    { id: 'c2', label: 'OOU Post-UTME / PUTME Screening Registration Slip', done: true },
    { id: 'c3', label: 'WAEC / NECO / NABTEB O-Level Statement of Results', done: false },
    { id: 'c4', label: 'Birth Certificate or Statutory Declaration of Age', done: false },
    { id: 'c5', label: 'Local Government Certificate of Origin', done: false },
    { id: 'c6', label: 'Motion Ground Shop Pre-order for Physical Hardcopy Dossier', done: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  // Aggregate Calculation: JAMB / 8 (max 50) + O-level (max 50)
  const calculateAggregate = () => {
    const jambComponent = (jambScore / 400) * 50;
    const olevelComponent = Math.min(50, olevelCredits * 10);
    return (jambComponent + olevelComponent).toFixed(2);
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-[#040E29] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-[#F5B400]/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#F5B400] text-[#061A4F] text-[10px] font-black uppercase tracking-wider">
                OOU Aspirant Portal
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
                2026/2027 Admissions Candidate
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome, {currentUser?.fullName || 'OOU Aspirant'}! 🎯
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Target Course: <strong className="text-white">{currentUser?.department || 'Computer Science'}</strong> • Faculty: <strong className="text-white">{currentUser?.faculty || 'Faculty of Science'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/campus')}
              className="px-4 py-2.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs font-black rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Campus Hub Printing</span>
            </button>
            <button
              onClick={() => onNavigate('/connect')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Find Student Mentors</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Checklist Progress</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {checklist.filter(c => c.done).length} / {checklist.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Screening documents ready
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Aggregate</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {calculateAggregate()}%
          </div>
          <div className="text-[11px] text-blue-600 font-semibold">
            Based on JAMB ({jambScore}) + O-Level
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Campus Locations</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            4 OOU Campuses
          </div>
          <div className="text-[11px] text-slate-500">
            Ago-Iwoye, Sagamu, Ayetoro, Ibogun
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Student Mentors</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F5B400] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {verifiedStudents.length > 0 ? verifiedStudents.length : 'OOU Network'}
          </div>
          <div className="text-[11px] text-slate-500">
            Verified undergrads available to advise
          </div>
        </div>

      </div>

      {/* Main Grid: Screening Preparation & Aggregate Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Admission Screening Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#061A4F]">OOU Screening Document Checklist</h2>
                <p className="text-xs text-slate-500">Keep track of your physical & digital screening credentials before visiting campus</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-[#061A4F] text-xs font-bold rounded-full">
                {Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)}% Complete
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                    item.done 
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                      item.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {item.done && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs font-medium ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {item.done ? 'Ready' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Need your documents printed at Motion Ground ahead of time?</span>
              <button
                onClick={() => onNavigate('/campus')}
                className="px-4 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Send to Motion Ground Shop
              </button>
            </div>
          </div>

          {/* OOU Four Campus Directory */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#061A4F]">OOU Multi-Campus Directory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {campusLocations.map((loc) => (
                <div key={loc.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2 text-[#061A4F]">
                    <MapPin className="w-4 h-4 text-[#F5B400]" />
                    <h4 className="text-xs font-extrabold">{loc.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{loc.description}</p>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{loc.campusType || loc.location || 'Campus Location'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: OOU Aggregate Calculator & Resources */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* OOU Aggregate Score Estimator */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#061A4F]">
              <Calculator className="w-5 h-5 text-[#F5B400]" />
              <h2 className="text-base font-extrabold">OOU Admission Aggregate Estimator</h2>
            </div>
            
            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  JAMB Score (out of 400): <span className="text-[#061A4F] font-black">{jambScore}</span>
                </label>
                <input
                  type="range"
                  min="160"
                  max="400"
                  value={jambScore}
                  onChange={(e) => setJambScore(Number(e.target.value))}
                  className="w-full accent-[#061A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  O-Level A1/B2/B3/C4-C6 Credits Count: <span className="text-[#061A4F] font-black">{olevelCredits} Subjects</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="5"
                  value={olevelCredits}
                  onChange={(e) => setOlevelCredits(Number(e.target.value))}
                  className="w-full accent-[#061A4F]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-center space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimated Aggregate Score</div>
                <div className="text-3xl font-black text-[#061A4F]">{calculateAggregate()}%</div>
                <p className="text-[10px] text-slate-500">Calculated via official OOU PUTME 50:50 weighting model</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-[#061A4F] to-[#040E29] p-6 rounded-3xl text-white space-y-4 border border-white/10">
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5B400]" />
              Need Personal Guidance?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect directly with verified students in your desired faculty to ask questions about cut-off marks, hostel accommodation in Ago-Iwoye, and lecture schedules.
            </p>
            <button
              onClick={() => onNavigate('/connect')}
              className="w-full py-3 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask OOU Student Representatives</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
