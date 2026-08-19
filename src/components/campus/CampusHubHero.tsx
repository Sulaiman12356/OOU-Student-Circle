import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Store, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  Truck,
  Compass
} from 'lucide-react';
import { CampusLocation } from '../../types/campus';

interface CampusHubHeroProps {
  locations: CampusLocation[];
  selectedLocation: string;
  onSelectLocation: (locationId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTracker: () => void;
  onOpenRegisterShop: () => void;
  onOpenAspirantPackage: () => void;
}

export const CampusHubHero: React.FC<CampusHubHeroProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  searchQuery,
  onSearchChange,
  onOpenTracker,
  onOpenRegisterShop,
  onOpenAspirantPackage
}) => {
  const [trackRef, setTrackRef] = useState('');

  return (
    <div className="relative bg-gradient-to-b from-[#061A4F] via-[#0A2265] to-[#061A4F] text-white overflow-hidden py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5B400_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>Pillar 4: Physical Campus Services & Business Centers</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTracker}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition"
            >
              <Search className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Track Campus Order</span>
            </button>
            <button
              onClick={onOpenRegisterShop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F5B400] hover:bg-[#e0a400] text-[#061A4F] text-xs font-extrabold shadow-sm transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Register Your Shop</span>
            </button>
          </div>
        </div>

        {/* Main Headline & Description */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
            Get Your Campus Services Sorted <span className="text-[#F5B400]">Before You Arrive.</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            Order project printing, hardcover binding, screening documents, portal verification, and passport photographs directly from verified shops at <span className="font-bold text-white">Motion Ground</span>, Main Campus Gate, and across OOU.
          </p>
        </div>

        {/* Aspirant Priority Box */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#F5B400] text-[#061A4F] shrink-0 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Coming for OOU Post-UTME, Screening, or Matriculation?</h2>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-[#F5B400] text-[#061A4F]">Aspirant Priority</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload your JAMB slip and screening credentials from Lagos, Ibadan, or home. Collect your printed and laminated folder within 2 minutes at Motion Ground Shop E6.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAspirantPackage}
            className="shrink-0 px-4 py-2 bg-[#F5B400] text-[#061A4F] rounded-lg text-xs font-bold hover:bg-[#e0a400] transition flex items-center gap-1.5"
          >
            <span>Prepare My Screening Docs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big Search Bar */}
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col md:flex-row items-stretch gap-2 text-slate-800">
          <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-[#061A4F] focus-within:bg-white transition">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search shops, services (e.g., 'Shop E6', 'Hardcover Binding', 'Passport Photo', 'Motion Ground')..."
              className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder-slate-400 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <MapPin className="w-4 h-4 text-[#061A4F]" />
              <select
                value={selectedLocation}
                onChange={(e) => onSelectLocation(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All OOU Locations ({locations.length})</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Location Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-slate-400 font-semibold shrink-0">Popular Zones:</span>
          <button
            onClick={() => onSelectLocation('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
              selectedLocation === 'all'
                ? 'bg-[#F5B400] text-[#061A4F]'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            All Locations
          </button>
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedLocation === loc.id
                  ? 'bg-[#F5B400] text-[#061A4F]'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <MapPin className="w-3 h-3 opacity-70" />
              <span>{loc.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({loc.code})</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
