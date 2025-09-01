import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { cardHoverVariants, transitions } from '../../utils/animations';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
  onClick?: (event?: React.MouseEvent) => void;
  className?: string;
}

const cardVariants = {
  default: css`
    background-color: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid transparent;
    box-shadow: ${({ theme }) => theme.shadows.sm};
  `,
  elevated: css`
    background-color: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid transparent;
    box-shadow: ${({ theme }) => theme.shadows.lg};
  `,
  outlined: css`
    background-color: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.text.muted};
    box-shadow: none;
  `,
};

const cardPadding = {
  none: css`
    padding: 0;
  `,
  sm: css`
    padding: ${({ theme }) => theme.spacing.md};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.lg};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.xl};
  `,
};

const StyledCard = styled(motion.div)<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  
  ${({ variant = 'default' }) => cardVariants[variant]}
  ${({ padding = 'md' }) => cardPadding[padding]}
  
  ${({ clickable }) => clickable && css`
    cursor: pointer;
    user-select: none;
  `}
`;

export const Card: React.FC<CardProps> = ({ 
  children, 
  onClick,
  clickable,
  hover = clickable,
  ...props 
}) => {
  const isInteractive = clickable || !!onClick;
  
  return (
    <StyledCard 
      onClick={onClick} 
      clickable={isInteractive}
      variants={cardHoverVariants}
      initial="initial"
      whileHover={hover && isInteractive ? "hover" : undefined}
      whileTap={isInteractive ? { scale: 0.98, transition: transitions.micro } : undefined}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

// Card sub-components for better composition
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const CardHeader: React.FC<CardHeaderProps> = ({ children, ...props }) => {
  return <StyledCardHeader {...props}>{children}</StyledCardHeader>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardContent = styled.div`
  flex: 1;
`;

export const CardContent: React.FC<CardContentProps> = ({ children, ...props }) => {
  return <StyledCardContent {...props}>{children}</StyledCardContent>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:first-child {
    margin-top: 0;
  }
`;

export const CardFooter: React.FC<CardFooterProps> = ({ children, ...props }) => {
  return <StyledCardFooter {...props}>{children}</StyledCardFooter>;
};