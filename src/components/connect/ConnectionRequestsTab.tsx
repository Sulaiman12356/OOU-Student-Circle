import React, { useState } from 'react';
import { ConnectionRequest, PublicStudentProfile } from '../../types/studentConnect';
import { UserAvatar } from '../common/UserAvatar';
import { 
  Check, 
  X, 
  Clock, 
  MapPin, 
  GraduationCap, 
  UserCheck, 
  Inbox, 
  Send,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface ConnectionRequestsTabProps {
  incomingRequests: ConnectionRequest[];
  outgoingRequests: ConnectionRequest[];
  onRespond: (requestId: string, action: 'accept' | 'decline') => Promise<void>;
  onCancelRequest: (requestId: string) => Promise<void>;
  onViewStudent: (studentId: string) => void;
  onExploreClick: () => void;
}

export const ConnectionRequestsTab: React.FC<ConnectionRequestsTabProps> = ({
  incomingRequests,
  outgoingRequests,
  onRespond,
  onCancelRequest,
  onViewStudent,
  onExploreClick
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (requestId: string, action: 'accept' | 'decline') => {
    setProcessingId(requestId);
    try {
      await onRespond(requestId, action);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await onCancelRequest(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'incoming'
              ? 'bg-[#061A4F] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4 text-[#F5B400]" />
          <span>Incoming Requests ({incomingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('outgoing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'outgoing'
              ? 'bg-[#061A4F] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Sent Requests ({outgoingRequests.length})</span>
        </button>
      </div>

      {/* Incoming Requests View */}
      {activeSubTab === 'incoming' && (
        <div>
          {incomingRequests.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-[#061A4F] flex items-center justify-center mb-3.5">
                <UserCheck className="w-7 h-7 text-[#061A4F]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No Pending Connection Requests
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                When other OOU students want to connect, collaborate, or work with you, their requests will appear here.
              </p>
              <button
                onClick={onExploreClick}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition shadow-2xs inline-flex items-center gap-1.5"
              >
                <span>Discover Students to Connect</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    <div 
                      className="cursor-pointer flex-shrink-0"
                      onClick={() => onViewStudent(req.senderId)}
                    >
                      <UserAvatar 
                        name={req.senderName} 
                        photoUrl={req.senderPhoto} 
                        size="md" 
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => onViewStudent(req.senderId)}
                          className="font-bold text-sm text-[#061A4F] hover:underline truncate text-left"
                        >
                          {req.senderName}
                        </button>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{req.senderDepartment || 'Student'}</span>
                        {req.senderLevel && <span className="text-slate-400">• {req.senderLevel}</span>}
                      </p>

                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F5B400] flex-shrink-0" />
                        <span className="truncate">{req.senderCampus || 'Main Campus'}</span>
                      </p>
                    </div>
                  </div>

                  {req.note && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-4 text-xs text-slate-700 italic">
                      "{req.note}"
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleAction(req.id, 'accept')}
                      disabled={processingId === req.id}
                      className="flex-1 py-2 px-3 text-xs font-bold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-[#F5B400]" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => handleAction(req.id, 'decline')}
                      disabled={processingId === req.id}
                      className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5 text-slate-500" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outgoing Requests View */}
      {activeSubTab === 'outgoing' && (
        <div>
          {outgoingRequests.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3.5">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No Outgoing Pending Requests
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                You haven't sent any pending connection requests. Browse the directory to connect with your peers.
              </p>
              <button
                onClick={onExploreClick}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition shadow-2xs"
              >
                <span>Browse Student Directory</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outgoingRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="cursor-pointer flex-shrink-0"
                      onClick={() => onViewStudent(req.receiverId)}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
                        {req.receiverName ? req.receiverName.charAt(0) : 'S'}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 
                        onClick={() => onViewStudent(req.receiverId)}
                        className="font-bold text-sm text-[#061A4F] hover:underline cursor-pointer truncate"
                      >
                        {req.receiverName || 'OOU Student'}
                      </h4>
                      <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Awaiting response</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancel(req.id)}
                    disabled={processingId === req.id}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition flex-shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
