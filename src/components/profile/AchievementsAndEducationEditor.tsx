import React, { useState } from 'react';
import { Award, GraduationCap, Plus, Trash2, Edit3, Check, X, ExternalLink, Calendar } from 'lucide-react';
import { StudentAchievement, StudentEducation } from '../../types';

interface AchievementsAndEducationEditorProps {
  achievements: StudentAchievement[];
  education: StudentEducation[];
  onAchievementsChange: (achievements: StudentAchievement[]) => void;
  onEducationChange: (education: StudentEducation[]) => void;
}

export const AchievementsAndEducationEditor: React.FC<AchievementsAndEducationEditorProps> = ({
  achievements = [],
  education = [],
  onAchievementsChange,
  onEducationChange
}) => {
  // Achievement Form State
  const [isAddingAchievement, setIsAddingAchievement] = useState<boolean>(false);
  const [editingAchId, setEditingAchId] = useState<string | null>(null);
  const [achTitle, setAchTitle] = useState<string>('');
  const [achIssuer, setAchIssuer] = useState<string>('');
  const [achDate, setAchDate] = useState<string>('');
  const [achDesc, setAchDesc] = useState<string>('');
  const [achLink, setAchLink] = useState<string>('');

  // Education Form State
  const [isAddingEducation, setIsAddingEducation] = useState<boolean>(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduDegree, setEduDegree] = useState<string>('B.Sc. Computer Science');
  const [eduInstitution, setEduInstitution] = useState<string>('Olabisi Onabanjo University');
  const [eduField, setEduField] = useState<string>('Computer Science');
  const [eduStartYear, setEduStartYear] = useState<string>('2021');
  const [eduEndYear, setEduEndYear] = useState<string>('2025 (Expected)');
  const [eduIsCurrent, setEduIsCurrent] = useState<boolean>(true);

  // Handlers for Achievements
  const handleSaveAchievement = () => {
    if (!achTitle.trim()) return;

    const item: StudentAchievement = {
      id: editingAchId || `ach-${Date.now()}`,
      title: achTitle.trim(),
      issuer: achIssuer.trim() || undefined,
      date: achDate.trim() || undefined,
      description: achDesc.trim() || undefined,
      link: achLink.trim() || undefined
    };

    if (editingAchId) {
      onAchievementsChange(achievements.map(a => a.id === editingAchId ? item : a));
    } else {
      onAchievementsChange([item, ...achievements]);
    }

    setAchTitle('');
    setAchIssuer('');
    setAchDate('');
    setAchDesc('');
    setAchLink('');
    setEditingAchId(null);
    setIsAddingAchievement(false);
  };

  const handleEditAchievement = (item: StudentAchievement) => {
    setEditingAchId(item.id);
    setAchTitle(item.title);
    setAchIssuer(item.issuer || '');
    setAchDate(item.date || item.year || '');
    setAchDesc(item.description || '');
    setAchLink(item.link || '');
    setIsAddingAchievement(true);
  };

  const handleDeleteAchievement = (id: string) => {
    onAchievementsChange(achievements.filter(a => a.id !== id));
  };

  // Handlers for Education
  const handleSaveEducation = () => {
    if (!eduDegree.trim() || !eduInstitution.trim()) return;

    const item: StudentEducation = {
      id: editingEduId || `edu-${Date.now()}`,
      degree: eduDegree.trim(),
      institution: eduInstitution.trim(),
      fieldOfStudy: eduField.trim() || undefined,
      startYear: eduStartYear.trim() || undefined,
      endYear: eduIsCurrent ? 'Present' : (eduEndYear.trim() || undefined),
      isCurrent: eduIsCurrent
    };

    if (editingEduId) {
      onEducationChange(education.map(e => e.id === editingEduId ? item : e));
    } else {
      onEducationChange([item, ...education]);
    }

    setEduDegree('');
    setEduInstitution('Olabisi Onabanjo University');
    setEduField('');
    setEduStartYear('');
    setEduEndYear('');
    setEduIsCurrent(true);
    setEditingEduId(null);
    setIsAddingEducation(false);
  };

  const handleEditEducation = (item: StudentEducation) => {
    setEditingEduId(item.id);
    setEduDegree(item.degree);
    setEduInstitution(item.institution);
    setEduField(item.fieldOfStudy || '');
    setEduStartYear(item.startYear || '');
    setEduEndYear(item.endYear || '');
    setEduIsCurrent(Boolean(item.isCurrent || item.endYear === 'Present'));
    setIsAddingEducation(true);
  };

  const handleDeleteEducation = (id: string) => {
    onEducationChange(education.filter(e => e.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Achievements & Awards */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#061A4F] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F5B400]" />
              <span>Achievements & Awards ({achievements.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Certifications, hackathons, academic laurels, and student leadership honors.
            </p>
          </div>

          {!isAddingAchievement && (
            <button
              type="button"
              onClick={() => {
                setEditingAchId(null);
                setAchTitle('');
                setAchIssuer('');
                setAchDate('');
                setAchDesc('');
                setAchLink('');
                setIsAddingAchievement(true);
              }}
              className="px-3 py-1.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Add/Edit Achievement Form */}
        {isAddingAchievement && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#061A4F]">
              <span>{editingAchId ? 'Edit Achievement' : 'New Achievement / Award'}</span>
              <button
                type="button"
                onClick={() => setIsAddingAchievement(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={achTitle}
                onChange={(e) => setAchTitle(e.target.value)}
                placeholder="Title (e.g. 1st Place - OOU Tech Hackathon)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={achIssuer}
                  onChange={(e) => setAchIssuer(e.target.value)}
                  placeholder="Issuer (e.g. NACOSS OOU, Google DSC)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={achDate}
                  onChange={(e) => setAchDate(e.target.value)}
                  placeholder="Date / Year (e.g. 2024)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <input
                type="url"
                value={achLink}
                onChange={(e) => setAchLink(e.target.value)}
                placeholder="Certificate / Verification URL (optional)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
              <textarea
                rows={2}
                value={achDesc}
                onChange={(e) => setAchDesc(e.target.value)}
                placeholder="Short description of the accomplishment..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingAchievement(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAchievement}
                className="px-4 py-1.5 bg-[#061A4F] text-white text-xs font-black rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Achievements List */}
        <div className="space-y-2.5">
          {achievements.length > 0 ? (
            achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200 flex items-start justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs text-[#061A4F] truncate">{ach.title}</h5>
                    {ach.link && (
                      <a href={ach.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#061A4F]">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {[ach.issuer, ach.date || ach.year].filter(Boolean).join(' • ')}
                  </p>
                  {ach.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-2">{ach.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditAchievement(ach)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            !isAddingAchievement && (
              <p className="text-xs text-slate-400 italic py-3 text-center">No achievements added yet.</p>
            )
          )}
        </div>
      </div>

      {/* 2. Education & Academics */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#061A4F] uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#061A4F]" />
              <span>Education & Qualifications ({education.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Degree programs, OOU course of study, and previous academic foundations.
            </p>
          </div>

          {!isAddingEducation && (
            <button
              type="button"
              onClick={() => {
                setEditingEduId(null);
                setEduDegree('');
                setEduInstitution('Olabisi Onabanjo University');
                setEduField('');
                setEduStartYear('2021');
                setEduEndYear('');
                setEduIsCurrent(true);
                setIsAddingEducation(true);
              }}
              className="px-3 py-1.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl hover:bg-[#0B2A6F] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Add/Edit Education Form */}
        {isAddingEducation && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#061A4F]">
              <span>{editingEduId ? 'Edit Education' : 'New Education Entry'}</span>
              <button
                type="button"
                onClick={() => setIsAddingEducation(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={eduDegree}
                onChange={(e) => setEduDegree(e.target.value)}
                placeholder="Degree / Program (e.g. B.Sc. Computer Science)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="text"
                value={eduInstitution}
                onChange={(e) => setEduInstitution(e.target.value)}
                placeholder="Institution (e.g. Olabisi Onabanjo University)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="text"
                value={eduField}
                onChange={(e) => setEduField(e.target.value)}
                placeholder="Major / Department (e.g. Computer Science)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={eduStartYear}
                  onChange={(e) => setEduStartYear(e.target.value)}
                  placeholder="Start Year (e.g. 2021)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  disabled={eduIsCurrent}
                  value={eduIsCurrent ? 'Present' : eduEndYear}
                  onChange={(e) => setEduEndYear(e.target.value)}
                  placeholder="End Year (e.g. 2025)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs disabled:bg-slate-100"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={eduIsCurrent}
                  onChange={(e) => setEduIsCurrent(e.target.checked)}
                  className="w-4 h-4 text-[#061A4F] rounded focus:ring-[#061A4F]"
                />
                <span>Currently studying here</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingEducation(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEducation}
                className="px-4 py-1.5 bg-[#061A4F] text-white text-xs font-black rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Education List */}
        <div className="space-y-2.5">
          {education.length > 0 ? (
            education.map((edu) => (
              <div
                key={edu.id}
                className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200 flex items-start justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-[#061A4F] truncate">{edu.degree}</h5>
                  <p className="text-[11px] font-medium text-slate-700">{edu.institution}</p>
                  <p className="text-[10px] text-slate-500">
                    {[edu.fieldOfStudy, `${edu.startYear || ''} - ${edu.endYear || (edu.isCurrent ? 'Present' : '')}`].filter(Boolean).join(' • ')}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditEducation(edu)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            !isAddingEducation && (
              <p className="text-xs text-slate-400 italic py-3 text-center">No education records added yet.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};
