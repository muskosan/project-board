import type { Variants, Transition } from 'framer-motion';

// Animation durations based on design system
export const DURATIONS = {
  micro: 0.15,      // 150ms for micro-interactions
  transition: 0.3,  // 300ms for transitions
  complex: 0.5,     // 500ms for complex animations
} as const;

// Easing curves
export const EASINGS = {
  default: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.46, 0.45, 0.94],
} as const;

// Common transitions
export const transitions: Record<string, Transition> = {
  micro: {
    duration: DURATIONS.micro,
    ease: EASINGS.default,
  },
  smooth: {
    duration: DURATIONS.transition,
    ease: EASINGS.default,
  },
  bounce: {
    duration: DURATIONS.transition,
    ease: EASINGS.bounce,
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
};

// Hover animation variants
export const hoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: transitions.micro,
  },
  tap: {
    scale: 0.98,
    transition: transitions.micro,
  },
};

// Card hover variants
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.01,
    y: -4,
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transition: transitions.smooth,
  },
};

// Button hover variants
export const buttonHoverVariants: Variants = {
  initial: {
    scale: 1,
    backgroundColor: 'var(--color-primary)',
  },
  hover: {
    scale: 1.05,
    backgroundColor: 'var(--color-primary-dark)',
    transition: transitions.micro,
  },
  tap: {
    scale: 0.95,
    transition: transitions.micro,
  },
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.smooth,
  },
};

// Fade in variants
export const fadeInVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.smooth,
  },
};

// Slide in variants
export const slideInVariants: Variants = {
  initial: {
    x: -20,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: transitions.smooth,
  },
};

// Stagger children animation
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// Alias for fadeIn
export const fadeIn = fadeInVariants;

// Loading pulse animation
export const pulseVariants: Variants = {
  initial: {
    opacity: 0.6,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

// Progress bar animation
export const progressVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: (progress: number) => ({
    scaleX: progress / 100,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

// Modal/overlay variants
export const overlayVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.smooth,
  },
};

export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.bounce,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: transitions.smooth,
  },
};

// Notification variants
export const notificationVariants: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: transitions.bounce,
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    transition: transitions.smooth,
  },
};