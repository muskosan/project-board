import React from 'react';
import styled from 'styled-components';
import type { FileItem } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X, Download, Share2, Eye } from 'lucide-react';

interface FilePreviewProps {
  file: FileItem;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PreviewContainer = styled(Card)`
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.text.muted}33;
`;

const FileInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const PreviewActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const PreviewContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: auto;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const TextPreview = styled.div`
  width: 100%;
  height: 400px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  line-height: 1.5;
  overflow: auto;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const UnsupportedPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  .icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text.muted};
  }
  
  h4 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.sizes.sm};
  }
`;

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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const renderPreviewContent = (file: FileItem) => {
  const mimeType = file.mimeType || '';
  
  // Image preview
  if (mimeType.startsWith('image/')) {
    return (
      <ImagePreview 
        src={file.thumbnail || `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`}
        alt={file.name}
      />
    );
  }
  
  // Text preview (for demonstration - in real app you'd fetch content)
  if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('xml')) {
    return (
      <TextPreview>
        {`// Preview of ${file.name}\n// This is a mock preview.\n// In a real application, you would fetch and display the actual file content.\n\nFile: ${file.name}\nSize: ${formatFileSize(file.size)}\nType: ${mimeType}\nLast Modified: ${formatDate(file.lastModified)}`}
      </TextPreview>
    );
  }
  
  // PDF preview (would typically use PDF.js or similar)
  if (mimeType.includes('pdf')) {
    return (
      <UnsupportedPreview>
        <div className="icon">
          <Eye size={32} />
        </div>
        <h4>PDF Preview</h4>
        <p>PDF preview would be implemented using PDF.js or similar library</p>
        <Button variant="primary" onClick={() => window.open('#', '_blank')}>
          Open in New Tab
        </Button>
      </UnsupportedPreview>
    );
  }
  
  // Unsupported file type
  return (
    <UnsupportedPreview>
      <div className="icon">
        <Eye size={32} />
      </div>
      <h4>Preview not available</h4>
      <p>This file type cannot be previewed. You can download it to view the content.</p>
    </UnsupportedPreview>
  );
};

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onClose,
  onDownload,
  onShare,
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Overlay onClick={handleOverlayClick}>
      <PreviewContainer padding="none">
        <PreviewHeader>
          <FileInfo>
            <h3>{file.name}</h3>
            <p>
              {formatFileSize(file.size)} • {formatDate(file.lastModified)}
              {file.version && ` • Version ${file.version}`}
            </p>
          </FileInfo>
          
          <PreviewActions>
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download size={16} />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 size={16} />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </PreviewActions>
        </PreviewHeader>
        
        <PreviewContent>
          {renderPreviewContent(file)}
        </PreviewContent>
      </PreviewContainer>
    </Overlay>
  );
};