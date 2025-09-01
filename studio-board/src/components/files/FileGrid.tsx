import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import type { FileItem } from '../../types';
import { FileCard } from './FileCard';
import { UploadZone } from './UploadZone';
import { FilePreview } from './FilePreview';

interface FileGridProps {
  items: FileItem[];
  onUpload: (files: FileList) => void;
  onSelect: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onRename: (item: FileItem, newName: string) => void;
  onDownload: (item: FileItem) => void;
  onShare: (item: FileItem) => void;
  onFolderOpen: (folder: FileItem) => void;
  loading?: boolean;
  uploadProgress?: Record<string, number>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  height: 100%;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  h3 {
    margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const FileGrid: React.FC<FileGridProps> = ({
  items,
  onUpload,
  onSelect,
  onDelete,
  onRename,
  onDownload,
  onShare,
  onFolderOpen,
  loading = false,
  uploadProgress = {},
}) => {
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileSelect = (item: FileItem) => {
    if (item.type === 'folder') {
      onFolderOpen(item);
    } else {
      setSelectedItem(item);
      onSelect(item);
    }
  };

  const handlePreviewClose = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <Container>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading files...
        </div>
      </Container>
    );
  }

  return (
    <Container
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <UploadZone 
        onUpload={onUpload}
        isDragOver={isDragOver}
        uploadProgress={uploadProgress}
      />
      
      {items.length === 0 ? (
        <EmptyState>
          <h3>No files yet</h3>
          <p>Upload files by dragging them here or using the upload button above.</p>
        </EmptyState>
      ) : (
        <GridContainer>
          {items.map((item) => (
            <FileCard
              key={item.id}
              item={item}
              onSelect={() => handleFileSelect(item)}
              onDelete={() => onDelete(item)}
              onRename={(newName) => onRename(item, newName)}
              onDownload={() => onDownload(item)}
              onShare={() => onShare(item)}
            />
          ))}
        </GridContainer>
      )}

      {selectedItem && selectedItem.type === 'file' && (
        <FilePreview
          file={selectedItem}
          onClose={handlePreviewClose}
          onDownload={() => onDownload(selectedItem)}
          onShare={() => onShare(selectedItem)}
        />
      )}
    </Container>
  );
};