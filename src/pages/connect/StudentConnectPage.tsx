import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  PublicStudentProfile, 
  ConnectionRequest, 
  StudentConnectFilter, 
  SmartRecommendations, 
  ConnectTab,
  StudentPrivacySettings 
} from '../../types/studentConnect';
import { CampusLocation } from '../../types/campus';
import { UserProfile } from '../../types';
import { DataStore } from '../../services/dataStore';
import { CampusStore } from '../../services/campusStore';
import { StudentConnectStore, defaultPrivacySettings } from '../../services/studentConnectStore';
import { StudentCard } from '../../components/connect/StudentCard';
import { StudentProfileModal } from '../../components/connect/StudentProfileModal';
import { ConnectionRequestsTab } from '../../components/connect/ConnectionRequestsTab';
import { MyConnectionsTab } from '../../components/connect/MyConnectionsTab';
import { StudentConnectFilterDrawer } from '../../components/connect/StudentConnectFilterDrawer';
import { StudentPrivacyModal } from '../../components/connect/StudentPrivacyModal';
import { 
  Search, 
  Filter, 
  Users, 
  UserCheck, 
  Inbox, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  SlidersHorizontal, 
  Shield, 
  UserPlus, 
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface StudentConnectPageProps {
  onNavigate: (path: string) => void;
  onOpenDirectChat?: (recipientId: string, recipientName: string, recipientRole: string) => void;
  initialTab?: ConnectTab;
}

const defaultFilters: StudentConnectFilter = {
  search: '',
  campus: 'all',
  faculty: 'all',
  department: 'all',
  level: 'all',
  skill: 'all',
  interest: 'all',
  onlyVerified: false,
  availableForWork: false
};

export const StudentConnectPage: React.FC<StudentConnectPageProps> = ({
  onNavigate,
  onOpenDirectChat,
  initialTab = 'explore'
}) => {
  const { currentUser } = useAuth();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<ConnectTab>(initialTab);

  // Data States
  const [students, setStudents] = useState<PublicStudentProfile[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendations>({
    nearCampus: [],
    similarSkills: [],
    inDepartment: [],
    youMayKnow: []
  });
  const [myConnections, setMyConnections] = useState<PublicStudentProfile[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>([]);
  const [campusLocations, setCampusLocations] = useState<CampusLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter and Search State with Debounce
  const [rawSearchInput, setRawSearchInput] = useState<string>('');
  const [filters, setFilters] = useState<StudentConnectFilter>(defaultFilters);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [userPrivacy, setUserPrivacy] = useState<StudentPrivacySettings>(defaultPrivacySettings);

  // Modal / Student detail state
  const [selectedStudent, setSelectedStudent] = useState<PublicStudentProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, 'self' | 'connected' | 'pending_sent' | 'pending_received' | 'not_connected'>>({});
  const [loadingConnectId, setLoadingConnectId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Note dialog state for sending request
  const [connectPromptTarget, setConnectPromptTarget] = useState<PublicStudentProfile | null>(null);
  const [connectNote, setConnectNote] = useState<string>('');

  // 1. Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: rawSearchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [rawSearchInput]);

  // 2. Initial Data Loading
  const loadData = async () => {
    setLoading(true);
    try {
      // Load Campus Locations
      const campuses = CampusStore.getLocations();
      setCampusLocations(campuses.filter(c => c.status === 'Active' || c.isActive !== false));

      // Load Privacy Settings if user is logged in
      if (currentUser?.id) {
        const priv = await StudentConnectStore.getPrivacySettings(currentUser.id);
        setUserPrivacy(priv);

        // Load Connections & Requests
        const conns = await StudentConnectStore.getMyConnections(currentUser.id);
        setMyConnections(conns);

        const { incoming, outgoing } = await StudentConnectStore.getUserRequests(currentUser.id);
        setIncomingRequests(incoming);
        setOutgoingRequests(outgoing);
      }

      // Load Recommendations
      const recs = await StudentConnectStore.getSmartRecommendations(currentUser);
      setRecommendations(recs);

      // Load Students with current filters
      const allStudents = await StudentConnectStore.getStudents(filters);
      setStudents(allStudents);

      // Cache connection status map
      if (currentUser?.id) {
        const statuses: Record<string, any> = {};
        for (const s of allStudents) {
          statuses[s.id] = await StudentConnectStore.getConnectionStatus(currentUser.id, s.id);
        }
        setConnectionStatuses(statuses);
      }
    } catch (err) {
      console.warn('Error loading student connect data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, currentUser?.id]);

  // Quick Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Connection Handler
  const handleInitiateConnect = (student: PublicStudentProfile) => {
    if (!currentUser) {
      showToast('Please sign in with your OOU student account to connect.');
      onNavigate('/auth/login');
      return;
    }

    if (currentUser.id === student.id) {
      showToast('You cannot send a connection request to yourself.');
      return;
    }

    // Open brief note dialog or send direct request
    setConnectPromptTarget(student);
    setConnectNote('');
  };

  const handleSendConnectionRequest = async () => {
    if (!currentUser || !connectPromptTarget) return;

    setLoadingConnectId(connectPromptTarget.id);
    try {
      const res = await StudentConnectStore.sendConnectionRequest(
        currentUser,
        connectPromptTarget.id,
        connectNote
      );

      if (res.success) {
        showToast(`Connection request sent to ${connectPromptTarget.fullName.split(' ')[0]}!`);
        // Update connection status
        setConnectionStatuses(prev => ({
          ...prev,
          [connectPromptTarget.id]: 'pending_sent'
        }));
        // Update outgoing list
        const { outgoing } = await StudentConnectStore.getUserRequests(currentUser.id);
        setOutgoingRequests(outgoing);
      } else {
        showToast(res.message);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to send connection request.');
    } finally {
      setLoadingConnectId(null);
      setConnectPromptTarget(null);
    }
  };

  // Respond to Request (Accept / Decline)
  const handleRespondToRequest = async (requestId: string, action: 'accept' | 'decline') => {
    if (!currentUser) return;
    try {
      const res = await StudentConnectStore.respondToRequest(requestId, currentUser.id, action);
      showToast(res.message);
      
      // Refresh requests & connections
      const { incoming, outgoing } = await StudentConnectStore.getUserRequests(currentUser.id);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);

      const conns = await StudentConnectStore.getMyConnections(currentUser.id);
      setMyConnections(conns);

      // Refresh connection statuses
      const all = await StudentConnectStore.getStudents(filters);
      const statuses: Record<string, any> = {};
      for (const s of all) {
        statuses[s.id] = await StudentConnectStore.getConnectionStatus(currentUser.id, s.id);
      }
      setConnectionStatuses(statuses);
    } catch (err: any) {
      showToast(err?.message || 'Failed to process request.');
    }
  };

  // Cancel Request
  const handleCancelRequest = async (requestId: string) => {
    if (!currentUser) return;
    try {
      const res = await StudentConnectStore.cancelRequest(requestId, currentUser.id);
      showToast(res.message);
      const { outgoing } = await StudentConnectStore.getUserRequests(currentUser.id);
      setOutgoingRequests(outgoing);
      
      // Refresh connection statuses
      const all = await StudentConnectStore.getStudents(filters);
      const statuses: Record<string, any> = {};
      for (const s of all) {
        statuses[s.id] = await StudentConnectStore.getConnectionStatus(currentUser.id, s.id);
      }
      setConnectionStatuses(statuses);
    } catch (err: any) {
      showToast(err?.message || 'Failed to cancel request.');
    }
  };

  // Remove Connection
  const handleRemoveConnection = async (targetUserId: string) => {
    if (!currentUser) return;
    try {
      const res = await StudentConnectStore.removeConnection(currentUser.id, targetUserId);
      showToast(res.message);
      const conns = await StudentConnectStore.getMyConnections(currentUser.id);
      setMyConnections(conns);

      setConnectionStatuses(prev => ({
        ...prev,
        [targetUserId]: 'not_connected'
      }));
    } catch (err: any) {
      showToast(err?.message || 'Failed to remove connection.');
    }
  };

  // View Profile Modal
  const handleViewProfile = async (student: PublicStudentProfile) => {
    const full = await StudentConnectStore.getStudentById(student.id);
    setSelectedStudent(full || student);
    setIsProfileModalOpen(true);
  };

  // Direct Message Routing
  const handleMessage = (student: PublicStudentProfile) => {
    if (!currentUser) {
      showToast('Please sign in to start a message.');
      onNavigate('/auth/login');
      return;
    }

    if (onOpenDirectChat) {
      onOpenDirectChat(student.id, student.fullName, 'student');
    } else {
      onNavigate(`/student/messages?recipient=${student.id}`);
    }
  };

  // Update Privacy Settings
  const handleSavePrivacy = async (updated: Partial<StudentPrivacySettings>) => {
    if (!currentUser) return;
    await StudentConnectStore.updatePrivacySettings(currentUser.id, updated);
    setUserPrivacy(prev => ({ ...prev, ...updated }));
    showToast('Privacy settings saved.');
  };

  // Active filter count
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
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#061A4F] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#F5B400]/40 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4 text-[#F5B400]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="bg-gradient-to-b from-[#061A4F] to-[#0B2A6F] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#F5B400_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#F5B400] rounded-full text-xs font-bold mb-3 backdrop-blur-xs border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OOU Campus Networking & Collaboration</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Student Connect
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed font-normal">
                Discover, connect, collaborate, and grow with verified OOU students across all 5 campuses. Connect • Collaborate • Learn • Work • Grow.
              </p>
            </div>

            {/* Privacy & Profile CTA */}
            {currentUser && (
              <div className="flex items-center gap-3 self-start md:self-center">
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/10"
                >
                  <Shield className="w-4 h-4 text-[#F5B400]" />
                  <span>Privacy Settings</span>
                </button>

                <button
                  onClick={() => onNavigate('/student/settings')}
                  className="px-4 py-2.5 bg-[#F5B400] hover:bg-[#E5A800] text-[#061A4F] rounded-xl text-xs font-black transition shadow-sm"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Quick Pillar Value Bar */}
          <div className="grid grid-cols-5 gap-2 mt-8 pt-6 border-t border-white/10 text-center">
            {['Connect', 'Collaborate', 'Learn', 'Work', 'Grow'].map((pillar, idx) => (
              <div key={idx} className="py-1.5 px-2 bg-white/5 rounded-lg border border-white/5">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#F5B400]">
                  {pillar}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Search & Navigation Bar Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-md mb-8">
          
          {/* Top Row: Search Input + Campus Select + Filter Button */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            
            {/* Search Input with debounced keystrokes */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={rawSearchInput}
                onChange={(e) => setRawSearchInput(e.target.value)}
                placeholder="Search students by name, department, faculty, level, campus, skill, or interest..."
                className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#061A4F]"
              />
              {rawSearchInput && (
                <button 
                  onClick={() => setRawSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dynamic Campus Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[170px] sm:min-w-[200px]">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F5B400]" />
                <select
                  value={filters.campus}
                  onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#061A4F] appearance-none"
                >
                  <option value="all">All 5 Campuses</option>
                  {campusLocations.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name.split('(')[0].trim()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Drawer Trigger */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                  activeFilterCount > 0
                    ? 'bg-[#061A4F] text-white border-[#061A4F]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#F5B400] text-[#061A4F] text-[10px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Tabs Row */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 overflow-x-auto no-scrollbar">
            
            {/* Tab 1: Discover & Directory */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'explore'
                  ? 'bg-[#061A4F] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 text-[#F5B400]" />
              <span>Student Directory</span>
            </button>

            {/* Tab 2: Suggested Connections */}
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'suggestions'
                  ? 'bg-[#061A4F] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#F5B400]" />
              <span>Smart Suggestions</span>
            </button>

            {/* Tab 3: My Connections */}
            <button
              onClick={() => {
                if (!currentUser) {
                  showToast('Please sign in to view your connections.');
                  onNavigate('/auth/login');
                  return;
                }
                setActiveTab('connections');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'connections'
                  ? 'bg-[#061A4F] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-[#F5B400]" />
              <span>My Connections</span>
              {myConnections.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-800">
                  {myConnections.length}
                </span>
              )}
            </button>

            {/* Tab 4: Connection Requests */}
            <button
              onClick={() => {
                if (!currentUser) {
                  showToast('Please sign in to view your requests.');
                  onNavigate('/auth/login');
                  return;
                }
                setActiveTab('requests');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-[#061A4F] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Inbox className="w-4 h-4 text-[#F5B400]" />
              <span>Requests</span>
              {incomingRequests.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500 text-white animate-pulse">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Full Directory with Search & Filters */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#061A4F]">OOU Student Directory</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Showing verified students and peers across Ago-Iwoye, Ibogun, Ayetoro, and Sagamu.
                </p>
              </div>
              <div className="text-xs font-bold text-slate-600">
                {students.length} {students.length === 1 ? 'Student' : 'Students'}
              </div>
            </div>

            {/* Students Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse p-5"></div>
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-20 px-6 bg-white rounded-3xl border border-slate-200 shadow-2xs">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 text-[#061A4F] flex items-center justify-center mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Student Connect is growing.
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  Be one of the first students to complete your profile, showcase your skills, and connect with peers across all 5 OOU campuses.
                </p>
                <button
                  onClick={() => {
                    if (currentUser) {
                      onNavigate('/student/settings');
                    } else {
                      onNavigate('/auth/register');
                    }
                  }}
                  className="px-6 py-3 text-xs font-extrabold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition shadow-sm inline-flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-[#F5B400]" />
                  <span>Complete My Profile</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    connectionStatus={connectionStatuses[student.id] || 'not_connected'}
                    onConnect={handleInitiateConnect}
                    onViewProfile={handleViewProfile}
                    onMessage={handleMessage}
                    loadingConnect={loadingConnectId === student.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Smart Discovery & Suggested Connections */}
        {activeTab === 'suggestions' && (
          <div className="space-y-10">
            
            {/* Section 1: People Near Your Campus */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-blue-50 text-[#061A4F]">
                  <MapPin className="w-4 h-4 text-[#F5B400]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#061A4F]">People Near Your Campus</h3>
                  <p className="text-xs text-slate-500">Students studying at your location or nearby campuses</p>
                </div>
              </div>

              {recommendations.nearCampus.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500">
                  No student recommendations available yet for your campus.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendations.nearCampus.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      connectionStatus={connectionStatuses[student.id] || 'not_connected'}
                      onConnect={handleInitiateConnect}
                      onViewProfile={handleViewProfile}
                      onMessage={handleMessage}
                      loadingConnect={loadingConnectId === student.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: People In Your Department */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-blue-50 text-[#061A4F]">
                  <GraduationCap className="w-4 h-4 text-[#061A4F]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#061A4F]">People In Your Department & Faculty</h3>
                  <p className="text-xs text-slate-500">Peers studying the same or related academic courses</p>
                </div>
              </div>

              {recommendations.inDepartment.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500">
                  No student recommendations available yet in this department.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendations.inDepartment.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      connectionStatus={connectionStatuses[student.id] || 'not_connected'}
                      onConnect={handleInitiateConnect}
                      onViewProfile={handleViewProfile}
                      onMessage={handleMessage}
                      loadingConnect={loadingConnectId === student.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: People With Similar Skills */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-blue-50 text-[#061A4F]">
                  <Sparkles className="w-4 h-4 text-[#F5B400]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#061A4F]">People With Similar Skills</h3>
                  <p className="text-xs text-slate-500">Collaborate with peers in development, design, and writing</p>
                </div>
              </div>

              {recommendations.similarSkills.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500">
                  No student recommendations available yet with similar skills.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendations.similarSkills.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      connectionStatus={connectionStatuses[student.id] || 'not_connected'}
                      onConnect={handleInitiateConnect}
                      onViewProfile={handleViewProfile}
                      onMessage={handleMessage}
                      loadingConnect={loadingConnectId === student.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: People You May Know */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-blue-50 text-[#061A4F]">
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#061A4F]">People You May Know</h3>
                  <p className="text-xs text-slate-500">Active student contributors across the university community</p>
                </div>
              </div>

              {recommendations.youMayKnow.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500">
                  No student recommendations available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recommendations.youMayKnow.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      connectionStatus={connectionStatuses[student.id] || 'not_connected'}
                      onConnect={handleInitiateConnect}
                      onViewProfile={handleViewProfile}
                      onMessage={handleMessage}
                      loadingConnect={loadingConnectId === student.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: My Connections */}
        {activeTab === 'connections' && (
          <MyConnectionsTab
            connections={myConnections}
            onViewProfile={handleViewProfile}
            onMessage={handleMessage}
            onRemoveConnection={handleRemoveConnection}
            onExploreClick={() => setActiveTab('explore')}
          />
        )}

        {/* Tab 4: Connection Requests */}
        {activeTab === 'requests' && (
          <ConnectionRequestsTab
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            onRespond={handleRespondToRequest}
            onCancelRequest={handleCancelRequest}
            onViewStudent={async (studentId) => {
              const s = await StudentConnectStore.getStudentById(studentId);
              if (s) handleViewProfile(s);
            }}
            onExploreClick={() => setActiveTab('explore')}
          />
        )}
      </div>

      {/* Connect with Optional Note Dialog */}
      {connectPromptTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-[#061A4F]">
                <UserPlus className="w-5 h-5 text-[#F5B400]" />
              </div>
              <div>
                <h3 className="font-black text-sm text-[#061A4F]">
                  Connect with {connectPromptTarget.fullName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {connectPromptTarget.department || 'Student'} • {connectPromptTarget.location}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Add an optional collaboration note:
              </label>
              <textarea
                value={connectNote}
                onChange={(e) => setConnectNote(e.target.value)}
                placeholder="e.g. Hi! I saw your work on web development and would love to collaborate on campus projects."
                rows={3}
                className="w-full p-3 text-xs text-slate-800 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#061A4F]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setConnectPromptTarget(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendConnectionRequest}
                disabled={loadingConnectId === connectPromptTarget.id}
                className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#061A4F] hover:bg-[#0B2A6F] rounded-xl transition shadow-2xs flex items-center gap-1.5"
              >
                {loadingConnectId === connectPromptTarget.id ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Drawer */}
      <StudentConnectFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onChange={(updated) => setFilters(prev => ({ ...prev, ...updated }))}
        onReset={() => setFilters(defaultFilters)}
      />

      {/* Profile Privacy Modal */}
      <StudentPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        currentSettings={userPrivacy}
        onSave={handleSavePrivacy}
      />

      {/* Detailed Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudent}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedStudent(null);
        }}
        connectionStatus={
          selectedStudent ? (connectionStatuses[selectedStudent.id] || 'not_connected') : 'not_connected'
        }
        onConnect={handleInitiateConnect}
        onMessage={handleMessage}
        loadingConnect={selectedStudent ? loadingConnectId === selectedStudent.id : false}
      />
    </div>
  );
};
