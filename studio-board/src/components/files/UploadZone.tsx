import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../ui/Button';
import { Upload, X } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (files: FileList) => void;
  isDragOver?: boolean;
  uploadProgress?: Record<string, number>;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
}

const Container = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${({ theme, isDragOver }) => 
    isDragOver ? theme.colors.accent.primary : theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background-color: ${({ theme, isDragOver }) => 
    isDragOver ? `${theme.colors.accent.primary}08` : theme.colors.background.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ isDragOver }) => isDragOver && css`
    transform: scale(1.02);
  `}
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UploadIcon = styled.div<{ isDragOver: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme, isDragOver }) => 
    isDragOver ? theme.colors.accent.primary : theme.colors.text.muted};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const UploadText = styled.div`
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.accent.primary};
  width: ${({ progress }) => progress}%;
  transition: width ${({ theme }) => theme.transitions.fast};
`;

const FileName = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.status.error};
  }
`;

const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const UploadZone: React.FC<UploadZoneProps> = ({
  onUpload,
  isDragOver = false,
  uploadProgress = {},
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = [],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, File>>({});

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (max ${formatFileSize(maxFileSize)})`);
        return;
      }

      // Check file type if restrictions exist
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        errors.push(`${file.name} is not an accepted file type`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      // In a real app, you'd show these errors to the user
      console.warn('Upload errors:', errors);
    }

    if (validFiles.length > 0) {
      // Track uploading files
      const newUploadingFiles = { ...uploadingFiles };
      validFiles.forEach(file => {
        newUploadingFiles[file.name] = file;
      });
      setUploadingFiles(newUploadingFiles);

      // Create FileList-like object
      const fileList = {
        length: validFiles.length,
        item: (index: number) => validFiles[index] || null,
        ...validFiles.reduce((acc, file, index) => ({ ...acc, [index]: file }), {}),
      } as FileList;

      onUpload(fileList);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelUpload = (fileName: string) => {
    const newUploadingFiles = { ...uploadingFiles };
    delete newUploadingFiles[fileName];
    setUploadingFiles(newUploadingFiles);
  };

  const hasUploads = Object.keys(uploadProgress).length > 0;

  return (
    <Container isDragOver={isDragOver}>
      <UploadContent>
        <UploadIcon isDragOver={isDragOver}>
          <Upload size={24} />
        </UploadIcon>
        
        <UploadText>
          <h3>
            {isDragOver ? 'Drop files here' : 'Upload files'}
          </h3>
          <p>
            Drag and drop files here, or click to browse
            {maxFileSize && ` (max ${formatFileSize(maxFileSize)})`}
          </p>
        </UploadText>

        <Button variant="primary" onClick={handleButtonClick}>
          <Upload size={16} />
          Choose Files
        </Button>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </UploadContent>

      {hasUploads && (
        <ProgressContainer>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <ProgressItem key={fileName}>
              <FileName>{fileName}</FileName>
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
              <span style={{ fontSize: '12px', color: '#666', minWidth: '40px' }}>
                {Math.round(progress)}%
              </span>
              {progress < 100 && (
                <CancelButton onClick={() => handleCancelUpload(fileName)}>
                  <X size={16} />
                </CancelButton>
              )}
            </ProgressItem>
          ))}
        </ProgressContainer>
      )}
    </Container>
  );
};