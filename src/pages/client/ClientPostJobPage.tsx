import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { OpportunityStore } from '../../services/opportunityStore';
import { DataStore } from '../../services/dataStore';
import { 
  Opportunity, 
  OpportunityType, 
  OpportunityCategory, 
  WorkMode,
  OpportunityAttachment 
} from '../../types/opportunities';
import { Job } from '../../types';
import { 
  Briefcase, 
  Send, 
  DollarSign, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  Paperclip,
  Building2,
  GraduationCap,
  FileText,
  ShieldCheck
} from 'lucide-react';

interface ClientPostJobPageProps {
  onNavigate: (path: string) => void;
}

export const ClientPostJobPage: React.FC<ClientPostJobPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [opportunityType, setOpportunityType] = useState<OpportunityType>('job');
  const [category, setCategory] = useState<OpportunityCategory>('Freelance Jobs');
  const [organizationName, setOrganizationName] = useState(
    currentUser?.businessName || currentUser?.fullName || 'Campus Enterprise'
  );
  const [organizationLogo, setOrganizationLogo] = useState('');
  const [description, setDescription] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number>(20000);
  const [budgetType, setBudgetType] = useState<'fixed' | 'stipend' | 'prize' | 'grant' | 'unpaid'>('fixed');
  const [deadlineDays, setDeadlineDays] = useState<number>(14);
  const [location, setLocation] = useState('Ago-Iwoye Main Campus');
  const [campus, setCampus] = useState('Ago-Iwoye Main Campus');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');

  const [requirements, setRequirements] = useState<string[]>([
    'Demonstrated portfolio or sample work',
    'Timely communication and milestone delivery'
  ]);
  const [reqInput, setReqInput] = useState('');

  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Execute project deliverables as specified in brief'
  ]);
  const [respInput, setRespInput] = useState('');

  const [attachments, setAttachments] = useState<OpportunityAttachment[]>([]);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const opportunityTypes: { value: OpportunityType; label: string }[] = [
    { value: 'job', label: 'Student / Freelance Job' },
    { value: 'internship', label: 'Internship' },
    { value: 'siwes', label: 'SIWES Industrial Training' },
    { value: 'scholarship', label: 'Scholarship / Tuition Grant' },
    { value: 'competition', label: 'Competition / Hackathon / Pitch' },
    { value: 'fellowship', label: 'Fellowship / Incubator' },
    { value: 'project', label: 'Project Collaboration' },
    { value: 'program', label: 'Enterprise Program' }
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
    'All Campuses',
    'Remote / Nationwide'
  ];

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

  const handleAddAttachment = () => {
    if (attachmentName.trim()) {
      setAttachments([
        ...attachments,
        {
          id: `att-${Date.now()}`,
          name: attachmentName.trim(),
          url: attachmentUrl.trim() || '#doc-brief',
          type: 'pdf',
          size: '1.5 MB'
        }
      ]);
      setAttachmentName('');
      setAttachmentUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title || !description || requirements.length === 0) {
      setErrorMessage('Please fill in all required opportunity details.');
      return;
    }

    if (!currentUser) return;

    const deadlineDate = new Date(Date.now() + Number(deadlineDays) * 24 * 60 * 60 * 1000).toISOString();
    const isAutoApproved = currentUser.role === 'admin';

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
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
      budgetString: budgetType === 'prize' ? `₦${Number(budgetAmount).toLocaleString()} Prize Pool` : `₦${Number(budgetAmount).toLocaleString()}`,
      deadline: deadlineDate,
      location: location.trim(),
      campus,
      workMode,
      requirements,
      responsibilities,
      attachments,
      applicationCount: 0,
      status: isAutoApproved ? 'open' : 'under_review',
      moderationStatus: isAutoApproved ? 'approved' : 'pending',
      moderatedBy: isAutoApproved ? currentUser.id : undefined,
      isFeatured: false,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to OpportunityStore
    OpportunityStore.saveOpportunity(newOpp);

    // Also sync to legacy Job schema for backward compatibility
    const legacyJob: Job = {
      id: newOpp.id,
      clientId: currentUser.id,
      clientName: currentUser.fullName,
      clientBusinessName: organizationName,
      title: newOpp.title,
      category: 'Tech & Development',
      description: newOpp.description,
      skillsRequired: requirements,
      budget: {
        min: Number(budgetAmount),
        max: Number(budgetAmount),
        currency: 'NGN'
      },
      deadline: deadlineDate,
      location: campus,
      status: 'open',
      proposalsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    DataStore.saveJob(legacyJob);

    setSubmitted(true);
    setTimeout(() => {
      onNavigate('/client/jobs');
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-[#061A4F]">Post a New Opportunity</h1>
        <p className="text-xs text-slate-500">Reach verified OOU student freelancers, interns, and academic talent across all campuses</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="font-bold text-lg text-emerald-900">
              {currentUser?.role === 'admin' ? 'Opportunity Published Live!' : 'Opportunity Submitted for Swift Moderation!'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your opportunity posting has been registered. You will be able to review incoming applications and shortlist talent in your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Opportunity Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Graphic Designer for Campus Cafe Branding & Menu Layouts"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F]"
              />
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Organization / Host Name *</label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Host Logo URL (Optional)</label>
                <input
                  type="url"
                  value={organizationLogo}
                  onChange={(e) => setOrganizationLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

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
                <label className="text-xs font-bold text-slate-700">Budget Type</label>
                <select
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="fixed">Fixed Project Fee</option>
                  <option value="stipend">Monthly Stipend</option>
                  <option value="prize">Prize Grant Award</option>
                  <option value="grant">Tuition Grant</option>
                  <option value="unpaid">Volunteer / Unpaid</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Duration / Days to Apply</label>
                <input
                  type="number"
                  min="1"
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="text-xs font-bold text-slate-700">Work Mode *</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="hybrid">Hybrid (Campus & Remote)</option>
                  <option value="remote">Remote (Virtual)</option>
                  <option value="on_campus">On-Campus Physical</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Detailed Description & Project Brief *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the role, project milestones, expectations, deliverables, and any tools required..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Requirements & Required Skills *
              </label>
              <div className="space-y-2">
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
                    placeholder="Add requirement (e.g. Adobe Illustrator / Figma / Python)"
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

            {/* Guidelines / Attachments */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Attachments / Project Documents
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
                      onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Attachment name (e.g. Brief.pdf)"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="w-full sm:w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Document URL / Google Drive link"
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

            <button
              type="submit"
              className="w-full py-3 bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Publish Opportunity Brief</span>
              <Sparkles className="w-4 h-4 text-[#F5B400]" />
            </button>

          </form>
        )}

      </div>

    </div>
  );
};
