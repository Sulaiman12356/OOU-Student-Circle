import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { ServiceItem, ServiceRequest, getServicePrice } from '../../types';
import { 
  X, 
  Send, 
  Sparkles, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';

interface ServiceRequestModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  isQuoteRequest?: boolean;
  onSuccess?: () => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  service,
  isOpen,
  onClose,
  isQuoteRequest = false,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState('');
  const [requirements, setRequirements] = useState('');
  const [preferredDelivery, setPreferredDelivery] = useState(service?.deliveryTime || '2-3 Days');
  const [budget, setBudget] = useState<number>(service ? getServicePrice(service) : 5000);
  const [meetingLocation, setMeetingLocation] = useState(currentUser?.location || service?.campus || 'Main Campus (Ago-Iwoye)');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in or select a demo account to submit a service request.');
      return;
    }

    if (!title.trim() || !requirements.trim()) {
      setError('Please provide a project title and detailed instructions.');
      return;
    }

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerPhoto: currentUser.profilePhoto,
      customerDepartment: currentUser.department || 'Student Client',
      customerLevel: currentUser.level || '300L',
      providerId: service.studentId,
      providerName: service.studentName,
      providerPhoto: service.studentPhoto,
      title: title.trim(),
      requirements: requirements.trim(),
      budget: Number(budget),
      pricingType: service.pricingType || 'Fixed Price',
      deliveryTime: preferredDelivery,
      campus: meetingLocation,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    DataStore.saveServiceRequest(newRequest);
    setIsSubmitted(true);
    if (onSuccess) onSuccess();
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setError(null);
    setTitle('');
    setRequirements('');
    onClose();
  };

  return (
    <div 
      id="service-request-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#061A4F]/10 text-[#061A4F] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isQuoteRequest ? 'Request Custom Quote' : 'Order / Request Service'}
              </h2>
              <p className="text-xs text-gray-500 truncate max-w-[260px]">
                {service.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">
                Request Sent Successfully! 🎉
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                Your request has been dispatched to <strong>{service.studentName}</strong>. 
                They will review your instructions and respond with confirmation or a customized quote.
              </p>
            </div>
            <div className="pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl bg-[#061A4F] text-white text-xs font-bold shadow-md hover:bg-[#082266] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Request Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Provider Preview Pill */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <img 
                src={service.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                alt={service.studentName} 
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">{service.studentName}</h4>
                <p className="text-[11px] text-gray-500">{service.studentDepartment} • {service.campus}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Standard Rate</span>
                <span className="text-sm font-extrabold text-[#061A4F]">₦{getServicePrice(service).toLocaleString()}</span>
              </div>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Project / Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Need Logo Design for my Campus Eatery Startup"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 font-medium"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Project Requirements & Specific Instructions *
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
                placeholder="Detail exactly what you want designed, developed, or delivered. Mention preferred colors, dimensions, reference links, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 leading-relaxed"
                required
              />
            </div>

            {/* Budget & Delivery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Offered Budget (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₦</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min={500}
                    step={500}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs font-bold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Preferred Turnaround
                </label>
                <input
                  type="text"
                  value={preferredDelivery}
                  onChange={(e) => setPreferredDelivery(e.target.value)}
                  placeholder="e.g. 2 Days / Urgent"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900"
                />
              </div>
            </div>

            {/* Meeting / Handover Location */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Preferred Campus Handover / Meeting Location
              </label>
              <input
                type="text"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder="e.g. Main Campus Library, PS Hall, or Online Delivery"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#061A4F] hover:bg-[#082266] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isQuoteRequest ? 'Submit Quote Request' : 'Send Service Request'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
