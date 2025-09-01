import React from 'react';
import styled from 'styled-components';

// ============================================================================
// TAG COLOR MAPPING
// ============================================================================

const tagColors: Record<string, { background: string; color: string; border: string }> = {
  // Priority tags
  urgent: { background: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  high: { background: '#FFFBEB', color: '#D97706', border: '#FED7AA' },
  medium: { background: '#F0F9FF', color: '#0284C7', border: '#BAE6FD' },
  low: { background: '#F7FEE7', color: '#65A30D', border: '#D9F99D' },
  
  // Category tags
  design: { background: '#FDF4FF', color: '#A21CAF', border: '#F3E8FF' },
  development: { background: '#ECFDF5', color: '#059669', border: '#BBF7D0' },
  review: { background: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  testing: { background: '#EFF6FF', color: '#2563EB', border: '#DBEAFE' },
  client: { background: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
  marketing: { background: '#FDF2F8', color: '#BE185D', border: '#FBCFE8' },
  branding: { background: '#F0F4FF', color: '#6366F1', border: '#C7D2FE' },
  mobile: { background: '#ECFCCB', color: '#84CC16', border: '#D9F99D' },
  web: { background: '#FEF7FF', color: '#9333EA', border: '#E9D5FF' },
  content: { background: '#FFFBEB', color: '#EA580C', border: '#FED7AA' },
  seo: { background: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  
  // Default fallback
  default: { background: '#F8FAFC', color: '#64748B', border: '#E2E8F0' },
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const TagContainer = styled.span<{ $colors: { background: string; color: string; border: string } }>`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ $colors }) => $colors.background};
  color: ${({ $colors }) => $colors.color};
  border: 1px solid ${({ $colors }) => $colors.border};
  text-transform: lowercase;
  letter-spacing: 0.025em;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const TagDot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  margin-right: 0.375rem;
  flex-shrink: 0;
`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================



const generateColorFromString = (str: string): { background: string; color: string; border: string } => {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate HSL color with good contrast
  const hue = Math.abs(hash) % 360;
  const saturation = 45 + (Math.abs(hash) % 30); // 45-75%
  const lightness = 85 + (Math.abs(hash) % 10); // 85-95% for background
  
  const background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const color = `hsl(${hue}, ${saturation + 20}%, 25%)`; // Darker for text
  const border = `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`;
  
  return { background, color, border };
};

// ============================================================================
// COMPONENT
// ============================================================================

interface TaskTagProps {
  tag: string;
  showDot?: boolean;
  onClick?: (tag: string) => void;
  className?: string;
}

export const TaskTag: React.FC<TaskTagProps> = ({
  tag,
  showDot = true,
  onClick,
  className,
}) => {
  const colors = tagColors[tag.toLowerCase()] || generateColorFromString(tag);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(tag);
    }
  };

  return (
    <TagContainer
      $colors={colors}
      onClick={onClick ? handleClick : undefined}
      className={className}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {showDot && <TagDot $color={colors.color} />}
      {tag}
    </TagContainer>
  );
};

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

export const getAvailableTagColors = () => {
  return Object.keys(tagColors).filter(key => key !== 'default');
};

export const createCustomTag = (tag: string, colors?: { background: string; color: string; border: string }) => {
  if (colors) {
    tagColors[tag.toLowerCase()] = colors;
  }
  return tag;
};