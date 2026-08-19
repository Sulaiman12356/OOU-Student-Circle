import React, { useState, useMemo } from 'react';
import { DataStore } from '../../services/dataStore';
import { UserProfile } from '../../types';
import { 
  Search, 
  Star, 
  CheckCircle, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  ExternalLink,
  MessageSquare,
  Award,
  Filter
} from 'lucide-react';

interface StudentTalentPageProps {
  onNavigate: (path: string) => void;
  onSelectStudent?: (student: UserProfile) => void;
}

export const StudentTalentPage: React.FC<StudentTalentPageProps> = ({ onNavigate, onSelectStudent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [activeProfileModal, setActiveProfileModal] = useState<UserProfile | null>(null);

  const faculties = [
    'All',
    'Faculty of Science',
    'Faculty of Arts',
    'Faculty of Social Sciences',
    'Faculty of Administration & Management',
    'Faculty of Education',
    'Faculty of Law',
    'Faculty of Engineering',
    'College of Health Sciences'
  ];

  const levels = ['All', '100L', '200L', '300L', '400L', '500L', 'Postgraduate'];

  const students = DataStore.getUsers().filter(u => u.role === 'student' && u.status === 'active');

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesQuery = 
        searchQuery === '' ||
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        student.shortBio?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFaculty = 
        selectedFaculty === 'All' || 
        student.faculty === selectedFaculty;

      const matchesLevel = 
        selectedLevel === 'All' || 
        student.level === selectedLevel;

      const matchesVerified = !onlyVerified || student.isVerified;

      return matchesQuery && matchesFaculty && matchesLevel && matchesVerified;
    });
  }, [students, searchQuery, selectedFaculty, selectedLevel, onlyVerified]);

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#061A4F] text-xs font-bold uppercase tracking-wider">
            Verified Campus Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061A4F]">
            Browse OOU Student <span className="text-[#F5B400]">Talent</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Find vetted student professionals across multiple disciplines ready to take on your design, coding, writing, and marketing tasks.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, department, or skill (e.g., Python, Figma, React, Copywriting)..."
              className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <span className="font-bold text-slate-700 mr-2">Faculty:</span>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                >
                  {faculties.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="font-bold text-slate-700 mr-2">Level:</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                >
                  {levels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 text-[#061A4F] rounded border-slate-300 focus:ring-[#061A4F]"
              />
              <span>Verified Students Only</span>
            </label>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const studentServices = DataStore.getServicesByStudent(student.id);
            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={student.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={student.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F5B400] shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-[#061A4F] truncate">
                          {student.fullName}
                        </h3>
                        {student.isVerified && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" title="Verified OOU Student" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {student.department} • {student.level}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-1">
                        <Star className="w-3.5 h-3.5 fill-[#F5B400] text-[#F5B400]" />
                        <span>{student.rating?.toFixed(1) || '5.0'}</span>
                        <span className="text-slate-400 font-normal">({student.completedJobsCount || 0} jobs)</span>
                      </div>
                    </div>
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                    {student.shortBio || 'Talented student professional ready for freelance projects and campus collaborations.'}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {student.skills?.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-[#061A4F] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {(student.skills?.length || 0) > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                        +{(student.skills?.length || 0) - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Footer & Action */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F5B400]" />
                      {student.location}
                    </span>
                    <span>{studentServices.length} Active Services</span>
                  </div>

                  <button
                    onClick={() => setActiveProfileModal(student)}
                    className="w-full py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>View Student Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Student Profile Modal View */}
      {activeProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={activeProfileModal.profilePhoto}
                  alt={activeProfileModal.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F5B400]"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#061A4F] flex items-center gap-1.5">
                    <span>{activeProfileModal.fullName}</span>
                    {activeProfileModal.isVerified && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </h3>
                  <div className="text-xs text-slate-500">
                    {activeProfileModal.faculty} • {activeProfileModal.department} ({activeProfileModal.level})
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Location: {activeProfileModal.location}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveProfileModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-sm text-[#061A4F] mb-1">Biography & Focus</h4>
                <p className="leading-relaxed whitespace-pre-line">
                  {activeProfileModal.shortBio}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#061A4F] mb-2">Verified Skills & Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {activeProfileModal.skills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-[#061A4F] font-semibold rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {activeProfileModal.portfolio && activeProfileModal.portfolio.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-[#061A4F] mb-2">Portfolio Works</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProfileModal.portfolio.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <div className="font-bold text-[#061A4F]">{item.title}</div>
                        <div className="text-[10px] text-slate-500">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-3xl">
              <button
                onClick={() => {
                  setActiveProfileModal(null);
                  onNavigate('/client/messages');
                }}
                className="px-5 py-2.5 bg-[#061A4F] text-white hover:bg-[#0B2A6F] font-bold text-xs rounded-xl shadow transition"
              >
                Send Message / Offer Job
              </button>
              <button
                onClick={() => setActiveProfileModal(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
