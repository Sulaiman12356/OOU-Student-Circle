import React, { useState } from 'react';
import { PublicStudentProfile } from '../../types/studentConnect';
import { UserAvatar } from '../common/UserAvatar';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  UserPlus, 
  Check, 
  Clock, 
  MessageSquare, 
  Briefcase, 
  ExternalLink, 
  Award, 
  Heart, 
  Layers, 
  Sparkles,
  Share2,
  Lock,
  Mail,
  Phone
} from 'lucide-react';

interface StudentProfileModalProps {
  student: PublicStudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  connectionStatus: 'self' | 'connected' | 'pending_sent' | 'pending_received' | 'not_connected';
  onConnect: (student: PublicStudentProfile) => void;
  onMessage?: (student: PublicStudentProfile) => void;
  loadingConnect?: boolean;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  connectionStatus,
  onConnect,
  onMessage,
  loadingConnect = false
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !student) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/student-connect?student=${student.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasPortfolio = student.portfolio && student.portfolio.length > 0;
  const hasServices = student.services && student.services.length > 0 && student.privacySettings?.showServices !== false;
  const hasAchievements = student.achievements && student.achievements.length > 0;
  const hasSkills = student.skills && student.skills.length > 0;
  const hasInterests = student.interests && student.interests.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-[#061A4F] relative px-6 flex items-start justify-between pt-5 overflow-hidden">
          {student.coverPhoto && (
            <img 
              src={student.coverPhoto} 
              alt={`${student.fullName} cover`} 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          )}
          <div className="flex items-center gap-2 relative z-10">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-[#F5B400] text-[#061A4F] rounded-lg shadow-sm">
              OOU Student Profile
            </span>
            {student.availableForWork && (
              <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white rounded-lg shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Available For Work
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition shadow-sm"
              title="Share profile link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 -mt-16">
          
          {/* Avatar & Main Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="ring-4 ring-white rounded-full shadow-lg bg-white">
                  <UserAvatar 
                    name={student.fullName} 
                    photoUrl={student.profilePhoto} 
                    size="xl" 
                  />
                </div>
                {student.isVerified && (
                  <span 
                    className="absolute bottom-1 right-1 bg-[#F5B400] text-[#061A4F] p-1 rounded-full ring-2 ring-white shadow" 
                    title="Verified OOU Student"
                  >
                    <ShieldCheck className="w-5 h-5 fill-current" />
                  </span>
                )}
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-[#061A4F]">
                    {student.fullName}
                  </h2>
                  {student.level && (
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                      {student.level}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mt-1">
                  <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{student.department || 'OOU Student'}</span>
                  {student.faculty && <span className="text-slate-400">• {student.faculty}</span>}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F5B400] flex-shrink-0" />
                  <span>{student.location}</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2.5 sm:self-end pt-2 sm:pt-0">
              {connectionStatus === 'connected' ? (
                <>
                  <span className="px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Connected</span>
                  </span>
                  {onMessage && (
                    <button
                      onClick={() => onMessage(student)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-[#F5B400]" />
                      <span>Message</span>
                    </button>
                  )}
                </>
              ) : connectionStatus === 'pending_sent' ? (
                <button
                  disabled
                  className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-1.5 cursor-default"
                >
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Request Pending</span>
                </button>
              ) : connectionStatus === 'pending_received' ? (
                <button
                  onClick={() => onConnect(student)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Connection</span>
                </button>
              ) : connectionStatus === 'self' ? (
                <span className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-100 rounded-xl">
                  Your Public Profile
                </span>
              ) : (
                <button
                  onClick={() => onConnect(student)}
                  disabled={loadingConnect}
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#061A4F] hover:bg-[#0B2A6F] active:scale-[0.98] rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <UserPlus className="w-4 h-4 text-[#F5B400]" />
                  <span>Connect with {student.fullName.split(' ')[0]}</span>
                </button>
              )}
            </div>
          </div>

          {copied && (
            <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg text-center">
              ✓ Public profile link copied to clipboard!
            </div>
          )}

          {/* Body Sections: Bio */}
          {student.shortBio && (
            <div className="py-5 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                About / Bio
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {student.shortBio}
              </p>
            </div>
          )}

          {/* Skills & Interests Grid */}
          {(hasSkills || hasInterests) && (
            <div className="py-5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hasSkills && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
                    <span>Skills & Expertise</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills?.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-800 rounded-lg border border-slate-200/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasInterests && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Areas of Interest</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {student.interests?.map((interest, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 text-xs font-semibold bg-blue-50 text-[#061A4F] rounded-lg border border-blue-100"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Education & Degrees Section */}
          {student.education && student.education.length > 0 && (
            <div className="py-5 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#061A4F]" />
                <span>Education & Qualifications</span>
              </h3>
              <div className="space-y-2.5">
                {student.education.map((edu) => (
                  <div key={edu.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#061A4F] flex-shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#061A4F]">{edu.degree}</h4>
                        {edu.isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-semibold">{edu.institution}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {[edu.fieldOfStudy, `${edu.startYear || ''} - ${edu.endYear || ''}`].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {hasAchievements && (
            <div className="py-5 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Honours & Achievements</span>
              </h3>
              <div className="space-y-2.5">
                {student.achievements?.map((ach) => (
                  <div key={ach.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#061A4F] text-[#F5B400] flex-shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#061A4F]">{ach.title}</h4>
                        {ach.year && <span className="text-[11px] font-semibold text-slate-400">({ach.year})</span>}
                      </div>
                      {ach.issuer && <p className="text-xs text-slate-500 font-medium">{ach.issuer}</p>}
                      {ach.description && <p className="text-xs text-slate-600 mt-1">{ach.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Showcase */}
          {hasPortfolio && (
            <div className="py-5 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#061A4F]" />
                <span>Portfolio & Projects</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {student.portfolio?.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    {item.imageUrl && (
                      <div className="h-32 w-full overflow-hidden bg-slate-200">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}
                    <div className="p-3.5">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                      {item.projectUrl && (
                        <a 
                          href={item.projectUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#061A4F] hover:underline mt-2"
                        >
                          <span>View Project</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offered Services Section */}
          {hasServices && (
            <div className="py-5 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>Services Offered on StudentCircle</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.services?.map((srv) => (
                  <div key={srv.id} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-[#061A4F] transition flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {srv.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-2">
                        {srv.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500">From</span>
                      <span className="font-extrabold text-[#061A4F]">
                        ₦{(srv.startingPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explicit Public Contact (If user enabled public contact in privacy) */}
          {(student.publicEmail || student.publicPhone) && (
            <div className="py-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Public Contact Info
              </h3>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
                {student.publicEmail && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{student.publicEmail}</span>
                  </div>
                )}
                {student.publicPhone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{student.publicPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Privacy Note Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Matriculation and private academic records are protected and never displayed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
