import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  once = true,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            const timer = setTimeout(() => {
              setIsRevealed(true);
            }, delay);
            if (once) observer.unobserve(element);
            return () => clearTimeout(timer);
          } else {
            setIsRevealed(true);
            if (once) observer.unobserve(element);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay, once, threshold]);

  const getDirectionClasses = () => {
    if (isRevealed) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100';
    }
    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-5 scale-[0.99]';
      case 'down':
        return 'opacity-0 -translate-y-5 scale-[0.99]';
      case 'left':
        return 'opacity-0 translate-x-5';
      case 'right':
        return 'opacity-0 -translate-x-5';
      case 'none':
      default:
        return 'opacity-0 scale-[0.98]';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${getDirectionClasses()} ${className}`}
      style={{
        transitionDelay: isRevealed ? `${delay}ms` : '0ms',
        willChange: isRevealed ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
