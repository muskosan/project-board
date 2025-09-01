import React, { useState } from 'react';
import styled from 'styled-components';
import { Download, File, Image, FileText, Archive, Eye, Calendar, User } from 'lucide-react';
import type { Attachment } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Heading, Text, Label } from '../ui/Typography';
import { tokens } from '../../styles/tokens';

interface ClientFileDownloadsProps {
  attachments: Attachment[];
  projectId: string;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
`;

const FilesCard = styled(Card)`
  padding: ${tokens.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: ${tokens.spacing.lg};
  gap: ${tokens.spacing.sm};
`;

const HeaderIcon = styled.div`
  color: ${tokens.colors.accent.primary};
`;

const Title = styled(Heading)`
  margin: 0;
  color: ${tokens.colors.text.primary};
  flex: 1;
`;

const FileCount = styled.span`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.weights.normal};
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  max-height: 500px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${tokens.colors.background.secondary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.text.muted};
    border-radius: 3px;
    
    &:hover {
      background: ${tokens.colors.text.secondary};
    }
  }
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
  padding: ${tokens.spacing.md};
  background: linear-gradient(135deg, ${tokens.colors.background.secondary}, ${tokens.colors.background.elevated});
  border-radius: ${tokens.borderRadius.md};
  border: 1px solid ${tokens.colors.background.secondary};
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${tokens.shadows.sm};
    border-color: ${tokens.colors.accent.primary}30;
  }
`;

const FileIcon = styled.div<{ $fileType: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${tokens.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $fileType }) => {
    const typeColors = {
      image: tokens.colors.status.success,
      document: tokens.colors.status.info,
      archive: tokens.colors.status.warning,
      default: tokens.colors.text.muted,
    };
    return typeColors[$fileType as keyof typeof typeColors] || typeColors.default;
  }}20;
  
  color: ${({ $fileType }) => {
    const typeColors = {
      image: tokens.colors.status.success,
      document: tokens.colors.status.info,
      archive: tokens.colors.status.warning,
      default: tokens.colors.text.muted,
    };
    return typeColors[$fileType as keyof typeof typeColors] || typeColors.default;
  }};
`;

const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
  min-width: 0; /* Allow text truncation */
`;

const FileName = styled(Text)`
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.text.primary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  flex-wrap: wrap;
`;

const FileSize = styled(Label)`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.xs};
`;

const FileDate = styled(Label)`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.xs};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
`;

const FileUploader = styled(Label)`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.xs};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
`;

const FileType = styled(Badge)`
  font-size: ${tokens.typography.sizes.xs};
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
`;

const ActionButton = styled(Button)`
  padding: ${tokens.spacing.sm};
  min-width: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing.xl};
  text-align: center;
  color: ${tokens.colors.text.secondary};
  gap: ${tokens.spacing.md};
`;

const EmptyIcon = styled.div`
  color: ${tokens.colors.text.muted};
`;

const EmptyTitle = styled(Text)`
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.text.secondary};
  margin: 0;
`;

const EmptyDescription = styled(Label)`
  color: ${tokens.colors.text.muted};
`;

const DownloadAllButton = styled(Button)`
  margin-top: ${tokens.spacing.md};
  align-self: flex-start;
`;

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return <Image size={20} />;
  } else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
    return <FileText size={20} />;
  } else if (mimeType.includes('zip') || mimeType.includes('archive')) {
    return <Archive size={20} />;
  }
  return <File size={20} />;
};

const getFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archive';
  return 'default';
};

const getFileTypeLabel = (mimeType: string): string => {
  const typeLabels: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/svg+xml': 'SVG',
    'application/pdf': 'PDF',
    'text/plain': 'TXT',
    'application/zip': 'ZIP',
    'application/x-zip-compressed': 'ZIP',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  };
  
  return typeLabels[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'FILE';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const handleDownload = async (attachment: Attachment) => {
  try {
    // In a real app, this would handle secure file downloads
    // For now, we'll simulate the download
    console.log('Downloading file:', attachment.filename);
    
    // Create a temporary link to simulate download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

const handlePreview = (attachment: Attachment) => {
  // In a real app, this would open a secure preview modal
  console.log('Previewing file:', attachment.filename);
  window.open(attachment.url, '_blank');
};

const handleDownloadAll = async (attachments: Attachment[]) => {
  // In a real app, this would create a zip file of all attachments
  console.log('Downloading all files:', attachments.length);
  
  // Simulate downloading each file
  for (const attachment of attachments) {
    await handleDownload(attachment);
    // Add delay between downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

export const ClientFileDownloads: React.FC<ClientFileDownloadsProps> = ({
  attachments,
  className,
}) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleFileDownload = async (attachment: Attachment) => {
    setDownloading(attachment.id);
    try {
      await handleDownload(attachment);
    } finally {
      setDownloading(null);
    }
  };

  if (attachments.length === 0) {
    return (
      <Container className={className}>
        <FilesCard>
          <Header>
            <HeaderIcon>
              <Download size={20} />
            </HeaderIcon>
            <Title level={2} size="lg">
              Available Downloads
            </Title>
          </Header>
          
          <EmptyState>
            <EmptyIcon>
              <Download size={48} />
            </EmptyIcon>
            <EmptyTitle>No files available</EmptyTitle>
            <EmptyDescription>
              Project files and deliverables will appear here when they're ready for download.
            </EmptyDescription>
          </EmptyState>
        </FilesCard>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <FilesCard>
        <Header>
          <HeaderIcon>
            <Download size={20} />
          </HeaderIcon>
          <Title level={2} size="lg">
            Available Downloads
            <FileCount> ({attachments.length} files)</FileCount>
          </Title>
        </Header>

        <FilesList>
          {attachments.map((attachment) => (
            <FileItem key={attachment.id}>
              <FileIcon $fileType={getFileType(attachment.mimeType)}>
                {getFileIcon(attachment.mimeType)}
              </FileIcon>
              
              <FileInfo>
                <FileName>
                  {attachment.filename}
                </FileName>
                
                <FileMeta>
                  <FileType size="sm">
                    {getFileTypeLabel(attachment.mimeType)}
                  </FileType>
                  
                  <FileSize>
                    {formatFileSize(attachment.size)}
                  </FileSize>
                  
                  <FileDate>
                    <Calendar size={12} />
                    {formatDate(attachment.uploadedAt)}
                  </FileDate>
                  
                  {attachment.uploader && (
                    <FileUploader>
                      <User size={12} />
                      {attachment.uploader.firstName} {attachment.uploader.lastName}
                    </FileUploader>
                  )}
                </FileMeta>
              </FileInfo>
              
              <FileActions>
                {attachment.mimeType.startsWith('image/') && (
                  <ActionButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(attachment)}
                    title="Preview file"
                  >
                    <Eye size={16} />
                  </ActionButton>
                )}
                
                <ActionButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileDownload(attachment)}
                  disabled={downloading === attachment.id}
                  title="Download file"
                >
                  <Download size={16} />
                  {downloading === attachment.id ? 'Downloading...' : 'Download'}
                </ActionButton>
              </FileActions>
            </FileItem>
          ))}
        </FilesList>
        
        {attachments.length > 1 && (
          <DownloadAllButton
            variant="primary"
            onClick={() => handleDownloadAll(attachments)}
          >
            <Download size={16} />
            Download All Files
          </DownloadAllButton>
        )}
      </FilesCard>
    </Container>
  );
};