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
import { optimizeImage, uploadMediaFile } from '../../services/storageService';

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
  
  // Image upload in-progress state
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    const fileList: File[] = Array.from(files);

    if (uploadedImages.length + fileList.length > 8) {
      setUploadError('You can upload a maximum of 8 images per portfolio project.');
      return;
    }

    setIsUploadingImages(true);
    setUploadProgress(10);

    const newUrls: string[] = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // Format check
        const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validMimes.includes(file.type.toLowerCase())) {
          throw new Error(`File "${file.name}" is not a supported image (JPG, PNG, WEBP).`);
        }

        setUploadProgress(20 + Math.round((i / fileList.length) * 40));
        const optimized = await optimizeImage(file, {
          maxWidth: 1600,
          maxHeight: 1200,
          quality: 0.85,
          format: 'image/webp'
        });

        setUploadProgress(60 + Math.round((i / fileList.length) * 35));
        const storagePath = `users/${userId}/portfolio/proj_${Date.now()}_${i}.webp`;
        const downloadUrl = await uploadMediaFile(storagePath, optimized.blob);

        newUrls.push(downloadUrl || optimized.dataUrl);
      }

      setUploadedImages(prev => [...prev, ...newUrls]);
      setUploadProgress(100);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload one or more images.');
    } finally {
      setIsUploadingImages(false);
      setUploadProgress(0);
      if (multiFileInputRef.current) {
        multiFileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveImageLeft = (index: number) => {
    if (index === 0) return;
    setUploadedImages(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveImageRight = (index: number) => {
    if (index === uploadedImages.length - 1) return;
    setUploadedImages(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setUploadedImages(prev => {
      const item = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [item, ...rest];
    });
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
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black text-[#061A4F] uppercase tracking-wider">
                  Project Images ({uploadedImages.length}/8) *
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload multiple screenshots, drafts, or photos directly from your device. First image is the primary cover.
                </p>
              </div>

              <input
                ref={multiFileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleMultipleFiles}
                className="hidden"
                id="portfolio-multi-file-input"
              />

              <button
                type="button"
                onClick={() => multiFileInputRef.current?.click()}
                disabled={isUploadingImages || uploadedImages.length >= 8}
                className="px-3.5 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isUploadingImages ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F5B400]" />
                    <span>Uploading ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#F5B400]" />
                    <span>Upload Images</span>
                  </>
                )}
              </button>
            </div>

            {/* Images Grid */}
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {uploadedImages.map((imgUrl, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-[#061A4F] shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                      <img
                        src={imgUrl}
                        alt={`Project media ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#061A4F] text-[#F5B400] text-[10px] font-black rounded-full shadow flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Cover</span>
                        </div>
                      )}
                      
                      {/* View full size button */}
                      <button
                        type="button"
                        onClick={() => setPreviewImage(imgUrl)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        title="Preview Full Size"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Image Controls Bar */}
                    <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveImageLeft(index)}
                          disabled={index === 0}
                          className="p-1 text-slate-500 hover:text-[#061A4F] hover:bg-slate-200 rounded disabled:opacity-30"
                          title="Move Left / Reorder"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImageRight(index)}
                          disabled={index === uploadedImages.length - 1}
                          className="p-1 text-slate-500 hover:text-[#061A4F] hover:bg-slate-200 rounded disabled:opacity-30"
                          title="Move Right / Reorder"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(index)}
                            className="px-1.5 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 rounded hover:bg-amber-100"
                            title="Make this the cover image"
                          >
                            Set Cover
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                        title="Delete image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                onClick={() => multiFileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-300 hover:border-[#061A4F] rounded-2xl bg-white text-center cursor-pointer space-y-2 transition"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#061A4F] flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">Click to upload project photos from your device</p>
                <p className="text-[11px] text-slate-400">JPG, JPEG, PNG, WEBP supported (Multiple files allowed)</p>
              </div>
            )}
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
