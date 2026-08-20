import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../services/dataStore';
import { MediaUploader } from '../common/MediaUploader';
import { 
  ServiceItem, 
  ServiceCategory, 
  PricingType, 
  ServiceAvailability,
  PortfolioLink 
} from '../../types';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  Sparkles, 
  DollarSign, 
  Clock, 
  MapPin, 
  Info,
  Link2,
  Tag,
  AlertCircle
} from 'lucide-react';

interface ServiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingService?: ServiceItem | null;
  onSaved: (service: ServiceItem) => void;
}

export const ServiceCreateModal: React.FC<ServiceCreateModalProps> = ({
  isOpen,
  onClose,
  editingService,
  onSaved
}) => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Fields
  const [title, setTitle] = useState(editingService?.title || '');
  const [category, setCategory] = useState<ServiceCategory>(editingService?.category || 'Graphic Design');
  const [description, setDescription] = useState(editingService?.description || '');
  const [pricingType, setPricingType] = useState<PricingType>(editingService?.pricingType || 'Fixed Price');
  const [price, setPrice] = useState<number>(editingService?.price || 5000);
  const [deliveryTime, setDeliveryTime] = useState(editingService?.deliveryTime || '2 Days');
  const [campus, setCampus] = useState(editingService?.campus || currentUser?.location || 'Main Campus (Ago-Iwoye)');
  const [serviceArea, setServiceArea] = useState(editingService?.serviceArea || 'Mini Campus & Permanent Site');
  const [availability, setAvailability] = useState<ServiceAvailability>(editingService?.availability || 'Available Now');

  // Device Uploaded Images
  const [images, setImages] = useState<string[]>(() => {
    if (editingService?.portfolioImages && editingService.portfolioImages.length > 0) {
      return editingService.portfolioImages;
    }
    if (editingService?.coverPhoto) {
      return [editingService.coverPhoto];
    }
    return ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80'];
  });
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Portfolio Links
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLink[]>(() => {
    if (editingService?.portfolioLinks && editingService.portfolioLinks.length > 0) {
      return editingService.portfolioLinks;
    }
    return [];
  });
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Skills & Tags
  const [skillsInput, setSkillsInput] = useState(() => {
    if (editingService?.skills && editingService.skills.length > 0) {
      return editingService.skills.join(', ');
    }
    return 'Logo Design, Branding, Adobe Illustrator';
  });

  const categories: ServiceCategory[] = [
    'Graphic Design',
    'Web Development',
    'Digital Marketing',
    'Video Editing',
    'Photography',
    'Tutoring',
    'Writing',
    'Data Analysis',
    'Programming',
    'Social Media Management',
    'Printing assistance',
    'Other legitimate services'
  ];

  const campusOptions = [
    'Main Campus (Ago-Iwoye)',
    'Sagamu Medical Campus',
    'Ayetoro Agricultural Campus',
    'Ibogun Engineering Campus',
    'Cross-Campus & Online Remote'
  ];

  const deliveryOptions = [
    '24 Hours',
    '2 Days',
    '3 Days',
    '4 Days',
    '5 Days',
    '7 Days',
    '14 Days',
    'Custom Timeframe'
  ];

  const availabilityOptions: ServiceAvailability[] = [
    'Available Now',
    'Within 24 Hours',
    'Weekdays (8am - 6pm)',
    'Weekends Only',
    'By Appointment / Booking'
  ];

  if (!isOpen) return null;

  // Direct Device Upload Handler (JPG, JPEG, PNG, WEBP)
  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    const newImgs: string[] = [];

    Array.from(files).forEach((file: File) => {
      // Validate format
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setUploadError('Only JPG, JPEG, PNG, and WEBP images are supported.');
        return;
      }

      // Read file to data URL
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          const resultUrl = loadEvt.target.result as string;
          setImages((prev) => [...prev, resultUrl]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input so re-uploading same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      setUploadError('Please maintain at least one photo for your service listing.');
      return;
    }
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (primaryImageIndex >= updated.length) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    }
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);

    // Update primary index if moved
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(targetIndex);
    } else if (primaryImageIndex === targetIndex) {
      setPrimaryImageIndex(index);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleAddPortfolioLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    setPortfolioLinks((prev) => [
      ...prev,
      {
        title: newLinkTitle.trim(),
        url: newLinkUrl.startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`
      }
    ]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemovePortfolioLink = (index: number) => {
    setPortfolioLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setUploadError('Please provide a descriptive title for your service.');
      return;
    }
    if (!description.trim()) {
      setUploadError('Please provide a detailed description of what you offer.');
      return;
    }
    if (images.length === 0) {
      setUploadError('Please upload at least one image representing your work.');
      return;
    }

    const primaryCover = images[primaryImageIndex] || images[0];
    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const deliveryDaysNum = parseInt(deliveryTime, 10) || 2;

    const newOrUpdatedService: ServiceItem = {
      id: editingService?.id || `srv-${Date.now()}`,
      studentId: currentUser?.id || 'student-1',
      studentName: currentUser?.fullName || 'Student Provider',
      studentPhoto: currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      studentDepartment: currentUser?.department || 'Computer Science',
      studentLevel: currentUser?.level || '400L',
      studentFaculty: currentUser?.faculty || 'Faculty of Science',
      isStudentVerified: currentUser?.isVerified || false,
      title: title.trim(),
      category,
      description: description.trim(),
      price: pricingType === 'Custom Quote' ? 0 : Number(price),
      startingPrice: pricingType === 'Custom Quote' ? 0 : Number(price),
      pricingType,
      deliveryTime,
      deliveryDays: deliveryDaysNum,
      campus,
      serviceArea,
      location: campus,
      availability,
      coverPhoto: primaryCover,
      coverImage: primaryCover,
      portfolioImages: images,
      portfolioLinks,
      skills: skillsArray,
      tags: skillsArray,
      viewsCount: editingService?.viewsCount || 0,
      rating: editingService?.rating || 5.0,
      reviewsCount: editingService?.reviewsCount || 0,
      completedOrders: editingService?.completedOrders || 0,
      ordersCompleted: editingService?.ordersCompleted || 0,
      status: editingService?.status || 'published',
      createdAt: editingService?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    DataStore.saveService(newOrUpdatedService);
    onSaved(newOrUpdatedService);
    onClose();
  };

  return (
    <div 
      id="service-create-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#061A4F]/10 text-[#061A4F] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {editingService ? 'Edit Service Listing' : 'Create New Service Offering'}
              </h2>
              <p className="text-xs text-gray-500">
                Offer your professional skill to students, campus businesses, and external clients.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {uploadError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A4F]">
              1. General Details
            </h3>

            {/* Service Title */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Service Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Professional Minimalist Logo & Brand Identity Design"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-sm text-gray-900 font-medium"
                required
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Be clear and descriptive so clients can find your service in search results.
              </span>
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-sm text-gray-900 bg-white font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Delivery Time *
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-sm text-gray-900 bg-white font-medium"
                >
                  {deliveryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Service Description & Scope *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Explain what is included, what you deliver, source file formats, and requirements from the client..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-sm text-gray-900 leading-relaxed font-normal"
                required
              />
            </div>
          </div>

          {/* Section 2: Pricing & Pricing Type */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A4F]">
              2. Pricing Structure
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Pricing Type *
                </label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as PricingType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-sm text-gray-900 bg-white font-medium"
                >
                  <option value="Fixed Price">Fixed Price (Set amount for full job)</option>
                  <option value="Starting From">Starting From (Base package rate)</option>
                  <option value="Per Unit">Per Unit (Per page / per hour / per piece)</option>
                  <option value="Custom Quote">Custom Quote (Calculated per inquiry)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {pricingType === 'Custom Quote' ? 'Indicative / Minimum Rate' : 'Price (NGN ₦) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    disabled={pricingType === 'Custom Quote'}
                    min={500}
                    step={500}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-sm text-gray-900 font-bold disabled:bg-gray-100 disabled:text-gray-400"
                    required={pricingType !== 'Custom Quote'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Campus & Service Area */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A4F]">
              3. Location & Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Campus *
                </label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 bg-white font-medium"
                >
                  {campusOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Service Area
                </label>
                <input
                  type="text"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  placeholder="e.g. Mini Campus, Permanent Site"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Availability *
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as ServiceAvailability)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 bg-white font-medium"
                >
                  {availabilityOptions.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Device Photo Upload & Media Gallery */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <MediaUploader
              storagePathPrefix={`services/${currentUser?.id || 'general'}`}
              images={images}
              onChange={(newImgs) => {
                setImages(newImgs);
                if (primaryImageIndex >= newImgs.length) {
                  setPrimaryImageIndex(0);
                }
              }}
              maxImages={6}
              maxFileSizeMB={15}
              label="4. Service Photos & Work Samples"
              helperText="Upload photos directly from your device (JPG, JPEG, PNG, WEBP). Select one as primary cover photo."
              aspectRatio="video"
            />
          </div>

          {/* Section 5: Skills & External Portfolio Links */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#061A4F]">
              5. Skills & External Portfolio Links
            </h3>

            {/* Skills Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Skills / Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Logo Design, Photoshop, Figma, Branding"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] text-xs text-gray-900 font-medium"
              />
            </div>

            {/* Portfolio Links */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-800">
                External Portfolio Links (Behance, GitHub, Google Drive, Portfolio Site)
              </label>

              {portfolioLinks.length > 0 && (
                <div className="space-y-2 mb-3">
                  {portfolioLinks.map((lnk, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Link2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="font-bold text-gray-900">{lnk.title}:</span>
                        <span className="text-gray-600 truncate">{lnk.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePortfolioLink(idx)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Link Title (e.g. Behance)"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://behance.net/username"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
                />
                <button
                  type="button"
                  onClick={handleAddPortfolioLink}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#061A4F] hover:bg-[#082266] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingService ? 'Save Changes' : 'Publish Service Listing'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
