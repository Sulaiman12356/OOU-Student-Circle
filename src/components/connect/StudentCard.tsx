import React from 'react';
import { PublicStudentProfile } from '../../types/studentConnect';
import { UserAvatar } from '../common/UserAvatar';
import { 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  UserPlus, 
  Check, 
  Clock, 
  MessageSquare, 
  Briefcase, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface StudentCardProps {
  student: PublicStudentProfile;
  connectionStatus: 'self' | 'connected' | 'pending_sent' | 'pending_received' | 'not_connected';
  onConnect: (student: PublicStudentProfile) => void;
  onViewProfile: (student: PublicStudentProfile) => void;
  onMessage?: (student: PublicStudentProfile) => void;
  loadingConnect?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  connectionStatus,
  onConnect,
  onViewProfile,
  onMessage,
  loadingConnect = false
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between p-5 h-full group">
      <div>
        {/* Top Header Row: Avatar + Verification + Level */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="relative cursor-pointer" onClick={() => onViewProfile(student)}>
            <UserAvatar 
              name={student.fullName} 
              photoUrl={student.profilePhoto} 
              size="lg" 
            />
            {student.isVerified && (
              <span 
                className="absolute -bottom-1 -right-1 bg-[#F5B400] text-[#061A4F] p-0.5 rounded-full ring-2 ring-white" 
                title="Verified OOU Student"
              >
                <ShieldCheck className="w-4 h-4 fill-current" />
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            {student.level && (
              <span className="px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase bg-slate-100 text-slate-700 rounded-full border border-slate-200/70">
                {student.level}
              </span>
            )}
            {student.availableForWork && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Available
              </span>
            )}
          </div>
        </div>

        {/* Student Name & Department */}
        <div className="mb-2">
          <button 
            onClick={() => onViewProfile(student)}
            className="text-left font-bold text-base text-[#061A4F] hover:text-[#F5B400] transition line-clamp-1 group-hover:underline"
          >
            {student.fullName}
          </button>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{student.department || student.faculty || 'OOU Student'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
            <MapPin className="w-3 h-3 text-[#F5B400] flex-shrink-0" />
            <span className="truncate">{student.location}</span>
          </div>
        </div>

        {/* Short Bio */}
        {student.shortBio && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 mt-2 min-h-[32px]">
            {student.shortBio}
          </p>
        )}

        {/* Skills Tag Pills */}
        {student.skills && student.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {student.skills.slice(0, 3).map((skill, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200 rounded-md truncate max-w-[120px]"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-md">
                +{student.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2 mt-auto">
        <button
          onClick={() => onViewProfile(student)}
          className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center justify-center gap-1"
        >
          <span>Profile</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>

        {connectionStatus === 'connected' ? (
          onMessage ? (
            <button
              onClick={() => onMessage(student)}
              className="flex-1 py-2 px-3 text-xs font-bold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Message</span>
            </button>
          ) : (
            <span className="flex-1 py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Connected</span>
            </span>
          )
        ) : connectionStatus === 'pending_sent' ? (
          <button
            disabled
            className="flex-1 py-2 px-3 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center gap-1.5 cursor-default"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending</span>
          </button>
        ) : connectionStatus === 'pending_received' ? (
          <button
            onClick={() => onConnect(student)}
            className="flex-1 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center justify-center gap-1 shadow-2xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept</span>
          </button>
        ) : connectionStatus === 'self' ? (
          <span className="flex-1 py-2 px-3 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl text-center">
            You
          </span>
        ) : (
          <button
            onClick={() => onConnect(student)}
            disabled={loadingConnect}
            className="flex-1 py-2 px-3 text-xs font-bold text-white bg-[#061A4F] hover:bg-[#0B2A6F] active:scale-[0.98] rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>Connect</span>
          </button>
        )}
      </div>
    </div>
  );
};
