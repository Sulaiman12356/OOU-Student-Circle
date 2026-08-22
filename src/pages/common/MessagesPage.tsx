import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Conversation, UserProfile } from '../../types';
import { MessagingStore } from '../../services/messagingStore';
import { ConversationListView } from '../../components/messaging/ConversationListView';
import { ChatAreaView } from '../../components/messaging/ChatAreaView';
import { ConversationContextDrawer } from '../../components/messaging/ConversationContextDrawer';
import { NewChatModal } from '../../components/messaging/NewChatModal';
import { MessagingTestHarness } from '../../components/messaging/MessagingTestHarness';
import { 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Lock, 
  HelpCircle,
  Plus
} from 'lucide-react';

interface MessagesPageProps {
  onNavigate?: (path: string) => void;
  initialConversationId?: string;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ 
  onNavigate,
  initialConversationId 
}) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConversationId || null);
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(true);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'chat' | 'test_studio'>('chat');
  const [mobileActiveView, setMobileActiveView] = useState<'list' | 'chat'>('list');

  // Fallback demo user if currentUser is not yet loaded
  const effectiveUser: UserProfile = currentUser || {
    id: 'student-1',
    fullName: 'Onifade Sulaiman',
    email: 'sulaiman@ooustudentcircle.com',
    role: 'student',
    phoneNumber: '+234 812 345 6789',
    location: 'Ago-Iwoye Main Campus',
    isVerified: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  useEffect(() => {
    if (!effectiveUser?.id) return;

    // Initialize real-time synchronization with Firestore
    const cleanupSync = MessagingStore.initializeUserSync(effectiveUser.id);

    // Initial fetch of conversations for current user
    const userConvs = MessagingStore.getConversationsForUser(effectiveUser.id);
    setConversations(userConvs);

    if (!selectedConvId && userConvs.length > 0) {
      setSelectedConvId(userConvs[0].id);
    }

    // Subscribe to realtime conversation changes
    const unsubscribe = MessagingStore.subscribeConversations((allConvs) => {
      const filtered = allConvs.filter(c => c.participants.includes(effectiveUser.id));
      setConversations(filtered);
      if (selectedConvId && !filtered.some(c => c.id === selectedConvId)) {
        if (filtered.length > 0) {
          setSelectedConvId(filtered[0].id);
        }
      }
    });

    return () => {
      cleanupSync();
      unsubscribe();
    };
  }, [effectiveUser.id, selectedConvId]);

  const selectedConversation = selectedConvId 
    ? MessagingStore.getConversationById(selectedConvId, effectiveUser.id)
    : null;

  const handleSelectConversation = (convId: string) => {
    setSelectedConvId(convId);
    setMobileActiveView('chat');
    setActiveViewMode('chat');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Bar Header & Workspace Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#061A4F]">
              StudentCircle Secure Messaging
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Participant Protected
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Realtime messaging with student peers, service providers, marketplace vendors & campus shops.
          </p>
        </div>

        {/* Action Toggle (Chat vs Test Studio) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveViewMode('chat')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'chat'
                  ? 'bg-white text-[#061A4F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Inbox & Chat</span>
            </button>

            <button
              onClick={() => setActiveViewMode('test_studio')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeViewMode === 'test_studio'
                  ? 'bg-white text-[#061A4F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>E2E Test Studio</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="px-3.5 py-2 bg-[#061A4F] text-white hover:bg-[#0B2A6F] rounded-2xl text-xs font-bold shadow-xs transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4 text-[#F5B400]" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      {activeViewMode === 'test_studio' ? (
        <MessagingTestHarness
          currentUser={effectiveUser}
          onSelectConversation={(convId) => {
            handleSelectConversation(convId);
            setActiveViewMode('chat');
          }}
          onNavigate={onNavigate || (() => {})}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex h-[640px] sm:h-[700px] relative">
          
          {/* Left Pane: Conversation List */}
          <div className={`${
            mobileActiveView === 'chat' ? 'hidden md:flex' : 'flex'
          } w-full md:w-auto h-full flex-shrink-0`}>
            <ConversationListView
              conversations={conversations}
              selectedConversationId={selectedConvId}
              currentUser={effectiveUser}
              onSelectConversation={handleSelectConversation}
              onOpenNewChatModal={() => setIsNewChatModalOpen(true)}
            />
          </div>

          {/* Center Pane: Active Chat Area */}
          <div className={`${
            mobileActiveView === 'list' ? 'hidden md:flex' : 'flex'
          } flex-1 h-full flex-col min-w-0`}>
            <ChatAreaView
              conversation={selectedConversation}
              currentUser={effectiveUser}
              onBackToList={() => setMobileActiveView('list')}
              onToggleContextDrawer={() => setIsContextDrawerOpen(!isContextDrawerOpen)}
              isContextDrawerOpen={isContextDrawerOpen}
              onNavigate={onNavigate}
            />
          </div>

          {/* Right Pane: Context Drawer (Collapsible) */}
          {selectedConversation && isContextDrawerOpen && (
            <div className="hidden xl:flex flex-shrink-0 h-full">
              <ConversationContextDrawer
                conversation={selectedConversation}
                currentUser={effectiveUser}
                onNavigate={onNavigate}
              />
            </div>
          )}

        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        currentUser={effectiveUser}
        onConversationCreated={(newConvId) => {
          handleSelectConversation(newConvId);
        }}
      />

    </div>
  );
};
