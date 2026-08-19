import React from 'react';

interface UserAvatarProps {
  name?: string;
  photoUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showVerifiedBadge?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  photoUrl,
  size = 'md',
  className = '',
  showVerifiedBadge = false,
}) => {
  // Generate initials (up to 2 characters)
  const getInitials = (text: string) => {
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'SC';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Color selection based on name hash for consistent elegant avatar palettes
  const getPalette = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      { bg: 'bg-[#061A4F]', text: 'text-[#F5B400]' },
      { bg: 'bg-emerald-800', text: 'text-emerald-100' },
      { bg: 'bg-indigo-900', text: 'text-amber-300' },
      { bg: 'bg-slate-800', text: 'text-white' },
      { bg: 'bg-blue-950', text: 'text-blue-200' },
      { bg: 'bg-amber-800', text: 'text-amber-100' },
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-black',
    '2xl': 'w-28 h-28 text-3xl font-black',
  };

  const palette = getPalette(name);
  const initials = getInitials(name);

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {photoUrl && !photoUrl.includes('placeholder') ? (
        <img
          src={photoUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-2xl object-cover border border-slate-200 shadow-sm`}
          onError={(e) => {
            // If image fails to load, replace with avatar fallback
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const fallback = parent.querySelector('.avatar-fallback');
              if (fallback) (fallback as HTMLElement).style.display = 'flex';
            }
          }}
        />
      ) : null}

      <div
        className={`avatar-fallback ${sizeClasses[size]} ${palette.bg} ${palette.text} rounded-2xl font-bold flex items-center justify-center tracking-wider shadow-inner select-none ${
          photoUrl && !photoUrl.includes('placeholder') ? 'hidden' : 'flex'
        }`}
      >
        {initials}
      </div>

      {showVerifiedBadge && (
        <span
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs"
          title="Verified OOU Student"
        >
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </div>
  );
};
