import React, { useState } from 'react';
import styled from 'styled-components';
import type { FileItem, User } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Clock, 
  Download, 
  Eye, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface FileVersion extends Omit<FileItem, 'version'> {
  version: number;
  uploadedBy: string;
  uploader?: User;
  uploadedAt: Date;
  changeDescription?: string;
  isCurrentVersion: boolean;
}

interface FileVersionsProps {
  file: FileItem;
  versions: FileVersion[];
  onDownloadVersion: (version: FileVersion) => void;
  onPreviewVersion: (version: FileVersion) => void;
  onRestoreVersion: (version: FileVersion) => void;
}

const Container = styled(Card)`
  max-width: 600px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ToggleButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xs};
`;

const VersionsList = styled.div<{ isExpanded: boolean }>`
  max-height: ${({ isExpanded }) => isExpanded ? '400px' : '0'};
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.transitions.normal};
`;

const VersionItem = styled.div<{ isCurrent: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, isCurrent }) => 
    isCurrent ? theme.colors.accent.primary : theme.colors.text.muted}33;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, isCurrent }) => 
    isCurrent ? `${theme.colors.accent.primary}08` : theme.colors.background.elevated};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const VersionInfo = styled.div`
  flex: 1;
  
  .version-header {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .version-number {
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  .version-meta {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .change-description {
    font-size: ${({ theme }) => theme.typography.sizes.sm};
    color: ${({ theme }) => theme.colors.text.primary};
    font-style: italic;
  }
`;

const VersionActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
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

export const FileVersions: React.FC<FileVersionsProps> = ({
  versions,
  onDownloadVersion,
  onPreviewVersion,
  onRestoreVersion,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <Container>
      <Header>
        <h3>
          <Clock size={20} />
          Version History
        </h3>
        <ToggleButton
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isExpanded ? 'Hide' : 'Show'} ({versions.length})
        </ToggleButton>
      </Header>

      <VersionsList isExpanded={isExpanded}>
        {sortedVersions.map((version) => (
          <VersionItem key={version.version} isCurrent={version.isCurrentVersion}>
            <VersionInfo>
              <div className="version-header">
                <span className="version-number">
                  Version {version.version}
                </span>
                {version.isCurrentVersion && (
                  <Badge variant="primary" size="sm">
                    Current
                  </Badge>
                )}
              </div>
              
              <div className="version-meta">
                {version.uploader ? 
                  `${version.uploader.firstName} ${version.uploader.lastName}` : 
                  'Unknown user'
                } • {formatDate(version.uploadedAt)} • {formatFileSize(version.size)}
              </div>
              
              {version.changeDescription && (
                <div className="change-description">
                  "{version.changeDescription}"
                </div>
              )}
            </VersionInfo>

            <VersionActions>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPreviewVersion(version)}
                title="Preview this version"
              >
                <Eye size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownloadVersion(version)}
                title="Download this version"
              >
                <Download size={16} />
              </Button>
              
              {!version.isCurrentVersion && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestoreVersion(version)}
                  title="Restore this version"
                >
                  <RotateCcw size={16} />
                  Restore
                </Button>
              )}
            </VersionActions>
          </VersionItem>
        ))}
      </VersionsList>
    </Container>
  );
};