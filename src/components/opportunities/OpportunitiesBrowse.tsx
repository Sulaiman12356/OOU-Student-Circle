import React, { useState, useMemo } from 'react';
import { 
  Opportunity, 
  OpportunityType, 
  OpportunityCategory, 
  WorkMode,
  OpportunityApplication 
} from '../../types/opportunities';
import { OpportunityStore } from '../../services/opportunityStore';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Send, 
  Plus, 
  Award, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  FileText, 
  Calendar,
  Grid,
  List,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Users
} from 'lucide-react';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { OpportunityApplyModal } from './OpportunityApplyModal';
import { OpportunityCreateModal } from './OpportunityCreateModal';

interface OpportunitiesBrowseProps {
  onNavigateMessage?: (creatorId: string, jobId?: string) => void;
  onNavigate?: (path: string) => void;
}

export const OpportunitiesBrowse: React.FC<OpportunitiesBrowseProps> = ({
  onNavigateMessage,
  onNavigate
}) => {
  const { currentUser } = useAuth();

  // State
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    return OpportunityStore.getOpportunities();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'deadline' | 'budget'>('latest');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [viewTab, setViewTab] = useState<'explore' | 'applied' | 'saved'>('explore');

  // Modals
  const [activeDetailModal, setActiveDetailModal] = useState<Opportunity | null>(null);
  const [activeApplyModal, setActiveApplyModal] = useState<Opportunity | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshOpportunities = () => {
    setOpportunities(OpportunityStore.getOpportunities());
  };

  // Types list
  const typesList: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Opportunities', icon: Sparkles },
    { id: 'job', label: 'Student & Freelance Jobs', icon: Briefcase },
    { id: 'internship', label: 'Internships', icon: Building2 },
    { id: 'siwes', label: 'SIWES Placement', icon: GraduationCap },
    { id: 'scholarship', label: 'Scholarships & Grants', icon: Award },
    { id: 'competition', label: 'Competitions & Hackathons', icon: Sparkles },
    { id: 'fellowship', label: 'Fellowships & Programs', icon: Layers },
    { id: 'project', label: 'Project Collaborations', icon: FileText }
  ];

  // Categories list
  const categoriesList = [
    'All Categories',
    'Student Jobs',
    'Freelance Jobs',
    'Internships',
    'SIWES opportunities',
    'Projects',
    'Competitions',
    'Scholarships',
    'Fellowships',
    'Entrepreneurship opportunities',
    'Enterprise opportunities'
  ];

  const campuses = [
    'All Campuses',
    'Ago-Iwoye Main Campus',
    'Sagamu Medical Campus',
    'Ayetoro Agricultural Campus',
    'Ibogun Engineering Campus',
    'Remote / Nationwide'
  ];

  // Student's applications
  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    return OpportunityStore.getApplications(undefined, currentUser.id);
  }, [currentUser, opportunities]);

  // Student's saved IDs
  const bookmarkedIds = useMemo(() => {
    if (!currentUser) return [];
    return OpportunityStore.getBookmarkedOpportunityIds(currentUser.id);
  }, [currentUser, opportunities]);

  // Filtered list
  const filteredOpportunities = useMemo(() => {
    let list = opportunities;

    // View tab filtering
    if (viewTab === 'saved') {
      list = list.filter(op => bookmarkedIds.includes(op.id));
    } else if (viewTab === 'applied') {
      const appliedOppIds = myApplications.map(a => a.opportunityId);
      list = list.filter(op => appliedOppIds.includes(op.id));
    } else {
      // By default show approved or creator's own
      list = list.filter(op => {
        if (op.moderationStatus === 'approved') return true;
        if (currentUser && (op.creatorId === currentUser.id || currentUser.role === 'admin')) return true;
        return false;
      });
    }

    // Type filter
    if (selectedType !== 'all') {
      list = list.filter(op => op.opportunityType === selectedType);
    }

    // Category filter
    if (selectedCategory !== 'all' && selectedCategory !== 'All Categories') {
      list = list.filter(op => op.category === selectedCategory);
    }

    // Campus filter
    if (selectedCampus !== 'all' && selectedCampus !== 'All Campuses') {
      list = list.filter(op => op.campus.toLowerCase().includes(selectedCampus.toLowerCase()) || op.campus === 'All Campuses');
    }

    // Work mode
    if (selectedWorkMode !== 'all') {
      list = list.filter(op => op.workMode === selectedWorkMode);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(op => 
        op.title.toLowerCase().includes(q) ||
        op.description.toLowerCase().includes(q) ||
        op.organizationName.toLowerCase().includes(q) ||
        op.campus.toLowerCase().includes(q) ||
        op.requirements.some(r => r.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'budget') {
        const bA = typeof a.budget === 'number' ? a.budget : 0;
        const bB = typeof b.budget === 'number' ? b.budget : 0;
        return bB - bA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    opportunities, 
    viewTab, 
    bookmarkedIds, 
    myApplications, 
    currentUser, 
    selectedType, 
    selectedCategory, 
    selectedCampus, 
    selectedWorkMode, 
    searchQuery, 
    sortBy
  ]);

  const handleToggleBookmark = (e: React.MouseEvent, oppId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    OpportunityStore.toggleBookmark(currentUser.id, oppId);
    refreshOpportunities();
  };

  const handleShare = (e: React.MouseEvent, opp: Opportunity) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopiedId(opp.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatBudgetDisplay = (opp: Opportunity) => {
    if (opp.budgetString) return opp.budgetString;
    if (typeof opp.budget === 'number') return `₦${opp.budget.toLocaleString()}`;
    if (opp.budget?.min && opp.budget?.max) return `₦${opp.budget.min.toLocaleString()} - ₦${opp.budget.max.toLocaleString()}`;
    return 'Funded / Grant';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship':
      case 'siwes':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'competition':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'scholarship':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'fellowship':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'project':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#061A4F] via-[#08236B] to-[#0B2A6F] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-blue-900/40">
        
        {/* Abstract Background Accents */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#F5B400]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F5B400] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OOU Verified Jobs, Internships & Competitions</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Launch Your Career with Campus Opportunities
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Discover student jobs, freelance gigs, SIWES industrial placements, academic scholarships, hackathons, and enterprise fellowships across all OOU campuses.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-[#F5B400] hover:bg-[#ffc21a] text-[#061A4F] font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Post an Opportunity Brief</span>
            </button>

            {currentUser && (
              <button
                onClick={() => setViewTab(viewTab === 'applied' ? 'explore' : 'applied')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition border flex items-center gap-2 backdrop-blur-xs ${
                  viewTab === 'applied' 
                    ? 'bg-white text-[#061A4F] border-white' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#F5B400]" />
                <span>My Applications ({myApplications.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Center */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Search Bar + Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, required skills (React, Figma, Writing), faculty, or host..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              {campuses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Work Modes</option>
              <option value="remote">Remote Only</option>
              <option value="on_campus">On-Campus Only</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="latest">Sort: Newest First</option>
              <option value="deadline">Sort: Deadline Soonest</option>
              <option value="budget">Sort: Highest Reward</option>
            </select>

            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-lg transition ${viewLayout === 'grid' ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewLayout('list')}
                className={`p-1.5 rounded-lg transition ${viewLayout === 'list' ? 'bg-[#061A4F] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Opportunity Types Quick Carousel Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          {typesList.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedType === t.id && viewTab === 'explore';
            return (
              <button
                key={t.id}
                onClick={() => {
                  setViewTab('explore');
                  setSelectedType(t.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#061A4F] text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F5B400]' : 'text-slate-500'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}

          {currentUser && (
            <button
              onClick={() => setViewTab('saved')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                viewTab === 'saved'
                  ? 'bg-[#F5B400] text-[#061A4F] shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({bookmarkedIds.length})</span>
            </button>
          )}
        </div>

        {/* Sub-categories tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {categoriesList.map(cat => {
            const isCatSelected = selectedCategory === cat || (cat === 'All Categories' && selectedCategory === 'all');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All Categories' ? 'all' : cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                  isCatSelected ? 'bg-blue-100 text-[#061A4F] font-bold border border-blue-200' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-slate-500">
          Showing <strong className="text-slate-900 font-bold">{filteredOpportunities.length}</strong> opportunities
          {selectedType !== 'all' && ` in ${typesList.find(t => t.id === selectedType)?.label}`}
          {selectedCampus !== 'all' && ` at ${selectedCampus}`}
        </div>
        
        {currentUser && (
          <span className="text-[11px] font-semibold text-slate-400">
            Active Submissions: {myApplications.length}
          </span>
        )}
      </div>

      {/* Opportunities Presentation (Grid or List) */}
      {filteredOpportunities.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-slate-800">No Opportunities Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {viewTab === 'saved' 
              ? 'You have not bookmarked any opportunities yet. Click the bookmark icon on any opportunity card to save it.'
              : viewTab === 'applied'
              ? 'You have not submitted applications yet. Browse the open opportunities and apply today!'
              : 'No opportunities currently match your search filters. Try widening your campus selection or category.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedCategory('all');
                setSelectedCampus('all');
                setSelectedWorkMode('all');
                setViewTab('explore');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#061A4F] text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Post Opportunity</span>
            </button>
          </div>
        </div>
      ) : viewLayout === 'grid' ? (
        /* GRID LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => {
            const isSaved = currentUser ? bookmarkedIds.includes(opp.id) : false;
            const studentApp = currentUser ? myApplications.find(a => a.opportunityId === opp.id) : null;
            const isExpired = new Date(opp.deadline).getTime() < Date.now();
            const daysLeft = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={opp.id}
                onClick={() => setActiveDetailModal(opp)}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer"
              >
                {/* Card Header Top */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {opp.organizationLogo ? (
                        <img 
                          src={opp.organizationLogo} 
                          alt={opp.organizationName}
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#061A4F] font-bold text-xs flex items-center justify-center border border-blue-100 flex-shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-xs truncate">{opp.organizationName}</div>
                        <div className="text-[11px] text-slate-400 truncate">{opp.campus}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {currentUser && (
                        <button
                          onClick={(e) => handleToggleBookmark(e, opp.id)}
                          className={`p-1.5 rounded-xl border transition ${
                            isSaved ? 'bg-[#F5B400] text-[#061A4F] border-[#F5B400]' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                          }`}
                          title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleShare(e, opp)}
                        className="p-1.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:text-slate-600 transition"
                        title="Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Badges */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${getTypeColor(opp.opportunityType)}`}>
                        {opp.opportunityType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600">
                        {opp.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 capitalize">
                        {opp.workMode.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-[#061A4F] transition line-clamp-2">
                      {opp.title}
                    </h3>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Key Requirements tags */}
                  {opp.requirements && opp.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {opp.requirements.slice(0, 3).map((req, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-600 text-[10px] truncate max-w-[140px]">
                          {req}
                        </span>
                      ))}
                      {opp.requirements.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-medium self-center">
                          +{opp.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Bottom */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Budget / Reward</div>
                    <div className="font-extrabold text-xs text-[#061A4F]">
                      {formatBudgetDisplay(opp)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {studentApp ? (
                      <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-900 font-bold text-[10px] uppercase flex items-center gap-1 border border-blue-200">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        {studentApp.status}
                      </span>
                    ) : isExpired ? (
                      <span className="px-2.5 py-1 rounded-xl bg-slate-200 text-slate-500 font-bold text-[10px]">
                        Expired
                      </span>
                    ) : opp.status === 'filled' ? (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-bold text-[10px]">
                        Filled
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveApplyModal(opp);
                        }}
                        className="px-3 py-1.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-2xs group-hover:bg-[#0B2A6F]"
                      >
                        <span>Apply</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#F5B400]" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* LIST LAYOUT */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filteredOpportunities.map((opp) => {
            const isSaved = currentUser ? bookmarkedIds.includes(opp.id) : false;
            const studentApp = currentUser ? myApplications.find(a => a.opportunityId === opp.id) : null;
            const isExpired = new Date(opp.deadline).getTime() < Date.now();

            return (
              <div
                key={opp.id}
                onClick={() => setActiveDetailModal(opp)}
                className="p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {opp.organizationLogo ? (
                    <img 
                      src={opp.organizationLogo} 
                      alt={opp.organizationName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#061A4F] font-bold text-sm flex items-center justify-center border border-blue-100 flex-shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase ${getTypeColor(opp.opportunityType)}`}>
                        {opp.opportunityType}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{opp.organizationName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" /> {opp.campus}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 hover:text-[#061A4F] transition">
                      {opp.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {opp.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="font-extrabold text-xs text-[#061A4F]">
                      {formatBudgetDisplay(opp)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Deadline: {new Date(opp.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentUser && (
                      <button
                        onClick={(e) => handleToggleBookmark(e, opp.id)}
                        className={`p-2 rounded-xl border transition ${
                          isSaved ? 'bg-[#F5B400] text-[#061A4F] border-[#F5B400]' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    )}

                    {studentApp ? (
                      <span className="px-3 py-2 rounded-xl bg-blue-100 text-blue-900 font-bold text-xs uppercase flex items-center gap-1 border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>{studentApp.status}</span>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveApplyModal(opp);
                        }}
                        className="px-4 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-xs"
                      >
                        <span>Apply</span>
                        <ChevronRight className="w-4 h-4 text-[#F5B400]" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <OpportunityDetailModal
        opportunity={activeDetailModal}
        isOpen={!!activeDetailModal}
        onClose={() => setActiveDetailModal(null)}
        onApply={(opp) => {
          setActiveDetailModal(null);
          setActiveApplyModal(opp);
        }}
        onNavigateMessage={onNavigateMessage}
      />

      <OpportunityApplyModal
        opportunity={activeApplyModal}
        isOpen={!!activeApplyModal}
        onClose={() => setActiveApplyModal(null)}
        onSuccess={() => {
          refreshOpportunities();
        }}
      />

      <OpportunityCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          refreshOpportunities();
        }}
      />

    </div>
  );
};
