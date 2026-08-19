import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  GraduationCap, 
  Sparkles, 
  ExternalLink, 
  Share2, 
  Briefcase, 
  Award, 
  Calendar, 
  Star, 
  Heart, 
  Layers, 
  MessageSquare, 
  UserPlus, 
  ChevronRight,
  ShieldCheck,
  Eye,
  X,
  ArrowRight,
  Tag
} from 'lucide-react';
import { UserProfile, PortfolioItem, ServiceItem } from '../../types';

interface PublicStudentProfileViewProps {
  user: UserProfile;
  services: ServiceItem[];
  isOwner?: boolean;
  onEditProfile?: () => void;
  onConnect?: () => void;
  onMessage?: () => void;
  onSelectService?: (service: ServiceItem) => void;
}

export const PublicStudentProfileView: React.FC<PublicStudentProfileViewProps> = ({
  user,
  services = [],
  isOwner = false,
  onEditProfile,
  onConnect,
  onMessage,
  onSelectService
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'services' | 'education'>('overview');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const defaultCoverGradient = 'bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-[#061A4F]';
  const fallbackAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card with Cover Photo & Overlaid Avatar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-44 sm:h-64 w-full relative overflow-hidden bg-slate-200">
          {user.coverPhoto ? (
            <img
              src={user.coverPhoto}
              alt={`${user.fullName}'s cover banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full ${defaultCoverGradient} relative`}>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F5B400_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          )}

          {/* Top Floating Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-1.5 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold rounded-xl hover:bg-white shadow-md transition flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#061A4F]" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
            </button>

            {isOwner && onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="px-3.5 py-1.5 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] shadow-md transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="px-5 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar & Title Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
              <div className="relative">
                <img
                  src={user.profilePhoto || fallbackAvatar}
                  alt={user.fullName}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl bg-slate-100"
                />
                {user.isVerified && (
                  <div 
                    className="absolute -bottom-1 -right-1 p-1.5 bg-[#061A4F] text-[#F5B400] rounded-full border-2 border-white shadow"
                    title="Verified OOU Student"
                  >
                    <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#061A4F] tracking-tight">
                    {user.fullName}
                  </h1>
                  {user.isVerified && (
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Student
                    </span>
                  )}
                  {user.availableForWork && (
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-black rounded-full flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Available for Work
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-600 flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span>{user.department || 'OOU Student'}</span>
                  {user.level && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-[#061A4F] rounded-md font-bold text-[11px]">{user.level}</span>
                    </>
                  )}
                  {user.faculty && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>{user.faculty}</span>
                    </>
                  )}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{user.location || 'Olabisi Onabanjo University'}</span>
                </div>
              </div>
            </div>

            {/* Quick CTAs for External Visitors */}
            {!isOwner && (
              <div className="flex items-center gap-2 pt-2 md:pt-0">
                {onConnect && (
                  <button
                    type="button"
                    onClick={onConnect}
                    className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#F5B400]" />
                    <span>Connect</span>
                  </button>
                )}
                {onMessage && (
                  <button
                    type="button"
                    onClick={onMessage}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#061A4F] text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 border-t border-slate-100 pt-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Overview & Bio
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'portfolio'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Portfolio</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'portfolio' ? 'bg-[#F5B400] text-[#061A4F]' : 'bg-slate-200 text-slate-700'
              }`}>
                {user.portfolio?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'services'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Services</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'services' ? 'bg-[#F5B400] text-[#061A4F]' : 'bg-slate-200 text-slate-700'
              }`}>
                {services.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'education'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>Education & Awards</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'education' ? 'bg-[#F5B400] text-[#061A4F]' : 'bg-slate-200 text-slate-700'
              }`}>
                {(user.education?.length || 0) + (user.achievements?.length || 0)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Tab Contents */}

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Bio Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">About Me</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {user.shortBio || 'No biography written yet. Tell fellow students and clients about what you do, your favorite tools, and your passions.'}
            </p>
          </div>

          {/* Skills & Interests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Skills & Expertise ({user.skills?.length || 0})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-blue-50 text-[#061A4F] font-bold text-xs rounded-xl border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Interests & Clubs ({user.interests?.length || 0})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.interests && user.interests.length > 0 ? (
                  user.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1.5 bg-amber-50 text-amber-900 font-bold text-xs rounded-xl border border-amber-200"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No interests listed yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Featured Portfolio Preview (Top 3) */}
          {user.portfolio && user.portfolio.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F5B400]" />
                  <span>Featured Portfolio Work</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('portfolio')}
                  className="text-xs font-bold text-[#061A4F] hover:underline flex items-center gap-1"
                >
                  <span>View all ({user.portfolio.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.portfolio.slice(0, 3).map((item) => {
                  const itemImages = item.images && item.images.length > 0 ? item.images : (item.imageUrl ? [item.imageUrl] : []);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPortfolioItem(item)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-md transition"
                    >
                      <div className="aspect-16/10 overflow-hidden bg-slate-200 relative">
                        {itemImages.length > 0 && (
                          <img
                            src={itemImages[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        )}
                        {item.category && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-[10px] font-black rounded-md shadow-xs text-[#061A4F]">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-extrabold text-xs text-[#061A4F] truncate group-hover:text-blue-700">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#061A4F]">Portfolio & Projects</h3>
              <p className="text-xs text-slate-500">All published student work and client deliverables.</p>
            </div>
            {isOwner && onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="px-3.5 py-1.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl"
              >
                + Add Project
              </button>
            )}
          </div>

          {user.portfolio && user.portfolio.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {user.portfolio.map((item) => {
                const itemImages = item.images && item.images.length > 0 ? item.images : (item.imageUrl ? [item.imageUrl] : []);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPortfolioItem(item)}
                    className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200 bg-slate-50/50 hover:shadow-lg transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-16/10 overflow-hidden bg-slate-200 relative">
                        {itemImages.length > 0 ? (
                          <img
                            src={itemImages[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Layers className="w-8 h-8" />
                          </div>
                        )}

                        {itemImages.length > 1 && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-black">
                            +{itemImages.length - 1} photos
                          </div>
                        )}

                        {item.category && (
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-xs text-[10px] font-black rounded-lg shadow-xs text-[#061A4F]">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-black text-sm text-[#061A4F] group-hover:text-blue-700 transition">
                            {item.title}
                          </h4>
                          {item.projectUrl && (
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          )}
                        </div>
                        {item.date && (
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{item.date}</span>
                          </p>
                        )}
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#061A4F]">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>View Project Details</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 italic">
              No portfolio projects uploaded yet.
            </div>
          )}
        </div>
      )}

      {/* Tab: Services */}
      {activeTab === 'services' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#061A4F]">Published Services ({services.length})</h3>
              <p className="text-xs text-slate-500">Available services directly provided by this student.</p>
            </div>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => onSelectService && onSelectService(service)}
                  className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-16/10 overflow-hidden bg-slate-200 relative">
                      {service.portfolioImages && service.portfolioImages.length > 0 ? (
                        <img
                          src={service.portfolioImages[0]}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Briefcase className="w-8 h-8" />
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#061A4F] text-[#F5B400] text-[10px] font-black rounded-lg shadow-xs">
                        {service.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-black text-xs sm:text-sm text-[#061A4F] line-clamp-2 group-hover:text-blue-700 transition">
                        {service.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting at</span>
                      <span className="text-sm font-black text-[#061A4F]">
                        ₦{service.startingPrice?.toLocaleString() || '3,000'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 bg-[#061A4F] text-[#F5B400] text-xs font-black rounded-xl hover:bg-[#0B2A6F] flex items-center gap-1"
                    >
                      <span>Hire Service</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 italic">
              This student has not published any freelance services yet.
            </div>
          )}
        </div>
      )}

      {/* Tab: Education & Awards */}
      {activeTab === 'education' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Education */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#061A4F]" />
              <span>Academic Education ({user.education?.length || 1})</span>
            </h3>

            <div className="space-y-3">
              {/* Default OOU Primary Degree */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#061A4F]">{user.department ? `B.Sc. ${user.department}` : 'Undergraduate Degree'}</h4>
                  <span className="px-2 py-0.5 bg-blue-100 text-[#061A4F] text-[10px] font-black rounded-md">
                    {user.level || 'Enrolled'}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700">Olabisi Onabanjo University</p>
                <p className="text-[10px] text-slate-500">
                  {[user.faculty, user.location].filter(Boolean).join(' • ')}
                </p>
              </div>

              {/* Additional Education Items */}
              {user.education?.map((edu) => (
                <div key={edu.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#061A4F]">{edu.degree}</h4>
                    {edu.isCurrent && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-700">{edu.institution}</p>
                  <p className="text-[10px] text-slate-500">
                    {[edu.fieldOfStudy, `${edu.startYear || ''} - ${edu.endYear || ''}`].filter(Boolean).join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F5B400]" />
              <span>Achievements & Certifications ({user.achievements?.length || 0})</span>
            </h3>

            <div className="space-y-3">
              {user.achievements && user.achievements.length > 0 ? (
                user.achievements.map((ach) => (
                  <div key={ach.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-[#061A4F]">{ach.title}</h4>
                      {ach.link && (
                        <a href={ach.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[10px] font-bold flex items-center gap-1">
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {[ach.issuer, ach.date || ach.year].filter(Boolean).join(' • ')}
                    </p>
                    {ach.description && (
                      <p className="text-[11px] text-slate-500">{ach.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-4 text-center">No certifications or awards listed yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Portfolio Project Full-Modal Viewer */}
      {selectedPortfolioItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedPortfolioItem(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-150 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                {selectedPortfolioItem.category && (
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#061A4F] text-[10px] font-black rounded-md">
                    {selectedPortfolioItem.category}
                  </span>
                )}
                <h3 className="text-lg font-black text-[#061A4F] mt-1">{selectedPortfolioItem.title}</h3>
                {selectedPortfolioItem.date && (
                  <p className="text-xs text-slate-400 mt-0.5">{selectedPortfolioItem.date}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedPortfolioItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Images Carousel / Gallery */}
            {selectedPortfolioItem.images && selectedPortfolioItem.images.length > 0 ? (
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96 bg-slate-100 flex items-center justify-center">
                  <img
                    src={selectedPortfolioItem.images[0]}
                    alt={selectedPortfolioItem.title}
                    className="max-h-96 w-full object-contain"
                  />
                </div>

                {selectedPortfolioItem.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedPortfolioItem.images.map((imgUrl, i) => (
                      <div key={i} className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={imgUrl} alt={`thumbnail ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : selectedPortfolioItem.imageUrl ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96 bg-slate-100 flex items-center justify-center">
                <img
                  src={selectedPortfolioItem.imageUrl}
                  alt={selectedPortfolioItem.title}
                  className="max-h-96 w-full object-contain"
                />
              </div>
            ) : null}

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Project Overview</h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedPortfolioItem.description || 'No detailed description provided.'}
              </p>
            </div>

            {/* External Link */}
            {selectedPortfolioItem.projectUrl && (
              <div className="pt-2">
                <a
                  href={selectedPortfolioItem.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition shadow-xs"
                >
                  <span>Visit Live Project</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#F5B400]" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
