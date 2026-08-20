import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon, 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  Calendar, 
  Tag, 
  Check, 
  X, 
  Eye, 
  Layers, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PortfolioItem } from '../../types';
import { MediaUploader } from '../common/MediaUploader';

interface PortfolioManagerProps {
  portfolio: PortfolioItem[];
  userId: string;
  onChange: (portfolio: PortfolioItem[]) => void;
}

const CATEGORIES = [
  'Web & Software Development',
  'UI/UX & Mobile App Design',
  'Graphic Design & Branding',
  'Writing, Translation & Research',
  'Video Editing & Animation',
  'Photography & Media Coverage',
  'Digital Marketing & Social Media',
  'Tutoring, Math & Science Projects',
  'Business Plans & Financial Modeling',
  'Other Campus Projects'
];

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  portfolio,
  userId,
  onChange
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State for new / edit item
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [projectUrl, setProjectUrl] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Image preview modal state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setProjectUrl('');
    setDate('');
    setUploadedImages([]);
    setEditingId(null);
    setIsAdding(false);
    setUploadError(null);
  };

  const handleStartEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category || CATEGORIES[0]);
    setProjectUrl(item.projectUrl || '');
    setDate(item.date || '');
    
    // Support either images array or legacy single imageUrl
    const existingImages = item.images && item.images.length > 0 
      ? item.images 
      : (item.imageUrl ? [item.imageUrl] : []);
    setUploadedImages(existingImages);
    setIsAdding(true);
  };

  const handleSaveProject = () => {
    if (!title.trim()) {
      setUploadError('Please enter a project title.');
      return;
    }

    if (uploadedImages.length === 0) {
      setUploadError('Please upload at least one image showing your work.');
      return;
    }

    const newProjectItem: PortfolioItem = {
      id: editingId || `port-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      category,
      images: uploadedImages,
      imageUrl: uploadedImages[0],
      projectUrl: projectUrl.trim() || undefined,
      date: date.trim() || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      orderIndex: editingId 
        ? (portfolio.find(p => p.id === editingId)?.orderIndex || 0)
        : portfolio.length
    };

    if (editingId) {
      onChange(portfolio.map(p => p.id === editingId ? newProjectItem : p));
    } else {
      onChange([newProjectItem, ...portfolio]);
    }

    resetForm();
  };

  const handleDeleteProject = (id: string) => {
    onChange(portfolio.filter(p => p.id !== id));
  };

  const handleReorderProject = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === portfolio.length - 1) return;

    const copy = [...portfolio];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    // Update order indices
    copy.forEach((item, idx) => {
      item.orderIndex = idx;
    });

    onChange(copy);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-[#061A4F] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F5B400]" />
            <span>Portfolio & Proof of Work ({portfolio.length})</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Showcase your best projects, client deliverables, and mockups with multiple images uploaded directly from your device.
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="px-4 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#F5B400]" />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {/* Add / Edit Project Form */}
      {isAdding && (
        <div className="p-5 bg-slate-50/80 rounded-3xl border-2 border-[#061A4F]/20 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="font-extrabold text-sm text-[#061A4F] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5B400]" />
              <span>{editingId ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}</span>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Project Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. OOU Student Union Brand Identity & Merch"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Date / Timeline</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. May 2024, or 2023 - Present"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Live URL / External Link (Optional)</label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://github.com/..., https://behance.net/..., https://..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Project Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the client problem, tools used (e.g. Figma, React, Illustrator), and the final impact..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#061A4F] outline-hidden"
            />
          </div>

          {/* Device Image Uploader */}
          <div className="pt-2">
            <MediaUploader
              storagePathPrefix={`users/${userId}/portfolio`}
              images={uploadedImages}
              onChange={(imgs) => setUploadedImages(imgs)}
              maxImages={8}
              maxFileSizeMB={15}
              label="Project Images & Work Samples"
              helperText="Direct device upload. Select multiple files. Reorder and set primary project cover."
              aspectRatio="video"
            />
          </div>

          {/* Form Error Notice */}
          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProject}
              className="px-6 py-2.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-[#F5B400]" />
              <span>{editingId ? 'Update Project' : 'Save Project to Portfolio'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Existing Portfolio Projects List */}
      {portfolio.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((proj, idx) => {
            const projectImages = proj.images && proj.images.length > 0 
              ? proj.images 
              : (proj.imageUrl ? [proj.imageUrl] : []);

            return (
              <div 
                key={proj.id}
                className="bg-slate-50/70 rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200"
              >
                {/* Project Image & Badge */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-200">
                  {projectImages.length > 0 ? (
                    <img
                      src={projectImages[0]}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  {/* Multi-image indicator */}
                  {projectImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-black flex items-center gap-1">
                      <ImageIcon className="w-2.5 h-2.5 text-[#F5B400]" />
                      <span>+{projectImages.length - 1} more</span>
                    </div>
                  )}

                  {proj.category && (
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#061A4F] text-[10px] font-black shadow-xs">
                      {proj.category}
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-4 space-y-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-black text-sm text-[#061A4F] line-clamp-1">{proj.title}</h4>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-[#061A4F] p-0.5 flex-shrink-0"
                        title="Open External Project"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {proj.date && (
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{proj.date}</span>
                    </p>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {proj.description || 'No detailed description provided.'}
                  </p>
                </div>

                {/* Project Controls Bar */}
                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                  {/* Reorder Up/Down */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleReorderProject(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="Move Project Up"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorderProject(idx, 'down')}
                      disabled={idx === portfolio.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="Move Project Down"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(proj)}
                      className="text-xs font-bold text-[#061A4F] hover:underline"
                    >
                      Edit
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !isAdding && (
          <div className="text-center py-10 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F5B400] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6 text-[#061A4F]" />
            </div>
            <p className="text-sm font-extrabold text-slate-800">No portfolio projects uploaded yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload proof of work from your device so clients and peers can see what you have created.
            </p>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="px-5 py-2.5 bg-[#061A4F] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B2A6F] inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#F5B400]" />
              <span>Add Your First Project</span>
            </button>
          </div>
        )
      )}

      {/* Lightbox / Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-[#F5B400] font-black text-sm flex items-center gap-1"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
            <img
              src={previewImage}
              alt="Full size project preview"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
