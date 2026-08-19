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
  Loader2
} from 'lucide-react';
import { optimizeImage, uploadMediaFile } from '../../services/storageService';

interface MediaUploaderProps {
  storagePathPrefix: string; // e.g. 'users/uid123/profile' or 'products/prod123/images'
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'cover' | 'any';
  allowPrimarySelection?: boolean;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  storagePathPrefix,
  images = [],
  onChange,
  maxImages = 6,
  label = 'Upload Media',
  helperText = 'Support JPG, PNG, WEBP up to 15MB. Automatically compressed for high speed.',
  aspectRatio = 'square',
  allowPrimarySelection = true,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxImages) {
      setErrorMessage(`You can only upload up to ${maxImages} images in total.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const newUploadedUrls: string[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        // Format validation
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type.toLowerCase())) {
          throw new Error(`"${file.name}" is not a supported format. Please upload JPG, PNG, or WEBP.`);
        }

        // Compress image in browser
        setUploadProgress(20 + Math.round((i / fileArray.length) * 40));
        const optimized = await optimizeImage(file, {
          maxWidth: aspectRatio === 'cover' ? 1920 : 1200,
          maxHeight: aspectRatio === 'cover' ? 1080 : 1200,
          quality: 0.85,
        });

        // Unique storage path
        const fileExt = file.name.split('.').pop() || 'webp';
        const uniqueFileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const fullStoragePath = `${storagePathPrefix}/${uniqueFileName}`;

        // Upload
        setUploadProgress(60 + Math.round((i / fileArray.length) * 35));
        const downloadUrl = await uploadMediaFile(fullStoragePath, optimized.blob);
        newUploadedUrls.push(downloadUrl);
      }

      setUploadProgress(100);
      onChange([...images, ...newUploadedUrls]);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during image upload. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            {label}
          </label>
          <span className="text-[11px] font-semibold text-slate-400">
            {images.length} of {maxImages} uploaded
          </span>
        </div>
      )}

      {/* Upload Dropzone */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#061A4F] bg-blue-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-[#061A4F]/60 bg-slate-50/50 hover:bg-slate-50'
          } ${isUploading ? 'pointer-events-none opacity-70' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={maxImages > 1}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#061A4F]">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-[#061A4F] animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-[#061A4F]" />
              )}
            </div>

            {isUploading ? (
              <div className="space-y-1 w-full max-w-xs mx-auto">
                <p className="text-xs font-bold text-[#061A4F]">Compressing & Uploading Media...</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#F5B400] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#061A4F] text-white rounded-xl text-xs font-bold hover:bg-[#0B2A6F] shadow-sm transition"
                >
                  + Upload Product Photos
                </button>
                <p className="text-xs font-semibold text-slate-700">
                  Select from Computer, Phone Gallery, or Files
                </p>
                <p className="text-[11px] text-slate-400">{helperText}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Thumbnails & Management Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {images.map((url, index) => {
            const isPrimary = index === 0;
            return (
              <div
                key={`${url}-${index}`}
                className="group relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-white shadow-xs transition-all hover:border-[#061A4F]"
              >
                <div className={`${aspectRatio === 'cover' ? 'aspect-video' : 'aspect-square'} w-full bg-slate-100`}>
                  <img
                    src={url}
                    alt={`Uploaded media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Primary Badge */}
                {isPrimary && allowPrimarySelection && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#061A4F] text-[#F5B400] text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-[#F5B400]" />
                    Primary
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow transition"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-1 bg-black/40 p-1 rounded-xl backdrop-blur-xs">
                    {/* Reorder Left */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveLeft(index)}
                      className="p-1 rounded bg-white/20 hover:bg-white/40 text-white disabled:opacity-30"
                      title="Move left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>

                    {/* Make Primary */}
                    {!isPrimary && allowPrimarySelection && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-[#F5B400] text-[#061A4F] rounded hover:bg-amber-400 transition"
                      >
                        Set Primary
                      </button>
                    )}

                    {/* Reorder Right */}
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => handleMoveRight(index)}
                      className="p-1 rounded bg-white/20 hover:bg-white/40 text-white disabled:opacity-30"
                      title="Move right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add More Photos Tile */}
          {images.length < maxImages && !isUploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`${
                aspectRatio === 'cover' ? 'aspect-video' : 'aspect-square'
              } w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#061A4F] bg-slate-50 hover:bg-blue-50/40 transition flex flex-col items-center justify-center gap-1.5 text-slate-600 hover:text-[#061A4F] p-2`}
            >
              <Upload className="w-5 h-5" />
              <span className="text-[11px] font-bold">+ Add More</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
