import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { Skeleton, SkeletonCard } from './Skeleton';
import { fadeIn, staggerContainer, staggerItem } from '../../utils/animations';

interface PageLoaderProps {
  type?: 'spinner' | 'skeleton' | 'cards';
  message?: string;
  className?: string;
}

const LoaderContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingMessage = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const SkeletonGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 1200px;
`;

const SkeletonList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 800px;
`;

export const PageLoader: React.FC<PageLoaderProps> = ({
  type = 'spinner',
  message = 'Loading...',
  className,
}) => {
  if (type === 'spinner') {
    return (
      <LoaderContainer
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className={className}
      >
        <SpinnerContainer>
          <LoadingSpinner size={32} />
          <LoadingMessage
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            {message}
          </LoadingMessage>
        </SpinnerContainer>
      </LoaderContainer>
    );
  }

  if (type === 'cards') {
    return (
      <LoaderContainer className={className}>
        <SkeletonGrid
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div key={index} variants={staggerItem}>
              <SkeletonCard />
            </motion.div>
          ))}
        </SkeletonGrid>
      </LoaderContainer>
    );
  }

  // Default skeleton type
  return (
    <LoaderContainer className={className}>
      <SkeletonList
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div key={index} variants={staggerItem}>
            <Skeleton height="60px" borderRadius="8px" />
          </motion.div>
        ))}
      </SkeletonList>
    </LoaderContainer>
  );
};

// Specialized loaders for different content types
export const DashboardLoader: React.FC<{ className?: string }> = ({ className }) => (
  <LoaderContainer className={className}>
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      style={{ width: '100%', maxWidth: '1200px' }}
    >
      <motion.div variants={staggerItem} style={{ marginBottom: '2rem' }}>
        <Skeleton height="200px" borderRadius="12px" />
      </motion.div>
      
      <SkeletonGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div key={index} variants={staggerItem}>
            <SkeletonCard />
          </motion.div>
        ))}
      </SkeletonGrid>
    </motion.div>
  </LoaderContainer>
);

export const ProjectListLoader: React.FC<{ className?: string }> = ({ className }) => (
  <PageLoader type="cards" className={className} />
);

export const TaskBoardLoader: React.FC<{ className?: string }> = ({ className }) => (
  <LoaderContainer className={className}>
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}
    >
      {Array.from({ length: 3 }).map((_, columnIndex) => (
        <motion.div key={columnIndex} variants={staggerItem}>
          <Skeleton height="40px" style={{ marginBottom: '1rem' }} />
          {Array.from({ length: 3 }).map((_, cardIndex) => (
            <Skeleton 
              key={cardIndex} 
              height="120px" 
              style={{ marginBottom: '0.75rem' }}
              borderRadius="8px"
            />
          ))}
        </motion.div>
      ))}
    </motion.div>
  </LoaderContainer>
);