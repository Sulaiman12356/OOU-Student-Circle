import React from 'react';
import { Lock, ShieldCheck, Eye, Database, UserCheck, ChevronRight, Server } from 'lucide-react';
import { founderConfig } from '../../config/founder';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-[#F5B400] selection:text-[#061A4F]">
      
      {/* Header Banner */}
      <div className="bg-[#061A4F] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#0B2A6F]">
        <div className="max-w-4xl mx-auto space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5B400]/20 text-[#F5B400] text-xs font-bold rounded-full border border-[#F5B400]/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            How OOU StudentCircle collects, protects, verifies, and handles the personal and academic data of students, clients, and vendors.
          </p>
          <div className="text-xs text-slate-400 pt-2">
            Effective: August 2024 • Compliant with NDPR & OOU Student Data Standards
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
              Information We Collect
            </h2>
            <p>
              To maintain a safe, verified peer-to-peer student freelancing and marketplace ecosystem, OOU StudentCircle collects specific information depending on your account role:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-[#061A4F] text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#061A4F]" />
                  Student Freelancers & Vendors
                </div>
                <ul className="list-disc pl-4 text-xs space-y-1 text-slate-600">
                  <li>Full legal name, email, phone / WhatsApp number</li>
                  <li>Campus location (Ago-Iwoye, Sagamu, Ayetoro, Ibogun)</li>
                  <li>Faculty, academic department, and study level (e.g. 300L)</li>
                  <li>Matriculation number & student ID verification document</li>
                  <li>Portfolio items, skills, gig descriptions, and ratings</li>
                  <li>NUBAN Bank Account details for payout disbursement</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-[#061A4F] text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-700" />
                  Hiring Clients & Buyers
                </div>
                <ul className="list-disc pl-4 text-xs space-y-1 text-slate-600">
                  <li>Full name, business / company name, contact email</li>
                  <li>Phone number and campus / delivery location</li>
                  <li>Job postings, project briefs, and hiring criteria</li>
                  <li>Transaction records and proposal communications</li>
                  <li>Payment transaction receipts and reviews left</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">2</span>
              How Your Information Is Used
            </h2>
            <p>We process your data strictly for legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Student Verification:</strong> Validating that registered freelancers and vendors are legitimate OOU students to safeguard hiring clients from fraud.</li>
              <li><strong>Escrow Settlement & Payouts:</strong> Safely transferring agreed client milestone payments to student Nigerian bank accounts upon job sign-off.</li>
              <li><strong>Messaging & Order Fulfillment:</strong> Facilitating direct communications regarding active jobs, delivery arrangements, and service revisions.</li>
              <li><strong>Reputation & Feedback:</strong> Maintaining transparent, authentic client reviews to help exceptional students build high-value career credentials.</li>
              <li><strong>Platform Security:</strong> Detecting suspicious activity, duplicate accounts, harassment, or unauthorized access attempts.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">3</span>
              Data Protection & Storage Security
            </h2>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Zero Unauthorized Third-Party Data Sharing
              </div>
              <p className="text-xs leading-relaxed">
                We never sell, rent, or trade student matriculation records, personal phone numbers, or private credentials to third-party marketing companies.
              </p>
            </div>
            <p>
              Your sensitive credentials (including passwords, bank account numbers, and ID photos) are encrypted in transit and at rest using enterprise Firebase Firestore database access rules and secure SSL/TLS communication protocols.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">4</span>
              Public vs. Private Profile Visibility
            </h2>
            <p>
              To protect student privacy while maintaining a thriving marketplace:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Public Information:</strong> Your full name, department, level, portfolio samples, service listings, verified badge, and public client reviews are visible to all visitors.</li>
              <li><strong>Private Confidential Information:</strong> Your raw matriculation card image, exact bank account routing number, account password, and internal dispute notes are strictly restricted to authorized platform administrators.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">5</span>
              Your Data Rights & Account Management
            </h2>
            <p>
              Under Nigerian Data Protection Regulations (NDPR) and platform policies, you have full authority to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Access, review, and update your personal profile, services, and bank details at any time in Account Settings.</li>
              <li>Pause or unpublish your services/products when busy with academic examinations.</li>
              <li>Request full account deletion and data anonymization by contacting our compliance desk.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#061A4F] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#061A4F] flex items-center justify-center text-xs font-bold">6</span>
              Privacy Inquiries & Compliance Officer
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding data privacy on OOU StudentCircle, contact:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div><strong>Data Protection Officer:</strong> {founderConfig.name} ({founderConfig.alias})</div>
              <div><strong>Official Email:</strong> <a href={founderConfig.emailUrl} className="text-[#061A4F] font-bold hover:underline">{founderConfig.email}</a></div>
              <div><strong>Direct Phone / WhatsApp:</strong> <a href={founderConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline">{founderConfig.whatsappFormatted}</a></div>
              <div><strong>Campus Office:</strong> Olabisi Onabanjo University, Ago-Iwoye, Ogun State, Nigeria</div>
            </div>
          </section>

          {/* Action CTA */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('/terms')}
              className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
            >
              <span>View Terms of Service</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              Back to Home
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
