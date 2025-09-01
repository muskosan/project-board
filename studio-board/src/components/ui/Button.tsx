import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { tokens } from '../../styles/tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  id?: string;
  title?: string;
  style?: React.CSSProperties;
}

const buttonSizes = {
  sm: css`
    padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
    font-size: ${tokens.typography.sizes.sm};
    height: 32px;
    
    @media (max-width: ${tokens.breakpoints.tablet}) {
      height: ${tokens.touch.minTarget};
      padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
    }
  `,
  md: css`
    padding: ${tokens.spacing[2.5]} ${tokens.spacing[4]};
    font-size: ${tokens.typography.sizes.base};
    height: 40px;
    
    @media (max-width: ${tokens.breakpoints.tablet}) {
      height: ${tokens.touch.minTarget};
      padding: ${tokens.spacing[3]} ${tokens.spacing[5]};
    }
  `,
  lg: css`
    padding: ${tokens.spacing[3]} ${tokens.spacing[6]};
    font-size: ${tokens.typography.sizes.lg};
    height: 48px;
    
    @media (max-width: ${tokens.breakpoints.tablet}) {
      height: 52px;
      padding: ${tokens.spacing[3.5]} ${tokens.spacing[7]};
    }
  `,
};

const buttonVariants = {
  primary: css`
    background-color: ${tokens.colors.interactive.primary};
    color: ${tokens.colors.text.inverse};
    border: 1px solid ${tokens.colors.interactive.primary};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colors.interactive.primaryHover};
      border-color: ${tokens.colors.interactive.primaryHover};
      box-shadow: ${tokens.shadows.md};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colors.interactive.primaryActive};
      border-color: ${tokens.colors.interactive.primaryActive};
      transform: translateY(1px);
    }
    
    &:focus-visible {
      box-shadow: ${tokens.shadows.focus};
    }
  `,
  secondary: css`
    background-color: ${tokens.colors.interactive.secondary};
    color: ${tokens.colors.text.primary};
    border: 1px solid ${tokens.colors.border.medium};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colors.interactive.secondaryHover};
      border-color: ${tokens.colors.border.dark};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colors.interactive.secondaryActive};
      transform: translateY(1px);
    }
    
    &:focus-visible {
      box-shadow: ${tokens.shadows.focus};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${tokens.colors.interactive.primary};
    border: 1px solid ${tokens.colors.interactive.primary};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colors.interactive.primary}10;
      border-color: ${tokens.colors.interactive.primaryHover};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colors.interactive.primary}20;
      transform: translateY(1px);
    }
    
    &:focus-visible {
      box-shadow: ${tokens.shadows.focus};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${tokens.colors.text.primary};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colors.interactive.secondaryHover};
      color: ${tokens.colors.text.primary};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colors.interactive.secondaryActive};
      transform: translateY(1px);
    }
    
    &:focus-visible {
      box-shadow: ${tokens.shadows.focus};
    }
  `,
  danger: css`
    background-color: ${tokens.colors.status.error};
    color: ${tokens.colors.text.inverse};
    border: 1px solid ${tokens.colors.status.error};
    
    &:hover:not(:disabled) {
      background-color: #B91C1C;
      border-color: #B91C1C;
      box-shadow: ${tokens.shadows.md};
    }
    
    &:active:not(:disabled) {
      background-color: #991B1B;
      border-color: #991B1B;
      transform: translateY(1px);
    }
    
    &:focus-visible {
      box-shadow: 0 0 0 3px ${tokens.colors.status.error}30;
    }
  `,
};

const StyledButton = styled(motion.button)<ButtonProps>`
  font-family: ${tokens.typography.fonts.primary};
  font-weight: ${tokens.typography.weights.semibold};
  border-radius: ${tokens.borderRadius.lg};
  outline: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing[2]};
  position: relative;
  transition: ${tokens.transitions.all};
  text-decoration: none;
  white-space: nowrap;
  
  ${({ size = 'md' }) => buttonSizes[size]}
  ${({ variant = 'primary' }) => buttonVariants[variant]}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  ${({ loading }) => loading && css`
    cursor: wait;
    
    &::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: ${tokens.spacing[2]};
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

export const Button: React.FC<ButtonProps> = ({ 
  children,
  loading,
  disabled,
  ...props 
}) => {
  return (
    <StyledButton
      disabled={disabled || loading}
      loading={loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading ? '' : children}
    </StyledButton>
  );
};