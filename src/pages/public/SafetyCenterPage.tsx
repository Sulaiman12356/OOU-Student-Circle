import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  KeyRound, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles, 
  Store, 
  Building2, 
  ChevronRight,
  HelpCircle,
  PhoneCall,
  UserX,
  FileCheck
} from 'lucide-react';
import { VERIFICATION_TIERS } from '../../types/trustSafety';

interface SafetyCenterPageProps {
  onNavigate?: (path: string) => void;
}

export const SafetyCenterPage: React.FC<SafetyCenterPageProps> = ({ onNavigate }) => {
  const safetyPillars = [
    {
      icon: <Lock className="w-6 h-6 text-[#061A4F]" />,
      title: '1. Secure Escrow Payments',
      subtitle: 'Never Pay Outside the Platform',
      content: 'All service contracts, product orders, and campus gig payments are held in secure escrow. Funds are ONLY released to the student freelancer or vendor after you inspect and mark the work as Completed.',
      rules: [
        'Never transfer money to personal bank accounts (OPay, Kuda, PalmPay, Zenith, etc.) before inspection.',
        'Platform escrow guarantees a 100% refund if a service provider fails to deliver.',
        'Beware of sellers who ask you to "cancel the order and pay directly for a discount."'
      ],
      badgeColor: 'bg-blue-50 text-[#061A4F] border-blue-200'
    },
    {
      icon: <KeyRound className="w-6 h-6 text-rose-600" />,
      title: '2. Passwords & OTP Security',
      subtitle: 'We Never Ask For Your PIN or Password',
      content: 'OOU StudentCircle administrators, campus executives, and staff will NEVER ask for your password, transaction PIN, or SMS one-time password (OTP).',
      rules: [
        'Keep your account password unique and confidential.',
        'Never share verification codes sent to your phone or WhatsApp.',
        'If someone claiming to be "OOU StudentCircle Support" asks for your login details, report their profile immediately.'
      ],
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      title: '3. Fraud & Impersonation Prevention',
      subtitle: 'Vetted Identity Accreditation',
      content: 'We enforce strict student and vendor accreditation. Look for the official Verified badges before engaging freelancers or shop owners.',
      rules: [
        'Check for the "Student Verified" badge backed by valid OOU Matriculation records.',
        'Be wary of unrealistically cheap hostel accommodation or "guaranteed exam score alteration" offers (which are strictly prohibited).',
        'Use the in-app chat for all project correspondence so our moderation team can protect you in case of a dispute.'
      ],
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      title: '4. Physical Campus Meeting Points',
      subtitle: 'Safe Daylight Trading Zones',
      content: 'When collecting physical products, print jobs, or holding in-person discussions, always meet at official, well-lit campus hubs during daylight hours.',
      rules: [
        'Main Campus (Ago-Iwoye): Motion Ground Commercial Centre, ICT Centre Quadrangle, University Library Arcade.',
        'Ayegbami Mini Campus: Mini Campus Quad, Student Affairs Corridor.',
        'Sagamu Campus (Health Sciences): OOUTH Main Gate Security Hub, Clinical Skills Atrium.',
        'Ayetoro / Ibogun Campuses: Faculty Administrative Building Forecourt.'
      ],
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  ];

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#061A4F] text-xs font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>OOU StudentCircle Trust, Safety & Quality Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#061A4F] tracking-tight">
            How We Keep OOU Students & Businesses Safe
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Our multi-tiered verification, escrow protection, anti-abuse reviews, and real-time fraud monitoring ensure a trusted environment for commerce across all OOU campuses.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#061A4F]">{pillar.title}</h3>
                  <p className="text-xs font-bold text-slate-500">{pillar.subtitle}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {pillar.content}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Key Rules & Guidelines
                </div>
                <ul className="space-y-1.5">
                  {pillar.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Verification Tiers Breakdown Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-[#061A4F] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Verification Levels & Badges</span>
              </h2>
              <p className="text-xs text-slate-500">
                Badges are only displayed once credentials have been verified by the accreditation team.
              </p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/student/profile')}
                className="px-4 py-2 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] shadow-sm transition"
              >
                Apply for Verification
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(VERIFICATION_TIERS) as (keyof typeof VERIFICATION_TIERS)[]).map((tierKey) => {
              const tier = VERIFICATION_TIERS[tierKey];
              return (
                <div 
                  key={tierKey}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}>
                      {tierKey === 'student' && <GraduationCap className="w-3.5 h-3.5" />}
                      {tierKey === 'service_provider' && <Sparkles className="w-3.5 h-3.5" />}
                      {tierKey === 'campus_shop' && <Store className="w-3.5 h-3.5" />}
                      {tierKey === 'business' && <Building2 className="w-3.5 h-3.5" />}
                      <span>{tier.badgeLabel}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      {tier.description}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 border-t border-slate-200/60 pt-2 font-medium">
                    Privacy Guarantee: Raw matric & national IDs kept private.
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fast Action CTA */}
        <div className="bg-[#061A4F] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5B400]/20 border border-[#F5B400]/30 flex items-center justify-center mx-auto text-[#F5B400]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white max-w-xl mx-auto">
            Witnessed Suspicious Activity or Policy Violation?
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 max-w-lg mx-auto">
            You can report any profile, product, service, job, shop, review, or direct chat message with full confidentiality.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/student/messages')}
                className="px-6 py-2.5 bg-[#F5B400] text-[#061A4F] text-xs font-black rounded-xl hover:bg-amber-400 shadow-md transition"
              >
                Go to Safe Messaging
              </button>
            )}
            <a
              href="mailto:trust@studentcircle.oou.edu.ng"
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition"
            >
              Contact Campus Safety Registry
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
