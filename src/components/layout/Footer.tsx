import React, { useState } from 'react';
import { OouLogo } from '../brand/OouLogo';
import { Mail, MapPin, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { founderConfig } from '../../config/founder';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('/')} 
              className="cursor-pointer inline-block"
            >
              <OouLogo size="md" />
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Connecting student talent, businesses and opportunities around the OOU community.
            </p>
            <p className="text-xs text-slate-500">
              <strong className="text-[#061A4F]">Founder:</strong> {founderConfig.name}, {founderConfig.role}
            </p>

            {/* Direct Contact Links */}
            <div className="space-y-2 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <a 
                  href={founderConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 hover:underline font-semibold"
                >
                  WhatsApp: {founderConfig.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#061A4F] flex-shrink-0" />
                <a 
                  href={founderConfig.emailUrl}
                  className="hover:text-[#061A4F] hover:underline font-medium"
                >
                  Email: {founderConfig.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F5B400] mt-0.5 flex-shrink-0" />
                <span>Olabisi Onabanjo University, Ago-Iwoye, Ogun State, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-bold text-[#061A4F] uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/student-connect')} className="text-slate-600 hover:text-[#061A4F] transition font-bold text-[#061A4F] flex items-center gap-1">
                  <span>Student Connect</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#F5B400] text-[#061A4F] font-black">HOT</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="text-slate-600 hover:text-[#061A4F] transition">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/explore')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/marketplace')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/talent')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Jobs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/campus')} className="text-slate-600 hover:text-[#061A4F] transition font-bold text-[#061A4F] flex items-center gap-1">
                  <span>Campus Hub</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#F5B400] text-[#061A4F] font-black">NEW</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="text-slate-600 hover:text-[#061A4F] transition">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* For Students & Legal */}
          <div>
            <h4 className="text-sm font-bold text-[#061A4F] uppercase tracking-wider mb-4">
              For Students
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/explore')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Student Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/talent')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Find Jobs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/auth/register')} className="text-slate-600 hover:text-[#061A4F] transition font-semibold text-[#061A4F]">
                  Create Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/auth/register-aspirant')} className="text-amber-800 hover:text-[#061A4F] transition font-bold flex items-center gap-1">
                  <span>Aspirants Document Hub</span>
                </button>
              </li>
            </ul>

            <h4 className="text-sm font-bold text-[#061A4F] uppercase tracking-wider mt-6 mb-3">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/safety')} className="text-slate-600 hover:text-[#061A4F] transition font-medium flex items-center gap-1.5">
                  <span>Safety & Escrow Guide</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="text-slate-600 hover:text-[#061A4F] transition font-medium">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="text-slate-600 hover:text-[#061A4F] transition font-medium">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-bold text-[#061A4F] uppercase tracking-wider mb-4">
              For Businesses
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/client/discover')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Find Student Talent
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/auth/register')} className="text-slate-600 hover:text-[#061A4F] transition">
                  Post a Job
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/campus/register-shop')} className="text-slate-600 hover:text-[#061A4F] transition font-semibold text-[#061A4F]">
                  Register Your Shop
                </button>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Campus Updates
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#061A4F] text-white text-xs font-bold rounded-lg hover:bg-[#0B2A6F] transition flex-shrink-0"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                {subscribed && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Subscribed!</span>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} OOU StudentCircle. All rights reserved. Founded by {founderConfig.name} ({founderConfig.alias}).</p>
          <div className="flex items-center space-x-6">
            <span className="text-slate-400">One Platform. Four Ways to Move Forward.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
