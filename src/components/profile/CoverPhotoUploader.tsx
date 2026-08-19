import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { optimizeImage, uploadMediaFile } from '../../services/storageService';

interface CoverPhotoUploaderProps {
  currentCoverUrl?: string;
  userId: string;
  onCoverChange: (newUrl: string) => void;
  onCoverRemove: () => void;
}

export const CoverPhotoUploader: React.FC<CoverPhotoUploaderProps> = ({
  currentCoverUrl,
  userId,
  onCoverChange,
  onCoverRemove
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultCoverGradient = 'bg-gradient-to-r from-[#061A4F] via-[#0B2A6F] to-[#061A4F]';

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessNotice(false);

    // Format validation
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Cover image exceeds 15MB size limit.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // 1. Optimize banner in browser
      setUploadProgress(30);
      const optimized = await optimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 800,
        quality: 0.85,
        format: 'image/webp'
      });

      // 2. Upload to storage
      setUploadProgress(60);
      const storagePath = `users/${userId}/profile/cover_${Date.now()}.webp`;
      const downloadUrl = await uploadMediaFile(storagePath, optimized.blob, (progress) => {
        setUploadProgress(progress);
      });

      const finalUrl = downloadUrl || optimized.dataUrl;

      onCoverChange(finalUrl);
      setUploadProgress(100);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload cover photo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id="cover-photo-file-input"
      />

      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Cover Banner Photo
          </label>
          <p className="text-[11px] text-slate-500">
            Recommended: 1200 × 400px (JPG, PNG, WEBP). Directly uploaded from device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3.5 py-1.5 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F5B400]" />
                <span>Uploading ({uploadProgress}%)...</span>
              </>
            ) : currentCoverUrl ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Change Banner</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Upload Banner</span>
              </>
            )}
          </button>

          {currentCoverUrl && (
            <button
              type="button"
              onClick={onCoverRemove}
              disabled={isUploading}
              className="px-3 py-1.5 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner Preview / Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !currentCoverUrl && fileInputRef.current?.click()}
        className={`w-full h-36 sm:h-48 rounded-3xl overflow-hidden relative border-2 transition ${
          isDragging ? 'border-[#F5B400] bg-amber-50/20' : 'border-slate-200'
        } ${!currentCoverUrl ? 'cursor-pointer hover:border-[#061A4F]' : ''}`}
      >
        {currentCoverUrl ? (
          <img
            src={currentCoverUrl}
            alt="Profile Cover Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${defaultCoverGradient} flex flex-col items-center justify-center text-white p-4 text-center space-y-2`}>
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-[#F5B400]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white">Click or drag & drop to upload custom cover photo</p>
            <p className="text-[11px] text-slate-300">Supports JPG, PNG, WEBP (No URL needed)</p>
          </div>
        )}

        {/* Uploading progress banner */}
        {isUploading && (
          <div className="absolute inset-0 bg-[#061A4F]/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
            <Loader2 className="w-7 h-7 animate-spin text-[#F5B400] mb-2" />
            <p className="text-xs font-black">Uploading banner image: {uploadProgress}%</p>
            <div className="w-48 bg-white/20 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-[#F5B400] h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successNotice && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Cover banner updated successfully!</span>
        </div>
      )}
    </div>
  );
};
