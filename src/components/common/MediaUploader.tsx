import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon,
  Loader2,
  Lock,
  RefreshCw,
  Eye,
  FileText,
  ShieldCheck,
  ZoomIn
} from 'lucide-react';
import { 
  optimizeImage, 
  uploadMediaFile, 
  validateMediaFile, 
  generateThumbnail 
} from '../../services/storageService';

export interface MediaUploaderProps {
  storagePathPrefix: string; // e.g. 'products/prod123', 'users/u123/profile', 'verification/v123'
  images: string[];
  onChange: (images: string[]) => void;
  single?: boolean;
  maxImages?: number;
  maxFileSizeMB?: number;
  acceptedTypes?: string[];
  isPrivate?: boolean;
  allowPrimarySelection?: boolean;
  label?: string;
  helperText?: string;
  buttonText?: string;
  aspectRatio?: 'square' | 'video' | 'cover' | 'avatar' | 'any';
  className?: string;
}

interface FailedUploadItem {
  file: File;
  error: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  storagePathPrefix,
  images = [],
  onChange,
  single = false,
  maxImages = 6,
  maxFileSizeMB = 15,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  isPrivate = false,
  allowPrimarySelection = true,
  label = 'Upload Media',
  helperText,
  buttonText,
  aspectRatio = 'square',
  className = '',
}) => {
  const effectiveMax = single ? 1 : maxImages;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressStageText, setProgressStageText] = useState<string>('');
  const [uploadSuccessNotice, setUploadSuccessNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedUploads, setFailedUploads] = useState<FailedUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format accept string for native file dialog
  const acceptAttribute = acceptedTypes.join(',');

  const uploadSingleFile = async (file: File): Promise<string> => {
    // 1. Validation
    const validation = validateMediaFile(file, acceptedTypes, maxFileSizeMB);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file');
    }

    // 2. Stage: 20%
    setUploadProgress(20);
    setProgressStageText(`Uploading 20% (${file.name})`);

    // 3. Compression & optimization
    const isImage = file.type.startsWith('image/') || !file.type;
    let uploadBlob: Blob = file;

    if (isImage) {
      const optimized = await optimizeImage(file, {
        maxWidth: aspectRatio === 'cover' ? 1920 : (aspectRatio === 'avatar' ? 800 : 1400),
        maxHeight: aspectRatio === 'cover' ? 1080 : (aspectRatio === 'avatar' ? 800 : 1400),
        quality: 0.85,
      });
      uploadBlob = optimized.blob;
    }

    // 4. Stage: 50%
    setUploadProgress(50);
    setProgressStageText(`Uploading 50% (${file.name})`);

    // 5. Build storage path
    const fileExt = file.name.split('.').pop() || (isImage ? 'webp' : 'bin');
    const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    const uniqueFileName = `${Date.now()}_${safeName}.${fileExt}`;
    const cleanPrefix = storagePathPrefix.replace(/^\/+|\/+$/g, '');
    const visibilitySubfolder = isPrivate ? 'private' : 'public';
    const fullStoragePath = `${cleanPrefix}/${visibilitySubfolder}/${uniqueFileName}`;

    // 6. Stage: Firebase upload to 100%
    const downloadUrl = await uploadMediaFile(
      fullStoragePath, 
      uploadBlob, 
      (p) => {
        const mappedProgress = Math.min(95, Math.max(50, p));
        setUploadProgress(mappedProgress);
        setProgressStageText(`Uploading ${mappedProgress}%`);
      },
      isPrivate
    );

    setUploadProgress(100);
    setProgressStageText('Uploading 100%');
    return downloadUrl;
  };

  const processFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    setUploadSuccessNotice(false);
    const fileArray = Array.from(files);

    if (fileArray.length === 0) return;

    // Check count limit
    if (single) {
      if (fileArray.length > 1) {
        setErrorMessage('Only a single file can be uploaded for this field.');
        return;
      }
    } else {
      if (images.length + fileArray.length > effectiveMax) {
        setErrorMessage(`You can only upload up to ${effectiveMax} files in total (current: ${images.length}).`);
        return;
      }
    }

    setIsUploading(true);
    const newUrls: string[] = [];
    const newFailures: FailedUploadItem[] = [];

    for (const file of fileArray) {
      try {
        const url = await uploadSingleFile(file);
        newUrls.push(url);
      } catch (err: any) {
        console.error('File upload error:', err);
        newFailures.push({
          file,
          error: err.message || 'Upload failed. Please try again.'
        });
      }
    }

    if (newUrls.length > 0) {
      const updated = single ? [newUrls[0]] : [...images, ...newUrls];
      onChange(updated);
      setUploadSuccessNotice(true);
      setTimeout(() => setUploadSuccessNotice(false), 3000);
    }

    if (newFailures.length > 0) {
      setFailedUploads(prev => [...prev, ...newFailures]);
      setErrorMessage('Upload failed. Please try again.');
    }

    setIsUploading(false);
    setUploadProgress(0);
    setProgressStageText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetryFailedItem = async (index: number) => {
    const item = failedUploads[index];
    if (!item) return;

    // Remove from failure list while retrying
    const nextFailures = failedUploads.filter((_, i) => i !== index);
    setFailedUploads(nextFailures);
    setErrorMessage(null);

    setIsUploading(true);
    try {
      const url = await uploadSingleFile(item.file);
      const updated = single ? [url] : [...images, url];
      onChange(updated);
      setUploadSuccessNotice(true);
      setTimeout(() => setUploadSuccessNotice(false), 3000);
    } catch (err: any) {
      setFailedUploads(prev => [...prev, { file: item.file, error: err.message || 'Upload failed. Please try again.' }]);
      setErrorMessage('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setProgressStageText('');
    }
  };

  const handleRemoveFailedItem = (index: number) => {
    setFailedUploads(prev => prev.filter((_, i) => i !== index));
    if (failedUploads.length <= 1) {
      setErrorMessage(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([item, ...rest]);
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Compute aspect ratio CSS classes
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'cover':
        return 'aspect-[3/1] sm:aspect-[16/6]';
      case 'avatar':
        return 'aspect-square rounded-full';
      case 'any':
        return 'aspect-auto min-h-[120px]';
      case 'square':
      default:
        return 'aspect-square';
    }
  };

  const computedHelperText = helperText || (
    isPrivate 
      ? `Private document storage. Strictly encrypted & accessible only to verified officials. Up to ${maxFileSizeMB}MB.`
      : `JPG, JPEG, PNG, WEBP up to ${maxFileSizeMB}MB. Direct device upload (No URL needed).`
  );

  const computedButtonText = buttonText || (single ? 'Select & Upload File' : '+ Upload Photos');

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header & Meta */}
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              {label}
            </label>
            {isPrivate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-black text-amber-800">
                <Lock className="w-2.5 h-2.5 text-amber-700" />
                Private & Secure
              </span>
            )}
          </div>
          {!single && (
            <span className="text-[11px] font-semibold text-slate-500">
              {images.length} of {effectiveMax} uploaded
            </span>
          )}
        </div>
      )}

      {/* Upload Dropzone */}
      {images.length < effectiveMax && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#061A4F] bg-blue-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-[#061A4F] bg-slate-50/70 hover:bg-slate-50'
          } ${isUploading ? 'pointer-events-none opacity-85' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={!single}
            accept={acceptAttribute}
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#061A4F]">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-[#061A4F] animate-spin" />
              ) : isPrivate ? (
                <Lock className="w-6 h-6 text-amber-600" />
              ) : (
                <Upload className="w-6 h-6 text-[#061A4F]" />
              )}
            </div>

            {isUploading ? (
              <div className="space-y-1.5 w-full max-w-xs mx-auto animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-bold text-[#061A4F]">
                  <span>{progressStageText || 'Uploading...'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-[#F5B400] h-full rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Optimizing & uploading directly from your device...</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-[#061A4F] text-[#F5B400] rounded-xl text-xs font-black hover:bg-[#0B2A6F] shadow-sm transition inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{computedButtonText}</span>
                </button>
                <p className="text-xs font-bold text-slate-800">
                  Open File Picker, Phone Gallery, or Drag & Drop
                </p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  {computedHelperText}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {uploadSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Upload successful! Media processed and attached.</span>
        </div>
      )}

      {/* Error Message & Failed Upload Action Items */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-2">
          <div className="flex items-center justify-between font-bold">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-700 font-black text-sm"
            >
              ✕
            </button>
          </div>

          {/* Failed Items List with Try Again & Remove */}
          {failedUploads.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-rose-200/60">
              {failedUploads.map((failedItem, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/80 p-2 rounded-xl border border-rose-200">
                  <div className="truncate text-[11px] font-medium text-slate-700 max-w-[200px] sm:max-w-xs">
                    <span className="font-bold">{failedItem.file.name}</span>: {failedItem.error}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRetryFailedItem(idx)}
                      className="px-2.5 py-1 bg-[#061A4F] text-white text-[11px] font-bold rounded-lg hover:bg-[#0B2A6F] flex items-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3 text-[#F5B400]" />
                      <span>Try Again</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFailedItem(idx)}
                      className="px-2 py-1 bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg hover:bg-rose-200 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Thumbnails Grid & Management */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, index) => {
              const isPrimary = index === 0;
              const isPdf = url.includes('.pdf') || url.startsWith('data:application/pdf');

              return (
                <div
                  key={`${url}-${index}`}
                  className={`group relative rounded-2xl overflow-hidden border-2 bg-white shadow-xs transition-all ${
                    isPrimary && allowPrimarySelection 
                      ? 'border-[#061A4F] ring-2 ring-[#061A4F]/20' 
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className={`${getAspectRatioClass()} w-full bg-slate-100 relative flex items-center justify-center overflow-hidden`}>
                    {isPdf ? (
                      <div className="flex flex-col items-center justify-center p-3 text-center text-slate-600 space-y-1">
                        <FileText className="w-8 h-8 text-rose-500" />
                        <span className="text-[10px] font-bold">PDF Document</span>
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={`Uploaded asset ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Primary Badge */}
                  {isPrimary && allowPrimarySelection && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#061A4F] text-[#F5B400] text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 z-10">
                      <Star className="w-2.5 h-2.5 fill-[#F5B400]" />
                      Primary Cover
                    </div>
                  )}

                  {/* Private Shield Badge */}
                  {isPrivate && (
                    <div className="absolute top-2 right-2 p-1 rounded-md bg-amber-500/90 text-white shadow-sm z-10" title="Private Encrypted File">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  )}

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                    {/* Top Bar: Preview & Remove */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl(url)}
                        className="p-1 rounded-lg bg-white/20 hover:bg-white/40 text-white transition"
                        title="Zoom / Preview"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow transition"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Bar: Reorder Left / Primary / Right */}
                    {!single && (
                      <div className="flex items-center justify-between gap-1 bg-black/50 p-1 rounded-xl backdrop-blur-xs">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveLeft(index)}
                          className="p-1 rounded bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 transition"
                          title="Move Left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>

                        {!isPrimary && allowPrimarySelection && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(index)}
                            className="px-2 py-0.5 text-[10px] font-bold bg-[#F5B400] text-[#061A4F] rounded-md hover:bg-amber-400 transition"
                          >
                            Set Primary
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={index === images.length - 1}
                          onClick={() => handleMoveRight(index)}
                          className="p-1 rounded bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 transition"
                          title="Move Right"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* "+ Add More" card if under limit */}
            {images.length < effectiveMax && !isUploading && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`${getAspectRatioClass()} w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#061A4F] bg-slate-50 hover:bg-blue-50/40 transition flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-[#061A4F] p-2`}
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-[11px] font-black">+ Add More</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Lightbox / Full Zoom Preview Modal */}
      {previewModalUrl && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div 
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Eye className="w-4 h-4 text-[#F5B400]" />
                <span>Media Preview</span>
                {isPrivate && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-[#F5B400] text-[10px] rounded-full font-bold">
                    Private Secure File
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-slate-950">
              {previewModalUrl.includes('.pdf') ? (
                <div className="p-8 text-center text-white space-y-3">
                  <FileText className="w-16 h-16 text-rose-500 mx-auto" />
                  <p className="text-sm font-bold">Document attached successfully</p>
                  <a
                    href={previewModalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 bg-[#F5B400] text-[#061A4F] text-xs font-bold rounded-xl"
                  >
                    Open Document Link
                  </a>
                </div>
              ) : (
                <img
                  src={previewModalUrl}
                  alt="Full preview"
                  className="max-h-[70vh] w-auto object-contain rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
