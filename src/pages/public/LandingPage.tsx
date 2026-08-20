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
  HelpCircle,
  UserCheck,
  PackageCheck,
  Send,
  AlertCircle,
  Eye,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { founderConfig } from '../../config/founder';
import { CampusStore } from '../../services/campusStore';
import { initialServices } from '../../services/dataStore';
import { initialProducts } from '../../services/marketplaceStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import { getServicePrice } from '../../types';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCampusTab, setActiveCampusTab] = useState<string>('all');

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const campusLocations = CampusStore.getPublicLocations();
  const featuredServices = initialServices.slice(0, 4);
  const featuredProducts = initialProducts.slice(0, 4);

  const problemItems = [
    {
      id: 'p1',
      title: 'Students struggle to find trustworthy service providers',
      problemDesc: 'When students need a graphic designer, typist, developer, or tutor, they rely on chaotic WhatsApp statuses with zero verification, risking substandard work, missed deadlines, or lost upfront deposits.',
      solutionTitle: 'Verified Student Badges & Escrow Security',
      solutionDesc: 'StudentCircle verifies student status, matriculation details, and portfolios. Payments are held in escrow until work is delivered and approved.'
    },
    {
      id: 'p2',
      title: 'Student professionals struggle to find clients',
      problemDesc: 'Skilled student graphic designers, developers, writers, and technicians have immense talent but lack a dedicated platform to showcase their portfolio to paying campus and external clients.',
      solutionTitle: 'Dedicated Professional Profiles & Global Client Exposure',
      solutionDesc: 'Student freelancers get structured service listings, custom portfolio galleries, milestone tracking, and direct access to client job briefs.'
    },
    {
      id: 'p3',
      title: 'Campus vendors struggle to reach customers before they arrive',
      problemDesc: 'Business centers at Motion Ground and campus food/fashion vendors rely purely on foot traffic. Freshmen and busy students spend hours waiting in long physical queues.',
      solutionTitle: 'Campus Hub Pre-Ordering & Remote Document Printing',
      solutionDesc: 'Students can upload lecture slides, thesis drafts, or project files online, pay securely, and pick up ready prints and bound copies with zero queueing.'
    },
    {
      id: 'p4',
      title: 'Students across different campuses rarely have one digital network',
      problemDesc: 'Ago-Iwoye Main, Mini Campus, Ibogun, Ayetoro, and Sagamu operate in isolated geographical silos with virtually no shared student marketplace or collaboration channel.',
      solutionTitle: 'Unified 5-Campus Directory & Student Connect',
      solutionDesc: 'One interconnected ecosystem bridging all 5 campuses. Connect by faculty, department, skill set, or project ideas across the university.'
    },
    {
      id: 'p5',
      title: 'Clients struggle to discover student talent',
      problemDesc: 'Startups, SMEs, local businesses, and university faculty struggle to recruit affordable, skilled student freelancers and SIWES interns with proven competencies.',
      solutionTitle: 'Open Job Briefs & Milestone Contract Escrow',
      solutionDesc: 'Post job requirements, receive structured proposals from verified OOU students, and manage delivery safely through clear project milestones.'
    }
  ];

  const agendaGoals = [
    {
      title: 'Connect OOU Students',
      desc: 'Unite students across Ago-Iwoye, Ibogun, Ayetoro, and Sagamu in one dynamic, collaborative digital campus network.',
      icon: <Users className="w-5 h-5 text-[#061A4F]" />
    },
    {
      title: 'Unlock Student Talent',
      desc: 'Transform classroom knowledge into verified, portfolio-backed professional experience with real client projects.',
      icon: <Sparkles className="w-5 h-5 text-[#061A4F]" />
    },
    {
      title: 'Digitize Campus Commerce',
      desc: 'Bring physical campus businesses, student makers, and service providers into a structured online marketplace.',
      icon: <Store className="w-5 h-5 text-[#061A4F]" />
    },
    {
      title: 'Improve Access to Campus Services',
      desc: 'Enable incoming aspirants and busy students to pre-order printing, binding, and screening before setting foot on campus.',
      icon: <Printer className="w-5 h-5 text-[#061A4F]" />
    },
    {
      title: 'Create Economic Opportunities',
      desc: 'Provide legitimate, flexible on-campus income streams that fit around academic timetables and study commitments.',
      icon: <TrendingUp className="w-5 h-5 text-[#061A4F]" />
    },
    {
      title: 'Build a Stronger Student Ecosystem',
      desc: 'Cultivate an enduring peer economy and entrepreneurial culture that prepares OOU graduates for industry leadership.',
      icon: <ShieldCheck className="w-5 h-5 text-[#061A4F]" />
    }
  ];

  const howItWorksSteps = [
    {
      step: '01',
      name: 'Discover',
      title: 'Search & Explore',
      desc: 'Browse verified student freelancers, campus marketplace products, client job opportunities, or Motion Ground business centers.'
    },
    {
      step: '02',
      name: 'Connect',
      title: 'Initiate Communication',
      desc: 'Chat directly with student professionals, submit proposals for job briefs, or specify custom print/product requirements.'
    },
    {
      step: '03',
      name: 'Request/Order',
      title: 'Secure Escrow Payment',
      desc: 'Place your order or accept a job proposal. Funds are held safely in escrow protection before work begins or items are prepared.'
    },
    {
      step: '04',
      name: 'Complete',
      title: 'Deliver & Inspect',
      desc: 'Receive digital deliverables, collect your printed documents at campus pickup points, or receive your physical marketplace order.'
    },
    {
      step: '05',
      name: 'Review',
      title: 'Release Funds & Rate',
      desc: 'Approve completion to release escrow funds directly to the student or vendor, and leave an authentic verified peer rating.'
    }
  ];

  const faqs = [
    {
      q: "What is OOU StudentCircle?",
      a: "OOU StudentCircle is the digital home for the OOU student economy. It is a single unified platform connecting student freelance talent, student-made physical marketplace products, client job opportunities, campus business center services, and student-to-student networking across all OOU campuses."
    },
    {
      q: "How does the Campus Hub document printing work?",
      a: "Instead of walking around Motion Ground or campus gates and waiting in long queues, you can upload lecture slides, assignments, lab manuals, or thesis documents online, select print specifications, pay securely, and pick up your ready prints with zero wait time using your pickup reference code."
    },
    {
      q: "How does StudentCircle protect transactions?",
      a: "We use an escrow protection model. When a client hires a student freelancer or orders a custom product, payment is held safely by StudentCircle. Funds are released to the student's Nigerian bank account only after the buyer confirms that the deliverable meets all agreed specifications."
    },
    {
      q: "Can clients outside OOU hire student talent?",
      a: "Yes! Startups, alumni, corporate businesses, and individuals anywhere in Nigeria and internationally can post job briefs, browse verified student portfolios, and hire talented OOU students for remote, hybrid, or on-campus tasks."
    },
    {
      q: "Which OOU campuses are supported?",
      a: "StudentCircle supports all five campus locations: Main Campus (Permanent Site, Ago-Iwoye), Mini Campus (Ago-Iwoye), Ibogun Campus (College of Engineering & Technology), Ayetoro Campus (College of Agricultural Sciences), and Sagamu Campus (Obafemi Awolowo College of Health Sciences)."
    },
    {
      q: "Is it free for students to join and list services?",
      a: "Yes. Registering your student account, creating your verified profile, listing your freelance services, and opening a product storefront is 100% free."
    }
  ];

  return (
    <div id="landing-page-root" className="bg-white text-slate-900 selection:bg-[#F5B400] selection:text-[#061A4F] font-sans antialiased">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section id="hero-section" className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#061A4F]/5 border border-[#061A4F]/10">
              <span className="w-2 h-2 rounded-full bg-[#F5B400] animate-pulse" />
              <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase">
                OOU STUDENTCIRCLE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#061A4F] tracking-tight leading-[1.12]">
              The digital home for the <br className="hidden sm:inline" />
              <span className="text-[#061A4F] border-b-4 border-[#F5B400]">OOU student economy.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              One platform connecting student talent, campus businesses, clients and incoming students.
            </p>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="hero-cta-join"
                onClick={() => onNavigate('/auth/register')}
                className="px-6 py-3.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Join StudentCircle</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </button>
              <button
                id="hero-cta-explore"
                onClick={() => onNavigate('/explore')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-xl border border-slate-300 shadow-2xs transition"
              >
                Explore the Platform
              </button>
            </div>

            {/* ============================================================ */}
            {/* FOUR PRIMARY ACTION BUTTONS (IMMEDIATELY DISPLAYED)          */}
            {/* ============================================================ */}
            <div className="pt-6">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                Quick Access • What are you looking for today?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto">
                
                <button
                  id="quick-action-services"
                  onClick={() => onNavigate('/explore')}
                  className="px-3.5 py-3 rounded-xl bg-slate-50 hover:bg-[#061A4F] hover:text-white border border-slate-200 hover:border-[#061A4F] transition-all text-left flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between w-full">
                    <Sparkles className="w-4 h-4 text-[#061A4F] group-hover:text-[#F5B400]" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-300">01</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-black text-slate-900 group-hover:text-white">Student Services</div>
                    <div className="text-[11px] text-slate-500 group-hover:text-slate-200">Find talent</div>
                  </div>
                </button>

                <button
                  id="quick-action-marketplace"
                  onClick={() => onNavigate('/marketplace')}
                  className="px-3.5 py-3 rounded-xl bg-slate-50 hover:bg-[#061A4F] hover:text-white border border-slate-200 hover:border-[#061A4F] transition-all text-left flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between w-full">
                    <ShoppingBag className="w-4 h-4 text-[#061A4F] group-hover:text-[#F5B400]" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-300">02</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-black text-slate-900 group-hover:text-white">Marketplace</div>
                    <div className="text-[11px] text-slate-500 group-hover:text-slate-200">Shop products</div>
                  </div>
                </button>

                <button
                  id="quick-action-opportunities"
                  onClick={() => onNavigate('/opportunities')}
                  className="px-3.5 py-3 rounded-xl bg-slate-50 hover:bg-[#061A4F] hover:text-white border border-slate-200 hover:border-[#061A4F] transition-all text-left flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between w-full">
                    <Briefcase className="w-4 h-4 text-[#061A4F] group-hover:text-[#F5B400]" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-300">03</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-black text-slate-900 group-hover:text-white">Opportunities</div>
                    <div className="text-[11px] text-slate-500 group-hover:text-slate-200">Find gigs & jobs</div>
                  </div>
                </button>

                <button
                  id="quick-action-campus"
                  onClick={() => onNavigate('/campus')}
                  className="px-3.5 py-3 rounded-xl bg-slate-50 hover:bg-[#061A4F] hover:text-white border border-slate-200 hover:border-[#061A4F] transition-all text-left flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between w-full">
                    <Store className="w-4 h-4 text-[#061A4F] group-hover:text-[#F5B400]" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-300">04</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-black text-slate-900 group-hover:text-white">Campus Hub</div>
                    <div className="text-[11px] text-slate-500 group-hover:text-slate-200">Print & services</div>
                  </div>
                </button>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE FOUR PILLARS (OVERVIEW CARDS)                         */}
      {/* ============================================================ */}
      <section id="four-pillars-overview" className="py-14 sm:py-18 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-white px-3.5 py-1 rounded-full border border-slate-200">
              CORE PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
              The Four Pillars of StudentCircle
            </h2>
            <p className="text-sm text-slate-600">
              Engineered specifically for Olabisi Onabanjo University students, makers, vendors, and clients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Pillar 01: Student Services */}
            <div 
              id="pillar-card-1"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#061A4F] transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">01</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 text-[#061A4F]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#061A4F] uppercase tracking-wide">
                    STUDENT SERVICES
                  </h3>
                  <p className="text-xs font-black text-[#F5B400] bg-amber-50 inline-block px-2 py-0.5 rounded mt-1">
                    "Sell what you know."
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hire verified OOU student graphic designers, software engineers, academic tutors, copywriters, and multimedia creators.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/explore')}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Find Student Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 02: Marketplace */}
            <div 
              id="pillar-card-2"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#061A4F] transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">02</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#061A4F] flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5 text-[#061A4F]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#061A4F] uppercase tracking-wide">
                    MARKETPLACE
                  </h3>
                  <p className="text-xs font-black text-[#F5B400] bg-amber-50 inline-block px-2 py-0.5 rounded mt-1">
                    "Sell what you make."
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Shop student-made campus fashion, snacks & pastries, hostel essentials, textbooks, tech accessories, and craft goods.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/marketplace')}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Shop Student Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 03: Jobs & Opportunities */}
            <div 
              id="pillar-card-3"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#061A4F] transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">03</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5 text-[#061A4F]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#061A4F] uppercase tracking-wide">
                    JOBS & OPPORTUNITIES
                  </h3>
                  <p className="text-xs font-black text-[#F5B400] bg-amber-50 inline-block px-2 py-0.5 rounded mt-1">
                    "Find work. Find talent."
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse client project briefs, campus freelancing gigs, SIWES industrial attachments, and remote internships with milestone protection.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/opportunities')}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 04: Campus Hub */}
            <div 
              id="pillar-card-4"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#061A4F] transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">04</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#061A4F] flex items-center justify-center font-bold">
                    <Store className="w-5 h-5 text-[#061A4F]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#061A4F] uppercase tracking-wide">
                    CAMPUS HUB
                  </h3>
                  <p className="text-xs font-black text-[#F5B400] bg-amber-50 inline-block px-2 py-0.5 rounded mt-1">
                    "Get campus services before you arrive."
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pre-order online document printing, thesis hardcover binding, JAMB screening, and passport photos at Motion Ground with zero queues.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/campus')}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Find Campus Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. STUDENT CONNECT SECTION                                   */}
      {/* ============================================================ */}
      <section id="student-connect-section" className="py-14 sm:py-18 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#061A4F] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-[#061A4F]">
            
            <div className="max-w-3xl space-y-6 relative z-10">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#F5B400] text-xs font-black border border-white/10">
                <Users className="w-4 h-4" />
                <span>STUDENT CONNECT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Meet your people across OOU.
              </h2>

              <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
                Connect with students across campuses, discover shared interests, collaborate on ideas and find people with the skills you need.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                  <div className="text-[#F5B400] font-black text-sm">Discover Peers</div>
                  <div className="text-xs text-slate-300">Filter by department, level, faculty, or creative hobbies.</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                  <div className="text-[#F5B400] font-black text-sm">Skill Match</div>
                  <div className="text-xs text-slate-300">Find co-founders, study partners, designers, and programmers.</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                  <div className="text-[#F5B400] font-black text-sm">Cross-Campus</div>
                  <div className="text-xs text-slate-300">Build friendships between Ago-Iwoye, Ibogun, Ayetoro, and Sagamu.</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  id="student-connect-cta"
                  onClick={() => onNavigate('/student-connect')}
                  className="px-7 py-3.5 bg-[#F5B400] hover:bg-[#E5A800] text-[#061A4F] text-sm font-black rounded-xl transition shadow-md flex items-center gap-2"
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
      {/* 4. THE PROBLEM & THE SOLUTION                                */}
      {/* ============================================================ */}
      <section id="problem-solution-section" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-white px-3.5 py-1 rounded-full border border-slate-200">
              CAMPUS REALITY & OUR SOLUTION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              Real Campus Problems. Clear Digital Solutions.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              How OOU StudentCircle eliminates friction for students, freelancers, vendors, and clients.
            </p>
          </div>

          <div className="space-y-4">
            {problemItems.map((item, idx) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:border-[#061A4F]/40 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  
                  {/* Left Column: Problem (Red/Amber tone) */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs font-black flex items-center justify-center">
                        ✕
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-rose-600">
                        Problem {idx + 1}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.problemDesc}
                    </p>
                  </div>

                  {/* Middle Arrow on Large Screens */}
                  <div className="hidden lg:flex lg:col-span-1 justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-[#061A4F] flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Right Column: StudentCircle Solution (Navy/Gold tone) */}
                  <div className="lg:col-span-6 bg-blue-50/60 p-4 sm:p-5 rounded-xl border border-blue-100/80 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#061A4F]" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#061A4F]">
                        StudentCircle Solution
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-[#061A4F]">
                      {item.solutionTitle}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item.solutionDesc}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FOUR PILLARS (DEDICATED DETAILED SECTIONS)                */}
      {/* ============================================================ */}
      
      {/* Dedicated Pillar 1: Student Services */}
      <section id="dedicated-pillar-services" className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-[#061A4F] text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PILLAR 01 • STUDENT SERVICES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
                Sell What You Know.
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Verified OOU student freelancers delivering top-tier design, software, writing, tutoring, and technical services.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/explore')}
              className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center gap-2 self-start md:self-auto"
            >
              <span>Find Student Services</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>
          </div>

          {/* Featured Services Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredServices.map(service => (
              <div
                key={service.id}
                onClick={() => onNavigate('/explore')}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#061A4F] transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={service.coverImage} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-[#061A4F]/85 text-white text-[10px] font-black uppercase backdrop-blur-xs">
                      {service.category}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={service.studentName} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                          {service.studentName}
                          <CheckCircle2 className="w-3 h-3 text-[#061A4F] flex-shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-500">{service.campus}</div>
                      </div>
                    </div>

                    <h4 className="text-xs font-black text-[#061A4F] line-clamp-2 leading-snug">
                      {service.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="text-[11px] text-slate-500 font-medium">Starting at</div>
                  <div className="text-sm font-black text-[#061A4F]">
                    {getServicePrice(service)}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dedicated Pillar 2: Marketplace */}
      <section id="dedicated-pillar-marketplace" className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-[#061A4F] text-xs font-black">
                <ShoppingBag className="w-3.5 h-3.5 text-[#061A4F]" />
                <span>PILLAR 02 • MARKETPLACE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
                Sell What You Make.
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Direct commerce for student artisans, fashion designers, bakers, gadget sellers, and book vendors across campus.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/marketplace')}
              className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center gap-2 self-start md:self-auto"
            >
              <span>Shop Student Marketplace</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>
          </div>

          {/* Featured Products Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => onNavigate('/marketplace')}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#061A4F] transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-[#061A4F]/85 text-white text-[10px] font-black uppercase backdrop-blur-xs">
                      {product.category}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F5B400]" />
                      {product.location}
                    </div>

                    <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">
                      {product.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    In Stock ({product.quantity || 1})
                  </div>
                  <div className="text-sm font-black text-[#061A4F]">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dedicated Pillar 3: Jobs & Opportunities */}
      <section id="dedicated-pillar-jobs" className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-[#061A4F] text-xs font-black">
                <Briefcase className="w-3.5 h-3.5 text-[#061A4F]" />
                <span>PILLAR 03 • JOBS & OPPORTUNITIES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
                Find Work. Find Talent.
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Real client contracts, campus gigs, SIWES industrial placements, and remote projects backed by milestone escrow.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/opportunities')}
                className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center gap-2"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#061A4F] flex items-center justify-center font-bold border border-slate-200">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#061A4F]">Milestone Escrow Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clients fund project milestones before you write a single line of code or design a flyer. Get paid reliably upon client milestone sign-off.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#061A4F] flex items-center justify-center font-bold border border-slate-200">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#061A4F]">SIWES & Tech Internships</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with verified businesses and alumni agencies seeking qualified students for IT attachments and career internships.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#061A4F] flex items-center justify-center font-bold border border-slate-200">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#061A4F]">Structured Proposals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit bids with delivery timelines, portfolio attachments, and clear milestones directly through the built-in proposal interface.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Dedicated Pillar 4: Campus Hub */}
      <section id="dedicated-pillar-campus" className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-[#061A4F] text-xs font-black">
                <Store className="w-3.5 h-3.5 text-[#061A4F]" />
                <span>PILLAR 04 • CAMPUS HUB</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
                Get Campus Services Before You Arrive.
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Upload slides, project reports, and screening documents to verified business centers at Motion Ground; pick up with zero queueing.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/campus')}
              className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs sm:text-sm font-black rounded-xl transition flex items-center gap-2 self-start md:self-auto"
            >
              <span>Find Campus Services</span>
              <ArrowRight className="w-4 h-4 text-[#F5B400]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <Printer className="w-6 h-6 text-[#061A4F]" />
              <div className="text-sm font-black text-[#061A4F]">Online Document Printing</div>
              <p className="text-xs text-slate-600">Send PDF slides and assignments from your hostel; collect ready prints at Motion Ground.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <FileText className="w-6 h-6 text-[#061A4F]" />
              <div className="text-sm font-black text-[#061A4F]">Hardcover Thesis Binding</div>
              <p className="text-xs text-slate-600">Gold-foil thesis hardcover and spiral binding for final-year projects without waiting in line.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#061A4F]" />
              <div className="text-sm font-black text-[#061A4F]">Screening Verification</div>
              <p className="text-xs text-slate-600">JAMB slip reprints, portal screening verification, and student credential assistance.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <Award className="w-6 h-6 text-[#061A4F]" />
              <div className="text-sm font-black text-[#061A4F]">Instant Passport Photos</div>
              <p className="text-xs text-slate-600">Official passport photographs formatted to exact OOU faculty screening specifications.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CAMPUS LOCATIONS (LOADED DYNAMICALLY)                     */}
      {/* ============================================================ */}
      <section id="campus-locations-section" className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
              CAMPUS FOOTPRINT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              Active Across All OOU Campuses
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Connecting students, services, and commerce across our university campuses in Ogun State.
            </p>
          </div>

          {/* Dynamic Campus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusLocations.map(loc => (
              <div
                key={loc.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#061A4F] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={loc.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'} 
                      alt={loc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#061A4F] text-white text-[11px] font-black">
                      {loc.code}
                    </div>
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-xs font-bold backdrop-blur-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F5B400]" />
                      {loc.location}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-black text-[#061A4F]">{loc.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{loc.campusType}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {loc.description}
                    </p>

                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] font-black uppercase text-slate-400">Key Landmarks & Hubs:</div>
                      <div className="text-xs text-slate-700 font-medium flex items-start gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#061A4F] flex-shrink-0 mt-0.5" />
                        <span>{loc.landmark}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => onNavigate('/campus')}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Campus Hubs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. HOW IT WORKS (5 STEPS)                                    */}
      {/* ============================================================ */}
      <section id="how-it-works-section" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-white px-3.5 py-1 rounded-full border border-slate-200">
              SIMPLE & SECURE PROCESS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              How StudentCircle Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From discovery to verified escrow completion in five straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {howItWorksSteps.map((stepItem, idx) => (
              <div 
                key={stepItem.step}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-[#061A4F] transition-all flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-[#F5B400]">{stepItem.step}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#061A4F] text-[10px] font-black uppercase">
                      {stepItem.name}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#061A4F]">
                    {stepItem.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Step {idx + 1} of 5</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. AGENDA & BROADER MISSION                                  */}
      {/* ============================================================ */}
      <section id="agenda-mission-section" className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
              OUR STRATEGIC MISSION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              The StudentCircle Agenda
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Building a sustainable, high-impact peer economy that transforms student potential into lasting career success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendaGoals.map((goal, idx) => (
              <div 
                key={goal.title}
                className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 hover:border-[#061A4F] transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#061A4F] flex items-center justify-center font-bold border border-slate-200 shadow-2xs">
                    {goal.icon}
                  </div>
                  <span className="text-xs font-black text-slate-400">0{idx + 1}</span>
                </div>

                <h3 className="text-base font-black text-[#061A4F]">
                  {goal.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {goal.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FOUNDER SECTION                                           */}
      {/* ============================================================ */}
      <section id="founder-section" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Founder Image Column */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-4 border-[#061A4F]/10 shadow-md relative group">
                  <img 
                    src={founderConfig.photoUrl} 
                    alt={founderConfig.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-black text-[#061A4F]">
                    {founderConfig.name}
                  </h3>
                  <p className="text-xs font-bold text-[#F5B400] bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
                    {founderConfig.role}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {founderConfig.department} • {founderConfig.level}
                  </p>
                  <p className="text-xs text-slate-400">
                    {founderConfig.institution}
                  </p>
                </div>
              </div>

              {/* Founder Story Column */}
              <div className="md:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#061A4F]/5 text-[#061A4F] text-xs font-black">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>FOUNDER'S STATEMENT</span>
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-[#061A4F] leading-snug">
                  "Empowering OOU students with authentic economic opportunities right from campus."
                </h4>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p>
                    As a Computer Science student at Olabisi Onabanjo University, I witnessed firsthand the immense pool of untapped student talent across our campuses — graphic designers, web developers, content writers, tutors, and vendors struggling to connect with clients who actively needed their skills.
                  </p>
                  <p>
                    I founded OOU StudentCircle to build a secure, verified, and campus-tailored marketplace. Our mission is to empower every skilled student to gain authentic work experience, build an unshakeable reputation, and earn sustainable income right from school.
                  </p>
                </div>

                {/* Direct Connect Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={founderConfig.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Founder ({founderConfig.whatsapp})</span>
                  </a>
                  <a
                    href={founderConfig.emailUrl}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Founder</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. FREQUENTLY ASKED QUESTIONS ACCORDION                     */}
      {/* ============================================================ */}
      <section id="faq-section" className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
              Everything You Need to Know
            </h2>
            <p className="text-sm text-slate-600">
              Clear answers to common questions about StudentCircle escrow, campus printing, and student freelancing.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left font-black text-sm text-[#061A4F] flex items-center justify-between hover:bg-slate-50 transition gap-4"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-[#F5B400] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. FINAL CTA SECTION                                        */}
      {/* ============================================================ */}
      <section id="final-cta-section" className="py-16 sm:py-24 bg-[#061A4F] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#F5B400] text-xs font-black border border-white/10">
            <Sparkles className="w-4 h-4" />
            <span>JOIN THE OOU STUDENT ECONOMY</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-snug">
            Your campus is full of talent, ideas and opportunities. <br className="hidden sm:inline" />
            <span className="text-[#F5B400]">StudentCircle brings them together.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
            Whether you want to sell your skills, launch a campus storefront, find verified student talent, or pre-order printing services, StudentCircle is built for you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="final-cta-join"
              onClick={() => onNavigate('/auth/register')}
              className="px-8 py-4 bg-[#F5B400] hover:bg-[#E5A800] text-[#061A4F] text-sm font-black rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>Join StudentCircle</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="final-cta-explore"
              onClick={() => onNavigate('/explore')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Explore the Platform</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
