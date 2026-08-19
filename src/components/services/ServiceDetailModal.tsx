import React, { useState, useEffect } from 'react';
import { ServiceItem, ServiceReview, getServicePrice } from '../../types';
import { DataStore } from '../../services/dataStore';
import { 
  X, 
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Send, 
  Bookmark, 
  ExternalLink, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Award,
  Sparkles,
  Share2,
  ThumbsUp
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestService: (service: ServiceItem, isQuoteRequest?: boolean) => void;
  onMessageProvider: (providerId: string, providerName: string) => void;
  isSaved?: boolean;
  onToggleSave?: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onRequestService,
  onMessageProvider,
  isSaved = false,
  onToggleSave
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (service && isOpen) {
      setActiveImageIndex(0);
      // Load verified reviews for this service
      const srvReviews = DataStore.getServiceReviewsByService(service.id);
      setReviews(srvReviews);
      // Increment views count
      DataStore.incrementServiceViews(service.id);
    }
  }, [service, isOpen]);

  if (!isOpen || !service) return null;

  const images = (service.portfolioImages && service.portfolioImages.length > 0)
    ? service.portfolioImages
    : [service.coverPhoto || service.coverImage || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80'];

  const price = getServicePrice(service);
  const provider = DataStore.getUserById(service.studentId);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getPricingTypeDisplay = () => {
    switch (service.pricingType) {
      case 'Fixed Price':
        return 'Fixed Project Rate';
      case 'Starting From':
        return 'Starting Base Rate';
      case 'Per Unit':
        return 'Per Page / Unit / Hour';
      case 'Custom Quote':
        return 'Custom Quote Required';
      default:
        return 'Starting Price';
    }
  };

  return (
    <div 
      id="service-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#061A4F]/10 text-[#061A4F] text-xs font-bold px-2.5 py-1 rounded-md">
              {service.category}
            </span>
            {service.isStudentVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Student
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors text-xs flex items-center gap-1.5"
              title="Share service"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(service.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved ? 'text-amber-500 bg-amber-50' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title={isSaved ? 'Remove from Saved' : 'Save Service'}
              >
                <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-8">
          
          {/* Main Grid: Gallery & Quick Purchase Meta */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-200">
                <img 
                  src={images[activeImageIndex]} 
                  alt={`${service.title} view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                      {activeImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? 'border-[#061A4F] ring-2 ring-[#061A4F]/20 scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Provider & Action Meta Box */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {/* Provider Profile Summary */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={service.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                      alt={service.studentName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    {service.isStudentVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">
                      {service.studentName}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {service.studentDepartment} • {service.studentLevel || 'Student'}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {service.studentFaculty || 'Olabisi Onabanjo University'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200/80 text-center">
                  <div className="p-1.5 rounded-lg bg-white">
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{(service.rating || 5.0).toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">({service.reviewsCount || 0} reviews)</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white">
                    <div className="text-xs font-bold text-[#061A4F]">
                      {service.completedOrders || service.ordersCompleted || 0}
                    </div>
                    <span className="text-[10px] text-gray-400">Orders Done</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white">
                    <div className="text-xs font-bold text-emerald-600">100%</div>
                    <span className="text-[10px] text-gray-400">On-Time</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onMessageProvider(service.studentId, service.studentName)}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                  <span>Message {service.studentName.split(' ')[0]}</span>
                </button>
              </div>

              {/* Price & Delivery Details */}
              <div className="p-5 rounded-xl bg-[#061A4F]/5 border border-[#061A4F]/10 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-[#061A4F] uppercase tracking-wider">
                    {getPricingTypeDisplay()}
                  </span>
                  <div className="text-2xl font-black text-[#061A4F]">
                    {service.pricingType === 'Custom Quote' ? (
                      <span className="text-lg">Quote on Request</span>
                    ) : (
                      <span>₦{price.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="w-3.5 h-3.5" /> Delivery Time
                    </span>
                    <span className="font-semibold text-gray-900">{service.deliveryTime || '2-3 Days'}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="w-3.5 h-3.5" /> Campus / Area
                    </span>
                    <span className="font-semibold text-gray-900">{service.campus || 'Ago-Iwoye Main Campus'}</span>
                  </div>
                  {service.serviceArea && (
                    <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
                      <span className="text-gray-500">Service Coverage</span>
                      <span className="font-semibold text-gray-900">{service.serviceArea}</span>
                    </div>
                  )}
                  {service.availability && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-500">Availability</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {service.availability}
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onRequestService(service, false)}
                    className="w-full py-3 px-4 rounded-xl bg-[#061A4F] hover:bg-[#082266] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Request This Service (₦{price.toLocaleString()})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRequestService(service, true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-[#061A4F] text-xs font-bold border-2 border-[#061A4F]/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Request Custom Quote</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Service Title & Detailed Description */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h1 className="text-2xl font-black text-gray-900 leading-snug">
              {service.title}
            </h1>

            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              {service.description}
            </div>
          </div>

          {/* Skills & Tags */}
          {((service.skills && service.skills.length > 0) || (service.tags && service.tags.length > 0)) && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {(service.skills || service.tags || []).map((tag, idx) => (
                  <span 
                    key={idx}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-lg border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Portfolio Links */}
          {service.portfolioLinks && service.portfolioLinks.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Provider Portfolio & Live Proof
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.portfolioLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white border border-gray-200 hover:border-[#061A4F] hover:shadow-sm flex items-center justify-between transition-all group"
                  >
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-[#061A4F]">
                      {link.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#061A4F]" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Verified Customer Reviews Section */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Verified Client Reviews
                </h3>
                <p className="text-xs text-gray-500">
                  Reviews are strictly verified from completed orders on StudentCircle.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg text-amber-800 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{(service.rating || 5.0).toFixed(1)}</span>
                <span className="text-xs text-gray-500 font-normal">({reviews.length} total)</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <Award className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">No reviews yet for this specific listing</p>
                <p className="text-xs text-gray-500">Be the first to order and review {service.studentName}!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={rev.customerPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'} 
                          alt={rev.customerName}
                          className="w-8 h-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-gray-900">{rev.customerName}</h5>
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Verified Order
                            </span>
                          </div>
                          {rev.customerDepartment && (
                            <p className="text-[11px] text-gray-500">{rev.customerDepartment}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {rev.title && (
                      <h6 className="text-xs font-bold text-gray-900 pt-1">
                        "{rev.title}"
                      </h6>
                    )}

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {rev.comment}
                    </p>

                    {rev.tags && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rev.tags.map((t, idx) => (
                          <span key={idx} className="bg-white text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-200">
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Sticky Bottom Bar for Mobile Convenience */}
        <div className="sticky bottom-0 z-20 bg-white px-6 py-3 border-t border-gray-100 flex items-center justify-between gap-4 sm:hidden">
          <div>
            <span className="text-[10px] text-gray-500 block">Price</span>
            <span className="text-base font-extrabold text-[#061A4F]">₦{price.toLocaleString()}</span>
          </div>
          <button
            type="button"
            onClick={() => onRequestService(service, false)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#061A4F] text-white text-xs font-bold text-center"
          >
            Request Service
          </button>
        </div>

      </div>
    </div>
  );
};
