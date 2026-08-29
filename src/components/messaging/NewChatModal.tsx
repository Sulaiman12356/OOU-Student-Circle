import React, { useState, useEffect } from 'react';
import { UserProfile, ConversationType, ConversationContext, UserRole } from '../../types';
import { MessagingStore } from '../../services/messagingStore';
import { FirestoreService } from '../../services/firestoreService';
import { UserAvatar } from '../common/UserAvatar';
import { 
  X, 
  Search, 
  Users, 
  Sparkles, 
  ShoppingBag, 
  Store, 
  Briefcase, 
  CheckCircle2,
  ArrowRight,
  Plus,
  Loader2,
  UserCheck
} from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onConversationCreated: (conversationId: string) => void;
}

interface PeerOption {
  id: string;
  name: string;
  role: UserRole;
  departmentOrCompany: string;
  photo?: string;
  type: ConversationType;
  topic?: string;
  isVerified?: boolean;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onConversationCreated
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ConversationType>('student_connect');
  const [customTopic, setCustomTopic] = useState('');
  const [realUsers, setRealUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    const loadUsers = async () => {
      try {
        const users = await FirestoreService.getAllUsers();
        if (isMounted) {
          setRealUsers(users.filter(u => u.id !== currentUser.id));
        }
      } catch (err) {
        console.warn('Failed to load registered peers:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUser.id]);

  if (!isOpen) return null;

  // Map real Firestore users to selectable PeerOptions
  const peers: PeerOption[] = realUsers.map(u => ({
    id: u.id,
    name: u.fullName || u.email.split('@')[0],
    role: u.role,
    departmentOrCompany: u.department || u.businessName || `${u.faculty || 'OOU Student'} (${u.level || 'Member'})`,
    photo: u.profilePhoto,
    type: u.role === 'client' ? 'job' : 'student_connect',
    topic: u.shortBio || u.businessDescription || (u.skills?.length ? `Skills: ${u.skills.slice(0, 3).join(', ')}` : undefined),
    isVerified: u.isVerified
  }));

  const filteredPeers = peers.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.departmentOrCompany.toLowerCase().includes(q) ||
        (p.topic && p.topic.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleStartChat = async (peer: PeerOption) => {
    if (isStarting) return;
    setIsStarting(true);

    try {
      const context: ConversationContext = {
        type: selectedType,
        initialTopic: customTopic.trim() || peer.topic || 'Direct Campus Chat'
      };

      const conv = await MessagingStore.getOrCreateConversation(
        currentUser.id,
        peer.id,
        selectedType,
        context,
        {
          name: currentUser.fullName,
          role: currentUser.role,
          photo: currentUser.profilePhoto,
          departmentOrCompany: currentUser.department || currentUser.businessName,
          isVerified: currentUser.isVerified,
          matricNumber: currentUser.matricNumber
        },
        {
          name: peer.name,
          role: peer.role as UserRole,
          photo: peer.photo,
          departmentOrCompany: peer.departmentOrCompany,
          isVerified: peer.isVerified
        }
      );

      onConversationCreated(conv.id);
      onClose();
    } catch (err) {
      console.error('Failed to initialize conversation:', err);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-[#061A4F]">
              <Plus className="w-5 h-5 text-[#F5B400]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#061A4F]">Start New Conversation</h3>
              <p className="text-xs text-slate-500">Connect with authenticated OOU students, providers, or clients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Type Picker */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setSelectedType('student_connect')}
            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
              selectedType === 'student_connect'
                ? 'bg-blue-50 border-blue-300 text-[#061A4F] font-black'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-[10px]">Connect</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('service')}
            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
              selectedType === 'service'
                ? 'bg-purple-50 border-purple-300 text-purple-900 font-black'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-[10px]">Service</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('marketplace')}
            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
              selectedType === 'marketplace'
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-black'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span className="text-[10px]">Marketplace</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('campus_service')}
            className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
              selectedType === 'campus_service'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-black'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px]">Campus Shop</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, matric, department, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
          />
        </div>

        {/* Optional Custom Topic */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">Subject / Project Reference (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Graphic Design Inquiry, Study Collab, Project Clearance..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
          />
        </div>

        {/* Peer Selection List */}
        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl">
          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#061A4F]" />
              <p className="text-xs font-medium">Looking up campus members...</p>
            </div>
          ) : filteredPeers.length > 0 ? (
            filteredPeers.map((peer) => (
              <div
                key={peer.id}
                onClick={() => handleStartChat(peer)}
                className="p-3 flex items-center justify-between gap-3 hover:bg-blue-50/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={peer.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={peer.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-extrabold text-[#061A4F] truncate">{peer.name}</h4>
                      {peer.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{peer.departmentOrCompany}</p>
                    {peer.topic && (
                      <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-0.5 max-w-[200px] truncate">
                        {peer.topic}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isStarting}
                  className="px-3 py-1.5 bg-[#061A4F] text-white hover:bg-[#0B2A6F] text-xs font-bold rounded-xl transition flex items-center gap-1 flex-shrink-0 disabled:opacity-50"
                >
                  <span>Message</span>
                  <ArrowRight className="w-3 h-3 text-[#F5B400]" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No other registered peers found</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Invite classmates or colleagues to register, or browse services & jobs in the marketplace to start chats!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
