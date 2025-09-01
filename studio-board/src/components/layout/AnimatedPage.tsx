import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../../utils/animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedPageTransitionProps {
  children: React.ReactNode;
  location: string;
}

export const AnimatedPageTransition: React.FC<AnimatedPageTransitionProps> = ({ 
  children, 
  location 
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};