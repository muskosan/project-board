import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
  className?: string;
}

const SpinnerContainer = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  position: relative;
  display: inline-block;
`;

const SpinnerSvg = styled(motion.svg)`
  width: 100%;
  height: 100%;
`;

const SpinnerCircle = styled(motion.circle)<{ color: string; thickness: number }>`
  fill: none;
  stroke: ${({ color }) => color};
  stroke-width: ${({ thickness }) => thickness};
  stroke-linecap: round;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color,
  thickness = 2,
  className,
}) => {
  const spinnerColor = color || '#D2691E'; // Default to accent color
  const radius = (size - thickness) / 2;
  const center = size / 2;

  return (
    <SpinnerContainer size={size} className={className}>
      <SpinnerSvg
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <SpinnerCircle
          cx={center}
          cy={center}
          r={radius}
          color={spinnerColor}
          thickness={thickness}
          animate={{
            strokeDasharray: ['90, 150', '90, 150', '90, 150'],
            strokeDashoffset: [0, -35, -124],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </SpinnerSvg>
    </SpinnerContainer>
  );
};

// Dots loading indicator
const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled(motion.div)<{ color: string; size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
`;

interface LoadingDotsProps {
  size?: number;
  color?: string;
  count?: number;
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 8,
  color,
  count = 3,
  className,
}) => {
  const dotColor = color || '#D2691E';

  return (
    <DotsContainer className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <Dot
          key={index}
          size={size}
          color={dotColor}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </DotsContainer>
  );
};

// Pulse loading indicator
const PulseContainer = styled(motion.div)<{ size: number; color: string }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
`;

interface LoadingPulseProps {
  size?: number;
  color?: string;
  className?: string;
}

export const LoadingPulse: React.FC<LoadingPulseProps> = ({
  size = 40,
  color,
  className,
}) => {
  const pulseColor = color || '#D2691E';

  return (
    <PulseContainer
      size={size}
      color={pulseColor}
      className={className}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};