import React from 'react';
import styled, { css } from 'styled-components';
import { tokens } from '../../styles/tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

const badgeVariants = {
  default: css`
    background-color: ${tokens.colors.surface[100]};
    color: ${tokens.colors.text.secondary};
    border: 1px solid ${tokens.colors.border.light};
  `,
  primary: css`
    background-color: ${tokens.colors.interactive.primary}10;
    color: ${tokens.colors.interactive.primary};
    border: 1px solid ${tokens.colors.interactive.primary}20;
  `,
  secondary: css`
    background-color: ${tokens.colors.surface[100]};
    color: ${tokens.colors.text.primary};
    border: 1px solid ${tokens.colors.border.medium};
  `,
  success: css`
    background-color: ${tokens.colors.status.success}10;
    color: ${tokens.colors.status.success};
    border: 1px solid ${tokens.colors.status.success}20;
  `,
  warning: css`
    background-color: ${tokens.colors.status.warning}10;
    color: ${tokens.colors.status.warning};
    border: 1px solid ${tokens.colors.status.warning}20;
  `,
  error: css`
    background-color: ${tokens.colors.status.error}10;
    color: ${tokens.colors.status.error};
    border: 1px solid ${tokens.colors.status.error}20;
  `,
  info: css`
    background-color: ${tokens.colors.status.info}10;
    color: ${tokens.colors.status.info};
    border: 1px solid ${tokens.colors.status.info}20;
  `,
};

const badgeSizes = {
  sm: css`
    padding: ${tokens.spacing[0.5]} ${tokens.spacing[2]};
    font-size: ${tokens.typography.sizes.xs};
    font-weight: ${tokens.typography.weights.medium};
    height: 20px;
  `,
  md: css`
    padding: ${tokens.spacing[1]} ${tokens.spacing[2.5]};
    font-size: ${tokens.typography.sizes.sm};
    font-weight: ${tokens.typography.weights.medium};
    height: 24px;
  `,
  lg: css`
    padding: ${tokens.spacing[1.5]} ${tokens.spacing[3]};
    font-size: ${tokens.typography.sizes.base};
    font-weight: ${tokens.typography.weights.medium};
    height: 32px;
  `,
};

const StyledBadge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.borderRadius.full};
  font-family: ${tokens.typography.fonts.primary};
  white-space: nowrap;
  transition: ${tokens.transitions.colors};
  cursor: ${({ onClick }) => onClick ? 'pointer' : 'default'};
  
  ${({ variant = 'default' }) => badgeVariants[variant]}
  ${({ size = 'md' }) => badgeSizes[size]}
  
  ${({ active, variant = 'default' }) => active && css`
    background-color: ${variant === 'primary' ? tokens.colors.interactive.primary : tokens.colors.surface[200]};
    color: ${variant === 'primary' ? tokens.colors.text.inverse : tokens.colors.text.primary};
    border-color: ${variant === 'primary' ? tokens.colors.interactive.primary : tokens.colors.border.dark};
  `}
  
  ${({ onClick }) => onClick && css`
    &:hover {
      opacity: 0.8;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  size = 'md',
  onClick,
  active,
  ...props 
}) => {
  return (
    <StyledBadge 
      variant={variant} 
      size={size} 
      onClick={onClick}
      active={active}
      {...props}
    >
      {children}
    </StyledBadge>
  );
};