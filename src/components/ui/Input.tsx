import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, transitions } from '../../utils/animations';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' | 'datetime-local' | 'date' | 'time';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  error?: boolean | string;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

const inputSizes = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    height: 32px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      height: ${({ theme }) => theme.touch.minTarget};
      font-size: 16px; /* Prevent zoom on iOS */
    }
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.sizes.base};
    height: 40px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      height: ${({ theme }) => theme.touch.minTarget};
      font-size: 16px; /* Prevent zoom on iOS */
      padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
    }
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
    height: 48px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      height: 52px;
      font-size: 16px; /* Prevent zoom on iOS */
      padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    }
  `,
};

const inputVariants = {
  default: css`
    background-color: ${({ theme }) => theme.colors.background.elevated};
    border: 1px solid ${({ theme }) => theme.colors.border.medium};
    
    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.border.dark};
    }
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.border.focus};
      box-shadow: ${({ theme }) => theme.shadows.focus};
    }
  `,
  filled: css`
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.elevated};
      border-color: ${({ theme }) => theme.colors.border.medium};
    }
    
    &:focus {
      background-color: ${({ theme }) => theme.colors.background.elevated};
      border-color: ${({ theme }) => theme.colors.border.focus};
      box-shadow: ${({ theme }) => theme.shadows.focus};
    }
  `,
};

const StyledInput = styled(motion.input)<InputProps & { isFocused: boolean }>`
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: ${({ theme }) => theme.typography.weights.normal};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  outline: none;
  width: 100%;
  position: relative;
  transition: ${({ theme }) => theme.transitions.colors};
  
  ${({ size = 'md' }) => inputSizes[size]}
  ${({ variant = 'default' }) => inputVariants[variant]}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  ${({ error, theme }) => error && css`
    border-color: ${theme.colors.status.error};
    
    &:focus {
      border-color: ${theme.colors.status.error};
      box-shadow: 0 0 0 3px ${theme.colors.status.error}10;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.surface[100]};
    color: ${({ theme }) => theme.colors.text.muted};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const ErrorMessage = styled(motion.div)`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.status.error};
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Input: React.FC<InputProps> = ({ 
  type = 'text',
  error,
  onFocus,
  onBlur,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : '';
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  return (
    <InputWrapper>
      <StyledInput 
        type={type} 
        error={hasError}
        isFocused={isFocused}
        onFocus={handleFocus}
        onBlur={handleBlur}
        animate={{
          scale: isFocused ? 1.01 : 1,
          transition: transitions.fast,
        }}
        {...props} 
      />
      <AnimatePresence>
        {errorMessage && (
          <ErrorMessage
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitions.fast}
          >
            {errorMessage}
          </ErrorMessage>
        )}
      </AnimatePresence>
    </InputWrapper>
  );
};