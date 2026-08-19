import React, { useState } from 'react';
import { PublicStudentProfile } from '../../types/studentConnect';
import { UserAvatar } from '../common/UserAvatar';
import { 
  Search, 
  MessageSquare, 
  UserMinus, 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  ExternalLink,
  Users,
  AlertTriangle
} from 'lucide-react';

interface MyConnectionsTabProps {
  connections: PublicStudentProfile[];
  onViewProfile: (student: PublicStudentProfile) => void;
  onMessage: (student: PublicStudentProfile) => void;
  onRemoveConnection: (targetUserId: string) => Promise<void>;
  onExploreClick: () => void;
}

export const MyConnectionsTab: React.FC<MyConnectionsTabProps> = ({
  connections,
  onViewProfile,
  onMessage,
  onRemoveConnection,
  onExploreClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const filteredConnections = connections.filter((student) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(q) ||
      student.department?.toLowerCase().includes(q) ||
      student.location?.toLowerCase().includes(q) ||
      student.skills?.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleConfirmRemove = async (userId: string) => {
    setRemoving(true);
    try {
      await onRemoveConnection(userId);
      setConfirmRemoveId(null);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header for My Connections */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search my connections by name, department, campus, or skills..."
            className="w-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#061A4F]"
          />
        </div>

        <div className="text-xs font-bold text-slate-600 px-2 text-right">
          {filteredConnections.length} {filteredConnections.length === 1 ? 'Connection' : 'Connections'}
        </div>
      </div>

      {/* Grid of Connections */}
      {filteredConnections.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#061A4F] flex items-center justify-center mb-3.5">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {searchTerm ? 'No matching connections found' : 'You have no connections yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {searchTerm 
              ? 'Try changing your search query to find specific students you have connected with.' 
              : 'Connect with peers from all 5 OOU campuses to collaborate on projects, study, and share knowledge.'}
          </p>
          {!searchTerm && (
            <button
              onClick={onExploreClick}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition shadow-2xs"
            >
              <span>Explore Student Directory</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.map((student) => (
            <div 
              key={student.id} 
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => onViewProfile(student)}
                  >
                    <UserAvatar 
                      name={student.fullName} 
                      photoUrl={student.profilePhoto} 
                      size="lg" 
                    />
                    {student.isVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-[#F5B400] text-[#061A4F] p-0.5 rounded-full ring-2 ring-white">
                        <ShieldCheck className="w-4 h-4 fill-current" />
                      </span>
                    )}
                  </div>

                  {student.level && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-md">
                      {student.level}
                    </span>
                  )}
                </div>

                {/* Name & Details */}
                <button
                  onClick={() => onViewProfile(student)}
                  className="font-bold text-sm text-[#061A4F] hover:underline text-left line-clamp-1"
                >
                  {student.fullName}
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{student.department || 'Student'}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1">
                  <MapPin className="w-3 h-3 text-[#F5B400] flex-shrink-0" />
                  <span className="truncate">{student.location}</span>
                </div>

                {student.shortBio && (
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {student.shortBio}
                  </p>
                )}

                {/* Skills tags */}
                {student.skills && student.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {student.skills.slice(0, 2).map((sk, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions row */}
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
                <button
                  onClick={() => onMessage(student)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#F5B400]" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => onViewProfile(student)}
                  className="p-2 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
                  title="View full profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setConfirmRemoveId(student.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition"
                  title="Remove connection"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>

              {/* Confirm Remove Dialog Popover */}
              {confirmRemoveId === student.id && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>Remove connection with {student.fullName.split(' ')[0]}?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleConfirmRemove(student.id)}
                      disabled={removing}
                      className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition"
                    >
                      {removing ? 'Removing...' : 'Yes, Remove'}
                    </button>
                    <button
                      onClick={() => setConfirmRemoveId(null)}
                      className="flex-1 py-1.5 px-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
