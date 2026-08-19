import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Store,
  Briefcase,
  MapPin,
  Users,
  ShieldCheck,
  Search,
  FileText,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  ShoppingBag,
  ExternalLink,
  Target,
  Compass,
  Zap,
  Building2,
  Lock,
  Star,
  Globe,
  GraduationCap,
  Award,
  PhoneCall,
  Check,
  TrendingUp,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';
import { founderConfig } from '../../config/founder';
import { OouLogo } from '../../components/brand/OouLogo';
import { CampusStore } from '../../services/campusStore';
import { initialServices } from '../../services/dataStore';
import { initialProducts } from '../../services/marketplaceStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import { getServicePrice } from '../../types';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeAudienceTab, setActiveAudienceTab] = useState<'students' | 'vendors' | 'clients' | 'aspirants'>('students');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const campusLocations = CampusStore.getPublicLocations();

  const featuredServices = initialServices.slice(0, 4);
  const featuredProducts = initialProducts.slice(0, 4);

  const studentSkillsList = [
    'Graphic Design & Branding', 'Full-Stack Web Development', 'Video Editing & Motion Graphics',
    'Content Writing & Proofreading', 'Academic Tutoring & Exam Prep', 'Data Analysis & Statistics',
    'Mobile App Development', 'Social Media Management', 'UI/UX Interface Design', 'Hardware & PC Repair'
  ];

  const marketplaceCategoriesList = [
    'Campus Fashion & Hoodies', 'Artisanal Snacks & Pastries', 'Beauty & Hair Care Essentials',
    'Gadgets & Phone Accessories', 'Textbooks & Course Packs', 'Hostel Comfort Essentials'
  ];

  const campusHubHighlights = [
    {
      title: 'Online Document Printing',
      desc: 'Send lecture slides, lab manuals, and PDFs from your room; pick up ready and printed at Motion Ground.',
      icon: <Printer className="w-5 h-5 text-[#061A4F]" />
    },
    {
      title: 'Hardcover & Spiral Binding',
      desc: 'Gold-foil thesis hardcover binding for final year defense without waiting in physical queues.',
      icon: <FileText className="w-5 h-5 text-[#061A4F]" />
    },
    {
      title: 'JAMB & Screening Verification',
      desc: 'Direct portal screening, slip reprints, and verified OOU credential processing for incoming aspirants.',
      icon: <ShieldCheck className="w-5 h-5 text-[#061A4F]" />
    },
    {
      title: 'Instant Passport Photographs',
      desc: 'High-resolution official passport shots formatted to exact faculty screening dimensions.',
      icon: <Award className="w-5 h-5 text-[#061A4F]" />
    }
  ];

  const faqs = [
    {
      q: "What is OOU StudentCircle?",
      a: "OOU StudentCircle is the unified digital economy platform built specifically for the Olabisi Onabanjo University community. It connects student freelancers, campus product vendors, enterprise clients, and incoming aspirants across Ago-Iwoye Main Campus, Ibogun, Ayetoro, and Sagamu."
    },
    {
      q: "How does the Campus Hub document ordering work?",
      a: "Instead of walking around Motion Ground or Main Gate searching for an open shop and standing in line, you can choose a verified business center (like Alhaja Biz Venture Shop E6), upload your documents, select print specifications, pay securely, and get a secure pickup reference code to collect immediately."
    },
    {
      q: "How does StudentCircle protect payments?",
      a: "We use an escrow protection model. When a client hires a student or places a product order, the payment is securely held by StudentCircle. Funds are released to the student's Nigerian bank account only when the client confirms the work has been satisfactorily completed."
    },
    {
      q: "Can clients outside OOU hire student talent?",
      a: "Yes! Businesses, startups, alumni, and individuals anywhere in Nigeria or internationally can post job briefs, browse verified student portfolios, and hire talented OOU students for remote and on-campus projects."
    },
    {
      q: "Is it free for OOU students to join and list services?",
      a: "Yes. Creating your verified student account, listing your freelance services, and opening your student product storefront is completely free."
    }
  ];

  return (
    <div className="bg-white text-slate-900 selection:bg-[#F5B400] selection:text-[#061A4F]">
      
      {/* ============================================================ */}
      {/* SECTION 1: HERO & FOUR PILLARS (ABOVE THE FOLD VIEWPORT)    */}
      {/* ============================================================ */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-100">
        
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-tr from-amber-100/50 via-blue-50/50 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          {/* Main Hero Header Block */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#061A4F]/5 border border-[#061A4F]/10">
              <span className="w-2 h-2 rounded-full bg-[#F5B400] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-black tracking-widest text-[#061A4F] uppercase">
                OOU STUDENTCIRCLE • THE DIGITAL STUDENT ECONOMY
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#061A4F] tracking-tight leading-[1.12]">
              The digital home for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-amber-600">OOU student economy</span>.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              One platform connecting student talent, campus businesses, clients and incoming students across Ago-Iwoye, Ibogun, Ayetoro, and Sagamu.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/auth/register')}
                className="px-6 py-3 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <span>Join StudentCircle</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </button>
              <button
                onClick={() => onNavigate('/about')}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 shadow-2xs transition"
              >
                Learn How It Works
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* THE FOUR CORE PILLARS (IMMEDIATELY VISIBLE IN FIRST VIEWPORT) */}
          {/* ============================================================ */}
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Pillar 1: Student Services */}
              <div 
                onClick={() => onNavigate('/explore')}
                className="group relative bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#061A4F] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center group-hover:scale-110 transition duration-200">
                    <Sparkles className="w-5 h-5 text-[#061A4F]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      PILLAR 01
                    </span>
                    <h3 className="text-base font-black text-[#061A4F]">Student Services</h3>
                    <p className="text-xs text-amber-700 font-bold mt-0.5">"Sell what you know."</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hire verified OOU student graphic designers, web developers, writers, tutors, and technical specialists.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#061A4F] group-hover:text-blue-700">
                  <span>Find Student Services</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Pillar 2: Marketplace */}
              <div 
                onClick={() => onNavigate('/marketplace')}
                className="group relative bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition duration-200">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      PILLAR 02
                    </span>
                    <h3 className="text-base font-black text-slate-900">Marketplace</h3>
                    <p className="text-xs text-emerald-700 font-bold mt-0.5">"Sell what you make."</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Shop student-made fashion, curated campus snacks, hostel essentials, textbooks, and electronic accessories.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <span>Shop Student Products</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Pillar 3: Jobs & Opportunities */}
              <div 
                onClick={() => onNavigate('/talent')}
                className="group relative bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition duration-200">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      PILLAR 03
                    </span>
                    <h3 className="text-base font-black text-slate-900">Jobs & Gigs</h3>
                    <p className="text-xs text-amber-700 font-bold mt-0.5">"Find work. Find talent."</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Clients post briefs and internships; verified students submit structured proposals with milestone protection.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
                  <span>Explore Opportunities</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Pillar 4: Campus Hub */}
              <div 
                onClick={() => onNavigate('/campus')}
                className="group relative bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#061A4F] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition duration-200">
                    <Store className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      PILLAR 04
                    </span>
                    <h3 className="text-base font-black text-slate-900">Campus Hub</h3>
                    <p className="text-xs text-indigo-700 font-bold mt-0.5">"Get services before you arrive."</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Upload documents online to Motion Ground business centers; pick up ready prints & binding with zero queueing.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#061A4F] group-hover:text-indigo-800">
                  <span>Find Campus Services</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>

            </div>
          </div>

          {/* Student Connect Spotlight Banner */}
          <div className="pt-4">
            <div className="bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-[#061A4F] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5B400] text-[#061A4F] text-xs font-black">
                  <Users className="w-3.5 h-3.5" />
                  <span>NEW: STUDENT CONNECT</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Connect & Collaborate with OOU Peers
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Discover peers across all 5 campuses by department, skills, and shared academic interests. Connect • Collaborate • Learn • Work • Grow.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => onNavigate('/student-connect')}
                  className="px-6 py-3 bg-[#F5B400] hover:bg-[#E5A800] text-[#061A4F] text-xs sm:text-sm font-black rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <span>Explore Student Connect</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: THE PROBLEM WE SOLVE                             */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
              WHY STUDENTCIRCLE EXISTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
              Campus commerce was broken, scattered, and risky. We fixed it.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Before StudentCircle, students, businesses, and aspirants dealt with everyday bottlenecks across OOU.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-sm font-black text-slate-900">Untrusted WhatsApp Group Commerce</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transactions on messy WhatsApp group chats led to unverified sellers, ghosting after payment, zero accountability, and lost student money.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-sm font-black text-slate-900">Exhausting Motion Ground Queues</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traveling all the way from hostels or Lagos only to stand in 3-hour lines at Motion Ground for screening documents, project binding, and photocopies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-sm font-black text-slate-900">Student Skills Going Unmonetized</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Brilliant student developers, designers, and tutors had no credible, verified platform to showcase their work to paying clients and campus businesses.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: HOW STUDENTCIRCLE WORKS                          */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
              SIMPLE, TRUSTED WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
              How OOU StudentCircle works in four clear steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#061A4F] text-[#F5B400]">
                STEP 1
              </span>
              <h3 className="text-sm font-black text-slate-900">Discover or Post</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse verified student services, products, or campus business centers. Or post a custom project brief.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#061A4F] text-[#F5B400]">
                STEP 2
              </span>
              <h3 className="text-sm font-black text-slate-900">Escrow Security</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Funds are held safely in escrow. The seller or shop begins work knowing the order is genuine and funded.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#061A4F] text-[#F5B400]">
                STEP 3
              </span>
              <h3 className="text-sm font-black text-slate-900">Delivery or Pickup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digital files are delivered online, products handed over on campus, or documents collected with a secure pickup code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-[#061A4F] text-[#F5B400]">
                STEP 4
              </span>
              <h3 className="text-sm font-black text-slate-900">Release & Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once satisfied, funds are released directly to the provider's Nigerian bank account and a verified rating is published.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: STUDENT SERVICES SHOWCASE                        */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
                STUDENT FREELANCE TALENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F] mt-1">
                Hire verified student professionals
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Real OOU students with proven skills in technology, media, design, writing, and academics.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/explore')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B2A6F] transition"
            >
              <span>Browse All Services</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>
          </div>

          {/* Skills Pills */}
          <div className="flex flex-wrap gap-2">
            {studentSkillsList.map((skill, index) => (
              <span 
                key={index}
                onClick={() => onNavigate('/explore')}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#061A4F] hover:text-[#061A4F] cursor-pointer transition shadow-2xs"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => onNavigate('/explore')}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#061A4F] hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-video w-full bg-slate-100 relative">
                  <img
                    src={srv.coverImage || srv.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=500&auto=format&fit=crop&q=80'}
                    alt={srv.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#061A4F]/90 backdrop-blur-xs text-white text-[10px] font-bold">
                    {srv.category}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2">{srv.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <UserAvatar name={srv.studentName} photoUrl={srv.studentPhoto} size="xs" />
                      <span className="truncate">{srv.studentName}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{srv.rating || 5.0} ({srv.reviewsCount || 12})</span>
                    </div>
                    <span className="text-xs font-black text-[#061A4F]">
                      From ₦{getServicePrice(srv).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: MARKETPLACE SHOWCASE                             */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                CAMPUS COMMERCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F] mt-1">
                Student Product Marketplace
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Buy handmade apparel, food & pastries, accessories, and hostel needs directly from student creators.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-800 transition"
            >
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigate('/marketplace')}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-600 hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-square w-full bg-slate-100 relative">
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80'}
                    alt={prod.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold">
                    {prod.category}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.title}</h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{prod.vendorStoreName || prod.vendorName} • {prod.location || 'Ago-Iwoye'}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800">
                      ₦{(prod.price || 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">In Stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: JOBS & OPPORTUNITIES SHOWCASE                    */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
                CLIENT & ENTERPRISE PORTAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F] mt-1">
                Post briefs. Hire top OOU talent.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Companies, alumni, faculty, and startups post tasks; students deliver verified excellence.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/client/jobs/new')}
                className="px-4 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B2A6F] transition"
              >
                Post a Job Brief
              </button>
              <button
                onClick={() => onNavigate('/talent')}
                className="px-4 py-2.5 bg-white text-[#061A4F] border border-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
              >
                Browse Talent
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#061A4F] w-fit">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Custom Project Briefs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specify your exact requirements, budget range (Fixed or Hourly), deadlines, and required faculty department.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Milestone Escrow Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pay per milestone. Funds are released only after review and acceptance of completed deliverables.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Vetted Student Portfolios</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified matriculation status, past client reviews, completed gigs, and student work samples before hiring.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7: CAMPUS HUB SHOWCASE                              */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
              PHYSICAL ON-CAMPUS SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
              Campus Hub: Send files before you arrive. Pick up without queues.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Connecting physical business centers at Motion Ground, Main Gate, and Faculty complexes to digital ordering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {campusHubHighlights.map((item, index) => (
              <div
                key={index}
                onClick={() => onNavigate('/campus')}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#061A4F] hover:bg-white shadow-2xs hover:shadow-md transition cursor-pointer space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#061A4F] text-white p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#F5B400] uppercase tracking-wider">
                FEATURED FLAGSHIP SHOP
              </span>
              <h3 className="text-lg sm:text-xl font-black">
                Alhaja Biz Venture (Shop E6, Motion Ground)
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Motion Ground's leading documentation center. Order project binding, photocopy packs, and screening forms online.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/campus')}
              className="px-6 py-3 bg-[#F5B400] hover:bg-amber-400 text-[#061A4F] font-black text-xs rounded-xl shadow-sm transition whitespace-nowrap"
            >
              Order Documents Now
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8: CAMPUS LOCATION ZONES                            */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
                CAMPUS LOCATION ZONES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F] mt-1">
                Find Services Across OOU
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Whether you&apos;re at the Main Campus, Mini Campus, Ibogun, Ayetoro or Sagamu, discover participating student professionals, vendors and campus service providers around your location.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/campus-zones')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B2A6F] transition flex-shrink-0"
            >
              <span>Explore All 5 Campuses</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusLocations.map((loc) => {
              const providersCount = CampusStore.getActiveProvidersCount(loc.id);
              return (
                <div
                  key={loc.id}
                  onClick={() => onNavigate('/campus-zones')}
                  className="group bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-[#061A4F] hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Campus Image */}
                    <div className="aspect-16/9 w-full bg-slate-900 relative overflow-hidden">
                      <img
                        src={loc.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80'}
                        alt={loc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#061A4F]/80 backdrop-blur-md text-[#F5B400] text-[10px] font-black uppercase tracking-wider self-start border border-[#F5B400]/30">
                          {loc.location || 'Ago-Iwoye'}
                        </span>
                        <div>
                          <span className="text-[11px] font-semibold text-slate-300 block">
                            {loc.subTitle || loc.campusType}
                          </span>
                          <h3 className="text-base font-black text-white leading-snug">
                            {loc.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {loc.description}
                      </p>

                      {/* Active Providers count / No service providers notice */}
                      <div className="flex items-center gap-2">
                        {providersCount > 0 ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                            <Store className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{providersCount} Active {providersCount === 1 ? 'Provider' : 'Providers'}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                            <Store className="w-3.5 h-3.5 text-slate-400" />
                            <span>No service providers listed yet.</span>
                          </div>
                        )}
                      </div>

                      {/* Popular Services Tags */}
                      {loc.popularServices && loc.popularServices.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            Popular Services
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {loc.popularServices.slice(0, 3).map((srv, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium"
                              >
                                {srv}
                              </span>
                            ))}
                            {loc.popularServices.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px] font-medium">
                                +{loc.popularServices.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explore Services Button */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('/campus-zones');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-[#061A4F] group-hover:text-white transition"
                    >
                      <span>Explore Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9: WHO STUDENTCIRCLE IS FOR                         */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
              DESIGNED FOR THE ENTIRE COMMUNITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
              Who StudentCircle is built for
            </h2>
          </div>

          <div className="flex justify-center border-b border-slate-200 pb-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveAudienceTab('students')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeAudienceTab === 'students'
                    ? 'bg-[#061A4F] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Student Freelancers
              </button>
              <button
                onClick={() => setActiveAudienceTab('vendors')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeAudienceTab === 'vendors'
                    ? 'bg-[#061A4F] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Campus Vendors & Shops
              </button>
              <button
                onClick={() => setActiveAudienceTab('clients')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeAudienceTab === 'clients'
                    ? 'bg-[#061A4F] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Enterprise & Clients
              </button>
              <button
                onClick={() => setActiveAudienceTab('aspirants')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeAudienceTab === 'aspirants'
                    ? 'bg-[#061A4F] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Incoming Aspirants
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 max-w-4xl mx-auto">
            {activeAudienceTab === 'students' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-black text-[#061A4F]">For OOU Student Freelancers & Creators</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Turn your coding, design, writing, or tutoring skills into a legitimate income stream. Build a public portfolio verified by your university status, set your prices, receive guaranteed escrow payments, and graduate with genuine commercial experience.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Zero signup or listing fees
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Guaranteed escrow payouts to NUBAN bank accounts
                  </div>
                </div>
              </div>
            )}

            {activeAudienceTab === 'vendors' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-black text-[#061A4F]">For Campus Vendors & Business Center Owners</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Expand your shop's reach across the entire campus. Receive pre-paid printing orders, sell student products, avoid cash-handling discrepancies, and manage daily sales through your dedicated shop dashboard.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Dedicated Motion Ground shop code (e.g. Shop E6)
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Live order tracker and customer messaging
                  </div>
                </div>
              </div>
            )}

            {activeAudienceTab === 'clients' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-black text-[#061A4F]">For Startups, Alumni & Corporate Clients</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Access motivated, highly skilled student talent at competitive rates. Every student freelancer is verified with legitimate campus matriculation. Pay only when work meets your specifications.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Milestone-based project contracts
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Direct chat and deliverable management
                  </div>
                </div>
              </div>
            )}

            {activeAudienceTab === 'aspirants' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-black text-[#061A4F]">For Incoming Aspirants & Freshers</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Prepare your screening, result printouts, and hostel essentials before arriving at OOU. Avoid scams, get authentic campus advice, and experience a stress-free transition into university life.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified screening document processing
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Pickup reference codes for instant on-campus collection
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10: THE STUDENT JOURNEY                             */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
              CAREER & ECONOMIC PATHWAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
              The OOU Student Journey on StudentCircle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">Phase 1</span>
              <h3 className="text-sm font-black text-slate-900">Aspirant & 100L</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Order screening forms, find verified campus guides, buy essential hostel items, and settle smoothly into university life.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">Phase 2</span>
              <h3 className="text-sm font-black text-slate-900">200L - 300L</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Publish your first freelance gigs, launch a product brand, build client reviews, and earn steady supplementary income.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">Phase 3</span>
              <h3 className="text-sm font-black text-slate-900">400L & Final Year</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fast-track final year project printing & binding through Campus Hub; win high-paying corporate briefs and internships.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <span className="text-[10px] font-black px-2 py-0.5 bg-[#061A4F] text-[#F5B400] rounded uppercase">Phase 4</span>
              <h3 className="text-sm font-black text-[#061A4F]">Graduation & Beyond</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Graduate not just with a degree, but with a verified work history, client references, financial autonomy, and market-ready skills.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 11, 12, 13: AGENDA, MISSION & VISION               */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Agenda */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#061A4F] text-[#F5B400] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#061A4F]">Our Agenda</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To transform OOU into the premier model for student economic empowerment in Nigeria, replacing informal insecurity with structured, verified, and protected digital commerce.
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 rounded-3xl bg-[#061A4F] text-white space-y-4 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#F5B400] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {founderConfig.mission}
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#061A4F] text-[#F5B400] flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#061A4F]">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {founderConfig.vision}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 14: TRUST, SAFETY & VERIFICATION                   */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
              SAFETY BY DESIGN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
              Built on uncompromising campus trust & escrow security
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <Lock className="w-6 h-6 text-[#061A4F]" />
              <h3 className="text-sm font-black text-slate-900">Escrow Security</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Money is held safely until client satisfaction is verified. Zero payment fraud.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">Campus Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students and shops undergo matriculation and physical on-ground audit verification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <Star className="w-6 h-6 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900">Authentic Reviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only verified paying customers who completed an order can leave feedback.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900">Direct NUBAN Payouts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fast automated payouts directly to all Nigerian commercial and microfinance banks.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 15: FOUNDER SECTION                                 */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-8">
            
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden bg-[#061A4F] border-4 border-white shadow-md flex-shrink-0">
              <img
                src={founderConfig.photoUrl}
                alt={founderConfig.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 block">
                  MEET THE FOUNDER
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#061A4F] mt-0.5">
                  {founderConfig.name}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {founderConfig.role} • {founderConfig.institution}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                "{founderConfig.story[0]}"
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href={founderConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {founderConfig.whatsapp}</span>
                </a>
                <a
                  href={founderConfig.emailUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>{founderConfig.email}</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 16: FREQUENTLY ASKED QUESTIONS                     */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#061A4F]">
              COMMON QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-[#061A4F]"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 17: FINAL CALL TO ACTION                           */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 bg-[#061A4F] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#F5B400]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F5B400] text-xs font-black uppercase tracking-wider">
            <span>GET STARTED IN SECONDS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Ready to join the official OOU student economy?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-xl mx-auto leading-relaxed">
            Create your account today as a student freelancer, campus vendor, hiring client, or incoming aspirant.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/auth/register')}
              className="px-6 py-3 bg-[#F5B400] hover:bg-amber-400 text-[#061A4F] font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/campus/register-shop')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition"
            >
              Register Campus Business
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
