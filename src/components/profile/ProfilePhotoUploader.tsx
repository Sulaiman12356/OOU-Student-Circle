import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { optimizeImage, uploadMediaFile } from '../../services/storageService';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  userName?: string;
  userId: string;
  onPhotoChange: (newUrl: string) => void;
  onPhotoRemove: () => void;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  currentPhotoUrl,
  userName = 'Student',
  userId,
  onPhotoChange,
  onPhotoRemove
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initials generator for neutral UI avatar
  const getInitials = (text: string) => {
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'SC';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(userName);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setErrorMessage(null);
    setSuccessNotice(false);

    // Format validation
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a JPG, JPEG, PNG, or WEBP image file.');
      return;
    }

    // Size limit 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Image exceeds 15MB size limit.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      // 1. Optimize in browser
      setUploadProgress(35);
      const optimized = await optimizeImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.88,
        format: 'image/webp'
      });

      // 2. Upload to storage path
      setUploadProgress(65);
      const storagePath = `users/${userId}/profile/avatar_${Date.now()}.webp`;
      const downloadUrl = await uploadMediaFile(storagePath, optimized.blob, (progress) => {
        setUploadProgress(progress);
      });

      // If dataUrl fallback was generated, use the optimized dataUrl or downloadUrl
      const finalUrl = downloadUrl || optimized.dataUrl;

      onPhotoChange(finalUrl);
      setUploadProgress(100);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id="profile-photo-file-input"
      />

      {/* Avatar Container with Preview & Progress */}
      <div className="relative group">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center relative">
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Profile Avatar"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#061A4F] text-[#F5B400] font-black flex flex-col items-center justify-center text-3xl select-none">
              <span>{initials}</span>
              <span className="text-[9px] font-bold text-white/60 tracking-wider uppercase mt-1">No Photo</span>
            </div>
          )}

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-[#061A4F]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#F5B400] mb-1" />
              <span className="text-[11px] font-black">{uploadProgress}%</span>
              <div className="w-3/4 bg-white/20 rounded-full h-1 mt-1.5 overflow-hidden">
                <div 
                  className="bg-[#F5B400] h-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Camera Trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-2 -right-2 p-2.5 bg-[#061A4F] text-[#F5B400] rounded-2xl shadow-lg border-2 border-white hover:bg-[#0B2A6F] hover:scale-110 active:scale-95 transition flex items-center justify-center"
          title="Upload Profile Photo"
        >
          <Camera className="w-4 h-4 text-[#F5B400]" />
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex-1 space-y-3 text-center sm:text-left">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900">Profile Photo</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            JPG, JPEG, PNG, or WEBP (Max 15MB). Upload from your device, gallery, or camera.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-[#061A4F] hover:bg-[#0B2A6F] text-white text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F5B400]" />
                <span>Uploading ({uploadProgress}%)...</span>
              </>
            ) : currentPhotoUrl ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Replace Photo</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#F5B400]" />
                <span>Upload from Device</span>
              </>
            )}
          </button>

          {currentPhotoUrl && (
            <button
              type="button"
              onClick={onPhotoRemove}
              disabled={isUploading}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>

        {/* Status Notices */}
        {errorMessage && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Profile photo updated successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};
