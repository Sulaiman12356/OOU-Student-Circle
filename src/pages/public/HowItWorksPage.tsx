import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Star, 
  GraduationCap, 
  Briefcase,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'clients'>('students');

  return (
    <div className="bg-white text-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#061A4F] text-xs font-bold uppercase tracking-wider">
            Process & Security
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#061A4F]">
            How OOU <span className="text-[#F5B400]">StudentCircle Works</span>
          </h1>
          <p className="text-base text-slate-600">
            A secure, transparent step-by-step pathway for students to offer services and clients to hire campus professionals with total peace of mind.
          </p>

          {/* Role Toggle Switch */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 mt-4">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'students'
                  ? 'bg-[#061A4F] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#061A4F]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>For OOU Students</span>
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'clients'
                  ? 'bg-[#061A4F] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#061A4F]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>For Clients & Businesses</span>
            </button>
          </div>
        </div>

        {/* Student Steps */}
        {activeTab === 'students' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#061A4F] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-base text-[#061A4F]">Sign Up & Verify ID</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Register with your student email, faculty, department, level, and matric number to claim your verified student badge.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#061A4F] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-base text-[#061A4F]">Publish Services</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Create rich listings for your skills (Graphic Design, Tutoring, Coding, etc.) with custom tiers (Basic, Standard, Premium).
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#061A4F] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-base text-[#061A4F]">Submit Proposals</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse open jobs posted by clients, send custom proposals with your price quote, timeline, and portfolio samples.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5B400] text-[#061A4F] flex items-center justify-center font-extrabold">
                  4
                </div>
                <h3 className="font-bold text-base text-[#061A4F]">Deliver & Get Paid</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete tasks on schedule, submit deliverables through the portal, receive client approval, ratings, and prompt payment.
                </p>
              </div>

            </div>

            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#061A4F]">Ready to monetize your skills as an OOU student?</h4>
                <p className="text-xs text-slate-600">Join verified peers across Ago-Iwoye and satellite campuses.</p>
              </div>
              <button
                onClick={() => onNavigate('/auth/register')}
                className="px-5 py-2.5 bg-[#061A4F] text-white font-bold text-xs rounded-xl hover:bg-[#0B2A6F] transition flex-shrink-0"
              >
                Create Student Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#061A4F] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-base text-[#061A4F]">Post Job or Browse</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Post detailed project requirements with your budget range, or directly order existing fixed-price student services.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#061A4F] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-base text-[#061A4F]">Review Proposals</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evaluate student bids, inspect verified matriculation status, past reviews, portfolio pieces, and message applicants.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#061A4F] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-base text-[#061A4F]">Hire & Collaborate</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accept a bid to initiate the contract. Chat in real-time and track progress milestones on your dashboard.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5B400] text-[#061A4F] flex items-center justify-center font-extrabold">
                  4
                </div>
                <h3 className="font-bold text-base text-[#061A4F]">Approve & Rate</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Review final deliverable files, approve completed milestones, release payments safely, and leave a genuine review.
                </p>
              </div>

            </div>

            <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#061A4F]">Need work done quickly by talented student professionals?</h4>
                <p className="text-xs text-slate-600">Post your job today and receive bids within hours.</p>
              </div>
              <button
                onClick={() => onNavigate('/auth/register')}
                className="px-5 py-2.5 bg-[#061A4F] text-white font-bold text-xs rounded-xl hover:bg-[#0B2A6F] transition flex-shrink-0"
              >
                Post a Job as Client
              </button>
            </div>
          </div>
        )}

        {/* Security & Safety Highlights */}
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-[#061A4F]">Trust, Safety & Nigerian Verification Standards</h3>
            <p className="text-xs text-slate-600">Every feature is designed with student safety and client reliability in mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">Student ID & Level Verification</div>
                <div className="text-[11px] text-slate-500">Every student profile can be verified against OOU student records to prevent fraud.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">Safe Milestone Settlements</div>
                <div className="text-[11px] text-slate-500">Transparent payment milestones ensure students are paid for honest work and clients receive promised quality.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">Double-Blind Honest Reviews</div>
                <div className="text-[11px] text-slate-500">Authentic 5-star ratings build long-term reputation and accountability on campus.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
