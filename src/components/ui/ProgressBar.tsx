import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { progressVariants } from '../../utils/animations';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: string;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const ProgressContainer = styled.div<{ height: string }>`
  width: 100%;
  height: ${({ height }) => height};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled(motion.div)<{ color: string }>`
  height: 100%;
  background-color: ${({ color }) => color};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  position: relative;
  
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
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
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

const ProgressLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  z-index: 1;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = '8px',
  color,
  showLabel = false,
  label,
  animated = true,
  className,
}) => {
  const progressColor = color || '#10B981'; // Default to success color
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <ProgressContainer height={height} className={className}>
      {showLabel && (
        <ProgressLabel>
          {label || `${Math.round(clampedProgress)}%`}
        </ProgressLabel>
      )}
      <ProgressFill
        color={progressColor}
        variants={animated ? progressVariants : undefined}
        initial={animated ? 'initial' : undefined}
        animate={animated ? 'animate' : undefined}
        custom={clampedProgress}
        style={!animated ? { width: `${clampedProgress}%` } : undefined}
      />
    </ProgressContainer>
  );
};

// Circular progress component
const CircularContainer = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  position: relative;
`;

const CircularSvg = styled.svg`
  transform: rotate(-90deg);
`;

const CircularBackground = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.background.secondary};
  stroke-width: 4;
`;

const CircularProgress = styled(motion.circle)<{ color: string }>`
  fill: none;
  stroke: ${({ color }) => color};
  stroke-width: 4;
  stroke-linecap: round;
`;

const CircularLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgressBar: React.FC<CircularProgressProps> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  color,
  showLabel = true,
  label,
  className,
}) => {
  const progressColor = color || '#10B981';
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <CircularContainer size={size} className={className}>
      <CircularSvg width={size} height={size}>
        <CircularBackground
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <CircularProgress
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          color={progressColor}
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </CircularSvg>
      {showLabel && (
        <CircularLabel>
          {label || `${Math.round(clampedProgress)}%`}
        </CircularLabel>
      )}
    </CircularContainer>
  );
};