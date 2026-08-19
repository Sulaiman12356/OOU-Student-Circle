import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who can register as a student on OOU StudentCircle?',
      a: 'Any current undergraduate, postgraduate, or pre-degree student enrolled across any campus of Olabisi Onabanjo University (Ago-Iwoye Main Campus, Sagamu Medical Campus, Ayetoro Agricultural Campus, and Ibogun Engineering Campus) with marketable skills can register.'
    },
    {
      q: 'How does student verification work?',
      a: 'Students submit their faculty, department, level, and matriculation number. Platform administrators verify these details against current university registration standards to issue the official Verified Student badge.'
    },
    {
      q: 'How do payments and fund settlements work?',
      a: 'When a client hires a student or accepts a job proposal, milestones are clearly agreed upon. Once the student delivers the work and the client reviews and approves it, funds are disbursed directly to the student without hidden deduction fees.'
    },
    {
      q: 'Who can hire students on the platform?',
      a: 'Anyone! Local business owners in Ago-Iwoye and Ogun State, fellow OOU students needing project assistance, campus student executives, university alumni, lecturers, and remote companies across Nigeria can post jobs and hire student talent.'
    },
    {
      q: 'What types of skills are supported on OOU StudentCircle?',
      a: 'We support virtually all legal skills and freelance services, including graphic design, logo creation, website and mobile app development, academic typing and proofreading, transcription, video editing, social media management, tutoring, event MCing, and campus logistics.'
    },
    {
      q: 'Is OOU StudentCircle completely free to join?',
      a: 'Yes! Creating an account, publishing student services, browsing the student directory, and posting client jobs is 100% free with zero upfront charges.'
    },
    {
      q: 'What happens if there is a misunderstanding on a project?',
      a: 'Our built-in Dispute Resolution & Admin Moderation system allows either party to submit a support report. Admin mediators review the project brief, deliverable files, and message history to ensure a fair resolution.'
    }
  ];

  return (
    <div className="bg-white text-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#061A4F] text-xs font-bold uppercase tracking-wider">
            Frequently Asked Questions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061A4F]">
            Got Questions? We’ve Got <span className="text-[#F5B400]">Answers</span>
          </h1>
          <p className="text-sm text-slate-600">
            Find immediate answers to common questions about accounts, verification, hiring, and payments on OOU StudentCircle.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition"
                >
                  <span className="font-bold text-sm sm:text-base text-[#061A4F]">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-full bg-slate-100 text-slate-600 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Banner */}
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4">
          <h3 className="font-bold text-lg text-[#061A4F]">Still have a specific question?</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Our campus community team in Ago-Iwoye is happy to assist you directly with any inquiries or feedback.
          </p>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] transition inline-flex items-center gap-2"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4 text-[#F5B400]" />
          </button>
        </div>

      </div>
    </div>
  );
};
