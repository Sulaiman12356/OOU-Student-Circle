import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  
  const allUsers = DataStore.getUsers();
  const students = allUsers.filter(u => u.role === 'student');
  const clients = allUsers.filter(u => u.role === 'client');
  const unverifiedStudents = students.filter(u => !u.isVerified);
  const services = DataStore.getServices();
  const jobs = DataStore.getJobs();

  const handleQuickApprove = (userId: string) => {
    DataStore.verifyUser(userId, true);
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#061A4F] text-white p-8 rounded-3xl border border-[#F5B400]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#F5B400] text-[#061A4F] text-[10px] font-extrabold uppercase">
            Platform Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            OOU StudentCircle Master Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            System moderation, student credential verification, and marketplace telemetry
          </p>
        </div>

        <button
          onClick={() => onNavigate('/admin/verification')}
          className="px-4 py-2.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md flex-shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Queue ({unverifiedStudents.length})</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {students.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Across 10 OOU Faculties
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Clients</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {clients.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Businesses & Campus Organizers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Services</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#061A4F]">
            {services.length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">
            Listed on Student Marketplace
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Verification</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F5B400] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            {unverifiedStudents.length}
          </div>
          <div className="text-[11px] text-amber-700 font-bold">
            Requires ID Review
          </div>
        </div>

      </div>

      {/* Verification Queue & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Pending Student Verifications */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#061A4F]">Student ID Verification Queue</h2>
            <button
              onClick={() => onNavigate('/admin/verification')}
              className="text-xs font-bold text-[#061A4F] hover:underline"
            >
              Full Queue
            </button>
          </div>

          {unverifiedStudents.length > 0 ? (
            <div className="space-y-3">
              {unverifiedStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={student.profilePhoto}
                      alt={student.fullName}
                      className="w-11 h-11 rounded-xl object-cover border-2 border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#061A4F] truncate">{student.fullName}</h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Matric: <strong>{student.matricNumber || 'Pending'}</strong> • {student.department} ({student.level})
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {student.faculty} • {student.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleQuickApprove(student.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Verification Queue is Empty</div>
              <p className="text-[11px] text-slate-400">All registered student matric numbers and profiles have been verified.</p>
            </div>
          )}
        </div>

        {/* Right: Quick System Health & Actions */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-[#061A4F]">System Moderation</h2>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Student Identity Verification</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Payment Gateway (NUBAN Bank Transfer)</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Operational</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Campuses Monitored</span>
                <span className="text-[#061A4F] font-bold">4 OOU Campuses</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onNavigate('/admin/users')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#061A4F] font-bold text-xs rounded-xl transition text-left px-4 flex items-center justify-between"
              >
                <span>Manage Users & Roles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/admin/services')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#061A4F] font-bold text-xs rounded-xl transition text-left px-4 flex items-center justify-between"
              >
                <span>Moderate Service Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
