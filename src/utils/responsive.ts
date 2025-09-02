import { useState, useEffect } from 'react';
import { tokens } from '../styles/tokens';

// Hook to detect mobile/tablet/desktop breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | 'wide'>('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < parseInt(tokens.breakpoints.mobile)) {
        setBreakpoint('mobile');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < parseInt(tokens.breakpoints.tablet)) {
        setBreakpoint('mobile');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < parseInt(tokens.breakpoints.desktop)) {
        setBreakpoint('tablet');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < parseInt(tokens.breakpoints.wide)) {
        setBreakpoint('desktop');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      } else {
        setBreakpoint('wide');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isTouch: isMobile || isTablet,
  };
};

// Hook to detect touch device
export const useTouch = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });
    
    return () => window.removeEventListener('touchstart', checkTouch);
  }, []);

  return isTouch;
};

// Hook for handling mobile gestures
export const useSwipeGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

// Utility function to get responsive values
export const getResponsiveValue = <T>(
  values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    wide?: T;
  },
  currentBreakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
): T | undefined => {
  return values[currentBreakpoint] || 
         values.desktop || 
         values.tablet || 
         values.mobile;
};

// CSS media query helpers
export const mediaQueries = {
  mobile: `@media (max-width: ${tokens.breakpoints.mobile})`,
  tablet: `@media (max-width: ${tokens.breakpoints.tablet})`,
  desktop: `@media (min-width: ${tokens.breakpoints.desktop})`,
  wide: `@media (min-width: ${tokens.breakpoints.wide})`,
  
  // Touch-specific queries
  touch: '@media (hover: none) and (pointer: coarse)',
  hover: '@media (hover: hover) and (pointer: fine)',
  
  // Orientation queries
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',
  
  // Combined queries
  mobilePortrait: `@media (max-width: ${tokens.breakpoints.tablet}) and (orientation: portrait)`,
  mobileLandscape: `@media (max-width: ${tokens.breakpoints.tablet}) and (orientation: landscape)`,
};