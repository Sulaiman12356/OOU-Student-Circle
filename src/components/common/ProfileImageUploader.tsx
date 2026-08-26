import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validateMediaFile, optimizeImage } from '../../services/storageService';

interface ProfileImageUploaderProps {
  value?: string;
  onChange: (base64OrUrl: string) => void;
  label?: string;
  helperText?: string;
  shape?: 'circle' | 'rounded';
  aspectRatio?: 'square' | 'wide';
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  value,
  onChange,
  label = 'Profile Photograph',
  helperText = 'Upload a clear photograph (JPG, JPEG, PNG or WEBP, max 10MB)',
  shape = 'circle',
  aspectRatio = 'square'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setUploadError(null);
    const validation = validateMediaFile(file, ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], 10);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid image file.');
      return;
    }

    setIsProcessing(true);
    try {
      // Optimize & compress image
      const optimized = await optimizeImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
        format: 'image/webp'
      });
      onChange(optimized.dataUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Could not process selected image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`group relative cursor-pointer border-2 border-dashed transition-all p-4 ${
          shape === 'circle' ? 'rounded-3xl' : 'rounded-2xl'
        } ${
          isDragging
            ? 'border-[#061A4F] bg-blue-50/60'
            : value
            ? 'border-emerald-200 bg-emerald-50/20 hover:border-[#061A4F]'
            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Thumbnail preview */}
          <div className="relative flex-shrink-0">
            {value ? (
              <div
                className={`relative overflow-hidden border-2 border-white shadow-md ${
                  shape === 'circle' ? 'w-16 h-16 rounded-full' : 'w-20 h-16 rounded-xl'
                }`}
              >
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-0 right-0 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 transition shadow"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                className={`flex items-center justify-center bg-slate-200 text-slate-500 border border-slate-300 ${
                  shape === 'circle' ? 'w-16 h-16 rounded-full' : 'w-20 h-16 rounded-xl'
                }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-[#061A4F] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-[#061A4F] transition" />
                )}
              </div>
            )}
          </div>

          {/* Text and Actions */}
          <div className="flex-1 min-w-0">
            {value ? (
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Photo selected and optimized</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Click or drag another image to replace
                </div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#061A4F] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#061A4F]" />
                  <span>{isProcessing ? 'Processing image...' : 'Choose photo from device'}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {helperText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
