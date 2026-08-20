import React, { useState } from 'react';
import { 
  Opportunity, 
  OpportunityType, 
  OpportunityCategory, 
  WorkMode,
  OpportunityAttachment 
} from '../../types/opportunities';
import { useAuth } from '../../context/AuthContext';
import { OpportunityStore } from '../../services/opportunityStore';
import { MediaUploader } from '../common/MediaUploader';
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Building2, 
  GraduationCap, 
  FileText, 
  Upload, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface OpportunityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: Opportunity) => void;
  initialData?: Partial<Opportunity>;
}

export const OpportunityCreateModal: React.FC<OpportunityCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData
}) => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState(initialData?.title || '');
  const [opportunityType, setOpportunityType] = useState<OpportunityType>(initialData?.opportunityType || 'job');
  const [category, setCategory] = useState<OpportunityCategory>(initialData?.category || 'Student Jobs');
  const [organizationName, setOrganizationName] = useState(
    initialData?.organizationName || currentUser?.businessName || currentUser?.fullName || 'OOU Student Enterprise'
  );
  const [organizationLogo, setOrganizationLogo] = useState(initialData?.organizationLogo || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [budgetAmount, setBudgetAmount] = useState<number>(
    typeof initialData?.budget === 'number' ? initialData.budget : 25000
  );
  const [budgetType, setBudgetType] = useState<'fixed' | 'stipend' | 'prize' | 'grant' | 'unpaid'>(
    initialData?.budgetType || 'fixed'
  );
  const [deadline, setDeadline] = useState(
    initialData?.deadline 
      ? new Date(initialData.deadline).toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [location, setLocation] = useState(initialData?.location || 'Ago-Iwoye Main Campus');
  const [campus, setCampus] = useState(initialData?.campus || 'Ago-Iwoye Main Campus');
  const [workMode, setWorkMode] = useState<WorkMode>(initialData?.workMode || 'hybrid');

  // Dynamic lists
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements?.length ? initialData.requirements : ['Strong communication and punctuality', 'Basic experience in the relevant domain']
  );
  const [reqInput, setReqInput] = useState('');

  const [responsibilities, setResponsibilities] = useState<string[]>(
    initialData?.responsibilities?.length ? initialData.responsibilities : ['Deliver assigned tasks according to agreed milestone deadlines']
  );
  const [respInput, setRespInput] = useState('');

  const [eligibility, setEligibility] = useState<string[]>(
    initialData?.eligibility?.length ? initialData.eligibility : ['Open to currently enrolled OOU undergraduates']
  );
  const [eligInput, setEligInput] = useState('');

  const [targetFaculties, setTargetFaculties] = useState<string[]>(
    initialData?.targetFaculties || ['All Faculties']
  );

  const [targetLevels, setTargetLevels] = useState<string[]>(
    initialData?.targetLevels || ['200L', '300L', '400L']
  );

  const [attachments, setAttachments] = useState<OpportunityAttachment[]>(
    initialData?.attachments || []
  );
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen || !currentUser) return null;

  const opportunityTypes: { value: OpportunityType; label: string }[] = [
    { value: 'job', label: 'Job (Student / Freelance)' },
    { value: 'internship', label: 'Internship / Industrial Work' },
    { value: 'siwes', label: 'SIWES Industrial Training' },
    { value: 'scholarship', label: 'Scholarship / Tuition Grant' },
    { value: 'competition', label: 'Competition / Hackathon / Pitch' },
    { value: 'fellowship', label: 'Fellowship / Incubator' },
    { value: 'project', label: 'Project / Capstone Collaboration' },
    { value: 'program', label: 'Enterprise & Entrepreneurship Program' }
  ];

  const categories: OpportunityCategory[] = [
    'Student Jobs',
    'Freelance Jobs',
    'Internships',
    'SIWES opportunities',
    'Projects',
    'Competitions',
    'Scholarships',
    'Fellowships',
    'Entrepreneurship opportunities',
    'Enterprise opportunities'
  ];

  const campuses = [
    'Ago-Iwoye Main Campus',
    'Sagamu Medical Campus',
    'Ayetoro Agricultural Campus',
    'Ibogun Engineering Campus',
    'All Campuses (Ago-Iwoye, Sagamu, Ayetoro, Ibogun)',
    'Remote / Nationwide'
  ];

  const facultiesList = [
    'All Faculties',
    'Faculty of Science',
    'Faculty of Arts',
    'Faculty of Social & Management Sciences',
    'Faculty of Basic Medical Sciences',
    'Faculty of Clinical Sciences',
    'Faculty of Engineering & Environmental Studies',
    'Faculty of Agricultural Sciences',
    'Faculty of Law',
    'Faculty of Education',
    'Faculty of Pharmacy'
  ];

  const levelsList = ['100L', '200L', '300L', '400L', '500L'];

  const handleAddRequirement = () => {
    if (reqInput.trim()) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput('');
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleAddResponsibility = () => {
    if (respInput.trim()) {
      setResponsibilities([...responsibilities, respInput.trim()]);
      setRespInput('');
    }
  };

  const handleRemoveResponsibility = (idx: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };

  const handleAddEligibility = () => {
    if (eligInput.trim()) {
      setEligibility([...eligibility, eligInput.trim()]);
      setEligInput('');
    }
  };

  const handleRemoveEligibility = (idx: number) => {
    setEligibility(eligibility.filter((_, i) => i !== idx));
  };

  const toggleFaculty = (fac: string) => {
    if (fac === 'All Faculties') {
      setTargetFaculties(['All Faculties']);
      return;
    }
    let updated = targetFaculties.filter(f => f !== 'All Faculties');
    if (updated.includes(fac)) {
      updated = updated.filter(f => f !== fac);
      if (updated.length === 0) updated = ['All Faculties'];
    } else {
      updated.push(fac);
    }
    setTargetFaculties(updated);
  };

  const toggleLevel = (lvl: string) => {
    if (targetLevels.includes(lvl)) {
      setTargetLevels(targetLevels.filter(l => l !== lvl));
    } else {
      setTargetLevels([...targetLevels, lvl]);
    }
  };

  const handleAddAttachment = () => {
    if (attachmentName.trim()) {
      setAttachments([
        ...attachments,
        {
          id: `att-${Date.now()}`,
          name: attachmentName.trim(),
          url: attachmentUrl.trim() || '#doc-attachment',
          type: 'pdf',
          size: '1.2 MB'
        }
      ]);
      setAttachmentName('');
      setAttachmentUrl('');
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please fill in the opportunity title and detailed description.');
      return;
    }

    if (requirements.length === 0) {
      setErrorMessage('Please specify at least one requirement.');
      return;
    }

    setSubmitting(true);

    try {
      const isAdmin = currentUser.role === 'admin';
      
      const newOpportunity: Opportunity = {
        id: initialData?.id || `opp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: title.trim(),
        description: description.trim(),
        opportunityType,
        category,
        organizationName: organizationName.trim(),
        organizationLogo: organizationLogo.trim() || undefined,
        creatorId: currentUser.id,
        creatorName: currentUser.fullName,
        creatorRole: currentUser.role as any,
        creatorEmail: currentUser.email,
        creatorPhone: currentUser.phoneNumber,
        creatorAvatar: currentUser.profilePhoto,
        budget: Number(budgetAmount) || 0,
        budgetType,
        budgetString: budgetType === 'prize' ? `₦${Number(budgetAmount).toLocaleString()} Grand Prize Grant` : budgetType === 'stipend' ? `₦${Number(budgetAmount).toLocaleString()} / Monthly Stipend` : `₦${Number(budgetAmount).toLocaleString()}`,
        deadline: new Date(`${deadline}T23:59:59Z`).toISOString(),
        location: location.trim(),
        campus,
        workMode,
        requirements,
        responsibilities,
        eligibility,
        targetFaculties,
        targetLevels,
        attachments,
        applicationCount: initialData?.applicationCount || 0,
        status: isAdmin ? 'open' : 'under_review',
        moderationStatus: isAdmin ? 'approved' : 'pending',
        moderatedBy: isAdmin ? currentUser.id : undefined,
        moderatedAt: isAdmin ? new Date().toISOString() : undefined,
        isFeatured: false,
        viewsCount: initialData?.viewsCount || 0,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      OpportunityStore.saveOpportunity(newOpportunity);

      setSubmitting(false);
      setSuccessMessage(true);

      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
        if (onSuccess) onSuccess(newOpportunity);
      }, 1600);
    } catch (err) {
      console.error('Error creating opportunity:', err);
      setSubmitting(false);
      setErrorMessage('Failed to create opportunity. Please check your inputs and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#061A4F] to-[#0B2A6F] text-white flex items-center justify-between flex-shrink-0">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#F5B400] tracking-wider">
              {initialData?.id ? 'Edit Opportunity Posting' : 'Publish Opportunity'}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Create Job, Internship, SIWES, or Challenge Brief
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          
          {successMessage ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-bold text-base text-emerald-900">
                {currentUser.role === 'admin' ? 'Opportunity Published Live!' : 'Opportunity Submitted for Moderation!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {currentUser.role === 'admin' 
                  ? 'Your opportunity posting is now live and accepting applications on the campus portal.'
                  : 'Your posting is now queued for swift admin review to ensure safety and quality standards.'}
              </p>
            </div>
          ) : (
            <form id="create-opp-form" onSubmit={handleSubmit} className="space-y-5">
              
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Opportunity / Job Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. OOU ICT Directorate Frontend Software Engineering SIWES / Internship 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                />
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Opportunity Type *</label>
                  <select
                    value={opportunityType}
                    onChange={(e) => setOpportunityType(e.target.value as OpportunityType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  >
                    {opportunityTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category Tag *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Organization & Logo */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Organization / Department / Studio Name *</label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Apex Brand Studio or OOU ICT Directorate"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <MediaUploader
                    storagePathPrefix="opportunities/logos"
                    images={organizationLogo ? [organizationLogo] : []}
                    onChange={(imgs) => setOrganizationLogo(imgs[0] || '')}
                    single={true}
                    maxImages={1}
                    label="Organization Logo / Banner"
                    helperText="Upload official brand logo or department crest directly from device"
                    aspectRatio="square"
                  />
                </div>
              </div>

              {/* Budget, Budget Type & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Budget / Reward (₦) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Budget Structure</label>
                  <select
                    value={budgetType}
                    onChange={(e) => setBudgetType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="fixed">Fixed Project Fee</option>
                    <option value="stipend">Monthly Stipend</option>
                    <option value="prize">Prize Grant Award</option>
                    <option value="grant">Academic Tuition Grant</option>
                    <option value="unpaid">Volunteer / Unpaid</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Work Mode & Campus Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Work Mode *</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="hybrid">Hybrid (Campus & Remote)</option>
                    <option value="remote">Fully Remote (Virtual)</option>
                    <option value="on_campus">On-Campus Physical</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Campus *</label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {campuses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Location Notes</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. ICT Directorate Hub"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Detailed Description & Overview *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an in-depth summary of the opportunity, project context, learning outcomes, and expectations..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {/* Requirements Dynamic List */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  Requirements & Desired Skills *
                </label>
                <div className="space-y-2">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      <span className="flex-1 text-slate-700 font-medium text-xs">{req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a requirement (e.g. Proficiency in Figma / React)"
                      value={reqInput}
                      onChange={(e) => setReqInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRequirement();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="px-3 py-2 bg-[#061A4F] text-white font-bold rounded-xl text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Responsibilities Dynamic List */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  Key Responsibilities & Milestones
                </label>
                <div className="space-y-2">
                  {responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span className="flex-1 text-slate-700 font-medium text-xs">{resp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a deliverable or responsibility..."
                      value={respInput}
                      onChange={(e) => setRespInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddResponsibility();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddResponsibility}
                      className="px-3 py-2 bg-[#061A4F] text-white font-bold rounded-xl text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  Eligibility Criteria
                </label>
                <div className="space-y-2">
                  {eligibility.map((el, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                      <span className="flex-1 text-slate-700 font-medium text-xs">{el}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEligibility(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add eligibility requirement (e.g. Min 3.5 CGPA / 300L)"
                      value={eligInput}
                      onChange={(e) => setEligInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEligibility();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddEligibility}
                      className="px-3 py-2 bg-[#061A4F] text-white font-bold rounded-xl text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Target Faculties & Levels Multi-selector */}
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Faculties</label>
                  <div className="flex flex-wrap gap-1.5">
                    {facultiesList.map(fac => {
                      const selected = targetFaculties.includes(fac);
                      return (
                        <button
                          key={fac}
                          type="button"
                          onClick={() => toggleFaculty(fac)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                            selected ? 'bg-[#061A4F] text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {fac}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-200">
                  <label className="text-xs font-bold text-slate-700">Target Academic Levels</label>
                  <div className="flex flex-wrap gap-1.5">
                    {levelsList.map(lvl => {
                      const selected = targetLevels.includes(lvl);
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => toggleLevel(lvl)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${
                            selected ? 'bg-[#F5B400] text-[#061A4F] font-bold shadow-2xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Guidelines / Attachments */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  Guidelines / Attachments (Brief, Rubric, Application Template)
                </label>
                <div className="space-y-2">
                  {attachments.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#061A4F]" />
                        <span className="font-semibold text-slate-800 text-xs">{att.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(att.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      placeholder="Attachment title (e.g. Challenge_Brief.pdf)"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      className="w-full sm:w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Document URL / Link"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="w-full sm:w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="px-3 py-2 bg-slate-700 text-white font-bold rounded-xl text-xs whitespace-nowrap"
                    >
                      Attach
                    </button>
                  </div>
                </div>
              </div>

              {/* Moderation note badge */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Campus Quality & Safety Policy:</strong> All public opportunity briefs are reviewed by student circle moderation admins before being visible on the main campus board.
                </p>
              </div>

            </form>
          )}

        </div>

        {/* Footer Actions */}
        {!successMessage && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="create-opp-form"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs transition flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {submitting ? (
                <span>Publishing Opportunity...</span>
              ) : (
                <>
                  <span>Publish Opportunity Brief</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B400]" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
