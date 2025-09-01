import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import type { Attachment } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Heading, Text, Label } from '../ui/Typography';

interface TaskAttachmentsProps {
  attachments: Attachment[];
  onAttachmentAdd: (file: File) => void;
  onAttachmentRemove: (attachmentId: string) => void;
  className?: string;
}

const Container = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled(Heading)`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AttachmentCount = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const UploadArea = styled.div<{ isDragOver: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px dashed ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  ${({ isDragOver, theme }) => isDragOver && css`
    border-color: ${theme.colors.accent.primary};
    background-color: ${theme.colors.accent.primary}10;
  `}
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent.primary};
    background-color: ${({ theme }) => theme.colors.accent.primary}05;
  }
`;

const UploadIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UploadText = styled(Text)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const UploadHint = styled(Label)`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  text-align: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.text.muted};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const FileIcon = styled.div<{ fileType: string }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  flex-shrink: 0;
  
  ${({ fileType, theme }) => {
    if (fileType.startsWith('image/')) {
      return css`
        background-color: ${theme.colors.status.success}20;
        color: ${theme.colors.status.success};
      `;
    } else if (fileType.includes('pdf')) {
      return css`
        background-color: ${theme.colors.status.error}20;
        color: ${theme.colors.status.error};
      `;
    } else if (fileType.includes('text') || fileType.includes('document')) {
      return css`
        background-color: ${theme.colors.status.info}20;
        color: ${theme.colors.status.info};
      `;
    } else if (fileType.includes('zip') || fileType.includes('archive')) {
      return css`
        background-color: ${theme.colors.status.warning}20;
        color: ${theme.colors.status.warning};
      `;
    } else {
      return css`
        background-color: ${theme.colors.text.muted}20;
        color: ${theme.colors.text.muted};
      `;
    }
  }}
`;

const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const FileName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FileSize = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

const FileUploader = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

const FileDate = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xs};
  min-width: auto;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  margin: 0;
`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('text') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  return '📎';
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  }).format(date);
};

export const TaskAttachments: React.FC<TaskAttachmentsProps> = ({
  attachments,
  onAttachmentAdd,
  onAttachmentRemove,
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      // Basic file validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }
      
      onAttachmentAdd(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDownload = (attachment: Attachment) => {
    // In a real app, this would handle secure file downloads
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container className={className}>
      <Header>
        <Title level={3} size="lg">
          Attachments
        </Title>
        <AttachmentCount>
          {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
        </AttachmentCount>
      </Header>

      <UploadArea
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <UploadIcon>📎</UploadIcon>
        <UploadText>Drop files here or click to upload</UploadText>
        <UploadHint>
          Supports images, documents, archives up to 10MB
        </UploadHint>
      </UploadArea>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
      />

      {attachments.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No attachments</EmptyTitle>
          <EmptyDescription>
            Upload files to share with your team.
          </EmptyDescription>
        </EmptyState>
      ) : (
        <AttachmentsList>
          {attachments.map((attachment) => (
            <AttachmentItem key={attachment.id}>
              <FileIcon fileType={attachment.mimeType}>
                {getFileIcon(attachment.mimeType)}
              </FileIcon>
              
              <FileInfo>
                <FileName>{attachment.filename}</FileName>
                <FileDetails>
                  <FileSize>{formatFileSize(attachment.size)}</FileSize>
                  <span>•</span>
                  {attachment.uploader && (
                    <>
                      <FileUploader>
                        {attachment.uploader.firstName} {attachment.uploader.lastName}
                      </FileUploader>
                      <span>•</span>
                    </>
                  )}
                  <FileDate>{formatDate(attachment.uploadedAt)}</FileDate>
                </FileDetails>
              </FileInfo>
              
              <FileActions>
                <ActionButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}

                >
                  ⬇️
                </ActionButton>
                <ActionButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onAttachmentRemove(attachment.id)}
                >
                  🗑️
                </ActionButton>
              </FileActions>
            </AttachmentItem>
          ))}
        </AttachmentsList>
      )}
    </Container>
  );
};