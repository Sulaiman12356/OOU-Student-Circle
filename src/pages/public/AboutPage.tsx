import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Quote, 
  Mail, 
  MessageCircle, 
  Target, 
  Compass, 
  Users, 
  Briefcase, 
  ShoppingBag, 
  Store, 
  ChevronDown, 
  ChevronUp,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { founderConfig } from '../../config/founder';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  const toggleChapter = (chapterId: string) => {
    setActiveChapter(prev => (prev === chapterId ? null : chapterId));
  };

  return (
    <div className="bg-white text-slate-800 py-10 sm:py-16 selection:bg-[#F5B400] selection:text-[#061A4F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* ============================================================ */}
        {/* HERO / INTRO                                                 */}
        {/* ============================================================ */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#061A4F] text-xs font-black uppercase tracking-wider border border-blue-200/60">
            <BookOpen className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>The Authentic Story</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-[#061A4F] tracking-tight leading-tight">
            Meet the Founder Behind <br className="hidden sm:inline" />
            <span className="text-[#F5B400] relative inline-block">
              StudentCircle
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-[#F5B400]/40 rounded-full"></span>
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            The story of how everyday observations of student talent, fragmented WhatsApp statuses, and campus challenges led to a unified digital ecosystem at OOU.
          </p>
        </div>

        {/* ============================================================ */}
        {/* FOUNDER PROFILE & CORE PULL QUOTE                            */}
        {/* ============================================================ */}
        <div className="bg-slate-50/90 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Founder Image Column */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-5">
              <div className="relative group">
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-200 relative">
                  <img 
                    src={founderConfig.photoUrl} 
                    alt={founderConfig.name}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-3 -right-2 bg-[#061A4F] text-white px-3.5 py-1.5 rounded-full border-2 border-white shadow-md flex items-center gap-1.5 text-xs font-black">
                  <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                  <span>Founder</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-[#061A4F]">{founderConfig.name}</h2>
                <p className="text-xs font-bold text-[#061A4F] bg-blue-100/70 px-3 py-0.5 rounded-full inline-block">
                  {founderConfig.role}
                </p>
                <div className="text-xs text-slate-600 font-semibold space-y-0.5 pt-1">
                  <p>{founderConfig.department} • {founderConfig.level}</p>
                  <p className="text-slate-500 font-medium">{founderConfig.institution}</p>
                </div>

                {/* Direct Contact Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full">
                  <a
                    href={founderConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: {founderConfig.whatsappFormatted}</span>
                  </a>
                  <a
                    href={founderConfig.emailUrl}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-[#F5B400]" />
                    <span>Email Founder</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Founder Highlight Quote & Initial Reflection */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#061A4F] text-[#F5B400] text-xs font-black">
                <Quote className="w-3.5 h-3.5" />
                <span>FOUNDER PERSPECTIVE</span>
              </div>

              <div className="relative p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                <Quote className="w-10 h-10 text-amber-100 absolute top-4 right-4 -z-0" />
                <p className="text-base sm:text-xl font-bold text-[#061A4F] leading-relaxed relative z-10 italic">
                  "{founderConfig.quote}"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[#F5B400]"></span>
                  <span>{founderConfig.name}, Founder</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  "I did not start StudentCircle to build another corporate app. I started it because I am an OOU student experiencing the exact disconnects we are solving. I saw talented graphic designers, coders, writers, bakers, craftspeople, and print shops operating in isolation."
                </p>
                <p>
                  "StudentCircle exists to connect student skills with real opportunities, giving hardworking students a clear, trusted place to be discovered."
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <Users className="w-4 h-4 text-[#061A4F] mx-auto mb-1" />
                  <div className="text-[11px] font-black text-[#061A4F]">Connect</div>
                  <div className="text-[10px] text-slate-500">Peers & Skills</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <Briefcase className="w-4 h-4 text-purple-700 mx-auto mb-1" />
                  <div className="text-[11px] font-black text-purple-900">Services</div>
                  <div className="text-[10px] text-slate-500">Escrow Protected</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <ShoppingBag className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                  <div className="text-[11px] font-black text-amber-900">Marketplace</div>
                  <div className="text-[10px] text-slate-500">Campus Vendors</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <Store className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <div className="text-[11px] font-black text-emerald-900">Motion Ground</div>
                  <div className="text-[10px] text-slate-500">Print & Hubs</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* THE 8 CHAPTERS OF THE FOUNDER STORY                          */}
        {/* ============================================================ */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#061A4F] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              The Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
              How the Vision Unfolded
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              An authentic narrative detailing the observations, struggles, and principles that built StudentCircle.
            </p>
          </div>

          <div className="space-y-6">
            {founderConfig.chapters.map((ch, idx) => {
              const isOpen = activeChapter === ch.id || idx < 3; // Keep first 3 open by default for rich reading
              return (
                <div 
                  key={ch.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-[#061A4F]/40"
                >
                  <button
                    onClick={() => toggleChapter(ch.id)}
                    className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left hover:bg-slate-50/50 transition cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-[#061A4F] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                          {ch.chapterNumber}
                        </span>
                        {ch.subtitle && (
                          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                            : {ch.subtitle}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-[#061A4F]">
                        {ch.title}
                      </h3>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600 flex-shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 bg-white space-y-4 animate-in fade-in duration-300">
                      {ch.highlight && (
                        <div className="p-4 bg-amber-50/70 border-l-4 border-[#F5B400] rounded-r-2xl text-xs sm:text-sm font-bold text-[#061A4F] italic">
                          "{ch.highlight}"
                        </div>
                      )}

                      <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {ch.content.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* VISUAL FOUNDER TIMELINE (UNDATED & AUTHENTIC)                */}
        {/* ============================================================ */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#061A4F] bg-white px-3 py-1 rounded-full border border-slate-200">
              Progression
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
              The Innovation Stages
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              The truthful evolution from everyday student observation to a working multi-campus infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {founderConfig.timeline.map((stage) => (
              <div 
                key={stage.stage}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-[#061A4F] transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-[#061A4F] text-[#F5B400] flex items-center justify-center font-black text-xs">
                      {stage.stage}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Stage 0{stage.stage}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#061A4F]">{stage.title}</h4>
                    <p className="text-xs font-bold text-amber-700">{stage.subtitle}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* MISSION & VISION                                             */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 bg-[#061A4F] text-white rounded-3xl border border-[#0B2A6F] shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0B2A6F] text-[#F5B400] flex items-center justify-center font-bold border border-white/10 shadow-inner">
              <Target className="w-6 h-6 text-[#F5B400]" />
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-[#F5B400]">Our Mission</div>
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
              "{founderConfig.mission}"
            </p>
            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-[#0B2A6F]">
              Focusing on verified identity, friction-free transactions, and localized discovery so student skills are rewarded with immediate, fair value.
            </p>
          </div>

          <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#061A4F] flex items-center justify-center font-bold border border-amber-100">
              <Compass className="w-6 h-6 text-[#061A4F]" />
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-[#061A4F]">Our Vision</div>
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
              "{founderConfig.vision}"
            </p>
            <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              Building a dependable bridge that connects campus learning to lifelong economic opportunities across tertiary institutions.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOUR PILLARS INTEGRATION                                     */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#061A4F] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
              The Four Pillars in Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              How the four core components work together to solve the discovery gap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {founderConfig.fourPillarsRelation.map((pillar, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-[#061A4F] transition group"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-[#061A4F] border border-blue-100">
                    {pillar.badge}
                  </span>
                  <h4 className="text-base font-black text-[#061A4F]">{pillar.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate(pillar.route)}
                  className="pt-2 text-xs font-bold text-[#061A4F] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore {pillar.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F5B400] transition group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* CLOSING MANIFESTO & CALL TO ACTION                           */}
        {/* ============================================================ */}
        <div className="bg-[#061A4F] text-white p-8 sm:p-12 rounded-3xl space-y-8 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F5B400] text-xs font-black">
              <HeartHandshake className="w-4 h-4" />
              <span>THE PURPOSE REMAINS CLEAR</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              "The Missing Piece is Connection."
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto italic">
              "{founderConfig.conclusionQuote}"
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('/auth/register')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F5B400] hover:bg-[#e0a500] text-[#061A4F] font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Join StudentCircle</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/services')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore the Platform</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
