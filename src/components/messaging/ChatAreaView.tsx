import React, { useState, useRef, useEffect } from 'react';
import { 
  Conversation, 
  ChatMessage, 
  UserProfile, 
  MessageAttachment,
  UserRole
} from '../../types';
import { MessagingStore } from '../../services/messagingStore';
import { UserAvatar } from '../common/UserAvatar';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  CheckCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  DollarSign, 
  ShoppingBag, 
  Briefcase, 
  ExternalLink, 
  Lock, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Download, 
  X, 
  Smile, 
  Clock, 
  UserCheck, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface ChatAreaViewProps {
  conversation: Conversation | null;
  currentUser: UserProfile;
  onBackToList?: () => void;
  onToggleContextDrawer?: () => void;
  isContextDrawerOpen?: boolean;
  onNavigate?: (path: string) => void;
}

export const ChatAreaView: React.FC<ChatAreaViewProps> = ({
  conversation,
  currentUser,
  onBackToList,
  onToggleContextDrawer,
  isContextDrawerOpen,
  onNavigate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedAttachments, setSelectedAttachments] = useState<MessageAttachment[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Quick Quote creation modal
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteAmount, setQuoteAmount] = useState<number | ''>('');
  const [quoteDelivery, setQuoteDelivery] = useState('2 Days');

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Security check: Verify current user is an authorized participant
  const isAuthorized = conversation 
    ? (currentUser.role === 'admin' || conversation.participants.includes(currentUser.id))
    : false;

  // Load and subscribe to messages
  useEffect(() => {
    if (!conversation || !isAuthorized) {
      setMessages([]);
      return;
    }

    // Mark conversation as read
    MessagingStore.markConversationAsRead(conversation.id, currentUser.id);

    // Subscribe to realtime updates for this conversation
    const unsubscribe = MessagingStore.subscribeMessages(conversation.id, (updatedMessages) => {
      setMessages(updatedMessages);
      // Auto-scroll on new messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => {
      unsubscribe();
    };
  }, [conversation?.id, currentUser.id, isAuthorized]);

  // Scroll to bottom on load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
        <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 mb-4">
          <Sparkles className="w-8 h-8 text-[#F5B400]" />
        </div>
        <h3 className="text-base font-extrabold text-[#061A4F]">Select a conversation</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          Choose a chat from the left panel to message student peers, service providers, campus vendors, or client partners securely.
        </p>
      </div>
    );
  }

  // Security Gate: Unauthorized access violation
  if (!isAuthorized) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-rose-50/50 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 border border-rose-200 shadow-sm flex items-center justify-center text-rose-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-rose-900">403 Access Forbidden</h3>
        <p className="text-xs text-rose-700 max-w-md mt-2 leading-relaxed font-medium">
          You are not an authorized participant in conversation <span className="font-mono bg-rose-200 px-1 py-0.5 rounded text-rose-900">{conversation.id}</span>.
          StudentCircle enforces strict end-to-end participant scoping to safeguard user privacy and sensitive deal conversations.
        </p>
        {onBackToList && (
          <button
            onClick={onBackToList}
            className="mt-6 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-rose-700 transition"
          >
            Return to My Messages
          </button>
        )}
      </div>
    );
  }

  const otherParticipantId = conversation.participants.find(id => id !== currentUser.id) || conversation.participants[0];
  const otherParticipant = conversation.participantDetails[otherParticipantId] || { name: 'StudentCircle Member', role: 'student' };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && selectedImages.length === 0 && selectedAttachments.length === 0) return;

    try {
      const textToSend = inputText.trim();
      const imagesToSend = selectedImages.length > 0 ? [...selectedImages] : undefined;
      const attachmentsToSend = selectedAttachments.length > 0 ? [...selectedAttachments] : undefined;

      setInputText('');
      setSelectedImages([]);
      setSelectedAttachments([]);
      setIsAttachmentMenuOpen(false);

      await MessagingStore.sendMessage({
        conversationId: conversation.id,
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        senderRole: currentUser.role,
        senderPhoto: currentUser.profilePhoto,
        text: textToSend,
        images: imagesToSend,
        attachments: attachmentsToSend
      });
    } catch (err: any) {
      console.warn('Could not send message:', err);
    }
  };

  const handleSendQuote = async () => {
    if (!quoteTitle.trim() || !quoteAmount || Number(quoteAmount) <= 0) {
      return;
    }

    try {
      const quoteId = `squote-${Date.now()}`;
      const title = quoteTitle.trim();
      const amount = Number(quoteAmount);
      const delivery = quoteDelivery;

      setIsQuoteModalOpen(false);
      setQuoteTitle('');
      setQuoteAmount('');
      setIsAttachmentMenuOpen(false);

      await MessagingStore.sendMessage({
        conversationId: conversation.id,
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        senderRole: currentUser.role,
        senderPhoto: currentUser.profilePhoto,
        text: `Official Quote: ${title} : ₦${amount.toLocaleString()} (${delivery})`,
        quoteData: {
          quoteId,
          title,
          amount,
          deliveryTime: delivery,
          status: 'pending'
        }
      });
    } catch (err: any) {
      console.warn('Could not send quote:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      // If image file
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setSelectedImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Document / PDF / Archive
        const mockAttachment: MessageAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          url: URL.createObjectURL(file),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.name.endsWith('.pdf') ? 'pdf' : 
                file.name.endsWith('.zip') || file.name.endsWith('.rar') ? 'archive' : 'doc'
        };
        setSelectedAttachments(prev => [...prev, mockAttachment]);
      }
    });

    setIsAttachmentMenuOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden relative">
      
      {/* Top Chat Header */}
      <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs z-10">
        
        {/* Left: Mobile back & Partner info */}
        <div className="flex items-center gap-3 min-w-0">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="p-1.5 -ml-1 text-slate-500 hover:text-[#061A4F] hover:bg-slate-100 rounded-xl md:hidden transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative flex-shrink-0">
            <UserAvatar
              name={otherParticipant.name}
              photoUrl={otherParticipant.photo}
              size="md"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" title="Active on StudentCircle" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-[#061A4F] truncate">
                {otherParticipant.name}
              </h3>
              {otherParticipant.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" title="Verified Campus Identity" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {otherParticipant.departmentOrCompany || otherParticipant.role}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          {/* Send Quote button for providers/students */}
          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-[#061A4F] text-white hover:bg-[#0B2A6F] text-xs font-bold rounded-xl shadow-xs transition"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#F5B400]" />
            <span>Send Quote</span>
          </button>

          {/* Context Drawer Toggle */}
          {onToggleContextDrawer && (
            <button
              onClick={onToggleContextDrawer}
              className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs font-bold ${
                isContextDrawerOpen 
                  ? 'bg-blue-50 border-blue-200 text-[#061A4F]' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle deal context"
            >
              <Info className="w-4 h-4 text-blue-600" />
              <span className="hidden lg:inline">Details</span>
            </button>
          )}

          {/* Security lock indicator */}
          <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded-lg" title="Scoped End-to-End between authorized participants">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Chat</span>
          </div>

        </div>

      </div>

      {/* Context Banner Strip (Collapsible context summary at top of chat) */}
      {conversation.context && (
        <div className="bg-gradient-to-r from-blue-50/80 to-slate-50 border-b border-blue-100/60 px-4 py-2 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-white text-[#061A4F] border border-blue-200 shadow-2xs flex-shrink-0">
              {conversation.context.type.replace('_', ' ')}
            </span>
            <span className="font-bold text-[#061A4F] truncate">
              {conversation.context.serviceTitle || 
               conversation.context.productTitle || 
               conversation.context.jobTitle || 
               conversation.context.shopName || 
               conversation.context.initialTopic}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {conversation.context.orderId && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                Order #{conversation.context.orderId}
              </span>
            )}
            {conversation.context.servicePrice && (
              <span className="font-extrabold text-[#061A4F]">
                ₦{conversation.context.servicePrice.toLocaleString()}
              </span>
            )}
            {conversation.context.productPrice && (
              <span className="font-extrabold text-[#061A4F]">
                ₦{conversation.context.productPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        
        {/* Beginning of conversation greeting banner */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center max-w-md mx-auto space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#061A4F] mx-auto flex items-center justify-center">
            <Lock className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="text-xs font-black text-[#061A4F]">Participant-Only Secure Channel</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            This conversation is strictly accessible only to <span className="font-bold text-slate-700">{currentUser.fullName}</span> and <span className="font-bold text-slate-700">{otherParticipant.name}</span>.
          </p>
        </div>

        {/* Message stream */}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
            >
              
              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] sm:max-w-lg rounded-2xl p-3.5 shadow-2xs space-y-2.5 ${
                  isMe
                    ? 'bg-[#061A4F] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                
                {/* Sender Name if not me */}
                {!isMe && (
                  <div className="text-[11px] font-bold text-[#F5B400] flex items-center gap-1">
                    <span>{msg.senderName || otherParticipant.name}</span>
                    {msg.senderRole && (
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                        • {msg.senderRole}
                      </span>
                    )}
                  </div>
                )}

                {/* Text Content */}
                {msg.text && (
                  <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isMe ? 'text-white' : 'text-slate-800'
                  }`}>
                    {msg.text}
                  </p>
                )}

                {/* Embedded Quote Card */}
                {msg.quoteData && (
                  <div className={`p-3 rounded-xl border space-y-2 ${
                    isMe 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-blue-50/70 border-blue-200 text-[#061A4F]'
                  }`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#F5B400]" />
                        Official Quote
                      </span>
                      <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-600 text-white">
                        {msg.quoteData.status || 'Active'}
                      </span>
                    </div>

                    <p className="text-xs font-bold leading-snug">
                      {msg.quoteData.title}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-current/10">
                      <span className="text-[11px] opacity-80 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {msg.quoteData.deliveryTime}
                      </span>
                      <span className="text-sm font-black text-[#F5B400]">
                        ₦{msg.quoteData.amount.toLocaleString()}
                      </span>
                    </div>

                    {!isMe && onNavigate && (
                      <button
                        onClick={() => onNavigate('/student/orders')}
                        className="w-full py-1.5 bg-[#061A4F] text-white hover:bg-[#0B2A6F] rounded-lg text-xs font-bold shadow-xs transition"
                      >
                        Accept & Fund Escrow
                      </button>
                    )}
                  </div>
                )}

                {/* Embedded Order Card */}
                {msg.orderData && (
                  <div className={`p-3 rounded-xl border space-y-2 ${
                    isMe 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="flex items-center gap-1 text-emerald-500">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Order #{msg.orderData.orderId}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                        {msg.orderData.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-80">Escrow Total:</span>
                      <span className="font-black text-sm">₦{msg.orderData.amount.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Multi-Image Gallery */}
                {msg.images && msg.images.length > 0 && (
                  <div className={`grid gap-1.5 ${msg.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {msg.images.map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt="attachment"
                        onClick={() => setLightboxImage(imgUrl)}
                        className="rounded-xl object-cover max-h-48 w-full cursor-pointer hover:opacity-95 transition border border-black/10"
                      />
                    ))}
                  </div>
                )}

                {/* Attachments List (PDF, DOC, ZIP) */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {msg.attachments.map((att) => (
                      <div
                        key={att.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                          isMe 
                            ? 'bg-white/10 border-white/15 text-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-blue-100 text-blue-700'}`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold truncate">{att.name}</h5>
                            <span className="text-[10px] opacity-75">{att.size}</span>
                          </div>
                        </div>

                        <a
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          download={att.name}
                          className={`p-1.5 rounded-lg transition ${
                            isMe ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-600'
                          }`}
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Footer: Timestamp & Read Status */}
                <div className={`flex items-center justify-end gap-1 text-[10px] pt-0.5 ${
                  isMe ? 'text-white/70' : 'text-slate-400'
                }`}>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <span>
                      {msg.read ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#F5B400]" title="Read by recipient" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-white/70" title="Delivered" />
                      )}
                    </span>
                  )}
                </div>

              </div>

            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-6 py-1 text-xs text-slate-400 italic flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
          <span>{otherParticipant.name} is typing...</span>
        </div>
      )}

      {/* Selected Attachments Preview Strip */}
      {(selectedImages.length > 0 || selectedAttachments.length > 0) && (
        <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          {selectedImages.map((img, i) => (
            <div key={i} className="relative flex-shrink-0">
              <img src={img} alt="preview" className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
              <button
                onClick={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))}
                className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-xs hover:bg-rose-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {selectedAttachments.map((att, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200 text-xs flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-bold truncate max-w-[120px]">{att.name}</span>
              <button
                onClick={() => setSelectedAttachments(prev => prev.filter((_, idx) => idx !== i))}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          
          {/* Attachment button & popup menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
              className="p-2.5 text-slate-500 hover:text-[#061A4F] hover:bg-slate-100 rounded-xl transition shadow-2xs"
              title="Add photos, files, or custom quote"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {isAttachmentMenuOpen && (
              <div className="absolute bottom-12 left-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1 z-30 animate-in fade-in slide-in-from-bottom-2">
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition"
                >
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  <span>Upload Photos</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Documents & PDFs</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsQuoteModalOpen(true);
                    setIsAttachmentMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-[#061A4F] hover:bg-amber-50 rounded-xl flex items-center gap-2 transition border-t border-slate-100"
                >
                  <DollarSign className="w-4 h-4 text-[#F5B400]" />
                  <span>Send Custom Quote</span>
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
          </div>

          {/* Textarea Input */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-[#061A4F] focus-within:bg-white transition flex items-center px-3 py-1.5 shadow-2xs">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Message ${otherParticipant.name}... (Press Enter to send)`}
              className="w-full bg-transparent border-0 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none max-h-32 leading-relaxed"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() && selectedImages.length === 0 && selectedAttachments.length === 0}
            className="p-3 bg-[#061A4F] text-white hover:bg-[#0B2A6F] disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl shadow-md transition flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4 text-[#F5B400]" />
          </button>

        </form>
      </div>

      {/* Lightbox Modal for Full-Size Image Preview */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <img src={lightboxImage} alt="enlarged preview" className="max-h-[85vh] w-auto rounded-2xl object-contain shadow-2xl" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-[#061A4F]">
                  <DollarSign className="w-5 h-5 text-[#F5B400]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#061A4F]">Create Official Quote</h3>
                  <p className="text-xs text-slate-500">Send a binding service quote with escrow support</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quote Deliverables / Brief</label>
                <input
                  type="text"
                  placeholder="e.g. Modern Minimalist Vector Logo + 3D Mockups"
                  value={quoteTitle}
                  onChange={(e) => setQuoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#061A4F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price in Naira (₦)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#061A4F] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Delivery</label>
                  <select
                    value={quoteDelivery}
                    onChange={(e) => setQuoteDelivery(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#061A4F] focus:outline-none font-medium"
                  >
                    <option value="24 Hours">24 Hours</option>
                    <option value="2 Days">2 Days</option>
                    <option value="3 Days">3 Days</option>
                    <option value="5 Days">5 Days</option>
                    <option value="7 Days">7 Days</option>
                    <option value="14 Days">14 Days</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Escrow Guarantee
                </div>
                <p>When {otherParticipant.name} accepts this quote, funds are locked in StudentCircle Escrow before you deliver.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendQuote}
                className="px-5 py-2 text-xs font-bold bg-[#061A4F] text-white hover:bg-[#0B2A6F] rounded-xl shadow-md"
              >
                Send Quote Card
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
