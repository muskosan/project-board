import React from 'react';
import styled from 'styled-components';
import type { FileItem } from '../../types';

import { ChevronRight, Home, Folder } from 'lucide-react';

interface FolderNavigationProps {
  currentPath: FileItem[];
  onNavigate: (folder: FileItem | null) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  white-space: nowrap;
`;

const BreadcrumbItem = styled.button<{ isLast: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ isLast, theme }) => 
    isLast ? theme.colors.text.primary : theme.colors.text.secondary};
  cursor: ${({ isLast }) => isLast ? 'default' : 'pointer'};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &:disabled {
    cursor: default;
  }
`;

const Separator = styled.div`
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  align-items: center;
`;

const HomeButton = styled(BreadcrumbItem)`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

export const FolderNavigation: React.FC<FolderNavigationProps> = ({
  currentPath,
  onNavigate,
}) => {
  const handleNavigate = (index: number) => {
    if (index === -1) {
      // Navigate to root
      onNavigate(null);
    } else {
      // Navigate to specific folder in path
      onNavigate(currentPath[index]);
    }
  };

  return (
    <Container>
      <HomeButton
        isLast={currentPath.length === 0}
        onClick={() => handleNavigate(-1)}
        disabled={currentPath.length === 0}
      >
        <Home size={16} />
        Files
      </HomeButton>

      {currentPath.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <Separator>
            <ChevronRight size={16} />
          </Separator>
          <BreadcrumbItem
            isLast={index === currentPath.length - 1}
            onClick={() => handleNavigate(index)}
            disabled={index === currentPath.length - 1}
          >
            <Folder size={16} />
            {folder.name}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Container>
  );
};