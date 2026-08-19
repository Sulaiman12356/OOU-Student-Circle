import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { Proposal, formatBudget } from '../../types';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  FileText
} from 'lucide-react';

interface StudentProposalsPageProps {
  onNavigate?: (path: string) => void;
}

export const StudentProposalsPage: React.FC<StudentProposalsPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const proposals = currentUser ? DataStore.getProposalsByStudent(currentUser.id) : [];
  const jobs = DataStore.getJobs();

  const filteredProposals = proposals.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#061A4F]">My Job Proposals & Bids</h1>
          <p className="text-xs text-slate-500">Track responses, negotiations, and accepted client contracts</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${filter === 'all' ? 'bg-[#061A4F] text-white' : 'text-slate-600'}`}
          >
            All ({proposals.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${filter === 'pending' ? 'bg-[#061A4F] text-white' : 'text-slate-600'}`}
          >
            Pending ({proposals.filter(p => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${filter === 'accepted' ? 'bg-[#061A4F] text-white' : 'text-slate-600'}`}
          >
            Accepted ({proposals.filter(p => p.status === 'accepted').length})
          </button>
        </div>
      </div>

      {/* Proposals List */}
      {filteredProposals.length > 0 ? (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => {
            const job = jobs.find(j => j.id === proposal.jobId);
            return (
              <div
                key={proposal.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#061A4F]">
                      {job?.title || 'Client Project Proposal'}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Client: <strong className="text-slate-700">{job?.clientName || 'Campus Client'}</strong> • Submitted on {new Date(proposal.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    {proposal.status === 'accepted' ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted & Active</span>
                      </span>
                    ) : proposal.status === 'rejected' ? (
                      <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Under Client Review</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Bid Amount</span>
                    <span className="font-extrabold text-[#061A4F] text-sm">
                      ₦{(proposal.proposedPrice || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Time</span>
                    <span className="font-semibold text-slate-800">
                      {proposal.estimatedDays} Days
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Job Category</span>
                    <span className="font-semibold text-slate-800">
                      {job?.category || 'General'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Client Budget</span>
                    <span className="font-semibold text-slate-800">
                      {formatBudget(job?.budget)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Cover Letter / Strategy:</div>
                  <p className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {proposal.coverLetter}
                  </p>
                </div>

                {proposal.attachments && proposal.attachments.length > 0 && (
                  <div className="text-xs flex items-center gap-2">
                    <span className="text-slate-400 font-bold">Attached Link:</span>
                    <a href={proposal.attachments[0]} target="_blank" rel="noreferrer" className="text-[#061A4F] underline truncate max-w-sm">
                      {proposal.attachments[0]}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Send className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Proposals in this View</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Browse the latest client jobs and submit your proposal with your rate and turnaround time.
          </p>
        </div>
      )}

    </div>
  );
};
