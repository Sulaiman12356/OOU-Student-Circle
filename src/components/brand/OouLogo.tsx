import React from 'react';

interface OouLogoProps {
  variant?: 'light' | 'dark' | 'full' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const OouLogo: React.FC<OouLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Dimensions
  const getScale = () => {
    switch (size) {
      case 'sm': return { icon: 28, text: 'text-sm', badge: 'text-[9px] px-1.5 py-0.5' };
      case 'lg': return { icon: 48, text: 'text-2xl', badge: 'text-xs px-2 py-0.5' };
      case 'xl': return { icon: 64, text: 'text-3xl', badge: 'text-sm px-2.5 py-1' };
      case 'md':
      default: return { icon: 36, text: 'text-lg', badge: 'text-[10px] px-2 py-0.5' };
    }
  };

  const scale = getScale();
  const isDark = variant === 'dark'; // Dark background (white text)

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`} id="oou-brand-logo">
      {/* Visual SC Emblem with 3 Students in Circle */}
      <div 
        className="relative flex-shrink-0 flex items-center justify-center"
        style={{ width: scale.icon, height: scale.icon }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-sm" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* S curve in Navy/White */}
          <path 
            d="M50 20 C35 20, 25 30, 25 40 C25 50, 45 52, 50 60 C55 68, 45 78, 30 75" 
            stroke={isDark ? "#FFFFFF" : "#061A4F"} 
            strokeWidth="11" 
            strokeLinecap="round"
          />
          {/* C arc in Vibrant Gold */}
          <path 
            d="M52 20 C72 20, 80 34, 80 48 C80 64, 70 78, 52 78" 
            stroke="#F5B400" 
            strokeWidth="11" 
            strokeLinecap="round"
          />
          {/* Smile base curve */}
          <path 
            d="M18 55 C22 80, 50 94, 82 72" 
            stroke={isDark ? "#FFFFFF" : "#0B2A6F"} 
            strokeWidth="6" 
            strokeLinecap="round"
          />
          {/* 3 Student Figures inside the Circle */}
          {/* Left Student (Small) */}
          <circle cx="34" cy="46" r="4.5" fill={isDark ? "#FFFFFF" : "#061A4F"} />
          <path d="M28 62 C28 54, 40 54, 40 62" fill={isDark ? "#FFFFFF" : "#061A4F"} />
          
          {/* Middle Student (Center - Gold Accent Leader) */}
          <circle cx="50" cy="42" r="5.5" fill="#F5B400" />
          <path d="M42 63 C42 52, 58 52, 58 63" fill="#F5B400" />

          {/* Right Student (Small) */}
          <circle cx="66" cy="46" r="4.5" fill={isDark ? "#FFFFFF" : "#061A4F"} />
          <path d="M60 62 C60 54, 72 54, 72 62" fill={isDark ? "#FFFFFF" : "#061A4F"} />
        </svg>
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5 mb-0.5">
            {/* OOU Gold Pill Badge */}
            <span className={`inline-block font-extrabold uppercase rounded font-display tracking-wider bg-[#F5B400] text-[#061A4F] ${scale.badge}`}>
              OOU
            </span>
          </div>

          {/* StudentCircle Typography */}
          <div className={`font-bold font-display tracking-tight flex items-baseline gap-0.5 ${scale.text}`}>
            <span className={isDark ? "text-white" : "text-[#061A4F]"}>
              Student
            </span>
            <span className="text-[#F5B400]">
              Circle
            </span>
          </div>

          {/* Tagline */}
          {showTagline && size !== 'sm' && (
            <span className={`text-[8px] tracking-[0.16em] uppercase font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              Skills • Services • Opportunities
            </span>
          )}
        </div>
      )}
    </div>
  );
};
