import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Image as ImageIcon 
} from 'lucide-react';

interface SwipeableGalleryProps {
  images: string[];
  alt?: string;
  aspectRatio?: 'square' | 'video' | 'standard';
  className?: string;
}

export const SwipeableGallery: React.FC<SwipeableGalleryProps> = ({
  images = [],
  alt = 'Product or Service Gallery',
  aspectRatio = 'square',
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Clean empty or invalid image strings
  const validImages = images.filter(Boolean);
  const displayImages = validImages.length > 0 
    ? validImages 
    : ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  // Keyboard navigation when Lightbox is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, displayImages.length]);

  // Touch Swipe handlers
  const minSwipeDistance = 45;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    standard: 'aspect-4/3',
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Main Image Stage */}
      <div 
        className={`relative ${aspectClasses[aspectRatio]} w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md group select-none`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={displayImages[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
        />

        {/* Counter Badge */}
        {displayImages.length > 1 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold tracking-wider shadow-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition opacity-0 group-hover:opacity-100 sm:opacity-90"
          title="View full size"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev & Next Arrows (Desktop & Tablet) */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md transition opacity-0 group-hover:opacity-100"
              title="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md transition opacity-0 group-hover:opacity-100"
              title="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                currentIndex === idx
                  ? 'border-[#061A4F] ring-2 ring-[#F5B400] scale-105'
                  : 'border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full">
              {currentIndex + 1} of {displayImages.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/30 text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Large Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImages[currentIndex]}
              alt={`${alt} - full view`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
