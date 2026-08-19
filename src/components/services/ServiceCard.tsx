import React from 'react';
import { ServiceItem, getServicePrice } from '../../types';
import { 
  Star, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Eye, 
  Tag, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Send,
  Bookmark
} from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
  onViewDetails: (service: ServiceItem) => void;
  onRequestService?: (service: ServiceItem) => void;
  onMessageProvider?: (providerId: string, providerName: string) => void;
  isSaved?: boolean;
  onToggleSave?: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onViewDetails,
  onRequestService,
  onMessageProvider,
  isSaved = false,
  onToggleSave
}) => {
  const price = getServicePrice(service);
  const images = service.portfolioImages && service.portfolioImages.length > 0 
    ? service.portfolioImages 
    : [service.coverPhoto || service.coverImage || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80'];
  const cover = service.coverPhoto || service.coverImage || images[0];

  const getPricingTypeLabel = () => {
    switch (service.pricingType) {
      case 'Fixed Price':
        return 'Fixed Price';
      case 'Starting From':
        return 'Starting From';
      case 'Per Unit':
        return 'Per Unit';
      case 'Custom Quote':
        return 'Custom Quote';
      default:
        return 'Starting From';
    }
  };

  return (
    <div 
      id={`service-card-${service.id}`}
      className="group bg-white rounded-xl border border-gray-200 hover:border-[#061A4F]/30 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden relative"
    >
      {/* Cover Media Container */}
      <div 
        className="relative h-48 w-full bg-gray-100 overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(service)}
      >
        <img 
          src={cover} 
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-[#061A4F]/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
          {service.category}
        </div>

        {/* Image Count & Save Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {images.length > 1 && (
            <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
              {images.length} photos
            </span>
          )}
          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(service.id);
              }}
              className={`p-1.5 rounded-md backdrop-blur-sm transition-colors ${
                isSaved 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Service'}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Availability Badge */}
        {service.availability && (
          <div className="absolute bottom-2.5 left-3 bg-emerald-950/80 backdrop-blur-sm text-emerald-300 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {service.availability}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Provider Profile Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={service.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
              alt={service.studentName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            {service.isStudentVerified && (
              <span 
                className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-sm"
                title="Verified OOU Student Provider"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {service.studentName}
              </h4>
            </div>
            <p className="text-xs text-gray-500 truncate">
              {service.studentDepartment} {service.studentLevel ? `(${service.studentLevel})` : ''}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-xs font-bold text-amber-700">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{(service.rating || 5.0).toFixed(1)}</span>
            <span className="text-gray-400 font-normal text-[11px]">
              ({service.reviewsCount || 0})
            </span>
          </div>
        </div>

        {/* Service Title */}
        <div className="space-y-1">
          <h3 
            onClick={() => onViewDetails(service)}
            className="text-base font-bold text-gray-900 line-clamp-2 hover:text-[#061A4F] cursor-pointer transition-colors leading-snug"
          >
            {service.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Location & Delivery Meta */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-gray-500 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate max-w-[140px]">
              {service.campus || service.location || 'Ago-Iwoye'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>{service.deliveryTime || '2-3 Days'}</span>
          </div>
          {service.viewsCount !== undefined && (
            <div className="flex items-center gap-1 ml-auto text-[11px] text-gray-400">
              <Eye className="w-3 h-3" />
              <span>{service.viewsCount} views</span>
            </div>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
              {getPricingTypeLabel()}
            </span>
            <div className="text-lg font-extrabold text-[#061A4F]">
              {service.pricingType === 'Custom Quote' ? (
                <span>Quote on Request</span>
              ) : (
                <span>₦{price.toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(service)}
              className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
            >
              View
            </button>
            {onRequestService && (
              <button
                type="button"
                onClick={() => onRequestService(service)}
                className="px-3.5 py-1.5 rounded-lg bg-[#061A4F] hover:bg-[#082266] text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Request</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
