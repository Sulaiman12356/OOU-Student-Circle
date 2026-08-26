import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { OouLogo } from '../../components/brand/OouLogo';
import { ProfileImageUploader } from '../../components/common/ProfileImageUploader';
import { UserRole, StudentLevel, getRoleDashboardPath } from '../../types';
import { 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  Store, 
  ShoppingBag, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  MapPin,
  FileText,
  Clock,
  ShieldAlert,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
  initialRole?: UserRole;
}

type RegistrationType = 
  | 'STUDENT' 
  | 'CLIENT' 
  | 'ASPIRANT' 
  | 'CAMPUS_SHOP_OWNER' 
  | 'MARKET_VENDOR' 
  | 'SERVICE_PROVIDER';

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, initialRole }) => {
  const { register, isLoading } = useAuth();
  
  // Account Type Selection
  const [accountType, setAccountType] = useState<RegistrationType>(() => {
    if (initialRole) {
      const up = initialRole.toUpperCase();
      if (up === 'CLIENT') return 'CLIENT';
      if (up === 'ASPIRANT') return 'ASPIRANT';
      if (up === 'CAMPUS_SHOP_OWNER') return 'CAMPUS_SHOP_OWNER';
      if (up === 'MARKET_VENDOR') return 'MARKET_VENDOR';
      if (up === 'SERVICE_PROVIDER') return 'SERVICE_PROVIDER';
    }
    return 'STUDENT';
  });

  // Common credentials
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [location, setLocation] = useState('Ago-Iwoye Main Campus');

  // Student specific
  const [faculty, setFaculty] = useState('Faculty of Science');
  const [department, setDepartment] = useState('Computer Science');
  const [level, setLevel] = useState<StudentLevel>('200L');
  const [matricNumber, setMatricNumber] = useState('');
  const [skillsInput, setSkillsInput] = useState('Graphic Design, Web Development');
  const [shortBio, setShortBio] = useState('Enthusiastic OOU student looking forward to work opportunities.');

  // Client specific
  const [businessName, setBusinessName] = useState('');
  const [clientType, setClientType] = useState('Business / Company');
  const [businessCategory, setBusinessCategory] = useState('Creative Agency');
  const [businessDescription, setBusinessDescription] = useState('');

  // Aspirant specific
  const [jambRegNumber, setJambRegNumber] = useState('');
  const [intendedCourse, setIntendedCourse] = useState('Computer Science');
  const [preferredCampus, setPreferredCampus] = useState('Ago-Iwoye Main Campus');
  const [entrySession, setEntrySession] = useState('2024/2025');

  // Campus Shop Owner specific
  const [shopName, setShopName] = useState('');
  const [shopCode, setShopCode] = useState('');
  const [shopCategory, setShopCategory] = useState('Printing & Cybercafe');
  const [servicesOffered, setServicesOffered] = useState('Printing, Photocopy, Project Binding, Spiral Binding, Online Registrations');
  const [openingInfo, setOpeningInfo] = useState('Mon - Sat: 8:00 AM - 6:00 PM');
  const [shopAddress, setShopAddress] = useState('Motion Ground Complex, Main Campus');
  const [shopDescription, setShopDescription] = useState('');

  // Student Market Vendor specific
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [productCategories, setProductCategories] = useState('Fashion, Shoes, Electronics, Campus Essentials');
  const [vendorBusinessInfo, setVendorBusinessInfo] = useState('');

  // Student Service Provider specific
  const [providerTitle, setProviderTitle] = useState('');
  const [services, setServices] = useState('Logo Design, Brand Identity, UI Design');
  const [pricingInfo, setPricingInfo] = useState('Affordable student-friendly rates. Starting from ₦5,000');
  const [availability, setAvailability] = useState('Available Now');

  // Status & notifications
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    isPendingVerification: boolean;
    redirectPath: string;
  } | null>(null);

  const faculties = [
    'Faculty of Science',
    'Faculty of Arts',
    'Faculty of Social Sciences',
    'Faculty of Administration & Management',
    'Faculty of Education',
    'Faculty of Law',
    'Faculty of Engineering',
    'College of Health Sciences',
    'Faculty of Pharmacy',
    'Faculty of Agricultural Sciences',
    'Faculty of Basic Medical Sciences'
  ];

  const campuses = [
    'Ago-Iwoye Main Campus',
    'Sagamu Medical Campus',
    'Ayetoro Agricultural Campus',
    'Ibogun Engineering Campus',
    'Mini Campus, Ago-Iwoye',
    'Remote / Online'
  ];

  const accountTypeCards = [
    {
      type: 'STUDENT' as RegistrationType,
      title: 'Existing OOU Student',
      tagline: 'Academic profile, freelance talent & earnings',
      icon: GraduationCap,
      accentColor: 'text-[#061A4F]',
      badge: 'Popular'
    },
    {
      type: 'CLIENT' as RegistrationType,
      title: 'OOU Client / Recruiter',
      tagline: 'Hire top-tier student freelancers & post tasks',
      icon: Briefcase,
      accentColor: 'text-amber-600',
      badge: 'Hire'
    },
    {
      type: 'ASPIRANT' as RegistrationType,
      title: 'New Aspirant',
      tagline: 'OOU admission seeker, campus guidance & info',
      icon: Sparkles,
      accentColor: 'text-emerald-600',
      badge: 'New'
    },
    {
      type: 'CAMPUS_SHOP_OWNER' as RegistrationType,
      title: 'Campus Shop Owner',
      tagline: 'Official campus store, printing shop or hub',
      icon: Store,
      accentColor: 'text-blue-600',
      badge: 'Verified Shop'
    },
    {
      type: 'MARKET_VENDOR' as RegistrationType,
      title: 'Student Market Vendor',
      tagline: 'Sell physical goods & products on student market',
      icon: ShoppingBag,
      accentColor: 'text-purple-600',
      badge: 'Sell'
    },
    {
      type: 'SERVICE_PROVIDER' as RegistrationType,
      title: 'Student Service Provider',
      tagline: 'Offer specialized campus services & skills',
      icon: Wrench,
      accentColor: 'text-teal-600',
      badge: 'Services'
    }
  ];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid phone number for SMS/WhatsApp verification.');
      return;
    }

    // Role-specific validations
    if (accountType === 'STUDENT' && !matricNumber.trim()) {
      setErrorMessage('Please provide your OOU Matriculation Number for verification.');
      return;
    }

    if (accountType === 'ASPIRANT' && !jambRegNumber.trim()) {
      setErrorMessage('Please enter your valid JAMB Registration Number.');
      return;
    }

    if (accountType === 'CAMPUS_SHOP_OWNER') {
      if (!shopName.trim()) {
        setErrorMessage('Please enter your official Campus Shop Name.');
        return;
      }
      if (!shopCode.trim()) {
        setErrorMessage('Please specify your Shop Code (e.g. E6, MG12).');
        return;
      }
    }

    if (accountType === 'MARKET_VENDOR' && !storeName.trim()) {
      setErrorMessage('Please provide your Store / Brand Name.');
      return;
    }

    if (accountType === 'SERVICE_PROVIDER' && !providerTitle.trim()) {
      setErrorMessage('Please state your Professional Service Title (e.g. Graphics Designer, Tutor).');
      return;
    }

    // Payload construction
    const registrationPayload: any = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      profilePhoto: profilePhoto || undefined,
      location,
      role: accountType
    };

    if (accountType === 'STUDENT') {
      registrationPayload.faculty = faculty;
      registrationPayload.department = department.trim();
      registrationPayload.level = level;
      registrationPayload.matricNumber = matricNumber.trim().toUpperCase();
      registrationPayload.skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      registrationPayload.shortBio = shortBio.trim();
    } else if (accountType === 'CLIENT') {
      registrationPayload.businessName = businessName.trim() || fullName.trim();
      registrationPayload.clientType = clientType;
      registrationPayload.businessCategory = businessCategory.trim();
      registrationPayload.businessDescription = businessDescription.trim();
    } else if (accountType === 'ASPIRANT') {
      registrationPayload.jambRegNumber = jambRegNumber.trim().toUpperCase();
      registrationPayload.intendedCourse = intendedCourse.trim();
      registrationPayload.preferredCampus = preferredCampus;
      registrationPayload.entrySession = entrySession;
      registrationPayload.isAspirant = true;
    } else if (accountType === 'CAMPUS_SHOP_OWNER') {
      registrationPayload.shopName = shopName.trim();
      registrationPayload.shopCode = shopCode.trim().toUpperCase();
      registrationPayload.shopCategory = shopCategory;
      registrationPayload.servicesOffered = servicesOffered.split(',').map(s => s.trim()).filter(Boolean);
      registrationPayload.openingInfo = openingInfo;
      registrationPayload.shopAddress = shopAddress.trim();
      registrationPayload.shopDescription = shopDescription.trim();
      registrationPayload.shopContactPhone = phoneNumber.trim();
      registrationPayload.shopWhatsapp = phoneNumber.trim();
    } else if (accountType === 'MARKET_VENDOR') {
      registrationPayload.storeName = storeName.trim();
      registrationPayload.storeDescription = storeDescription.trim();
      registrationPayload.productCategories = productCategories.split(',').map(s => s.trim()).filter(Boolean);
      registrationPayload.vendorBusinessInfo = vendorBusinessInfo.trim();
      registrationPayload.vendorPhone = phoneNumber.trim();
      registrationPayload.vendorWhatsapp = phoneNumber.trim();
    } else if (accountType === 'SERVICE_PROVIDER') {
      registrationPayload.providerTitle = providerTitle.trim();
      registrationPayload.services = services.split(',').map(s => s.trim()).filter(Boolean);
      registrationPayload.pricingInfo = pricingInfo.trim();
      registrationPayload.availability = availability;
      registrationPayload.department = department.trim();
    }

    const res = await register(registrationPayload, password);

    if (res.success && res.user) {
      const dest = res.redirectPath || getRoleDashboardPath(res.role, res.user);
      setSuccessInfo({
        message: res.message || 'Your StudentCircle account has been created successfully!',
        isPendingVerification: !!res.verificationPending,
        redirectPath: dest
      });
    } else {
      setErrorMessage(res.error || 'Failed to create account. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center selection:bg-[#F5B400] selection:text-[#061A4F]">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-3">
        <div 
          onClick={() => onNavigate('/')} 
          className="cursor-pointer inline-flex items-center justify-center p-2 rounded-2xl hover:bg-white transition shadow-xs"
        >
          <OouLogo size="md" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#061A4F] tracking-tight">
            Create Your StudentCircle Account
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-lg mx-auto">
            Choose your account type to access specialized campus features, marketplace listings and verified services.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-7">
          
          {/* Post-registration Success Banner */}
          {successInfo ? (
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-[#061A4F]">
                  Registration Successful!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {successInfo.message}
                </p>
                {successInfo.isPendingVerification && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-[#061A4F] max-w-md mx-auto text-left space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-blue-600" />
                      <span>Verification Underway</span>
                    </div>
                    <p className="text-slate-600">
                      Your campus shop profile has been registered. It will be verified by campus moderators before being tagged as an official verified shop.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNavigate(successInfo.redirectPath)}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center justify-center gap-2"
              >
                <span>Proceed to Your Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#F5B400]" />
              </button>
            </div>
          ) : (
            <>
              {/* Account Type Selector Grid */}
              <div className="space-y-2.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Select Account Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {accountTypeCards.map((item) => {
                    const Icon = item.icon;
                    const isSelected = accountType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          setAccountType(item.type);
                          setErrorMessage('');
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#061A4F] bg-blue-50/50 shadow-xs'
                            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#061A4F] text-white' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#F5B400] text-[#061A4F]">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-400">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <div className="mt-3">
                          <div className="text-xs font-black text-[#061A4F] leading-tight">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                            {item.tagline}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-6">

                {/* Profile Photo Uploader */}
                <ProfileImageUploader
                  value={profilePhoto}
                  onChange={(val) => setProfilePhoto(val)}
                  label={
                    accountType === 'CAMPUS_SHOP_OWNER'
                      ? 'Shop Logo / Front Photo (from Device)'
                      : accountType === 'MARKET_VENDOR'
                      ? 'Store Logo / Profile Picture (from Device)'
                      : 'Profile Photograph (from Device)'
                  }
                  helperText="Select or drag a clear JPG, JPEG, PNG, or WEBP file from your phone or computer."
                />

                {/* Core Account Information */}
                <div className="space-y-4">
                  <div className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5 pb-1 border-b border-slate-100">
                    <User className="w-3.5 h-3.5 text-[#F5B400]" />
                    <span>Personal & Contact Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        {accountType === 'CAMPUS_SHOP_OWNER' ? 'Owner / Manager Full Name *' : 'Full Name *'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Babatunde Sulaiman"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. user@email.com"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Account Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Phone Number / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 08012345678"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Primary Campus Location *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#061A4F]/20 focus:border-[#061A4F] transition"
                      >
                        {campuses.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* TYPE 1: STUDENT SPECIFIC FIELDS */}
                {accountType === 'STUDENT' && (
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <GraduationCap className="w-3.5 h-3.5 text-[#F5B400]" />
                      <span>OOU Academic Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Faculty *</label>
                        <select
                          value={faculty}
                          onChange={(e) => setFaculty(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        >
                          {faculties.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Department *</label>
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Academic Level *</label>
                        <select
                          value={level}
                          onChange={(e) => setLevel(e.target.value as StudentLevel)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        >
                          <option value="100L">100L</option>
                          <option value="200L">200L</option>
                          <option value="300L">300L</option>
                          <option value="400L">400L</option>
                          <option value="500L">500L</option>
                          <option value="Postgraduate">Postgraduate</option>
                          <option value="Alumni">Alumni</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          Matriculation Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={matricNumber}
                          onChange={(e) => setMatricNumber(e.target.value)}
                          placeholder="e.g. FOS/21/22/0458"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Core Skills / Offerings (comma separated)
                      </label>
                      <input
                        type="text"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="e.g. Web Development, Graphics Design, Video Editing, Writing"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                      />
                    </div>
                  </div>
                )}

                {/* TYPE 2: CLIENT SPECIFIC FIELDS */}
                {accountType === 'CLIENT' && (
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <Briefcase className="w-3.5 h-3.5 text-[#F5B400]" />
                      <span>Client & Business Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Brand / Business Name</label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Apex Media Agency or Personal Client"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Client Type</label>
                        <select
                          value={clientType}
                          onChange={(e) => setClientType(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        >
                          <option value="Individual Client">Individual Client</option>
                          <option value="Campus Organization / SUG">Campus Organization / SUG</option>
                          <option value="Small Business / Startup">Small Business / Startup</option>
                          <option value="Corporate / Company">Corporate / Company</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Business Description / Hiring Goals</label>
                      <textarea
                        rows={2}
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                        placeholder="Briefly describe what kind of talent, services or projects you intend to commission..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                      />
                    </div>
                  </div>
                )}

                {/* TYPE 3: ASPIRANT SPECIFIC FIELDS */}
                {accountType === 'ASPIRANT' && (
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
                      <span>OOU Aspirant Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          JAMB Registration Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={jambRegNumber}
                          onChange={(e) => setJambRegNumber(e.target.value)}
                          placeholder="e.g. 202410298374CA"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                        <span className="text-[10px] text-slate-500">
                          Sensitive info: Encrypted and kept confidential for verification only.
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Intended Course of Study *</label>
                        <input
                          type="text"
                          required
                          value={intendedCourse}
                          onChange={(e) => setIntendedCourse(e.target.value)}
                          placeholder="e.g. Computer Science, Law, Medicine"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Preferred Campus</label>
                        <select
                          value={preferredCampus}
                          onChange={(e) => setPreferredCampus(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        >
                          {campuses.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Admission Session</label>
                        <input
                          type="text"
                          value={entrySession}
                          onChange={(e) => setEntrySession(e.target.value)}
                          placeholder="e.g. 2024/2025"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TYPE 4: CAMPUS SHOP OWNER SPECIFIC FIELDS */}
                {accountType === 'CAMPUS_SHOP_OWNER' && (
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <Store className="w-3.5 h-3.5 text-[#F5B400]" />
                      <span>Campus Shop Information (Verification Required)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Shop Name *</label>
                        <input
                          type="text"
                          required
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          placeholder="e.g. Success Cybercafe & Print Hub"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          Shop Code * (e.g. E6, MG04)
                        </label>
                        <input
                          type="text"
                          required
                          value={shopCode}
                          onChange={(e) => setShopCode(e.target.value)}
                          placeholder="e.g. E6"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Shop Category</label>
                        <select
                          value={shopCategory}
                          onChange={(e) => setShopCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        >
                          <option value="Printing & Cybercafe">Printing & Cybercafe</option>
                          <option value="Food & Restaurant">Food & Restaurant</option>
                          <option value="Gadgets & Phone Repairs">Gadgets & Phone Repairs</option>
                          <option value="Stationeries & Books">Stationeries & Books</option>
                          <option value="Fashion & Tailoring">Fashion & Tailoring</option>
                          <option value="Hair Salon & Barber">Hair Salon & Barber</option>
                          <option value="Grocery & Provisions">Grocery & Provisions</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Opening Hours</label>
                        <input
                          type="text"
                          value={openingInfo}
                          onChange={(e) => setOpeningInfo(e.target.value)}
                          placeholder="e.g. Mon - Sat: 8:00 AM - 6:00 PM"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Physical Location / Address</label>
                      <input
                        type="text"
                        value={shopAddress}
                        onChange={(e) => setShopAddress(e.target.value)}
                        placeholder="e.g. Shop 12, Motion Ground Complex, Ago-Iwoye Main Campus"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Services Offered (comma separated)</label>
                      <input
                        type="text"
                        value={servicesOffered}
                        onChange={(e) => setServicesOffered(e.target.value)}
                        placeholder="e.g. Document Printing, Hardcover Project Binding, Online Course Registration"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                      />
                    </div>
                  </div>
                )}

                {/* TYPE 5: STUDENT MARKET VENDOR SPECIFIC FIELDS */}
                {accountType === 'MARKET_VENDOR' && (
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#F5B400]" />
                      <span>Marketplace Store Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Store / Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="e.g. OOU Campus Wears & Sneakers"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Product Categories</label>
                        <input
                          type="text"
                          value={productCategories}
                          onChange={(e) => setProductCategories(e.target.value)}
                          placeholder="e.g. Fashion, Shoes, Gadgets, Food, Perfumes"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Store Bio & Delivery Info</label>
                      <textarea
                        rows={2}
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        placeholder="Briefly describe what you sell, dispatch methods across Ago-Iwoye/Sagamu/Ayetoro, and warranty details..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                      />
                    </div>
                  </div>
                )}

                {/* TYPE 6: STUDENT SERVICE PROVIDER SPECIFIC FIELDS */}
                {accountType === 'SERVICE_PROVIDER' && (
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-black uppercase tracking-wider text-[#061A4F] flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <Wrench className="w-3.5 h-3.5 text-[#F5B400]" />
                      <span>Service Offerings & Pricing</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Professional Service Title *</label>
                        <input
                          type="text"
                          required
                          value={providerTitle}
                          onChange={(e) => setProviderTitle(e.target.value)}
                          placeholder="e.g. Certified Web & Graphic Designer"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Availability</label>
                        <select
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        >
                          <option value="Available Now">Available Now</option>
                          <option value="Weekdays (8am - 6pm)">Weekdays (8am - 6pm)</option>
                          <option value="Weekends Only">Weekends Only</option>
                          <option value="By Appointment">By Appointment</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Services (comma separated)</label>
                        <input
                          type="text"
                          value={services}
                          onChange={(e) => setServices(e.target.value)}
                          placeholder="e.g. Logo Design, Flyer Design, Web App Development"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Pricing / Rates</label>
                        <input
                          type="text"
                          value={pricingInfo}
                          onChange={(e) => setPricingInfo(e.target.value)}
                          placeholder="e.g. From ₦5,000 / project"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#061A4F]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group disabled:opacity-50 mt-6"
                >
                  <span>{isLoading ? 'Creating Account & Validating...' : 'CREATE MY ACCOUNT'}</span>
                  <ArrowRight className="w-4 h-4 text-[#F5B400] group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Back to Login Footer */}
              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1">
                <div>
                  Already registered on StudentCircle?{' '}
                  <button
                    onClick={() => onNavigate('/auth/login')}
                    className="font-extrabold text-[#061A4F] hover:underline"
                  >
                    Click here to Login
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
