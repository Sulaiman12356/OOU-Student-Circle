import React, { useState } from 'react';
import { UserProfile, ConversationType, ConversationContext, UserRole } from '../../types';
import { MessagingStore } from '../../services/messagingStore';
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
  Plus
} from 'lucide-react';
import founderImage from '../../assets/images/founder_sulaiman.jpg';

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

  if (!isOpen) return null;

  // Potential mock peers available across OOU campuses
  const availablePeers: PeerOption[] = [
    {
      id: 'student-1',
      name: 'Onifade Sulaiman',
      role: 'student' as UserRole,
      departmentOrCompany: 'Computer Science (400L)',
      photo: founderImage,
      type: 'student_connect' as ConversationType,
      isVerified: true
    },
    {
      id: 'student-2',
      name: 'Adebayo Samuel',
      role: 'student' as UserRole,
      departmentOrCompany: 'Fine & Applied Arts (300L)',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      type: 'service' as ConversationType,
      topic: 'Brand Identity & UI Design Services',
      isVerified: true
    },
    {
      id: 'student-3',
      name: 'Maryam Adeola',
      role: 'student' as UserRole,
      departmentOrCompany: 'Mass Communication (300L)',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
      type: 'student_connect' as ConversationType,
      topic: 'Campus Social Media & Copywriting',
      isVerified: true
    },
    {
      id: 'student-4',
      name: 'Praise Daniel',
      role: 'student' as UserRole,
      departmentOrCompany: 'Biochemistry (300L)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      type: 'service' as ConversationType,
      topic: 'Campus Photography & Video Production',
      isVerified: false
    },
    {
      id: 'client-1',
      name: 'Johnson Peter',
      role: 'client' as UserRole,
      departmentOrCompany: 'Apex Brand Studio & Tech Hub',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      type: 'job' as ConversationType,
      topic: 'Hiring Student Developers & Designers',
      isVerified: true
    },
    {
      id: 'vendor-1',
      name: 'Campus Tech & Gadgets Hub',
      role: 'vendor' as unknown as UserRole,
      departmentOrCompany: 'Ago-Iwoye Main Gate Plaza',
      photo: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      type: 'marketplace' as ConversationType,
      topic: 'Laptops, Accessories & Phone Parts',
      isVerified: true
    },
    {
      id: 'shop-print-hub',
      name: 'Ago-Iwoye Fast Print & Tech Center',
      role: 'vendor' as unknown as UserRole,
      departmentOrCompany: 'Mini Campus Student Quad',
      photo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      type: 'campus_service' as ConversationType,
      topic: 'Project Binding, Color Printing & UTME Clearance',
      isVerified: true
    }
  ].filter(p => p.id !== currentUser.id);

  const filteredPeers = availablePeers.filter(p => {
    if (selectedType && p.type !== selectedType && selectedType !== 'direct') {
      // allow flexible search
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.departmentOrCompany.toLowerCase().includes(q) || (p.topic && p.topic.toLowerCase().includes(q));
    }
    return true;
  });

  const handleStartChat = (peer: PeerOption) => {
    const context: ConversationContext = {
      type: peer.type,
      initialTopic: customTopic.trim() || peer.topic || 'Direct Conversation'
    };

    const conv = MessagingStore.getOrCreateConversation(
      currentUser.id,
      peer.id,
      peer.type,
      context,
      {
        name: currentUser.fullName,
        role: currentUser.role,
        photo: currentUser.profilePhoto,
        departmentOrCompany: currentUser.department || currentUser.businessName
      },
      {
        name: peer.name,
        role: peer.role as UserRole,
        photo: peer.photo,
        departmentOrCompany: peer.departmentOrCompany
      }
    );

    onConversationCreated(conv.id);
    onClose();
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
              <p className="text-xs text-slate-500">Connect with students, providers, vendors, or campus shops</p>
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
            placeholder="Search by student name, skill, shop, or department..."
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
            placeholder="e.g. Logo Design, Past Questions, MacBook Charger..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#061A4F]"
          />
        </div>

        {/* Peer Selection List */}
        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl">
          {filteredPeers.map((peer) => (
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
                    <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                      {peer.topic}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="px-3 py-1.5 bg-[#061A4F] text-white hover:bg-[#0B2A6F] text-xs font-bold rounded-xl transition flex items-center gap-1 flex-shrink-0"
              >
                <span>Message</span>
                <ArrowRight className="w-3 h-3 text-[#F5B400]" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
