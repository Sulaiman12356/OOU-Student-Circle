import React, { useEffect, useState } from 'react';
import { StudentConnectFilter } from '../../types/studentConnect';
import { CampusLocation } from '../../types/campus';
import { CampusStore } from '../../services/campusStore';
import { popularStudentInterests } from '../../services/studentConnectStore';
import { 
  Filter, 
  X, 
  RotateCcw, 
  MapPin, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Sparkles,
  Heart,
  ChevronDown
} from 'lucide-react';

interface StudentConnectFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: StudentConnectFilter;
  onChange: (updated: Partial<StudentConnectFilter>) => void;
  onReset: () => void;
}

export const OOU_FACULTIES = [
  'Faculty of Science',
  'Faculty of Social and Management Sciences',
  'Faculty of Arts',
  'Faculty of Law',
  'Faculty of Education',
  'Faculty of Basic Medical Sciences',
  'College of Engineering and Environmental Studies',
  'College of Agricultural Sciences',
  'College of Health Sciences',
  'Faculty of Pharmacy'
];

export const OOU_LEVELS = ['100L', '200L', '300L', '400L', '500L', 'Postgraduate', 'Alumni'];

export const POPULAR_SKILLS = [
  'Web Development',
  'Graphic Design',
  'UI/UX Design',
  'Logo Design',
  'Content Writing',
  'Photography',
  'Video Editing',
  'Agribusiness Planning',
  'AutoCAD & 3D Modeling',
  'Data Analysis & SPSS',
  'Digital Marketing',
  'Public Speaking',
  'Legal Drafting',
  'Bookkeeping & Accounting'
];

export const StudentConnectFilterDrawer: React.FC<StudentConnectFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset
}) => {
  const [campusLocations, setCampusLocations] = useState<CampusLocation[]>([]);

  useEffect(() => {
    const loadCampuses = async () => {
      try {
        const locations = CampusStore.getLocations();
        setCampusLocations(locations.filter(loc => loc.status === 'Active' || loc.isActive !== false));
      } catch (err) {
        console.warn('Campus load notice:', err);
      }
    };
    loadCampuses();
  }, []);

  if (!isOpen) return null;

  const activeFilterCount = [
    filters.campus !== 'all' && filters.campus,
    filters.faculty !== 'all' && filters.faculty,
    filters.level !== 'all' && filters.level,
    filters.skill !== 'all' && filters.skill,
    filters.interest !== 'all' && filters.interest,
    filters.onlyVerified,
    filters.availableForWork
  ].filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#061A4F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#F5B400]" />
            <h3 className="font-black text-sm">Filter Students</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F5B400] text-[#061A4F] rounded-full">
                {activeFilterCount} Active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Dynamic Campus Filter (from campusLocations collection) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Campus Location</span>
            </label>
            <select
              value={filters.campus}
              onChange={(e) => onChange({ campus: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#061A4F]"
            >
              <option value="all">All 5 OOU Campuses</option>
              {campusLocations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.location || 'OOU'})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Faculty Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#061A4F]" />
              <span>Faculty / College</span>
            </label>
            <select
              value={filters.faculty}
              onChange={(e) => onChange({ faculty: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#061A4F]"
            >
              <option value="all">All Faculties & Colleges</option>
              {OOU_FACULTIES.map((fac, idx) => (
                <option key={idx} value={fac}>{fac}</option>
              ))}
            </select>
          </div>

          {/* 3. Level Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">
              Academic Level
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ level: 'all' })}
                className={`py-2 px-1 text-center text-xs font-bold rounded-lg border transition ${
                  filters.level === 'all'
                    ? 'bg-[#061A4F] text-white border-[#061A4F]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              {OOU_LEVELS.slice(0, 5).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChange({ level: lvl })}
                  className={`py-2 px-1 text-center text-xs font-bold rounded-lg border transition ${
                    filters.level === lvl
                      ? 'bg-[#061A4F] text-white border-[#061A4F]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Skills Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Skills & Talents</span>
            </label>
            <select
              value={filters.skill}
              onChange={(e) => onChange({ skill: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#061A4F]"
            >
              <option value="all">All Skills</option>
              {POPULAR_SKILLS.map((sk, idx) => (
                <option key={idx} value={sk}>{sk}</option>
              ))}
            </select>
          </div>

          {/* 5. Interest Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Shared Interests & Fields</span>
            </label>
            <select
              value={filters.interest}
              onChange={(e) => onChange({ interest: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#061A4F]"
            >
              <option value="all">All Interests</option>
              {popularStudentInterests.map((interest, idx) => (
                <option key={idx} value={interest}>{interest}</option>
              ))}
            </select>
          </div>

          {/* 6. Toggles */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F5B400]" />
                <span className="text-xs font-bold text-slate-800">Verified OOU Students Only</span>
              </div>
              <input
                type="checkbox"
                checked={filters.onlyVerified}
                onChange={(e) => onChange({ onlyVerified: e.target.checked })}
                className="w-4 h-4 text-[#061A4F] rounded-md focus:ring-[#061A4F]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Available for Freelance/Work</span>
              </div>
              <input
                type="checkbox"
                checked={filters.availableForWork}
                onChange={(e) => onChange({ availableForWork: e.target.checked })}
                className="w-4 h-4 text-[#061A4F] rounded-md focus:ring-[#061A4F]"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-black text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition shadow-sm text-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
