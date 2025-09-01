import React from 'react';
import styled, { css } from 'styled-components';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const badgeVariants = {
  default: css`
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.text.muted};
  `,
  primary: css`
    background-color: ${({ theme }) => theme.colors.accent.primary}20;
    color: ${({ theme }) => theme.colors.accent.primary};
    border: 1px solid ${({ theme }) => theme.colors.accent.primary}40;
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.accent.secondary}20;
    color: ${({ theme }) => theme.colors.accent.secondary};
    border: 1px solid ${({ theme }) => theme.colors.accent.secondary}40;
  `,
  success: css`
    background-color: ${({ theme }) => theme.colors.status.success}20;
    color: ${({ theme }) => theme.colors.status.success};
    border: 1px solid ${({ theme }) => theme.colors.status.success}40;
  `,
  warning: css`
    background-color: ${({ theme }) => theme.colors.status.warning}20;
    color: ${({ theme }) => theme.colors.status.warning};
    border: 1px solid ${({ theme }) => theme.colors.status.warning}40;
  `,
  error: css`
    background-color: ${({ theme }) => theme.colors.status.error}20;
    color: ${({ theme }) => theme.colors.status.error};
    border: 1px solid ${({ theme }) => theme.colors.status.error}40;
  `,
  info: css`
    background-color: ${({ theme }) => theme.colors.status.info}20;
    color: ${({ theme }) => theme.colors.status.info};
    border: 1px solid ${({ theme }) => theme.colors.status.info}40;
  `,
};

const badgeSizes = {
  sm: css`
    padding: ${({ theme }) => `2px ${theme.spacing.xs}`};
    font-size: ${({ theme }) => theme.typography.sizes.xs};
    height: 20px;
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    height: 24px;
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.typography.sizes.base};
    height: 32px;
  `,
};

const StyledBadge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  white-space: nowrap;
  user-select: none;
  cursor: ${({ onClick }) => onClick ? 'pointer' : 'default'};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ variant = 'default' }) => badgeVariants[variant]}
  ${({ size = 'md' }) => badgeSizes[size]}
  
  ${({ onClick }) => onClick && css`
    &:hover {
      transform: translateY(-1px);
      opacity: 0.8;
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

export const Badge: React.FC<BadgeProps> = ({ children, ...props }) => {
  return <StyledBadge {...props}>{children}</StyledBadge>;
};