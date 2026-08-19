import React, { useState } from 'react';
import { Sparkles, Plus, X, Heart, Tag, Check } from 'lucide-react';

interface SkillsAndInterestsEditorProps {
  skills: string[];
  interests: string[];
  onSkillsChange: (skills: string[]) => void;
  onInterestsChange: (interests: string[]) => void;
}

const POPULAR_SKILLS = [
  'Web Development',
  'React',
  'TypeScript',
  'UI/UX Design',
  'Graphic Design',
  'Logo Design',
  'Digital Marketing',
  'Video Editing',
  'Python',
  'Data Analysis',
  'Copywriting',
  'Content Writing',
  'SEO Optimization',
  'Photography',
  'Mobile App Development',
  'Tailwind CSS',
  'Figma',
  'Adobe Illustrator',
  'Adobe Photoshop',
  'Cybersecurity',
  'Financial Accounting',
  'Academic Tutoring'
];

const POPULAR_INTERESTS = [
  'Tech Innovation',
  'Campus Startups & E-commerce',
  'Artificial Intelligence',
  'Open Source Software',
  'Creative Writing & Poetry',
  'Event Photography',
  'Public Speaking & Debates',
  'Stock & Forex Trading',
  'Product Management',
  'Robotics & Embedded Systems',
  'Campus Volunteering',
  'Fitness & Sports'
];

export const SkillsAndInterestsEditor: React.FC<SkillsAndInterestsEditorProps> = ({
  skills,
  interests,
  onSkillsChange,
  onInterestsChange
}) => {
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [newInterestInput, setNewInterestInput] = useState<string>('');

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onSkillsChange([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(s => s !== skillToRemove));
  };

  const handleAddInterest = (interestToAdd: string) => {
    const trimmed = interestToAdd.trim();
    if (trimmed && !interests.includes(trimmed)) {
      onInterestsChange([...interests, trimmed]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    onInterestsChange(interests.filter(i => i !== interestToRemove));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Skills Box */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-[#061A4F] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F5B400]" />
            <span>Skills & Capabilities ({skills.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add hard and soft skills you offer for peer collaboration and client work.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(newSkillInput);
              }
            }}
            placeholder="Type skill (e.g. Python, Video Editing)..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
          />
          <button
            type="button"
            onClick={() => handleAddSkill(newSkillInput)}
            className="px-4 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Active Skills List */}
        <div className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-slate-50/70 rounded-2xl border border-slate-100">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs group animate-in fade-in"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-300 hover:text-[#F5B400] transition"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic p-1">No skills added yet. Select from suggestions below or type a skill above.</p>
          )}
        </div>

        {/* Popular Suggestions */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Suggested OOU Skills:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.filter(s => !skills.includes(s)).slice(0, 10).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-600 hover:text-[#061A4F] text-[11px] font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5 text-slate-400" />
                <span>{skill}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interests Box */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-[#061A4F] uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Interests & Passions ({interests.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Share what excites you for peer networking and student community clubs.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newInterestInput}
            onChange={(e) => setNewInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddInterest(newInterestInput);
              }
            }}
            placeholder="Type interest (e.g. Artificial Intelligence)..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
          />
          <button
            type="button"
            onClick={() => handleAddInterest(newInterestInput)}
            className="px-4 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Active Interests List */}
        <div className="flex flex-wrap gap-2 min-h-[48px] p-2 bg-slate-50/70 rounded-2xl border border-slate-100">
          {interests.length > 0 ? (
            interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs group animate-in fade-in"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="text-amber-700 hover:text-rose-600 transition"
                  title={`Remove ${interest}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic p-1">No interests added yet. Pick from suggestions below or type your passion above.</p>
          )}
        </div>

        {/* Popular Suggestions */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Suggested Campus Interests:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_INTERESTS.filter(i => !interests.includes(i)).slice(0, 8).map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleAddInterest(interest)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50/50 text-slate-600 hover:text-amber-900 text-[11px] font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5 text-slate-400" />
                <span>{interest}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
