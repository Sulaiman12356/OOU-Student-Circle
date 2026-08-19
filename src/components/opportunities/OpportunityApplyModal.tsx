import React, { useState, useEffect } from 'react';
import { Opportunity, OpportunityApplication } from '../../types/opportunities';
import { useAuth } from '../../context/AuthContext';
import { OpportunityStore } from '../../services/opportunityStore';
import { 
  X, 
  Send, 
  Paperclip, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  User, 
  Briefcase, 
  Link as LinkIcon, 
  Plus, 
  Trash2,
  Sparkles,
  FileText
} from 'lucide-react';

interface OpportunityApplyModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const OpportunityApplyModal: React.FC<OpportunityApplyModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  
  // Existing application if any
  const existingApp = currentUser && opportunity 
    ? OpportunityStore.getApplications(opportunity.id, currentUser.id)[0] 
    : null;

  const [coverMessage, setCoverMessage] = useState('');
  const [relevantSkills, setRelevantSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [portfolioLinks, setPortfolioLinks] = useState<{ title: string; url: string }[]>([
    { title: 'Portfolio / GitHub / Behance', url: '' }
  ]);
  const [proposedBudget, setProposedBudget] = useState<number>(0);
  const [availabilityDate, setAvailabilityDate] = useState('Available immediately (Part-time / Full-term)');
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string }[]>([
    { name: 'Student_CV_Resume.pdf', url: '#attachment-student-cv', type: 'pdf' }
  ]);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (existingApp) {
      setCoverMessage(existingApp.coverMessage || '');
      setRelevantSkills(existingApp.relevantSkills || []);
      setPortfolioLinks(existingApp.portfolioLinks?.length ? existingApp.portfolioLinks : [{ title: 'Portfolio', url: '' }]);
      setProposedBudget(existingApp.proposedBudget || 0);
      setAvailabilityDate(existingApp.availabilityDate || 'Available immediately');
      setAttachments(existingApp.attachments || []);
    } else if (currentUser) {
      // Pre-fill smart default cover letter
      const defaultRole = opportunity?.opportunityType === 'internship' || opportunity?.opportunityType === 'siwes' 
        ? 'internship placement' 
        : opportunity?.opportunityType === 'scholarship' 
        ? 'merit scholarship award'
        : opportunity?.opportunityType === 'competition'
        ? 'challenge entry'
        : 'job position';

      setCoverMessage(
        `Dear ${opportunity?.organizationName || 'Selection Committee'},\n\nI am writing to express my strong enthusiasm for the "${opportunity?.title}" ${defaultRole}. As a ${currentUser.level || '300L'} student of ${currentUser.department || 'Computer Science'} in the ${currentUser.faculty || 'Faculty of Science'} at Olabisi Onabanjo University, I possess the relevant skills, academic discipline, and hands-on drive to excel in this role.\n\nI look forward to discussing how I can deliver exceptional value.`
      );
      setRelevantSkills(currentUser.skills || ['Web Development', 'Problem Solving', 'Teamwork']);
      if (typeof opportunity?.budget === 'number') {
        setProposedBudget(opportunity.budget);
      }
    }
  }, [existingApp, currentUser, opportunity]);

  if (!isOpen || !opportunity || !currentUser) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !relevantSkills.includes(skillInput.trim())) {
      setRelevantSkills([...relevantSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRelevantSkills(relevantSkills.filter(s => s !== skill));
  };

  const handleAddPortfolioLink = () => {
    setPortfolioLinks([...portfolioLinks, { title: 'Project / Drive Link', url: '' }]);
  };

  const handleUpdatePortfolioLink = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...portfolioLinks];
    updated[index][field] = value;
    setPortfolioLinks(updated);
  };

  const handleRemovePortfolioLink = (index: number) => {
    setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index));
  };

  const handleAddAttachment = () => {
    if (attachmentName.trim()) {
      setAttachments([
        ...attachments,
        {
          name: attachmentName.trim(),
          url: attachmentUrl.trim() || '#doc-attachment',
          type: 'pdf'
        }
      ]);
      setAttachmentName('');
      setAttachmentUrl('');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!coverMessage.trim() || coverMessage.trim().length < 40) {
      setErrorMessage('Please provide a meaningful cover message / statement (at least 40 characters).');
      return;
    }

    setSubmitting(true);

    try {
      const application: OpportunityApplication = {
        id: existingApp?.id || `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        opportunityType: opportunity.opportunityType,
        opportunityCategory: opportunity.category,
        creatorId: opportunity.creatorId,
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        studentEmail: currentUser.email,
        studentPhone: currentUser.phoneNumber,
        studentAvatar: currentUser.profilePhoto,
        studentFaculty: currentUser.faculty,
        studentDepartment: currentUser.department,
        studentLevel: currentUser.level,
        studentMatric: currentUser.matricNumber,
        coverMessage,
        portfolioLinks: portfolioLinks.filter(p => p.url.trim() !== ''),
        relevantSkills,
        proposedBudget: Number(proposedBudget) || undefined,
        availabilityDate,
        attachments,
        status: existingApp?.status || 'pending',
        createdAt: existingApp?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      OpportunityStore.submitApplication(application);

      setSubmitting(false);
      setSuccessMessage(true);

      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitting(false);
      setErrorMessage('An unexpected error occurred while submitting your application. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#061A4F] text-white flex items-center justify-between flex-shrink-0">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#F5B400] tracking-wider">
              {existingApp ? 'Update Application' : 'Submit Application'}
            </span>
            <h2 className="text-base font-bold text-white truncate max-w-md">
              {opportunity.title}
            </h2>
            <p className="text-xs text-slate-300">Host: {opportunity.organizationName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
          
          {successMessage ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-bold text-base text-emerald-900">Application Successfully Submitted!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your credentials, cover statement, and portfolio have been transmitted to {opportunity.organizationName}. You will receive instant notifications when your status is updated.
              </p>
            </div>
          ) : (
            <form id="apply-form" onSubmit={handleSubmit} className="space-y-5">
              
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Student Profile Dossier Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Applicant Profile (Auto-Attached)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Verified Student
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img 
                    src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                    alt={currentUser.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300" 
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{currentUser.fullName}</div>
                    <div className="text-[11px] text-slate-500">
                      {currentUser.department || 'Department'} ({currentUser.level || 'Undergraduate'}) • Matric: {currentUser.matricNumber || 'OOU Student'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Message / Statement of Motivation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Cover Message / Statement of Purpose *</span>
                  <span className="text-[10px] text-slate-400">{coverMessage.length} characters</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={coverMessage}
                  onChange={(e) => setCoverMessage(e.target.value)}
                  placeholder="Explain why you are the best fit for this opportunity, citing relevant coursework, past projects, or achievements..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#061A4F] leading-relaxed"
                />
              </div>

              {/* Relevant Skills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  Relevant Skills & Expertise Tags
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[42px] items-center">
                  {relevantSkills.map(skill => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 bg-[#061A4F] text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-300 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="+ Add skill..."
                      className="bg-transparent text-xs px-2 py-1 outline-none text-slate-700 w-28"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="p-1 text-slate-500 hover:text-[#061A4F]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Portfolio Links */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Portfolio & Work References (Behance, GitHub, Drive)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPortfolioLink}
                    className="text-[11px] font-bold text-[#061A4F] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {portfolioLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Link Label (e.g. GitHub)"
                        value={link.title}
                        onChange={(e) => handleUpdatePortfolioLink(idx, 'title', e.target.value)}
                        className="w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => handleUpdatePortfolioLink(idx, 'url', e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                      {portfolioLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioLink(idx)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposed Budget / Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Proposed Rate / Expected Stipend (₦)
                  </label>
                  <input
                    type="number"
                    value={proposedBudget || ''}
                    onChange={(e) => setProposedBudget(Number(e.target.value))}
                    placeholder="e.g. 35000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Earliest Availability
                  </label>
                  <input
                    type="text"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    placeholder="e.g. Immediate / Next Monday"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Attachments / Document Links */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-purple-600" />
                  <span>Resume / Recommendation Attachments</span>
                </label>

                <div className="space-y-2">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#061A4F]" />
                        <span className="font-semibold text-slate-800 text-xs">{att.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add new attachment mini form */}
                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-purple-900 uppercase">Add Document Link</span>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        placeholder="Document Name (e.g. Resume.pdf)"
                        value={attachmentName}
                        onChange={(e) => setAttachmentName(e.target.value)}
                        className="w-full sm:w-1/2 px-2.5 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="URL or Google Drive link"
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                        className="w-full sm:w-1/2 px-2.5 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
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
              form="apply-form"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#061A4F] hover:bg-[#0B2A6F] text-white font-bold text-xs transition flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {submitting ? (
                <span>Submitting Application...</span>
              ) : (
                <>
                  <span>{existingApp ? 'Save Application Changes' : 'Submit Application'}</span>
                  <Send className="w-3.5 h-3.5 text-[#F5B400]" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
