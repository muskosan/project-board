import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { pulseVariants, fadeInVariants } from '../../utils/animations';


interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonBase = styled(motion.div)<SkeletonProps>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.background.secondary} 0%,
    ${({ theme }) => theme.colors.background.elevated} 50%,
    ${({ theme }) => theme.colors.background.secondary} 100%
  );
  background-size: 200% 100%;
  border-radius: ${({ borderRadius, theme }) => borderRadius || theme.borderRadius.md};
  width: ${({ width }) => typeof width === 'number' ? `${width}px` : width || '100%'};
  height: ${({ height }) => typeof height === 'number' ? `${height}px` : height || '1rem'};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

export const Skeleton: React.FC<SkeletonProps> = (props) => {
  return (
    <SkeletonBase 
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      {...props} 
    />
  );
};

// Predefined skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        height="1rem"
        width={index === lines - 1 ? '75%' : '100%'}
        style={{ marginBottom: index < lines - 1 ? '0.5rem' : 0 }}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <Skeleton height="200px" borderRadius="12px" style={{ marginBottom: '1rem' }} />
    <Skeleton height="1.5rem" width="80%" style={{ marginBottom: '0.5rem' }} />
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({ 
  size = 40, 
  className 
}) => (
  <Skeleton
    width={size}
    height={size}
    borderRadius="50%"
    className={className}
  />
);

export const SkeletonButton: React.FC<{ width?: string; className?: string }> = ({ 
  width = '120px', 
  className 
}) => (
  <Skeleton
    width={width}
    height="40px"
    borderRadius="8px"
    className={className}
  />
);

// Complex skeleton layouts
export const SkeletonProjectCard: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div 
    className={className}
    variants={fadeInVariants}
    initial="initial"
    animate="animate"
  >
    <Skeleton height="160px" borderRadius="12px" style={{ marginBottom: '1rem' }} />
    <Skeleton height="1.5rem" width="85%" style={{ marginBottom: '0.5rem' }} />
    <SkeletonText lines={2} />
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <SkeletonAvatar size={24} />
      <SkeletonAvatar size={24} />
      <SkeletonAvatar size={24} />
    </div>
  </motion.div>
);

export const SkeletonTaskCard: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div 
    className={className}
    variants={fadeInVariants}
    initial="initial"
    animate="animate"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <Skeleton height="1rem" width="60%" />
      <Skeleton height="1rem" width="20%" />
    </div>
    <SkeletonText lines={2} />
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <Skeleton height="20px" width="60px" borderRadius="10px" />
      <Skeleton height="20px" width="40px" borderRadius="10px" />
    </div>
  </motion.div>
);

export const SkeletonDashboard: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div 
    className={className}
    variants={fadeInVariants}
    initial="initial"
    animate="animate"
    style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}
  >
    <div>
      <Skeleton height="2rem" width="200px" style={{ marginBottom: '1rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonProjectCard key={index} />
        ))}
      </div>
    </div>
    <div>
      <Skeleton height="2rem" width="150px" style={{ marginBottom: '1rem' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <SkeletonAvatar size={32} />
            <div style={{ flex: 1 }}>
              <Skeleton height="1rem" width="80%" style={{ marginBottom: '0.25rem' }} />
              <Skeleton height="0.75rem" width="60%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);