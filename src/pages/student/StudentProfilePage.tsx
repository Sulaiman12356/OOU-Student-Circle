import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { CampusStore } from '../../services/campusStore';
import { 
  UserProfile, 
  PortfolioItem, 
  StudentAchievement, 
  StudentEducation, 
  StudentLevel, 
  ServiceItem 
} from '../../types';
import { ProfileCompletenessCard } from '../../components/profile/ProfileCompletenessCard';
import { ProfilePhotoUploader } from '../../components/profile/ProfilePhotoUploader';
import { CoverPhotoUploader } from '../../components/profile/CoverPhotoUploader';
import { PortfolioManager } from '../../components/profile/PortfolioManager';
import { SkillsAndInterestsEditor } from '../../components/profile/SkillsAndInterestsEditor';
import { AchievementsAndEducationEditor } from '../../components/profile/AchievementsAndEducationEditor';
import { PublicStudentProfileView } from '../../components/profile/PublicStudentProfileView';
import { 
  Save, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  Briefcase, 
  Sparkles, 
  GraduationCap, 
  ExternalLink,
  Plus,
  ShieldCheck,
  Building,
  MapPin,
  Layers
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUserProfile } = useAuth();

  // Mode: 'edit' or 'preview'
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // Form Fields
  const [fullName, setFullName] = useState<string>(currentUser?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser?.phoneNumber || '');
  const [profilePhoto, setProfilePhoto] = useState<string>(currentUser?.profilePhoto || '');
  const [coverPhoto, setCoverPhoto] = useState<string>(currentUser?.coverPhoto || '');
  const [location, setLocation] = useState<string>(currentUser?.location || 'Ago-Iwoye (Main Campus)');
  const [faculty, setFaculty] = useState<string>(currentUser?.faculty || 'Faculty of Science');
  const [department, setDepartment] = useState<string>(currentUser?.department || 'Computer Science');
  const [level, setLevel] = useState<StudentLevel>(currentUser?.level || '300L');
  const [matricNumber, setMatricNumber] = useState<string>(currentUser?.matricNumber || 'CSC/2021/0482');
  const [shortBio, setShortBio] = useState<string>(currentUser?.shortBio || '');
  const [availableForWork, setAvailableForWork] = useState<boolean>(currentUser?.availableForWork ?? true);

  // Arrays
  const [skills, setSkills] = useState<string[]>(currentUser?.skills || ['Web Development', 'React', 'TypeScript', 'UI/UX Design']);
  const [interests, setInterests] = useState<string[]>(currentUser?.interests || ['Tech Innovation', 'Campus Startups', 'Artificial Intelligence']);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(currentUser?.portfolio || [
    {
      id: 'p-1',
      title: 'OOU Campus Marketplace & Service Hub',
      description: 'Modern full-stack student service portal and marketplace built with React and Tailwind CSS.',
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      category: 'Web & Software Development',
      date: 'May 2024',
      projectUrl: 'https://github.com/example/oou-portal'
    }
  ]);
  const [achievements, setAchievements] = useState<StudentAchievement[]>(currentUser?.achievements || [
    {
      id: 'ach-1',
      title: 'Best Student Developer Award 2024',
      issuer: 'NACOSS OOU Chapter',
      date: '2024',
      description: 'Awarded for outstanding contribution to student digital infrastructure and open source tools.'
    }
  ]);
  const [education, setEducation] = useState<StudentEducation[]>(currentUser?.education || [
    {
      id: 'edu-1',
      degree: 'B.Sc. Computer Science',
      institution: 'Olabisi Onabanjo University',
      fieldOfStudy: 'Computer Science',
      startYear: '2021',
      endYear: '2025 (Expected)',
      isCurrent: true
    }
  ]);

  // Real Published Services for this student (Auto-referenced, no duplication)
  const [userServices, setUserServices] = useState<ServiceItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state if currentUser changes from AuthContext
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setProfilePhoto(currentUser.profilePhoto || '');
      setCoverPhoto(currentUser.coverPhoto || '');
      setLocation(currentUser.location || 'Ago-Iwoye (Main Campus)');
      setFaculty(currentUser.faculty || 'Faculty of Science');
      setDepartment(currentUser.department || 'Computer Science');
      setLevel(currentUser.level || '300L');
      setMatricNumber(currentUser.matricNumber || 'CSC/2021/0482');
      setShortBio(currentUser.shortBio || '');
      setAvailableForWork(currentUser.availableForWork ?? true);
      if (currentUser.skills) setSkills(currentUser.skills);
      if (currentUser.interests) setInterests(currentUser.interests);
      if (currentUser.portfolio) setPortfolio(currentUser.portfolio);
      if (currentUser.achievements) setAchievements(currentUser.achievements);
      if (currentUser.education) setEducation(currentUser.education);
    }
  }, [currentUser]);

  // Load published services for current student
  useEffect(() => {
    if (currentUser?.id) {
      const allServices = DataStore.getServices();
      const studentServices = allServices.filter(s => s.studentId === currentUser.id || s.studentId === 'student-1');
      setUserServices(studentServices);
    }
  }, [currentUser]);

  const activeUserProfile: UserProfile = {
    id: currentUser?.id || 'student-1',
    email: currentUser?.email || 'student@ooustudentcircle.com',
    role: currentUser?.role || 'student',
    fullName,
    phoneNumber,
    profilePhoto,
    coverPhoto,
    location,
    faculty,
    department,
    level,
    matricNumber,
    shortBio,
    availableForWork,
    skills,
    interests,
    portfolio,
    achievements,
    education,
    isVerified: currentUser?.isVerified ?? true,
    verificationStatus: currentUser?.verificationStatus || 'verified',
    status: currentUser?.status || 'active',
    rating: currentUser?.rating || 4.9,
    reviewsCount: currentUser?.reviewsCount || 14,
    completedJobsCount: currentUser?.completedJobsCount || 14,
    totalEarnings: currentUser?.totalEarnings || 95000,
    createdAt: currentUser?.createdAt || '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const updatedData: Partial<UserProfile> = {
      fullName,
      phoneNumber,
      profilePhoto,
      coverPhoto,
      location,
      faculty,
      department,
      level,
      matricNumber,
      shortBio,
      availableForWork,
      skills,
      interests,
      portfolio,
      achievements,
      education
    };

    updateCurrentUserProfile(updatedData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header & Mode Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#061A4F] tracking-tight">
              Student Professional Profile
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#061A4F] text-[10px] font-black rounded-full border border-blue-200">
              Identity & Portfolio
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build your verified campus identity, showcase portfolio work from your device, and attract student & local client projects.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-1 bg-slate-100 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition flex items-center gap-1.5 ${
                viewMode === 'edit'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#061A4F]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition flex items-center gap-1.5 ${
                viewMode === 'preview'
                  ? 'bg-[#061A4F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#061A4F]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>View Public Profile</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-5 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-2xl shadow-md transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Floating Save Toast */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-100" />
          <span>Professional profile saved and updated live!</span>
        </div>
      )}

      {/* VIEW 1: PUBLIC PREVIEW MODE */}
      {viewMode === 'preview' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-[#061A4F] font-bold">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#061A4F]" />
              <span>Preview Mode: This is exactly how clients and peer students see your verified OOU professional page.</span>
            </span>
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className="text-xs font-black text-[#061A4F] hover:underline"
            >
              Back to Editing →
            </button>
          </div>

          <PublicStudentProfileView
            user={activeUserProfile}
            services={userServices}
            isOwner={true}
            onEditProfile={() => setViewMode('edit')}
          />
        </div>
      )}

      {/* VIEW 2: EDIT PROFILE MODE */}
      {viewMode === 'edit' && (
        <form onSubmit={handleSave} className="space-y-8">
          {/* Milestone Completeness Card */}
          <ProfileCompletenessCard
            user={activeUserProfile}
            servicesCount={userServices.length}
            onNavigateToSection={handleNavigateToSection}
          />

          {/* Section 1: Media (Cover & Avatar with Device Uploaders) */}
          <div id="photo" className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-[#061A4F] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5B400]" />
              <span>Profile Photos & Visual Branding</span>
            </h3>

            {/* 1. Cover Photo Uploader */}
            <CoverPhotoUploader
              currentCoverUrl={coverPhoto}
              userId={currentUser?.id || 'student-1'}
              onCoverChange={(url) => setCoverPhoto(url)}
              onCoverRemove={() => setCoverPhoto('')}
            />

            <hr className="border-slate-100" />

            {/* 2. Profile Photo Uploader */}
            <ProfilePhotoUploader
              currentPhotoUrl={profilePhoto}
              userId={currentUser?.id || 'student-1'}
              onPhotoChange={(url) => setProfilePhoto(url)}
              onPhotoRemove={() => setProfilePhoto('')}
            />
          </div>

          {/* Section 2: Professional Availability Mode */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-[#061A4F]">
                  Professional Mode: &ldquo;Available for Work&rdquo;
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                When active, your profile displays an active availability badge and highlights your services in search.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={availableForWork}
                onChange={(e) => setAvailableForWork(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-3 text-xs font-black text-[#061A4F]">
                {availableForWork ? 'Available' : 'Unavailable'}
              </span>
            </label>
          </div>

          {/* Section 3: Academic & Personal Information */}
          <div id="department" className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-[#061A4F] uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#061A4F]" />
              <span>Academic & Student Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">OOU Matriculation Number *</label>
                <input
                  type="text"
                  required
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  placeholder="e.g. CSC/2021/0482"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Faculty *</label>
                <input
                  type="text"
                  required
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  placeholder="e.g. Faculty of Science"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Department / Course *</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Academic Level *</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as StudentLevel)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
                >
                  <option value="100L">100L</option>
                  <option value="200L">200L</option>
                  <option value="300L">300L</option>
                  <option value="400L">400L</option>
                  <option value="500L">500L</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>

              <div id="campus" className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">OOU Campus Location *</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
                >
                  <option value="Ago-Iwoye (Main Campus)">Ago-Iwoye (Main Campus)</option>
                  <option value="Ago-Iwoye (Mini Campus)">Ago-Iwoye (Mini Campus)</option>
                  <option value="Sagamu Medical Campus">Sagamu Medical Campus</option>
                  <option value="Ayetoro Agricultural Campus">Ayetoro Agricultural Campus</option>
                  <option value="Ibogun Engineering Campus">Ibogun Engineering Campus</option>
                  <option value="Ijebu-Ode Extension">Ijebu-Ode Extension</option>
                  <option value="Remote / Online">Remote / Online</option>
                </select>
              </div>
            </div>

            <div id="bio" className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700">
                Professional Bio & Value Statement
              </label>
              <textarea
                rows={3}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="Share your passion, key tools you master (e.g. Figma, Python, React), past student leadership roles, and how you help peers or clients..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
              />
            </div>
          </div>

          {/* Section 4: Skills & Interests Editor */}
          <div id="skills">
            <SkillsAndInterestsEditor
              skills={skills}
              interests={interests}
              onSkillsChange={(newSkills) => setSkills(newSkills)}
              onInterestsChange={(newInterests) => setInterests(newInterests)}
            />
          </div>

          {/* Section 5: Portfolio Manager (Multiple Image Device Uploader) */}
          <div id="portfolio">
            <PortfolioManager
              portfolio={portfolio}
              userId={currentUser?.id || 'student-1'}
              onChange={(newPortfolio) => setPortfolio(newPortfolio)}
            />
          </div>

          {/* Section 6: Published Services (Auto-referenced) */}
          <div id="service" className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#061A4F] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#F5B400]" />
                  <span>My Published Services ({userServices.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published freelance services are automatically displayed on your professional profile.
                </p>
              </div>

              <a
                href="/student/services"
                className="px-3.5 py-1.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Manage Services</span>
              </a>
            </div>

            {userServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {userServices.map((service) => (
                  <div key={service.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="font-extrabold text-xs text-[#061A4F] line-clamp-1">{service.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs font-bold">
                      <span className="text-[#061A4F]">₦{service.startingPrice?.toLocaleString()}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Published</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <p className="text-xs text-slate-600 font-semibold">No services published under your account yet.</p>
                <p className="text-[11px] text-slate-400">Publish a service to allow campus clients and peers to hire you directly.</p>
              </div>
            )}
          </div>

          {/* Section 7: Achievements & Education */}
          <AchievementsAndEducationEditor
            achievements={achievements}
            education={education}
            onAchievementsChange={(newAch) => setAchievements(newAch)}
            onEducationChange={(newEdu) => setEducation(newEdu)}
          />

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm sticky bottom-4 z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-600">All changes ready to be saved</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#061A4F] text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-[#F5B400]" />
                <span>Save All Profile Updates</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
