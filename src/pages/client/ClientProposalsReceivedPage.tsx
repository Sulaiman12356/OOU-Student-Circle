import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { Proposal } from '../../types';
import { UserAvatar } from '../../components/common/UserAvatar';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  Star, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ClientProposalsReceivedPageProps {
  onNavigate: (path: string) => void;
}

export const ClientProposalsReceivedPage: React.FC<ClientProposalsReceivedPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>(() => {
    if (!currentUser) return [];
    const clientJobs = DataStore.getJobsByClient(currentUser.id);
    const jobIds = clientJobs.map(j => j.id);
    return DataStore.getProposals().filter(p => jobIds.includes(p.jobId));
  });

  const jobs = DataStore.getJobs();

  const handleAcceptProposal = (proposal: Proposal) => {
    if (confirm(`Accept proposal from ${proposal.studentName} for ₦${(proposal.proposedPrice || 0).toLocaleString()}?`)) {
      DataStore.updateProposalStatus(proposal.id, 'accepted');
      if (currentUser) {
        const clientJobs = DataStore.getJobsByClient(currentUser.id);
        const jobIds = clientJobs.map(j => j.id);
        setProposals(DataStore.getProposals().filter(p => jobIds.includes(p.jobId)));
      }
    }
  };

  const handleDeclineProposal = (proposal: Proposal) => {
    if (confirm(`Decline proposal from ${proposal.studentName}?`)) {
      DataStore.updateProposalStatus(proposal.id, 'rejected');
      if (currentUser) {
        const clientJobs = DataStore.getJobsByClient(currentUser.id);
        const jobIds = clientJobs.map(j => j.id);
        setProposals(DataStore.getProposals().filter(p => jobIds.includes(p.jobId)));
      }
    }
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-[#061A4F]">Student Proposals Received</h1>
        <p className="text-xs text-slate-500">Review student bids, academic backgrounds, and hire the best fit for your projects</p>
      </div>

      {proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const job = jobs.find(j => j.id === proposal.jobId);
            return (
              <div
                key={proposal.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={proposal.studentName}
                      photoUrl={proposal.studentPhoto}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#061A4F]">{proposal.studentName}</h3>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Verified OOU
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {proposal.studentDepartment} • {proposal.studentLevel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Proposed Bid</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        ₦{(proposal.proposedPrice || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="pl-3 border-l border-slate-200 text-right">
                      <span className="text-[10px] text-slate-400 block">Delivery</span>
                      <span className="text-xs font-bold text-slate-700">
                        {proposal.estimatedDays} Days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs">
                  <span className="font-bold text-[#061A4F] block mb-1">
                    Applying for: {job?.title || 'Campus Job'}
                  </span>
                  <p className="text-slate-700 leading-relaxed italic">
                    "{proposal.coverLetter}"
                  </p>
                </div>

                {proposal.attachments && proposal.attachments.length > 0 && (
                  <div className="text-xs flex items-center gap-2">
                    <span className="text-slate-500 font-bold">Attached Portfolio:</span>
                    <a href={proposal.attachments[0]} target="_blank" rel="noreferrer" className="text-[#061A4F] font-semibold underline truncate max-w-sm">
                      {proposal.attachments[0]}
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {proposal.status === 'accepted' && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted - In Progress</span>
                      </span>
                    )}
                    {proposal.status === 'rejected' && (
                      <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('/client/messages')}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    {proposal.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleDeclineProposal(proposal)}
                          className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl transition"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptProposal(proposal)}
                          className="px-4 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F5B400]" />
                          <span>Accept & Hire</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Proposals Received Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once students review your job postings and submit bids, they will appear here for review and hiring.
          </p>
        </div>
      )}

    </div>
  );
};
