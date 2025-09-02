import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { tokens } from '../../styles/tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

const cardVariants = {
  default: css`
    background-color: ${tokens.colors.background.elevated};
    border: 1px solid ${tokens.colors.border.light};
    box-shadow: ${tokens.shadows.sm};
  `,
  elevated: css`
    background-color: ${tokens.colors.background.elevated};
    border: 1px solid ${tokens.colors.border.light};
    box-shadow: ${tokens.shadows.md};
  `,
  outlined: css`
    background-color: ${tokens.colors.background.primary};
    border: 1px solid ${tokens.colors.border.medium};
    box-shadow: none;
  `,
};

const cardPadding = {
  none: css`
    padding: 0;
  `,
  sm: css`
    padding: ${tokens.spacing[3]};
  `,
  md: css`
    padding: ${tokens.spacing[4]};
  `,
  lg: css`
    padding: ${tokens.spacing[6]};
  `,
};

const StyledCard = styled(motion.div)<CardProps>`
  border-radius: ${tokens.borderRadius.xl};
  transition: ${tokens.transitions.all};
  position: relative;
  overflow: hidden;
  
  ${({ variant = 'default' }) => cardVariants[variant]}
  ${({ padding = 'md' }) => cardPadding[padding]}
  
  ${({ hover }) => hover && css`
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${tokens.shadows.lg};
      border-color: ${tokens.colors.border.medium};
    }
  `}
  
  ${({ clickable }) => clickable && css`
    cursor: pointer;
    
    &:active {
      transform: translateY(0);
    }
    
    &:focus-visible {
      outline: none;
      box-shadow: ${tokens.shadows.focus};
    }
  `}
`;

export const Card: React.FC<CardProps> = ({ 
  children, 
  hover = false,
  clickable = false,
  ...props 
}) => {
  return (
    <StyledCard
      hover={hover}
      clickable={clickable}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

// Legacy exports for backward compatibility
export const CardHeader = styled.div`
  padding: ${tokens.spacing[4]} ${tokens.spacing[4]} 0;
`;

export const CardContent = styled.div`
  padding: ${tokens.spacing[4]};
`;

export const CardFooter = styled.div`
  padding: 0 ${tokens.spacing[4]} ${tokens.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${tokens.spacing[2]};
`;