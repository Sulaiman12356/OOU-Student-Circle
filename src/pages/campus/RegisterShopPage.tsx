import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  ShieldCheck, 
  Sparkles,
  Phone,
  FileText,
  Camera
} from 'lucide-react';
import { CampusStore } from '../../services/campusStore';
import { useAuth } from '../../context/AuthContext';
import { MediaUploader } from '../../components/common/MediaUploader';

interface RegisterShopPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterShopPage: React.FC<RegisterShopPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const locations = CampusStore.getLocations();

  const [shopName, setShopName] = useState('');
  const [shopCode, setShopCode] = useState('');
  const [locationId, setLocationId] = useState(locations[0]?.id || 'loc-motion-ground');
  const [specificArea, setSpecificArea] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [description, setDescription] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser?.fullName || '');
  const [ownerPhone, setOwnerPhone] = useState(currentUser?.phoneNumber || '+234 ');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.phoneNumber || '+234 ');
  const [ownerEmail, setOwnerEmail] = useState(currentUser?.email || '');
  const [openingHours, setOpeningHours] = useState('08:00');
  const [closingHours, setClosingHours] = useState('18:30');
  const [pickupInstructions, setPickupInstructions] = useState('Present your StudentCircle order reference at the counter.');
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Selected Services
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Project Printing',
    'Hardcover & Spiral Binding',
    'Photocopying (B&W / Colour)',
    'Online JAMB & Portal Registration'
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdShopId, setCreatedShopId] = useState('');

  const allServiceOptions = [
    'Project Printing',
    'Hardcover & Spiral Binding',
    'Photocopying (B&W / Colour)',
    'Online JAMB & Portal Registration',
    'Online Verification & Screening Docs',
    'Instant Passport Photographs',
    'Document Lamination & Scanning',
    'Speed Typing & Thesis Formatting',
    'Stationery & Project Files',
    'Graphic Design & Flyer Printing'
  ];

  const handleToggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter(s => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !shopCode || !ownerPhone) {
      alert('Please fill in all required shop fields.');
      return;
    }

    setIsSubmitting(true);
    const selectedLoc = locations.find(l => l.id === locationId) || locations[0];

    try {
      const newShopId = `shop-${shopCode.toLowerCase()}-${Date.now()}`;
      CampusStore.saveShop({
        id: newShopId,
        ownerId: currentUser?.id || `owner-${Date.now()}`,
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        ownerEmail: ownerEmail.trim(),
        whatsappNumber: whatsappNumber.trim(),
        name: shopName.trim(),
        shopCode: shopCode.trim().toUpperCase(),
        campusId: selectedLoc.campusId,
        campusName: selectedLoc.campusName,
        locationId: selectedLoc.id,
        locationName: selectedLoc.name,
        specificArea: specificArea.trim() || `Shop ${shopCode}`,
        locationDescription: locationDescription.trim() || `${selectedLoc.name}, Shop ${shopCode}`,
        description: description.trim() || `Campus business centre and service shop at ${selectedLoc.name}.`,
        servicesOffered: selectedServices,
        openingHours,
        closingHours,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        manualStatusOverride: 'auto',
        pickupInstructions: pickupInstructions.trim(),
        photos: photos,
        coverPhoto: photos.length > 0 ? photos[0] : '',
        verificationStatus: 'pending',
        rating: 5.0,
        reviewsCount: 0,
        totalOrdersCount: 0,
        totalRevenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setCreatedShopId(newShopId);
      setIsSuccess(true);
    } catch (err: any) {
      alert('Failed to register shop: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#061A4F]">
            Shop Registration Submitted!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your application for <strong className="text-slate-900">{shopName} (Shop {shopCode})</strong> at Motion Ground/Campus has been received. Our compliance team will review your location details and activate your shop profile.
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left space-y-2 max-w-md mx-auto">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Next Steps:</span>
          </div>
          <p>
            1. An admin will physically verify your kiosk code or documentation at OOU.
            <br />
            2. Once approved, you will receive customer printing requests & orders in your Shop Owner Dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('/campus')}
            className="px-6 py-3 rounded-xl bg-[#061A4F] text-white font-bold text-xs hover:bg-[#0A2265] transition"
          >
            Explore Campus Hub
          </button>
          <button
            onClick={() => onNavigate('/campus/shop/dashboard')}
            className="px-6 py-3 rounded-xl bg-[#F5B400] text-[#061A4F] font-bold text-xs hover:bg-[#e0a400] transition"
          >
            Go to Shop Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate('/campus')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#061A4F] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campus Services Hub</span>
      </button>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#061A4F] text-white space-y-3 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold">
          <Store className="w-3.5 h-3.5" />
          <span>Vendor & Business Centre Partner Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Register Your Physical Campus Shop
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Connect your business center at Motion Ground, Campus Gate, or SUB to thousands of OOU students, lecturers, and incoming aspirants who order before arriving on campus.
        </p>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm text-slate-800">
        
        {/* Section 1: Shop Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F] uppercase tracking-wider pb-2 border-b border-slate-100">
            <Store className="w-4 h-4 text-[#F5B400]" />
            <span>1. Shop Identity & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Shop / Business Name *</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Alhaja Biz Venture, Campus Cyber"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                Shop Code (Unique Kiosk / Shop #) *
              </label>
              <input
                type="text"
                required
                value={shopCode}
                onChange={(e) => setShopCode(e.target.value.toUpperCase())}
                placeholder="e.g. E6, B2, G1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:border-[#061A4F]"
              />
              <span className="text-[10px] text-slate-400">Used for customer reference codes (e.g. SC-MG-E6-XXXX)</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Campus Location Zone *</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.campusName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Specific Area / Line *</label>
              <input
                type="text"
                required
                value={specificArea}
                onChange={(e) => setSpecificArea(e.target.value)}
                placeholder="e.g. Block E, Center Line, Beside Zenith ATM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Full Location Description & Landmarks</label>
            <input
              type="text"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              placeholder="e.g. Motion Ground, Shop Block E, Shop E6, facing the main quadrangle"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Shop Bio & Specializations</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your equipment, turnaround speed, print quality, and experience..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
            />
          </div>
        </div>

        {/* Section 2: Owner & Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F] uppercase tracking-wider pb-2 border-b border-slate-100">
            <Phone className="w-4 h-4 text-[#F5B400]" />
            <span>2. Owner & Contact Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Owner Full Name *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Alhaja Kudirat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Phone Number *</label>
              <input
                type="tel"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="+234 803 445 9988"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+234 803 445 9988"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Services Offered */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F] uppercase tracking-wider pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-[#F5B400]" />
            <span>3. Services Offered</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allServiceOptions.map((srv) => {
              const isChecked = selectedServices.includes(srv);
              return (
                <div
                  key={srv}
                  onClick={() => handleToggleService(srv)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    isChecked
                      ? 'border-[#061A4F] bg-[#061A4F]/5 text-[#061A4F] font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{srv}</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isChecked ? 'bg-[#061A4F] border-[#061A4F] text-white' : 'border-slate-300'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Storefront & Equipment Photography */}
        <div className="space-y-4 pt-2">
          <MediaUploader
            storagePathPrefix={`shops/${shopCode || 'new'}/photos`}
            images={photos}
            onChange={setPhotos}
            maxImages={4}
            label="4. Storefront & Workshop Photos (Upload from Device)"
            helperText="Upload clear pictures of your shop exterior, kiosk number, printing equipment, and counter."
            aspectRatio="video"
            allowPrimarySelection={true}
          />
        </div>

        {/* Section 5: Operating Hours & Pickup */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#061A4F] uppercase tracking-wider pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-[#F5B400]" />
            <span>5. Working Hours & Pickup Instructions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Opening Time</label>
              <input
                type="time"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Closing Time</label>
              <input
                type="time"
                value={closingHours}
                onChange={(e) => setClosingHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Customer Pickup Instructions</label>
            <textarea
              rows={2}
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              placeholder="e.g. Present your StudentCircle order reference at the counter. Printouts are pre-sealed in envelopes."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-[#061A4F] hover:bg-[#0A2265] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <span>Submit Shop for Admin Verification</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
