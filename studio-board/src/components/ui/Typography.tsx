import React from 'react';
import styled, { css } from 'styled-components';

// Base typography styles
const baseTextStyles = css`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.5;
`;

const baseHeadingStyles = css`
  ${baseTextStyles}
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  line-height: 1.2;
`;

// Heading component
interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted';
  children: React.ReactNode;
  className?: string;
}

const StyledHeading = styled.h1<HeadingProps>`
  ${baseHeadingStyles}
  font-size: ${({ theme, size, level }) => {
    if (size) return theme.typography.sizes[size];
    switch (level) {
      case 1: return theme.typography.sizes['4xl'];
      case 2: return theme.typography.sizes['3xl'];
      case 3: return theme.typography.sizes['2xl'];
      case 4: return theme.typography.sizes.xl;
      case 5: return theme.typography.sizes.lg;
      case 6: return theme.typography.sizes.base;
      default: return theme.typography.sizes['2xl'];
    }
  }};
  font-weight: ${({ theme, weight }) => 
    weight ? theme.typography.weights[weight] : theme.typography.weights.semibold
  };
  color: ${({ theme, color }) => {
    switch (color) {
      case 'secondary': return theme.colors.text.secondary;
      case 'muted': return theme.colors.text.muted;
      default: return theme.colors.text.primary;
    }
  }};
`;

export const Heading: React.FC<HeadingProps> = ({ 
  level = 2, 
  children, 
  ...props 
}) => {
  return (
    <StyledHeading as={`h${level}`} level={level} {...props}>
      {children}
    </StyledHeading>
  );
};

// Text component
interface TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted';
  children: React.ReactNode;
  className?: string;
}

const StyledText = styled.p<TextProps>`
  ${baseTextStyles}
  font-size: ${({ theme, size = 'base' }) => theme.typography.sizes[size]};
  font-weight: ${({ theme, weight = 'normal' }) => theme.typography.weights[weight]};
  color: ${({ theme, color = 'primary' }) => {
    switch (color) {
      case 'secondary': return theme.colors.text.secondary;
      case 'muted': return theme.colors.text.muted;
      default: return theme.colors.text.primary;
    }
  }};
`;

export const Text: React.FC<TextProps> = ({ children, ...props }) => {
  return <StyledText {...props}>{children}</StyledText>;
};

// Label component
interface LabelProps {
  size?: 'xs' | 'sm' | 'base';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted';
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

const StyledLabel = styled.label<LabelProps>`
  ${baseTextStyles}
  font-size: ${({ theme, size = 'sm' }) => theme.typography.sizes[size]};
  font-weight: ${({ theme, weight = 'medium' }) => theme.typography.weights[weight]};
  color: ${({ theme, color = 'primary' }) => {
    switch (color) {
      case 'secondary': return theme.colors.text.secondary;
      case 'muted': return theme.colors.text.muted;
      default: return theme.colors.text.primary;
    }
  }};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const Label: React.FC<LabelProps> = ({ children, ...props }) => {
  return <StyledLabel {...props}>{children}</StyledLabel>;
};

// Unified Typography component
interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'label';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'error';
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  weight,
  color = 'primary',
  children, 
  ...props 
}) => {
  const colorValue = color === 'error' ? 'muted' : color; // Map error to muted for now
  
  switch (variant) {
    case 'h1':
      return <Heading level={1} weight={weight} color={colorValue} {...props}>{children}</Heading>;
    case 'h2':
      return <Heading level={2} weight={weight} color={colorValue} {...props}>{children}</Heading>;
    case 'h3':
      return <Heading level={3} weight={weight} color={colorValue} {...props}>{children}</Heading>;
    case 'h4':
      return <Heading level={4} weight={weight} color={colorValue} {...props}>{children}</Heading>;
    case 'h5':
      return <Heading level={5} weight={weight} color={colorValue} {...props}>{children}</Heading>;
    case 'h6':
      return <Heading level={6} weight={weight} color={colorValue} {...props}>{children}</Heading>;
    case 'caption':
      return <Text size="xs" weight={weight} color={colorValue} {...props}>{children}</Text>;
    case 'label':
      return <Label weight={weight} color={colorValue} {...props}>{children}</Label>;
    default:
      return <Text weight={weight} color={colorValue} {...props}>{children}</Text>;
  }
};