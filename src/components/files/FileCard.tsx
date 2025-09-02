import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import type { FileItem } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  File, 
  Folder, 
  Image, 
  FileText, 
  Archive,
  MoreHorizontal,
  Download,
  Share2,
  Edit3,
  Trash2
} from 'lucide-react';
import { transitions } from '../../utils/animations';

interface FileCardProps {
  item: FileItem;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onDownload: () => void;
  onShare: () => void;
}

const CardContainer = styled(Card)<{ isFolder: boolean }>`
  position: relative;
  cursor: pointer;
  
  ${({ isFolder }) => isFolder && css`
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  `}
  
  &:hover .file-actions {
    opacity: 1;
  }
`;

const FileIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FileName = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  word-break: break-word;
  line-height: 1.4;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FileActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 10;
  min-width: 150px;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  background: none;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
  
  &:first-child {
    border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md};
  }
  
  &.danger {
    color: ${({ theme }) => theme.colors.status.error};
  }
`;

const RenameInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.accent.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent.primary}33;
  }
`;

const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') {
    return <Folder size={24} />;
  }
  
  if (item.mimeType?.startsWith('image/')) {
    return <Image size={24} />;
  }
  
  if (item.mimeType?.includes('pdf') || item.mimeType?.includes('document')) {
    return <FileText size={24} />;
  }
  
  if (item.mimeType?.includes('zip') || item.mimeType?.includes('archive')) {
    return <Archive size={24} />;
  }
  
  return <File size={24} />;
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const FileCard: React.FC<FileCardProps> = ({
  item,
  onSelect,
  onDelete,
  onRename,
  onDownload,
  onShare,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      onRename(newName.trim());
    }
    setIsRenaming(false);
    setNewName(item.name);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setNewName(item.name);
    }
  };

  const handleCardClick = (e?: React.MouseEvent) => {
    if (isRenaming || showDropdown) {
      e?.stopPropagation();
      return;
    }
    onSelect();
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        transition: transitions.fast,
      }}
      whileTap={{
        y: -2,
        transition: transitions.fast,
      }}
    >
      <CardContainer 
        isFolder={item.type === 'folder'}
        onClick={handleCardClick}
        hover
        padding="md"
      >
      <FileActions className="file-actions">
        <ActionButton
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e?.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
        >
          <MoreHorizontal size={16} />
        </ActionButton>
        
        {showDropdown && (
          <DropdownMenu>
            {item.type === 'file' && (
              <DropdownItem onClick={(e) => {
                e.stopPropagation();
                onDownload();
                setShowDropdown(false);
              }}>
                <Download size={16} />
                Download
              </DropdownItem>
            )}
            <DropdownItem onClick={(e) => {
              e.stopPropagation();
              onShare();
              setShowDropdown(false);
            }}>
              <Share2 size={16} />
              Share
            </DropdownItem>
            <DropdownItem onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
              setShowDropdown(false);
            }}>
              <Edit3 size={16} />
              Rename
            </DropdownItem>
            <DropdownItem 
              className="danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowDropdown(false);
              }}
            >
              <Trash2 size={16} />
              Delete
            </DropdownItem>
          </DropdownMenu>
        )}
      </FileActions>

      {item.thumbnail ? (
        <Thumbnail src={item.thumbnail} alt={item.name} />
      ) : (
        <FileIcon
          whileHover={{
            scale: 1.1,
            rotate: item.type === 'folder' ? 5 : 0,
            transition: transitions.fast,
          }}
        >
          {getFileIcon(item)}
        </FileIcon>
      )}

      {isRenaming ? (
        <RenameInput
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyPress}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <FileName>{item.name}</FileName>
      )}

      <FileInfo>
        <span>{formatDate(item.lastModified)}</span>
        {item.size && <span>{formatFileSize(item.size)}</span>}
      </FileInfo>

      {item.version && (
        <Badge variant="secondary" size="sm">
          v{item.version}
        </Badge>
      )}
    </CardContainer>
    </motion.div>
  );
};