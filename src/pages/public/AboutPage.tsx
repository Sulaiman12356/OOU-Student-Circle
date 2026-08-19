import React from 'react';
import { Target, Compass, Award, Users, CheckCircle2, ArrowRight, Sparkles, Quote, ShieldCheck, Mail, MessageCircle, Phone } from 'lucide-react';
import { founderConfig } from '../../config/founder';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-slate-800 py-12 selection:bg-[#F5B400] selection:text-[#061A4F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#061A4F] text-xs font-bold uppercase tracking-wider border border-[#061A4F]/10">
            About OOU StudentCircle
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#061A4F] leading-tight">
            Empowering OOU Students Through <br />
            <span className="text-[#F5B400]">Verified Opportunities</span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            OOU StudentCircle is the dedicated talent ecosystem connecting Olabisi Onabanjo University student professionals with businesses, organizations, and clients seeking verified quality.
          </p>
        </div>

        {/* Founder Story & Vision */}
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-56 h-56 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-200">
                  <img 
                    src={founderConfig.photoUrl} 
                    alt={founderConfig.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[#061A4F] text-[#F5B400] px-3.5 py-1.5 rounded-full border-2 border-white shadow-md flex items-center gap-1.5 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                  <span>Founder</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#061A4F]">{founderConfig.name}</h3>
                <p className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-amber-200/60">
                  {founderConfig.fullNameWithAlias}
                </p>
                <div className="mt-2">
                  <span className="text-xs font-bold text-[#F5B400] bg-[#061A4F] px-3.5 py-1 rounded-full inline-block">
                    {founderConfig.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                  {founderConfig.department} ({founderConfig.level}) • {founderConfig.institution}
                </p>

                {/* Founder Direct Contact Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
                  <a
                    href={founderConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    title="Open WhatsApp chat with Onifade Sulaiman"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: {founderConfig.whatsapp}</span>
                  </a>
                  <a
                    href={founderConfig.emailUrl}
                    className="w-full sm:w-auto px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    title="Send email to Onifade Sulaiman"
                  >
                    <Mail className="w-4 h-4 text-[#F5B400]" />
                    <span>Email Founder</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#061A4F]">
                <Quote className="w-4 h-4 text-[#F5B400]" />
                <span>The Story of StudentCircle</span>
              </div>
              
              <h2 className="text-2xl font-extrabold text-[#061A4F]">
                Born from Real Student Experience at Ago-Iwoye
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {founderConfig.story.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="p-4 bg-white border-l-4 border-[#F5B400] rounded-r-xl text-xs text-slate-700 italic shadow-sm">
                "Our core conviction is simple: student skills should not stay dormant until after graduation. By verifying matriculation and securing payments in escrow, we build trust that unlocks real economic dignity."
              </div>
            </div>

          </div>
        </div>

        {/* Mission, Vision & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-[#061A4F]">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {founderConfig.mission}
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F5B400] flex items-center justify-center font-bold">
              <Compass className="w-6 h-6 text-[#061A4F]" />
            </div>
            <h3 className="font-extrabold text-xl text-[#061A4F]">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {founderConfig.vision}
            </p>
          </div>
        </div>

        {/* 4 Pillars of Operation */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-[#061A4F] text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {founderConfig.coreValues.map((val, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#061A4F] text-[#F5B400] flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-sm text-[#061A4F]">{val.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#061A4F] text-white p-10 rounded-3xl text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Be Part of the OOU Student Community</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Whether you are an OOU student eager to earn or an organization looking for dependable talent, join StudentCircle today.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/auth/register')}
              className="px-8 py-3.5 bg-[#F5B400] text-[#061A4F] font-bold text-xs rounded-xl hover:bg-[#e6a800] transition flex items-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
