import React, { useState, useEffect, useRef } from 'react';
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
  Target,
  Compass,
  Quote,
  Zap,
  Building2,
  Lock,
  Star,
  Globe,
  GraduationCap,
  Award,
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
  Cpu,
  Layers3,
  CreditCard,
  Sliders,
  Scale,
  RefreshCw,
  Plus,
  ExternalLink
} from 'lucide-react';
import { founderConfig } from '../../config/founder';
import { CampusStore } from '../../services/campusStore';
import { DataStore, initialServices } from '../../services/dataStore';
import { MarketplaceStore, initialProducts } from '../../services/marketplaceStore';
import { OpportunityStore } from '../../services/opportunityStore';
import { UserAvatar } from '../../components/common/UserAvatar';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { getServicePrice, User as AppUser, Service } from '../../types';
import { ProductItem } from '../../types/marketplace';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Navigation & UI state
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [activePersonaTab, setActivePersonaTab] = useState<'students' | 'customers' | 'vendors' | 'shops'>('students');

  // Real data state
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [students, setStudents] = useState<AppUser[]>([]);

  // Pointer position for subtle hero floating element dampening
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load real data from stores
    const loadedServices = DataStore.getServices();
    const loadedProducts = MarketplaceStore.getAllProducts();
    const allUsers = DataStore.getUsers();
    const studentUsers = allUsers.filter(u => u.role === 'student' && u.status !== 'suspended');

    setServices(loadedServices);
    setProducts(loadedProducts);
    setStudents(studentUsers);
  }, []);

  // Subtle pointer tracking on desktop
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: x * 20, y: y * 20 });
      });
    };

    const currentHero = heroRef.current;
    if (currentHero) {
      currentHero.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (currentHero) {
        currentHero.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const campusLocations = CampusStore.getPublicLocations();
  const campusShops = CampusStore.getShops();
  const filteredCampusLocations = selectedCampus === 'all' 
    ? campusLocations 
    : campusLocations.filter(loc => loc.id === selectedCampus || loc.code.toLowerCase() === selectedCampus.toLowerCase());

  // Persona Steps definition
  const personaFlows = {
    students: {
      title: "For Student Professionals",
      subtitle: "Monetize your creative & technical skills with client milestone protection.",
      ctaText: "Become a Student Provider",
      ctaPath: "/auth/register",
      steps: [
        {
          number: "01",
          title: "Create Your Profile",
          desc: "Register with your OOU matric number, select your campus, and choose your skill categories."
        },
        {
          number: "02",
          title: "Showcase Your Skills",
          desc: "Publish your portfolio samples, set clear package pricing, and list your service availability."
        },
        {
          number: "03",
          title: "Connect with Clients",
          desc: "Receive direct client requests and submit structured proposals for open campus and external gigs."
        },
        {
          number: "04",
          title: "Earn from Your Work",
          desc: "Deliver high quality work, receive verified peer ratings, and get paid straight to your Nigerian bank account."
        }
      ]
    },
    customers: {
      title: "For Clients & Students",
      subtitle: "Discover verified student talent and campus businesses with zero deposit risk.",
      ctaText: "Explore Student Services",
      ctaPath: "/explore",
      steps: [
        {
          number: "01",
          title: "Search & Filter",
          desc: "Browse verified student freelancers by campus, department, rating, and specialized skill."
        },
        {
          number: "02",
          title: "Compare Portfolios",
          desc: "Inspect live project galleries, client feedback, past deliverables, and fixed-price packages."
        },
        {
          number: "03",
          title: "Request & Escrow",
          desc: "Submit your order or post a custom job brief. Funds remain safely in escrow until you approve."
        },
        {
          number: "04",
          title: "Receive Quality Service",
          desc: "Review final deliverables, request revisions if necessary, release payment, and leave a review."
        }
      ]
    },
    vendors: {
      title: "For Student Vendors",
      subtitle: "Launch an on-campus digital storefront and reach thousands of student buyers.",
      ctaText: "Register as a Vendor",
      ctaPath: "/auth/register",
      steps: [
        {
          number: "01",
          title: "Register Storefront",
          desc: "Set up your verified student merchant profile with your store brand, banner, and WhatsApp contact."
        },
        {
          number: "02",
          title: "List Products",
          desc: "Upload photos from your device, write descriptions, specify categories, and set stock quantities."
        },
        {
          number: "03",
          title: "Receive Orders",
          desc: "Get instant buyer order notifications with clear delivery preferences and campus pickup points."
        },
        {
          number: "04",
          title: "Grow Visibility",
          desc: "Build verified customer reviews, restock popular items, and expand across all OOU campuses."
        }
      ]
    },
    shops: {
      title: "For Campus Business Centers",
      subtitle: "Digitize Motion Ground printing, photocopying, thesis binding, and online screening.",
      ctaText: "Register Your Shop",
      ctaPath: "/campus/register-shop",
      steps: [
        {
          number: "01",
          title: "Register Campus Shop",
          desc: "Claim or register your physical business center at Motion Ground, Mini Campus, or faculty zones."
        },
        {
          number: "02",
          title: "Add Unique Shop Code",
          desc: "Get an official verified OOU campus shop code so students can find your shop directly."
        },
        {
          number: "03",
          title: "List Services & Rates",
          desc: "Publish per-page printing costs, colored slide printing, hardcover project binding, and photo services."
        },
        {
          number: "04",
          title: "Prepare & Serve Orders",
          desc: "Receive PDF uploads before students arrive, print ahead of time, and hand over with zero queueing."
        }
      ]
    }
  };

  const faqs = [
    {
      q: "What is OOU StudentCircle?",
      a: "OOU StudentCircle is the digital ecosystem built for the Olabisi Onabanjo University student economy. It brings together verified student freelancers, student marketplace merchants, Motion Ground campus business centers, and cross-campus student discovery in one trusted, unified platform."
    },
    {
      q: "How does the Campus Hub document printing work?",
      a: "Instead of walking under the sun to Motion Ground and waiting in long physical queues, you can upload lecture slides, assignments, lab manuals, or thesis drafts online, choose print specifications (color, double-sided, binding), pay securely, and pick up your ready prints using your pickup code."
    },
    {
      q: "How does StudentCircle protect transactions?",
      a: "We operate a secure milestone and escrow protection model. When a client hires a student freelancer or orders a custom product, payment is held safely by StudentCircle. Funds are released directly to the provider's Nigerian bank account only after the buyer confirms satisfactory completion."
    },
    {
      q: "Can clients outside OOU hire student talent?",
      a: "Yes. Startups, SMEs, university departments, alumni, and external clients anywhere in Nigeria and internationally can post job briefs, browse verified student portfolios, and hire talented OOU students for remote, hybrid, or on-campus tasks."
    },
    {
      q: "Which OOU campuses are supported?",
      a: "StudentCircle connects all OOU campus locations: Main Campus (Permanent Site, Ago-Iwoye), Mini Campus (Ago-Iwoye), Ibogun Campus (College of Engineering & Technology), Ayetoro Campus (College of Agricultural Sciences), and Sagamu Campus (Obafemi Awolowo College of Health Sciences)."
    },
    {
      q: "Is it free for students to join and list services?",
      a: "Yes. Registering your student account, creating your verified profile, listing your freelance services, and opening a product storefront is 100% free."
    }
  ];

  return (
    <div id="landing-page-root" className="bg-white text-slate-900 selection:bg-[#F5B400] selection:text-[#061A4F] font-sans antialiased overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION WITH SUBTLE FLOATING ECOSYSTEM               */}
      {/* ============================================================ */}
      <section 
        ref={heroRef}
        id="hero-section" 
        className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 bg-white border-b border-slate-100 overflow-hidden"
      >
        {/* Subtle decorative background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* FLOATING UI BADGES (Visual Illustrations of Platform Roles with staggered organic floats) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            
            {/* Top Left: Student Professional */}
            <div 
              style={{
                transform: `translate(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px)`
              }}
              className="absolute top-8 left-6 xl:left-12 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2.5 animate-float-slow transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4 text-[#061A4F]" />
              </div>
              <div>
                <div className="text-[11px] font-black text-[#061A4F]">Student Professional</div>
                <div className="text-[9px] text-slate-500 font-semibold">Verified Portfolio & Escrow</div>
              </div>
            </div>

            {/* Top Right: Motion Ground */}
            <div 
              style={{
                transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
              }}
              className="absolute top-10 right-6 xl:right-12 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2.5 animate-float-medium transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#061A4F] flex items-center justify-center font-bold">
                <Printer className="w-4 h-4 text-[#061A4F]" />
              </div>
              <div>
                <div className="text-[11px] font-black text-[#061A4F]">Motion Ground Hub</div>
                <div className="text-[9px] text-emerald-600 font-bold">Pre-Order & Skip Queues</div>
              </div>
            </div>

            {/* Middle Left: Campus Vendor */}
            <div 
              style={{
                transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`
              }}
              className="absolute top-64 left-2 xl:left-8 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2.5 animate-float-reverse transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Store className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <div className="text-[11px] font-black text-[#061A4F]">Campus Vendor</div>
                <div className="text-[9px] text-slate-500 font-semibold">Fashion, Tech & Essentials</div>
              </div>
            </div>

            {/* Middle Right: New Opportunity */}
            <div 
              style={{
                transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)`
              }}
              className="absolute top-60 right-2 xl:right-8 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2.5 animate-float-organic transition-transform duration-300"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="text-[11px] font-black text-[#061A4F]">New Opportunity</div>
                <div className="text-[9px] text-slate-500 font-semibold">Client Briefs & SIWES</div>
              </div>
            </div>

            {/* Bottom Left: Service Request */}
            <div 
              style={{
                transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`
              }}
              className="absolute bottom-6 left-16 xl:left-24 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 animate-float-medium transition-transform duration-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
              <span className="text-[10px] font-black text-[#061A4F]">Service Request Matching</span>
            </div>

            {/* Bottom Right: Marketplace */}
            <div 
              style={{
                transform: `translate(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px)`
              }}
              className="absolute bottom-8 right-16 xl:right-24 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 animate-float-reverse transition-transform duration-300"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#061A4F]" />
              <span className="text-[10px] font-black text-[#061A4F]">Student Marketplace</span>
            </div>

          </div>

          {/* Centered Hero Content with ScrollReveal */}
          <ScrollReveal direction="up" delay={0} className="max-w-4xl mx-auto text-center space-y-7">
            
            {/* Campus Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F5B400] animate-pulse" />
              <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase">
                OOU StudentCircle • The Student Economy
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#061A4F] tracking-tight leading-[1.08]">
              One Circle. <br />
              <span className="relative inline-block">
                <span>Every Student Opportunity.</span>
                <span className="absolute left-0 right-0 -bottom-1.5 h-3 bg-[#F5B400]/40 -z-1 rounded-sm" />
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              OOU StudentCircle connects students, professionals, vendors, campus businesses and clients in one digital ecosystem built around the real student economy.
            </p>

            {/* Primary & Secondary Call to Action Row */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                id="hero-cta-join"
                onClick={() => onNavigate('/auth/register')}
                className="interactive-btn px-7 py-3.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Join StudentCircle</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </button>

              <button
                id="hero-cta-explore-services"
                onClick={() => onNavigate('/explore')}
                className="interactive-btn px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#061A4F]" />
                <span>Explore Student Services</span>
              </button>
            </div>

            {/* Additional Targeted Action Prompts */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium pt-1">
              <span>Are you a service provider or business?</span>
              <button
                onClick={() => onNavigate('/auth/register')}
                className="font-bold text-[#061A4F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Become a Provider</span>
                <ArrowRight className="w-3 h-3 text-[#F5B400]" />
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => onNavigate('/campus/register-shop')}
                className="font-bold text-[#061A4F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Register Your Business</span>
                <ArrowRight className="w-3 h-3 text-[#F5B400]" />
              </button>
            </div>

            {/* MOBILE & TABLET FLOATING ECOSYSTEM FLOW (Interactive on touch devices) */}
            <div className="lg:hidden pt-4">
              <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
                <div 
                  onClick={() => onNavigate('/explore')}
                  className="interactive-card-subtle flex-shrink-0 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs flex items-center gap-2 animate-float-slow cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-[#061A4F] flex items-center justify-center">
                    <GraduationCap className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold text-[#061A4F] whitespace-nowrap">Student Professional</span>
                </div>

                <div 
                  onClick={() => onNavigate('/campus')}
                  className="interactive-card-subtle flex-shrink-0 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs flex items-center gap-2 animate-float-medium cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-50 text-[#061A4F] flex items-center justify-center">
                    <Printer className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold text-[#061A4F] whitespace-nowrap">Motion Ground Hub</span>
                </div>

                <div 
                  onClick={() => onNavigate('/marketplace')}
                  className="interactive-card-subtle flex-shrink-0 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs flex items-center gap-2 animate-float-reverse cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Store className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold text-[#061A4F] whitespace-nowrap">Campus Vendor</span>
                </div>

                <div 
                  onClick={() => onNavigate('/opportunities')}
                  className="interactive-card-subtle flex-shrink-0 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs flex items-center gap-2 animate-float-organic cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Briefcase className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold text-[#061A4F] whitespace-nowrap">New Opportunity</span>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* FOUR IMMEDIATE ENTRY POINTS (VISIBLE IN FIRST VIEWPORT)       */}
            {/* ============================================================ */}
            <div className="pt-8 sm:pt-10">
              <div className="flex items-center justify-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                <span>Immediate Entry Points</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
                
                {/* 1. Student Connect */}
                <ScrollReveal direction="up" delay={50}>
                  <button
                    id="entry-student-connect"
                    onClick={() => onNavigate('/student-connect')}
                    className="interactive-card w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#061A4F] transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer h-full"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#061A4F] group-hover:bg-[#061A4F] group-hover:text-white transition flex items-center justify-center font-bold">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">01</span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs sm:text-sm font-black text-[#061A4F]">Student Connect</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">Meet peers & collaborate</div>
                    </div>
                  </button>
                </ScrollReveal>

                {/* 2. Student Services */}
                <ScrollReveal direction="up" delay={120}>
                  <button
                    id="entry-student-services"
                    onClick={() => onNavigate('/explore')}
                    className="interactive-card w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#061A4F] transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer h-full"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 group-hover:bg-[#061A4F] group-hover:text-white transition flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4 text-pink-600 group-hover:text-[#F5B400]" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">02</span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs sm:text-sm font-black text-[#061A4F]">Student Services</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">Hire verified talent</div>
                    </div>
                  </button>
                </ScrollReveal>

                {/* 3. Marketplace */}
                <ScrollReveal direction="up" delay={190}>
                  <button
                    id="entry-marketplace"
                    onClick={() => onNavigate('/marketplace')}
                    className="interactive-card w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#061A4F] transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer h-full"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#061A4F] group-hover:bg-[#061A4F] group-hover:text-white transition flex items-center justify-center font-bold">
                        <ShoppingBag className="w-4 h-4 text-amber-700 group-hover:text-[#F5B400]" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">03</span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs sm:text-sm font-black text-[#061A4F]">Marketplace</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">Shop campus vendors</div>
                    </div>
                  </button>
                </ScrollReveal>

                {/* 4. Campus Hub */}
                <ScrollReveal direction="up" delay={260}>
                  <button
                    id="entry-campus-hub"
                    onClick={() => onNavigate('/campus')}
                    className="interactive-card w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#061A4F] transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer h-full"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-[#061A4F] group-hover:text-white transition flex items-center justify-center font-bold">
                        <Store className="w-4 h-4 text-emerald-700 group-hover:text-[#F5B400]" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">04</span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs sm:text-sm font-black text-[#061A4F]">Campus Hub</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">Print & Motion Ground</div>
                    </div>
                  </button>
                </ScrollReveal>

              </div>
            </div>

          </ScrollReveal>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FOUR PILLARS SECTION                                      */}
      {/* ============================================================ */}
      <section id="four-pillars-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal direction="up" delay={0} className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              CORE PLATFORM FOUNDATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              The Four Pillars of StudentCircle
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Engineered specifically for the real needs of students, freelancers, vendors, and businesses across all OOU campuses.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1: Student Connect */}
            <ScrollReveal direction="up" delay={50}>
              <div 
                id="pillar-student-connect"
                className="interactive-card bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs hover:border-[#061A4F] flex flex-col justify-between space-y-6 group h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-bold border border-blue-100">
                      <Users className="w-6 h-6 text-[#061A4F]" />
                    </div>
                    <span className="text-xs font-black text-slate-400">PILLAR 01</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-black text-[#061A4F] uppercase tracking-wide">
                      STUDENT CONNECT
                    </h3>
                    <div className="text-xs font-bold text-[#061A4F] mt-1">
                      Connect across OOU.
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Meet and connect with students across OOU. Discover people with similar interests, skills and goals.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('/student-connect')}
                  className="interactive-btn w-full py-3 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Connect With Students</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>

            {/* Pillar 2: Student Services */}
            <ScrollReveal direction="up" delay={120}>
              <div 
                id="pillar-student-services"
                className="interactive-card bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs hover:border-[#061A4F] flex flex-col justify-between space-y-6 group h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold border border-pink-100">
                      <Sparkles className="w-6 h-6 text-pink-600" />
                    </div>
                    <span className="text-xs font-black text-slate-400">PILLAR 02</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-black text-[#061A4F] uppercase tracking-wide">
                      STUDENT SERVICES
                    </h3>
                    <div className="text-xs font-bold text-[#061A4F] mt-1">
                      Skills and freelance services.
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Find students who can help with real services, or create a profile and offer your own skills.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('/explore')}
                  className="interactive-btn w-full py-3 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Find a Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>

            {/* Pillar 3: Marketplace */}
            <ScrollReveal direction="up" delay={190}>
              <div 
                id="pillar-marketplace"
                className="interactive-card bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs hover:border-[#061A4F] flex flex-col justify-between space-y-6 group h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-100">
                      <ShoppingBag className="w-6 h-6 text-amber-700" />
                    </div>
                    <span className="text-xs font-black text-slate-400">PILLAR 03</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-black text-[#061A4F] uppercase tracking-wide">
                      MARKETPLACE
                    </h3>
                    <div className="text-xs font-bold text-[#061A4F] mt-1">
                      Campus buying and selling.
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Buy and sell products from student vendors around your campus.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('/marketplace')}
                  className="interactive-btn w-full py-3 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>

            {/* Pillar 4: Campus Hub */}
            <ScrollReveal direction="up" delay={260}>
              <div 
                id="pillar-campus-hub"
                className="interactive-card bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs hover:border-[#061A4F] flex flex-col justify-between space-y-6 group h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
                      <Store className="w-6 h-6 text-emerald-700" />
                    </div>
                    <span className="text-xs font-black text-slate-400">PILLAR 04</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-black text-[#061A4F] uppercase tracking-wide">
                      CAMPUS HUB
                    </h3>
                    <div className="text-xs font-bold text-[#061A4F] mt-1">
                      Motion Ground and local shops.
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Find campus shops and everyday services before you get there.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('/campus')}
                  className="interactive-btn w-full py-3 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Register Your Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. PROBLEM SECTION                                           */}
      {/* ============================================================ */}
      <section id="problem-section" className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal direction="up" delay={0} className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-white px-3.5 py-1 rounded-full border border-slate-200">
              THE FRAGMENTATION REALITY
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#061A4F] tracking-tight">
              Student talent is everywhere. <br className="hidden sm:inline" />
              Finding it shouldn't be difficult.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Why the traditional campus economy broke down, and how StudentCircle brings everything into one connected ecosystem.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* The Fragmented Reality (Left Column) */}
            <ScrollReveal direction="right" delay={50} className="lg:col-span-5 h-full">
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-rose-200 shadow-2xs space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black border border-rose-100">
                    <span>The Fragmented Reality</span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-900">
                      Across our university campuses, economic activity is vibrant but scattered:
                    </p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                        <span><strong>Students have skills</strong>, but lack an easy way to be discovered.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                        <span><strong>Students run businesses</strong>, but rely on short-lived status updates.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                        <span><strong>Campus shops provide essential services</strong>, but students wait in long physical lines.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                        <span><strong>Clients need student talent</strong>, but worry about reliability and upfront deposits.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                        <span><strong>Aspirants need reliable campus services</strong>, but arrive without verified local guidance.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-xs text-rose-800 space-y-1">
                  <div className="font-bold">Scattered across:</div>
                  <div className="text-[11px] text-rose-700">WhatsApp stories • Social media DMs • Word of mouth • Physical crowds • Unverified personal contacts</div>
                </div>
              </div>
            </ScrollReveal>

            {/* The StudentCircle Solution (Right Column) */}
            <ScrollReveal direction="left" delay={100} className="lg:col-span-7 h-full">
              <div className="bg-[#061A4F] text-white p-7 sm:p-9 rounded-3xl shadow-xl border border-[#061A4F] flex flex-col justify-between space-y-6 h-full">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#F5B400] text-xs font-black border border-white/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Unified StudentCircle Ecosystem</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    One verified platform that connects student talent, commerce and campus services.
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2 text-[#F5B400] font-black text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verified Student Profiles</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Matriculation verification and authentic skill tiers build instant trust between student providers and clients.
                      </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2 text-[#F5B400] font-black text-xs">
                        <Lock className="w-4 h-4" />
                        <span>Milestone Escrow Security</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Payments are held securely in escrow protection until deliverables are inspected and approved.
                      </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2 text-[#F5B400] font-black text-xs">
                        <Printer className="w-4 h-4" />
                        <span>Remote Motion Ground Orders</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Pre-order printing and project binding before stepping foot on campus. Zero waiting in lines.
                      </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2 text-[#F5B400] font-black text-xs">
                        <Globe className="w-4 h-4" />
                        <span>Cross-Campus Bridge</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        One interconnected network linking Ago-Iwoye, Mini Campus, Ibogun, Ayetoro, and Sagamu.
                      </p>
                    </div>

                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('/auth/register')}
                    className="interactive-btn px-6 py-3 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] font-black text-xs rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Join the Circle Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. HOW IT WORKS (PERSONA SWITCHER WITH ANIMATED STEPS)        */}
      {/* ============================================================ */}
      <section id="how-it-works-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal direction="up" delay={0} className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              CLEAR & INTUITIVE PROCESS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              How StudentCircle Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Select your role to see how simple and secure it is to connect, transact, and deliver.
            </p>
          </ScrollReveal>

          {/* Persona Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActivePersonaTab('students')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activePersonaTab === 'students'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Students
            </button>
            <button
              onClick={() => setActivePersonaTab('customers')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activePersonaTab === 'customers'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Customers
            </button>
            <button
              onClick={() => setActivePersonaTab('vendors')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activePersonaTab === 'vendors'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Vendors
            </button>
            <button
              onClick={() => setActivePersonaTab('shops')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activePersonaTab === 'shops'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Campus Shops
            </button>
          </div>

          {/* Active Persona Steps */}
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-[#061A4F]">
                {personaFlows[activePersonaTab].title}
              </h3>
              <p className="text-xs text-slate-500">
                {personaFlows[activePersonaTab].subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {personaFlows[activePersonaTab].steps.map((step, idx) => (
                <ScrollReveal key={step.number} direction="up" delay={idx * 60}>
                  <div 
                    className="interactive-card bg-slate-50/80 p-6 rounded-3xl border border-slate-200 hover:border-[#061A4F] transition-all flex flex-col justify-between space-y-4 relative group h-full"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-[#F5B400]">{step.number}</span>
                        <span className="w-6 h-6 rounded-full bg-white text-[#061A4F] text-[10px] font-black flex items-center justify-center border border-slate-200">
                          {idx + 1}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-[#061A4F]">
                        {step.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Protocol</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => onNavigate(personaFlows[activePersonaTab].ctaPath)}
                className="interactive-btn inline-flex items-center gap-2 px-6 py-3.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                <span>{personaFlows[activePersonaTab].ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. MOTION GROUND DEDICATED SECTION                           */}
      {/* ============================================================ */}
      <section id="motion-ground-section" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal direction="up" delay={0} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#061A4F] text-xs font-black border border-amber-200">
                <Printer className="w-3.5 h-3.5 text-[#061A4F]" />
                <span>MOTION GROUND DIGITAL HUB</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F] tracking-tight">
                "Need a document printed before you arrive?"
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Campus business centers at Motion Ground and campus gates are now digitally discoverable. Upload lecture slides, hardcover project drafts, or screening verification slips online, and pick up ready prints with zero queueing.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => onNavigate('/campus')}
                className="interactive-btn px-5 py-3 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Find Campus Hubs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F5B400]" />
              </button>
              <button
                onClick={() => onNavigate('/campus/register-shop')}
                className="interactive-btn px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition cursor-pointer"
              >
                Register Campus Shop
              </button>
            </div>
          </ScrollReveal>

          {/* 5-Step Motion Ground Concept Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            
            <ScrollReveal direction="up" delay={40}>
              <div className="interactive-card bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5 h-full">
                <div className="text-xs font-black text-[#F5B400]">Step 01</div>
                <div className="text-xs font-black text-[#061A4F]">Search Provider</div>
                <p className="text-[11px] text-slate-500">Find verified campus centers at Motion Ground or faculty areas.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <div className="interactive-card bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5 h-full">
                <div className="text-xs font-black text-[#F5B400]">Step 02</div>
                <div className="text-xs font-black text-[#061A4F]">Select Service</div>
                <p className="text-[11px] text-slate-500">Choose per-page printing, colored slides, hardcover, or passport.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={120}>
              <div className="interactive-card bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5 h-full">
                <div className="text-xs font-black text-[#F5B400]">Step 03</div>
                <div className="text-xs font-black text-[#061A4F]">Submit Request</div>
                <p className="text-[11px] text-slate-500">Upload PDF documents and specify binding preferences.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={160}>
              <div className="interactive-card bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5 h-full">
                <div className="text-xs font-black text-[#F5B400]">Step 04</div>
                <div className="text-xs font-black text-[#061A4F]">Receive Code</div>
                <p className="text-[11px] text-slate-500">Get an instant unique pickup reference code on your device.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="interactive-card bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5 h-full">
                <div className="text-xs font-black text-[#F5B400]">Step 05</div>
                <div className="text-xs font-black text-[#061A4F]">Arrive & Collect</div>
                <p className="text-[11px] text-slate-500">Walk in, display code, and pick up ready prints immediately.</p>
              </div>
            </ScrollReveal>

          </div>

          {/* Real Campus Shops List or Honest State */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#061A4F]">
                Verified Campus Service Providers ({campusShops.length})
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Real registered centers</span>
            </div>

            {campusShops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {campusShops.slice(0, 3).map((shop, sIdx) => (
                  <ScrollReveal key={shop.id} direction="up" delay={sIdx * 80}>
                    <div
                      onClick={() => onNavigate('/campus')}
                      className="interactive-card bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-[#061A4F] transition cursor-pointer space-y-3 h-full flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block">
                              Code: {shop.shopCode || 'OOU-SHOP'}
                            </div>
                            <h4 className="text-sm font-black text-[#061A4F] mt-1">{shop.name}</h4>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#F5B400]" />
                              <span>{shop.locationName || shop.specificArea || shop.campusName}</span>
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#061A4F] flex items-center justify-center font-bold">
                            <Store className="w-4 h-4" />
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-2">{shop.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified Shop</span>
                        </span>
                        <span className="text-[#061A4F] font-bold group-hover:underline flex items-center gap-1">
                          <span>Pre-Order</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3 max-w-xl mx-auto">
                <Store className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-[#061A4F]">No campus shops registered yet</div>
                <p className="text-xs text-slate-500">
                  Are you a business center owner at Motion Ground or near campus gates? Register your business today to receive student pre-orders.
                </p>
                <button
                  onClick={() => onNavigate('/campus/register-shop')}
                  className="interactive-btn px-5 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] transition cursor-pointer"
                >
                  Register Your Shop
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. STUDENT CONNECT SECTION                                   */}
      {/* ============================================================ */}
      <section id="student-connect-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal direction="up" delay={0}>
            <div className="bg-[#061A4F] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#061A4F]">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#F5B400] text-xs font-black border border-white/10">
                    <Users className="w-3.5 h-3.5" />
                    <span>CROSS-CAMPUS STUDENT NETWORK</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-snug">
                    Discover and connect with students across all OOU campuses.
                  </h2>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
                    Students from Ago-Iwoye, Mini Campus, Ibogun, Ayetoro, and Sagamu can discover peers based on public profile details like name, department, level, faculty, verified skills, and project interests.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onNavigate('/student-connect')}
                      className="interactive-btn px-6 py-3.5 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs sm:text-sm font-black rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Explore Student Connect</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('/auth/register')}
                      className="interactive-btn px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/20 transition cursor-pointer"
                    >
                      Join StudentCircle
                    </button>
                  </div>
                </div>

                {/* Public Verified Student Highlights (Real DB Data) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Verified Student Profiles</span>
                    <span>{students.length} Registered</span>
                  </div>

                  {students.length > 0 ? (
                    <div className="space-y-2.5">
                      {students.slice(0, 3).map(student => (
                        <div
                          key={student.id}
                          onClick={() => onNavigate('/student-connect')}
                          className="interactive-card bg-white/10 hover:bg-white/15 p-3.5 rounded-2xl border border-white/10 transition cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <UserAvatar name={student.fullName} photoUrl={student.profilePhoto} size="sm" />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                                <span>{student.fullName}</span>
                                {student.isVerified && <CheckCircle2 className="w-3 h-3 text-[#F5B400] flex-shrink-0" />}
                              </div>
                              <div className="text-[10px] text-slate-300 truncate">
                                {student.department} • {student.level}
                              </div>
                            </div>
                          </div>

                          <div className="text-[10px] font-bold text-[#F5B400] bg-white/10 px-2 py-0.5 rounded">
                            {student.location?.split(' ')[0] || 'OOU'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/5 p-6 rounded-2xl text-center space-y-2 border border-white/10">
                      <UserCheck className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-200">Be the first student to register</div>
                      <p className="text-[11px] text-slate-300">Create your verified student profile in under 2 minutes.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. STUDENT SERVICES SECTION (PROFESSIONAL MARKETPLACE)        */}
      {/* ============================================================ */}
      <section id="services-showcase-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <ScrollReveal direction="up" delay={0} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-[#061A4F] text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>STUDENT SERVICES MARKETPLACE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
                Verified Student Talent On Demand
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Real student professionals offering graphic design, programming, academic writing, tutoring, and tech repairs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/explore')}
                className="interactive-btn px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Browse All Services</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </button>
              <button
                onClick={() => onNavigate('/auth/register')}
                className="interactive-btn px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
              >
                Become a Provider
              </button>
            </div>
          </ScrollReveal>

          {/* Real Services Grid */}
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.slice(0, 4).map((service, sIdx) => (
                <ScrollReveal key={service.id} direction="up" delay={sIdx * 70}>
                  <div
                    onClick={() => onNavigate('/explore')}
                    className="interactive-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:border-[#061A4F] transition cursor-pointer flex flex-col justify-between group h-full"
                  >
                    <div>
                      <div className="h-40 bg-slate-100 relative overflow-hidden img-zoom-container">
                        <img 
                          src={service.coverImage} 
                          alt={service.title}
                          className="w-full h-full object-cover transition duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#061A4F]/85 text-white text-[9px] font-black uppercase backdrop-blur-xs">
                          {service.category}
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <UserAvatar name={service.studentName} size="sm" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                              <span>{service.studentName}</span>
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
                      <div className="text-[10px] text-slate-500 font-medium">Starting at</div>
                      <div className="text-sm font-black text-[#061A4F]">
                        {getServicePrice(service)}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 text-center space-y-3 max-w-md mx-auto">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No service providers have joined this category yet</div>
              <p className="text-xs text-slate-500">Showcase your skills to clients on campus and start earning today.</p>
              <button
                onClick={() => onNavigate('/auth/register')}
                className="interactive-btn px-5 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] transition cursor-pointer"
              >
                Become a Provider
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. MARKETPLACE SECTION                                       */}
      {/* ============================================================ */}
      <section id="marketplace-showcase-section" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <ScrollReveal direction="up" delay={0} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-[#061A4F] text-xs font-black">
                <ShoppingBag className="w-3.5 h-3.5 text-[#061A4F]" />
                <span>STUDENT VENDOR COMMERCE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
                Campus Marketplace
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Direct commerce from student fashion designers, bakers, gadget sellers, textbook merchants, and hostel item suppliers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/marketplace')}
                className="interactive-btn px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Shop Marketplace</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </button>
              <button
                onClick={() => onNavigate('/auth/register')}
                className="interactive-btn px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition cursor-pointer"
              >
                Sell on StudentCircle
              </button>
            </div>
          </ScrollReveal>

          {/* Real Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.slice(0, 4).map((product, pIdx) => (
                <ScrollReveal key={product.id} direction="up" delay={pIdx * 70}>
                  <div
                    onClick={() => onNavigate('/marketplace')}
                    className="interactive-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:border-[#061A4F] transition cursor-pointer flex flex-col justify-between group h-full"
                  >
                    <div>
                      <div className="h-40 bg-slate-100 relative overflow-hidden img-zoom-container">
                        <img 
                          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'} 
                          alt={product.title}
                          className="w-full h-full object-cover transition duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#061A4F]/85 text-white text-[9px] font-black uppercase backdrop-blur-xs">
                          {product.category}
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-2">
                        <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F5B400]" />
                          <span>{product.location}</span>
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
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3 max-w-md mx-auto">
              <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700">Be the first vendor to list a product on StudentCircle</div>
              <p className="text-xs text-slate-500">Reach buyers across all 4 OOU campuses directly from your hostel.</p>
              <button
                onClick={() => onNavigate('/auth/register')}
                className="interactive-btn px-5 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] transition cursor-pointer"
              >
                Register as a Vendor
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. TRUST & SAFETY SECTION                                    */}
      {/* ============================================================ */}
      <section id="trust-safety-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal direction="up" delay={0} className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 text-emerald-800">
              SAFETY, ESCROW & INTEGRITY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              How StudentCircle Builds Trust
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Verified credentials, milestone escrow, peer accountability, and dedicated dispute handling.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <ScrollReveal direction="up" delay={40}>
              <div className="interactive-card bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 h-full">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#061A4F] flex items-center justify-center font-bold border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-[#061A4F]" />
                </div>
                <h3 className="text-sm font-black text-[#061A4F]">Identity Accreditation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Student accounts are verified with authentic matriculation numbers and faculty enrollment before receiving verified badges.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <div className="interactive-card bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 h-full">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#061A4F] flex items-center justify-center font-bold border border-slate-200">
                  <Lock className="w-5 h-5 text-[#061A4F]" />
                </div>
                <h3 className="text-sm font-black text-[#061A4F]">Escrow Protection</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buyer deposits are held securely during project milestones. Providers only receive payout once work is completed to specification.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={120}>
              <div className="interactive-card bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 h-full">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#061A4F] flex items-center justify-center font-bold border border-slate-200">
                  <Scale className="w-5 h-5 text-[#061A4F]" />
                </div>
                <h3 className="text-sm font-black text-[#061A4F]">Dispute Arbitration</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If deliverables fail to meet the agreed brief, our admin arbitration desk reviews evidence and issues full or partial escrow refunds.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={160}>
              <div className="interactive-card bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 h-full">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#061A4F] flex items-center justify-center font-bold border border-slate-200">
                  <Star className="w-5 h-5 text-[#061A4F]" />
                </div>
                <h3 className="text-sm font-black text-[#061A4F]">Verified Peer Reviews</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reviews can only be submitted following completed, paid transactions, eliminating fake ratings and inflated reputation scores.
                </p>
              </div>
            </ScrollReveal>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/safety')}
              className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <span>Visit our Safety Center & Trust Policy</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F5B400]" />
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. CAMPUS COVERAGE ZONE                                     */}
      {/* ============================================================ */}
      <section id="campus-coverage-section" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <ScrollReveal direction="up" delay={0} className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-white px-3.5 py-1 rounded-full border border-slate-200">
              CAMPUS COVERAGE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              Active Across All OOU Campuses
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Select your campus location to explore registered hubs, providers, and student communities.
            </p>
          </ScrollReveal>

          {/* Campus Selector Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedCampus('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCampus === 'all'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Campuses ({campusLocations.length})
            </button>
            {campusLocations.map(loc => (
              <button
                key={loc.id}
                onClick={() => setSelectedCampus(loc.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCampus === loc.id
                    ? 'bg-[#061A4F] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {loc.name.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Dynamic Campus Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampusLocations.map((loc, lIdx) => {
              return (
                <ScrollReveal key={loc.id} direction="up" delay={lIdx * 80}>
                  <div
                    className="interactive-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:border-[#061A4F] transition-all flex flex-col justify-between group h-full"
                  >
                    <div>
                      <div className="h-44 bg-slate-100 relative overflow-hidden img-zoom-container">
                        <img 
                          src={loc.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'} 
                          alt={loc.name}
                          className="w-full h-full object-cover transition duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#061A4F] text-white text-[10px] font-black">
                          {loc.code}
                        </div>
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-xs font-bold backdrop-blur-xs flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#F5B400]" />
                          <span>{loc.location}</span>
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

                        <div className="space-y-1 pt-1 text-xs">
                          <div className="text-[10px] font-black uppercase text-slate-400">Key Landmarks:</div>
                          <div className="text-slate-700 font-medium flex items-start gap-1">
                            <Building2 className="w-3.5 h-3.5 text-[#061A4F] flex-shrink-0 mt-0.5" />
                            <span>{loc.landmark}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                      <button
                        onClick={() => onNavigate('/campus')}
                        className="interactive-btn w-full py-2.5 px-4 bg-slate-50 hover:bg-[#061A4F] text-[#061A4F] hover:text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Explore Campus Hubs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. FOUNDER SECTION                                          */}
      {/* ============================================================ */}
      <section id="founder-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="up" delay={0} className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              FOUNDER STORY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#061A4F]">
              Meet the Founder Behind StudentCircle
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Built from a simple observation: student talent exists everywhere, but the connection between talent, services, and opportunity was missing.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={50}>
            <div className="bg-slate-50/90 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-2xs max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Founder Image Column (ORIGINAL UNALTERED IMAGE) */}
                <div className="md:col-span-5 flex flex-col items-center text-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-white shadow-md relative group bg-slate-200">
                    <img 
                      src={founderConfig.photoUrl} 
                      alt={founderConfig.name}
                      className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#061A4F] text-white px-3 py-1 rounded-full border-2 border-white shadow-xs flex items-center gap-1 text-[11px] font-black">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F5B400]" />
                      <span>Founder</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <h3 className="text-xl font-black text-[#061A4F]">
                      {founderConfig.name}
                    </h3>
                    <p className="text-xs font-bold text-[#061A4F] bg-blue-100/70 px-2.5 py-0.5 rounded-full inline-block">
                      {founderConfig.role}
                    </p>
                    <p className="text-xs text-slate-500 font-medium pt-0.5">
                      {founderConfig.department} • {founderConfig.level}
                    </p>
                    <p className="text-xs text-slate-400">
                      {founderConfig.institution}
                    </p>
                  </div>
                </div>

                {/* Founder Story Preview Column */}
                <div className="md:col-span-7 space-y-5 text-left">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-start gap-2">
                      <Quote className="w-6 h-6 text-[#F5B400] flex-shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm font-bold text-[#061A4F] leading-relaxed italic">
                        "{founderConfig.quote}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p>
                      The idea for StudentCircle started from observing the everyday reality of campus life at OOU. Students with skills in graphic design, web development, video editing, baking, crafting, and document printing were scattered across WhatsApp status updates and word of mouth.
                    </p>
                    <p>
                      The problem was never a lack of student talent or hard work. The problem was discovery and trust. We created StudentCircle to bring Student Connect, Student Services, Campus Marketplace, and Campus Hub into one connected platform.
                    </p>
                  </div>

                  {/* CTA & Connect Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onNavigate('/about')}
                      className="interactive-btn px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Read the Full Founder Story</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F5B400]" />
                    </button>

                    <a
                      href={founderConfig.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="interactive-btn px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="Open direct WhatsApp chat with Onifade Sulaiman"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Founder</span>
                    </a>
                  </div>

                </div>

              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. MISSION & VISION SECTION                                 */}
      {/* ============================================================ */}
      <section id="mission-vision-section" className="py-16 sm:py-20 bg-slate-50/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Mission */}
            <ScrollReveal direction="right" delay={50}>
              <div className="interactive-card bg-[#061A4F] text-white p-7 sm:p-8 rounded-3xl border border-[#0B2A6F] shadow-xl space-y-3 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B2A6F] text-[#F5B400] flex items-center justify-center font-bold border border-white/10 shadow-inner">
                    <Target className="w-5 h-5 text-[#F5B400]" />
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#F5B400]">Our Mission</div>
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    "{founderConfig.mission}"
                  </p>
                </div>
                <p className="text-xs text-slate-300 pt-2 border-t border-[#0B2A6F]">
                  Making student talent and campus enterprises immediately accessible and rewarding.
                </p>
              </div>
            </ScrollReveal>

            {/* Vision */}
            <ScrollReveal direction="left" delay={100}>
              <div className="interactive-card bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-3 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#061A4F] flex items-center justify-center font-bold border border-amber-100">
                    <Compass className="w-5 h-5 text-[#061A4F]" />
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#061A4F]">Our Vision</div>
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                    "{founderConfig.vision}"
                  </p>
                </div>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  Building a permanent bridge between student learning and lifelong economic opportunities.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 13. FREQUENTLY ASKED QUESTIONS ACCORDION                     */}
      {/* ============================================================ */}
      <section id="faq-section" className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <ScrollReveal direction="up" delay={0} className="text-center space-y-3">
            <span className="text-xs font-black tracking-widest text-[#061A4F] uppercase bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#061A4F]">
              Everything You Need to Know
            </h2>
            <p className="text-sm text-slate-600">
              Clear answers to common questions about StudentCircle escrow, campus printing, and student freelancing.
            </p>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.q} direction="up" delay={index * 40}>
                <div
                  className="interactive-card border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-left font-black text-sm text-[#061A4F] flex items-center justify-between hover:bg-slate-50 transition gap-4 cursor-pointer"
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
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 14. FINAL CALL TO ACTION                                     */}
      {/* ============================================================ */}
      <section id="final-cta-section" className="py-16 sm:py-24 bg-[#061A4F] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <ScrollReveal direction="up" delay={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#F5B400] text-xs font-black border border-white/10">
            <Sparkles className="w-4 h-4" />
            <span>JOIN THE OOU STUDENT ECONOMY</span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={60}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-snug">
              Your campus is full of talent, ideas and opportunities. <br className="hidden sm:inline" />
              <span className="text-[#F5B400]">StudentCircle brings them together.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={120}>
            <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
              Whether you want to sell your skills, launch a campus storefront, find verified student talent, or pre-order printing services, StudentCircle is built for you.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={180}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                id="final-cta-join"
                onClick={() => onNavigate('/auth/register')}
                className="interactive-btn px-8 py-4 bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-sm font-black rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Join StudentCircle</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="final-cta-explore"
                onClick={() => onNavigate('/explore')}
                className="interactive-btn px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Student Services</span>
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

    </div>
  );
};
