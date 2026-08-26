import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { formatBudget } from '../../types';
import { 
  Briefcase, 
  PlusCircle, 
  Search, 
  Users, 
  Send, 
  Sparkles, 
  Star, 
  ArrowRight,
  Clock,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface ClientDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  
  const clientJobs = currentUser ? DataStore.getJobsByClient(currentUser.id) : [];
  const topStudents = DataStore.getUsers().filter(u => u.role === 'student').slice(0, 3);
  const allServices = DataStore.getServices().slice(0, 3);

  const openJobs = clientJobs.filter(j => j.status === 'open');
  const activeContracts = clientJobs.filter(j => j.status === 'in_progress');

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-[#F5B400]/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5B400] text-[#061A4F] text-[10px] font-extrabold uppercase">
              Client & Employer Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome, {currentUser?.fullName || 'Client'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {currentUser?.businessName || 'Business Owner'} • {currentUser?.location || 'Ago-Iwoye'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/client/jobs/new')}
              className="px-4 py-2.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job</span>
            </button>
            <button
              onClick={() => onNavigate('/client/discover')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find Students</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Posted Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {clientJobs.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {openJobs.length} active and accepting bids
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Contracts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {activeContracts.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            In progress with OOU students
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Investment</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            ₦{(currentUser?.totalSpent || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">
            Empowering student talent
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Proposals Inbox</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F5B400] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {clientJobs.reduce((sum, j) => sum + j.proposalsCount, 0)}
          </div>
          <div className="text-[11px] text-slate-500">
            Received from vetted students
          </div>
        </div>

      </div>

      {/* Main Sections: My Posted Jobs & Recommended Student Talent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: My Jobs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F]">My Posted Jobs</h2>
            <button
              onClick={() => onNavigate('/client/jobs')}
              className="text-xs font-bold text-[#061A4F] hover:underline"
            >
              View All
            </button>
          </div>

          {clientJobs.length > 0 ? (
            <div className="space-y-3">
              {clientJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-[#061A4F]">
                        {job.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#061A4F] mt-1">{job.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{job.description}</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {formatBudget(job.budget)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      <strong>{job.proposalsCount}</strong> proposals received
                    </span>
                    <button
                      onClick={() => onNavigate('/client/proposals')}
                      className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
                    >
                      <span>Review Proposals</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No Jobs Posted Yet</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Post your first project to receive proposals and quotes from talented students across OOU.
              </p>
              <button
                onClick={() => onNavigate('/client/jobs/new')}
                className="px-4 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-xl"
              >
                Post a Job Now
              </button>
            </div>
          )}
        </div>

        {/* Right: Featured Student Talent */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F]">Top Rated OOU Students</h2>
            <button
              onClick={() => onNavigate('/client/discover')}
              className="text-xs font-bold text-[#061A4F] hover:underline"
            >
              Browse All
            </button>
          </div>

          <div className="space-y-3">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={student.profilePhoto}
                    alt={student.fullName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#F5B400] flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#061A4F] truncate flex items-center gap-1">
                      <span>{student.fullName}</span>
                      {student.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {student.department} • {student.level}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                      <Star className="w-3 h-3 fill-[#F5B400] text-[#F5B400]" />
                      <span>{student.rating?.toFixed(1) || '5.0'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('/client/messages')}
                  className="px-3 py-1.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl flex-shrink-0"
                >
                  Hire
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
