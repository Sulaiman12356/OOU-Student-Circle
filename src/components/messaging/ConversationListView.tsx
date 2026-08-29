import React, { useState } from 'react';
import { Conversation, ConversationType, UserProfile } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { 
  Search, 
  MessageSquare, 
  Sparkles, 
  ShoppingBag, 
  Briefcase, 
  Store, 
  Users, 
  Pin, 
  CheckCheck, 
  Check, 
  CheckCircle2, 
  Filter,
  Plus
} from 'lucide-react';

interface ConversationListViewProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  currentUser: UserProfile;
  onSelectConversation: (conversationId: string) => void;
  onOpenNewChatModal?: () => void;
}

export const ConversationListView: React.FC<ConversationListViewProps> = ({
  conversations,
  selectedConversationId,
  currentUser,
  onSelectConversation,
  onOpenNewChatModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'connect' | 'services' | 'marketplace' | 'campus'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    // 1. Tab filter
    if (activeTab === 'connect' && c.type !== 'student_connect') return false;
    if (activeTab === 'services' && c.type !== 'service' && c.type !== 'job') return false;
    if (activeTab === 'marketplace' && c.type !== 'marketplace') return false;
    if (activeTab === 'campus' && c.type !== 'campus_service') return false;

    // 2. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const otherParticipantId = c.participants.find(id => id !== currentUser.id) || c.participants[0];
      const partner = c.participantDetails[otherParticipantId];
      const title = c.title || '';
      const lastMsg = c.lastMessage || '';
      const partnerName = partner?.name || '';
      const partnerDept = partner?.departmentOrCompany || '';

      return (
        title.toLowerCase().includes(q) ||
        lastMsg.toLowerCase().includes(q) ||
        partnerName.toLowerCase().includes(q) ||
        partnerDept.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPartner = (c: Conversation) => {
    const otherId = c.participants.find(id => id !== currentUser.id) || c.participants[0];
    return {
      id: otherId,
      details: c.participantDetails[otherId] || { name: 'StudentCircle User', role: 'student' }
    };
  };

  const formatTimestamp = (timestampStr: string) => {
    if (!timestampStr) return '';
    try {
      const date = new Date(timestampStr);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch {
      return '';
    }
  };

  const getTypeBadge = (type?: ConversationType) => {
    switch (type) {
      case 'student_connect':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            <Users className="w-2.5 h-2.5" />
            Connect
          </span>
        );
      case 'service':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
            <Sparkles className="w-2.5 h-2.5" />
            Service
          </span>
        );
      case 'marketplace':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
            <ShoppingBag className="w-2.5 h-2.5" />
            Marketplace
          </span>
        );
      case 'campus_service':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            <Store className="w-2.5 h-2.5" />
            Campus Shop
          </span>
        );
      case 'job':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
            <Briefcase className="w-2.5 h-2.5" />
            Opportunity
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden">
      
      {/* Header & New Chat button */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#061A4F]">Messages</h2>
            <p className="text-[11px] text-slate-500">Secure end-to-end communication</p>
          </div>

          {onOpenNewChatModal && (
            <button
              onClick={onOpenNewChatModal}
              className="p-2 bg-[#061A4F] text-white hover:bg-[#0B2A6F] rounded-xl transition shadow-xs flex items-center gap-1 text-xs font-bold"
              title="Start a new message"
            >
              <Plus className="w-4 h-4 text-[#F5B400]" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages, users, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#061A4F] focus:bg-white transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-xs ${
              activeTab === 'all' 
                ? 'bg-[#061A4F] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-xs ${
              activeTab === 'connect' 
                ? 'bg-[#061A4F] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Connect
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-xs ${
              activeTab === 'services' 
                ? 'bg-[#061A4F] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Services & Jobs
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-xs ${
              activeTab === 'marketplace' 
                ? 'bg-[#061A4F] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-xs ${
              activeTab === 'campus' 
                ? 'bg-[#061A4F] text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Campus Hub
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((c) => {
            const partner = getPartner(c);
            const isSelected = c.id === selectedConversationId;
            const unreadCount = c.unreadCounts?.[currentUser.id] || 0;
            const hasUnread = unreadCount > 0;

            return (
              <div
                key={c.id}
                onClick={() => onSelectConversation(c.id)}
                className={`p-3.5 sm:p-4 flex items-start gap-3 cursor-pointer transition relative group ${
                  isSelected 
                    ? 'bg-blue-50/80 border-l-4 border-l-[#061A4F]' 
                    : hasUnread 
                      ? 'bg-blue-50/30 hover:bg-slate-50' 
                      : 'hover:bg-slate-50'
                }`}
              >
                {/* Avatar with verified badge & status */}
                <div className="relative flex-shrink-0">
                  <UserAvatar
                    name={partner.details.name}
                    photoUrl={partner.details.photo}
                    size="md"
                  />
                  {partner.details.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                  {c.isPinned && (
                    <div className="absolute -top-1 -left-1 bg-[#F5B400] text-[#061A4F] p-0.5 rounded-full ring-1 ring-white shadow-2xs">
                      <Pin className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Conversation Body */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs sm:text-sm truncate flex items-center gap-1 ${
                      hasUnread ? 'font-black text-[#061A4F]' : 'font-bold text-slate-800'
                    }`}>
                      <span>{partner.details.name}</span>
                    </h4>
                    <span className={`text-[10px] whitespace-nowrap ${
                      hasUnread ? 'font-extrabold text-blue-600' : 'text-slate-400'
                    }`}>
                      {formatTimestamp(c.lastMessageTimestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getTypeBadge(c.type)}
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                      {partner.details.departmentOrCompany || partner.details.role}
                    </span>
                  </div>

                  <p className={`text-xs truncate ${
                    hasUnread ? 'font-bold text-slate-900' : 'text-slate-500'
                  }`}>
                    {c.lastMessageSenderId === currentUser.id && (
                      <span className="text-slate-400 font-normal">You: </span>
                    )}
                    {c.lastMessage}
                  </p>
                </div>

                {/* Unread Counter Pill */}
                {hasUnread && (
                  <div className="w-5 h-5 rounded-full bg-[#061A4F] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 self-center shadow-xs">
                    {unreadCount}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-700">No conversations found</div>
            <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">
              {searchQuery ? 'Try modifying your search keywords.' : 'Start a new conversation or explore campus services.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
