import React from 'react';
import { ShieldCheck, FileText, Scale, Lock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { founderConfig } from '../../config/founder';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-[#F5B400] selection:text-[#061A4F]">
      
      {/* Header Banner */}
      <div className="bg-[#061A4F] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#0B2A6F]">
        <div className="max-w-4xl mx-auto space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5B400]/20 text-[#F5B400] text-xs font-bold rounded-full border border-[#F5B400]/30">
            <Scale className="w-3.5 h-3.5" />
            <span>Official Platform Terms & Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Governing rules, rights, and responsibilities for students, clients, and vendors on the OOU StudentCircle platform.
          </p>
          <div className="text-xs text-slate-400 pt-2">
            Last Updated: August 2024 • Applicable across Ago-Iwoye, Sagamu, Ayetoro, and Ibogun Campuses
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-10 leading-relaxed text-sm text-slate-700">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, registering for, or using <strong>OOU StudentCircle</strong> (accessible via our official web application and associated mobile interfaces), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must immediately discontinue use of the platform.
            </p>
            <p>
              OOU StudentCircle operates as a dedicated student service marketplace and physical product exchange network founded by <strong>{founderConfig.name}</strong> to empower undergraduates of Olabisi Onabanjo University (OOU) and connect them with real economic opportunities.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">2</span>
              Eligibility & Student Identity Verification
            </h2>
            <p>
              To register as a <strong>Student Freelancer</strong> or <strong>Campus Vendor</strong>, you must be a currently enrolled student or recognized alumnus of Olabisi Onabanjo University across any of its four operational campuses:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Ago-Iwoye Main Campus</strong> (Arts, Science, Social Sciences, Law, Education, Management)</li>
              <li><strong>Sagamu Campus</strong> (College of Health Sciences, Pharmacy)</li>
              <li><strong>Ayetoro Campus</strong> (Faculty of Agricultural Sciences)</li>
              <li><strong>Ibogun Campus</strong> (College of Engineering & Environmental Studies)</li>
            </ul>
            <p>
              Student accounts are subject to identity verification. Providing fraudulent matriculation numbers, fake student identity cards, or impersonating another student will result in immediate permanent expulsion from the platform and potential referral to campus authorities.
            </p>
            <p>
              <strong>Clients</strong> can be registered by any individual, campus business, alumnus, or corporate organization seeking to hire verified student talent or purchase campus goods.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">3</span>
              Freelance Services & Project Contracts
            </h2>
            <p>
              When a client hires a student through a posted job proposal or direct service tier:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Scope of Work:</strong> The student is contractually obligated to deliver the specific work outlined in the service package or proposal within the agreed turnaround deadline.</li>
              <li><strong>Deliverable Quality:</strong> Deliverables must be authentic, original, and free of plagiarism or copyright infringement.</li>
              <li><strong>Academic Schedules:</strong> Both parties acknowledge that students balance academic responsibilities (lectures, tests, exams) with freelancing. Clear delivery expectations must be established before project commencement.</li>
              <li><strong>Intellectual Property:</strong> Upon complete payment release, full commercial rights to completed custom deliverables transfer to the hiring client, unless explicitly agreed otherwise in writing.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">4</span>
              Physical Product Marketplace & Campus Orders
            </h2>
            <p>
              For physical goods listed in the OOU StudentCircle Marketplace:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Accurate Product Listings:</strong> Vendors must provide genuine photos, honest condition ratings (e.g. Brand New, Like New, Handcrafted), and transparent inventory counts.</li>
              <li><strong>Prohibited Items:</strong> Listing illegal items, counterfeit goods, expired consumables, unprescribed pharmaceuticals, academic examination leakages, weapons, or items violating Nigerian laws and OOU University Regulations is strictly prohibited.</li>
              <li><strong>Delivery & Campus Pickups:</strong> Vendors offering campus pickup must specify safe, well-lit campus landmarks (e.g. OOU Main Gate, ICT Center, Faculty Hallway, University Library).</li>
              <li><strong>Order Inspection:</strong> Buyers have 24 hours from marked delivery to inspect physical goods and report discrepancies before escrow funds settle to the vendor.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">5</span>
              Escrow Protection, Platform Fees & Payouts
            </h2>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-xs uppercase tracking-wide text-amber-800">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Escrow Security Guarantee
              </div>
              <p className="text-xs leading-relaxed">
                To eliminate payment defaults and deliverable abandonment, client funds are held securely in platform escrow upon job agreement. Funds are only transferred to the student’s wallet upon client milestone sign-off.
              </p>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Platform Fee:</strong> OOU StudentCircle deducts a standard 10% platform maintenance fee on successfully completed freelance contracts and marketplace sales to support hosting, verification infrastructure, and support operations.</li>
              <li><strong>Direct NUBAN Payouts:</strong> Students and vendors can withdraw available wallet balances directly to any licensed Nigerian commercial bank or fintech institution (e.g., GTBank, Zenith, Access, Kuda, Moniepoint, OPay). Standard bank transfer processing applies.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">6</span>
              Dispute Resolution & Campus Arbitration
            </h2>
            <p>
              In the event of a disagreement between a client and a student (e.g. missed deadlines, unsatisfactory quality, non-delivery of physical items):
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
              <li>The parties are encouraged to communicate constructively in the platform chat to agree on revisions or modifications.</li>
              <li>If mutual agreement cannot be reached, either party may escalate the matter by opening a Dispute in the Admin Mediation Center.</li>
              <li>Our compliance team reviews chat transcripts, project files, delivery proofs, and matriculation logs to deliver a fair, binding decision (which may include a full refund, partial refund, or complete payout release).</li>
            </ol>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">7</span>
              Contact & Platform Administration
            </h2>
            <p>
              For legal inquiries, dispute appeals, or verification questions, reach out to the administrative desk:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div><strong>Platform Administration:</strong> OOU StudentCircle Legal & Compliance</div>
              <div><strong>Founder & Director:</strong> {founderConfig.name} ({founderConfig.alias})</div>
              <div><strong>Email:</strong> <a href={founderConfig.emailUrl} className="text-[#061A4F] font-bold hover:underline">{founderConfig.email}</a></div>
              <div><strong>WhatsApp Desk:</strong> <a href={founderConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline">{founderConfig.whatsappFormatted}</a></div>
              <div><strong>Campus Base:</strong> Olabisi Onabanjo University, Ago-Iwoye, Ogun State, Nigeria</div>
            </div>
          </section>

          {/* Action CTA */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('/privacy')}
              className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
            >
              <span>View Privacy Policy</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('/auth/register')}
              className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              Accept & Join StudentCircle
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
