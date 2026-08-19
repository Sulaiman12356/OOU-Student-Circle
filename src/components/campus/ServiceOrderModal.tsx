import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  MapPin, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CampusShop, CampusService, UploadedServiceDoc } from '../../types/campus';
import { CampusStore } from '../../services/campusStore';
import { useAuth } from '../../context/AuthContext';

interface ServiceOrderModalProps {
  shop: CampusShop;
  services: CampusService[];
  preSelectedService?: CampusService;
  onClose: () => void;
  onOrderSuccess: (referenceNumber: string) => void;
}

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
  shop,
  services,
  preSelectedService,
  onClose,
  onOrderSuccess
}) => {
  const { currentUser } = useAuth();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preSelectedService?.id || (services[0]?.id || '')
  );

  const selectedService = services.find(s => s.id === selectedServiceId) || preSelectedService;

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phoneNumber || '+234 ');
  const [customerType, setCustomerType] = useState<'student' | 'aspirant' | 'guest'>(
    currentUser?.isAspirant ? 'aspirant' : (currentUser?.role === 'student' ? 'student' : 'guest')
  );
  const [matricOrJamb, setMatricOrJamb] = useState(
    currentUser?.matricNumber || currentUser?.jambRegNumber || ''
  );

  // Specifications
  const [copies, setCopies] = useState<number>(1);
  const [estimatedPages, setEstimatedPages] = useState<number>(20);
  const [colorMode, setColorMode] = useState<'black_white' | 'color' | 'mixed'>('black_white');
  const [paperSize, setPaperSize] = useState<string>('A4 Standard (80gsm)');
  const [bindingType, setBindingType] = useState<string>('None');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [preferredPickupDate, setPreferredPickupDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredPickupTime, setPreferredPickupTime] = useState<string>('14:00');

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedServiceDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'wallet'>('paystack');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Price Calculation
  const calculatePricing = () => {
    if (!selectedService) {
      return { subtotal: 0, platformCommission: 0, processingFee: 0, netShopEarnings: 0, totalAmount: 0, isQuoteRequired: false };
    }

    if (selectedService.pricingType === 'quote_required') {
      return { subtotal: 0, platformCommission: 0, processingFee: 0, netShopEarnings: 0, totalAmount: 0, isQuoteRequired: true };
    }

    let unit = selectedService.unitPrice;
    let base = 0;

    if (selectedService.pricingType === 'per_page') {
      const pageCost = colorMode === 'color' ? 150 : (colorMode === 'mixed' ? 80 : unit);
      base = pageCost * estimatedPages * copies;
    } else if (selectedService.pricingType === 'per_copy' || selectedService.pricingType === 'per_item') {
      base = unit * copies;
    } else {
      // Fixed price
      base = unit * copies;
    }

    // Add binding cost if applicable
    if (bindingType.includes('Hardcover')) {
      base += 2500 * copies;
    } else if (bindingType.includes('Spiral')) {
      base += 500 * copies;
    }

    const platformCommission = Math.round(base * 0.10);
    const processingFee = 100;
    const totalAmount = base + processingFee;
    const netShopEarnings = base - platformCommission;

    return {
      subtotal: base,
      platformCommission,
      processingFee,
      netShopEarnings,
      totalAmount,
      isQuoteRequired: false
    };
  };

  const pricing = calculatePricing();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const newDocs: UploadedServiceDoc[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 25 * 1024 * 1024) {
          setUploadError(`File ${file.name} exceeds the 25MB limit.`);
          continue;
        }
        newDocs.push({
          id: `doc-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString()
        });
      }
      setUploadedFiles(prev => [...prev, ...newDocs]);
    } catch (err: any) {
      setUploadError('Failed to process file upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (docId: string) => {
    setUploadedFiles(prev => prev.filter(d => d.id !== docId));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please provide your name and phone number.');
      return;
    }

    if (selectedService?.requiresDocumentUpload && uploadedFiles.length === 0) {
      alert('Please upload your document file before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = CampusStore.createOrder({
        customerId: currentUser?.id || `guest-${Date.now()}`,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerType,
        customerMatricOrJamb: matricOrJamb.trim(),
        shopId: shop.id,
        shopName: shop.name,
        shopCode: shop.shopCode,
        locationName: shop.locationName,
        serviceId: selectedService?.id || '',
        serviceName: selectedService?.title || 'Campus Service',
        serviceCategory: selectedService?.category || 'General',
        uploadedFiles,
        specifications: {
          copies,
          colorMode,
          paperSize,
          bindingType,
          customNotes,
          preferredPickupDate,
          preferredPickupTime
        },
        pricing: {
          pricingType: selectedService?.pricingType || 'fixed',
          subtotal: pricing.subtotal,
          platformCommission: pricing.platformCommission,
          processingFee: pricing.processingFee,
          netShopEarnings: pricing.netShopEarnings,
          totalAmount: pricing.totalAmount,
          isQuoteAccepted: !pricing.isQuoteRequired
        },
        status: pricing.isQuoteRequired ? 'request_submitted' : 'payment_confirmed',
        payment: {
          status: pricing.isQuoteRequired ? 'pending' : 'paid',
          paymentMethod: paymentMethod === 'paystack' ? 'paystack' : 'wallet',
          reference: `PSTK_CAMPUS_${Math.floor(100000 + Math.random() * 900000)}`,
          paidAt: pricing.isQuoteRequired ? undefined : new Date().toISOString()
        }
      });

      onOrderSuccess(order.referenceNumber);
    } catch (err: any) {
      alert('Could not submit order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#061A4F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>{shop.locationName}</span>
                <span>•</span>
                <span>Shop {shop.shopCode}</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Request Service from {shop.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* 1. Service Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Service Required:
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-[#061A4F] bg-slate-50 focus:bg-white transition"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.priceDescription || `₦${s.unitPrice}`})
                </option>
              ))}
            </select>
            {selectedService && (
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedService.description}
              </p>
            )}
          </div>

          {/* 2. Customer Identity */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Contact Details:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomerType('student')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    customerType === 'student'
                      ? 'bg-[#061A4F] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('aspirant')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    customerType === 'aspirant'
                      ? 'bg-[#F5B400] text-[#061A4F]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Aspirant
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('guest')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    customerType === 'guest'
                      ? 'bg-[#061A4F] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Visitor / Guest
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Adebayo Samuel"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+234 812 345 6789"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Email Address (Optional)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  {customerType === 'student' ? 'Matriculation Number' : (customerType === 'aspirant' ? 'JAMB Reg. Number' : 'ID / Reference')}
                </label>
                <input
                  type="text"
                  value={matricOrJamb}
                  onChange={(e) => setMatricOrJamb(e.target.value)}
                  placeholder={customerType === 'aspirant' ? 'e.g. 202410884920AB' : 'e.g. CSC/2021/0482'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                />
              </div>
            </div>
          </div>

          {/* 3. Document Upload Area */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Upload Document or File:
              </span>
              <span className="text-[11px] text-slate-500">PDF, DOCX, DOC, JPG, PNG (Max 25MB)</span>
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-[#061A4F] rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="p-3 bg-white rounded-full shadow-sm text-[#061A4F] border border-slate-200">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Click or drag files here to upload
                </div>
                <div className="text-[11px] text-slate-500">
                  Direct encrypted upload for shop review and instant printing
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600">Attached Documents ({uploadedFiles.length}):</div>
                {uploadedFiles.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#061A4F] shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{doc.name}</span>
                      <span className="text-slate-500 text-[10px]">({Math.round(doc.size / 1024)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(doc.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Service Specifics & Printing Options */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Printing & Binding Specifications:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Number of Copies</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                />
              </div>

              {selectedService?.pricingType === 'per_page' && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Est. Total Pages</label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedPages}
                    onChange={(e) => setEstimatedPages(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Colour Mode</label>
                <select
                  value={colorMode}
                  onChange={(e: any) => setColorMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                >
                  <option value="black_white">Black & White (₦50/pg)</option>
                  <option value="color">Full Colour High-Def (₦150/pg)</option>
                  <option value="mixed">Mixed (Colour charts + B&W body)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Binding Preference</label>
                <select
                  value={bindingType}
                  onChange={(e) => setBindingType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                >
                  <option value="None">No Binding (Loose Sheets in Folder)</option>
                  <option value="Plastic Spiral Comb (+₦500)">Plastic Spiral Comb (+₦500)</option>
                  <option value="Official Hardcover (Gold Foil) (+₦2,500)">Official Hardcover (Gold Foil) (+₦2,500)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Preferred Pickup Date</label>
                <input
                  type="date"
                  value={preferredPickupDate}
                  onChange={(e) => setPreferredPickupDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Preferred Pickup Time</label>
                <input
                  type="time"
                  value={preferredPickupTime}
                  onChange={(e) => setPreferredPickupTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Special Instructions / Page Notes</label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Please print page 1-3 in color, print double-sided for chapter 2, use navy blue hardcover..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#061A4F]"
              />
            </div>
          </div>

          {/* 5. Pricing Summary & Payment */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Order Summary:</span>
              <span className="text-emerald-700 flex items-center gap-1 font-semibold normal-case">
                <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
              </span>
            </div>

            {pricing.isQuoteRequired ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                <strong>Custom Quote Service:</strong> The shop will review your attached files and submit a binding price quote within 15–30 minutes. You can accept or decline before payment.
              </div>
            ) : (
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Service Subtotal ({copies} {copies > 1 ? 'copies' : 'copy'}):</span>
                  <span className="font-semibold text-slate-800">₦{(pricing.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Campus Platform Processing Fee:</span>
                  <span>₦{pricing.processingFee || 0}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-[#061A4F]">
                  <span>Total Due:</span>
                  <span className="text-base text-emerald-700">₦{(pricing.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            )}

            {!pricing.isQuoteRequired && (
              <div className="pt-2 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-2">Payment Method:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paystack')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'paystack'
                        ? 'border-[#061A4F] bg-[#061A4F] text-white shadow-sm'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Paystack / Card / Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'wallet'
                        ? 'border-[#061A4F] bg-[#061A4F] text-white shadow-sm'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>StudentCircle Wallet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#061A4F] hover:bg-[#0A2265] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Request...</span>
              ) : pricing.isQuoteRequired ? (
                <>
                  <span>Submit Request for Shop Quote</span>
                  <ArrowRight className="w-4 h-4 text-[#F5B400]" />
                </>
              ) : (
                <>
                  <span>Confirm Order & Pay ₦{(pricing.totalAmount || 0).toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4 text-[#F5B400]" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Pickup directly at {shop.name} ({shop.locationName} Shop {shop.shopCode}) with your Order Reference.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
