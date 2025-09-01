import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { buttonHoverVariants } from '../../utils/animations';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

const buttonVariants = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.accent.primary};
    color: white;
    border: 1px solid ${({ theme }) => theme.colors.accent.primary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.accent.primary}dd;
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.accent.secondary};
    color: white;
    border: 1px solid ${({ theme }) => theme.colors.accent.secondary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.accent.secondary}dd;
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.text.secondary};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.secondary};
      border-color: ${({ theme }) => theme.colors.text.primary};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.secondary};
    }
  `,
};

const buttonSizes = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    height: 32px;
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.typography.sizes.base};
    height: 40px;
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
    height: 48px;
  `,
};

const StyledButton = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  
  ${({ variant = 'primary' }) => buttonVariants[variant]}
  ${({ size = 'md' }) => buttonSizes[size]}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.primary};
    outline-offset: 2px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading = false,
  disabled = false,
  size = 'md',
  ...props 
}) => {
  const spinnerSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <StyledButton 
      disabled={disabled || loading} 
      size={size}
      variants={buttonHoverVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      {...props}
    >
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner size={spinnerSize} color="currentColor" />
          Loading...
        </LoadingContainer>
      ) : children}
    </StyledButton>
  );
};