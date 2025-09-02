import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { DocumentLink } from '../../types';

interface DocumentLinkPreviewProps {
  url: string;
  className?: string;
}

const PreviewContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.text.muted};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const PreviewContent = styled.a`
  display: flex;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    text-decoration: none;
  }
`;

const PreviewThumbnail = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const PreviewInfo = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const PreviewTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PreviewDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PreviewDomain = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DomainIcon = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.text.muted};
  border-radius: 2px;
  flex-shrink: 0;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.background.primary};
  border-top: 2px solid ${({ theme }) => theme.colors.accent.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-style: italic;
`;

// Mock function to simulate fetching link metadata
const fetchLinkMetadata = async (url: string): Promise<DocumentLink> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Mock different types of links
  const domain = new URL(url).hostname;
  const mockData: DocumentLink = {
    id: Math.random().toString(36).substr(2, 9),
    url,
    domain,
    createdAt: new Date(),
    title: '',
    description: '',
    type: 'webpage',
    thumbnail: '',
  };

  // Generate mock data based on domain
  if (domain.includes('github.com')) {
    mockData.title = 'GitHub Repository - StudioBoard';
    mockData.description = 'A premium project management dashboard for creative professionals and agencies.';
    mockData.type = 'document';
    mockData.thumbnail = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  } else if (domain.includes('figma.com')) {
    mockData.title = 'StudioBoard Design System - Figma';
    mockData.description = 'Complete design system with components, tokens, and guidelines for the StudioBoard application.';
    mockData.type = 'document';
    mockData.thumbnail = 'https://cdn.worldvectorlogo.com/logos/figma-1.svg';
  } else if (domain.includes('notion.so')) {
    mockData.title = 'Project Requirements - Notion';
    mockData.description = 'Detailed project requirements and specifications for the StudioBoard development.';
    mockData.type = 'document';
  } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
    mockData.title = 'Design Process Walkthrough';
    mockData.description = 'A comprehensive walkthrough of our design process and methodology.';
    mockData.type = 'video';
    mockData.thumbnail = 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg';
  } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    mockData.title = 'Image Preview';
    mockData.description = 'Shared image file';
    mockData.type = 'image';
    mockData.thumbnail = url;
  } else {
    mockData.title = 'Web Page';
    mockData.description = 'External web page or document';
    mockData.type = 'webpage';
  }

  return mockData;
};

const getTypeIcon = (type: DocumentLink['type']): string => {
  switch (type) {
    case 'document':
      return '📄';
    case 'image':
      return '🖼️';
    case 'video':
      return '🎥';
    case 'webpage':
      return '🌐';
    default:
      return '🔗';
  }
};

export const DocumentLinkPreview: React.FC<DocumentLinkPreviewProps> = ({
  url,
  className,
}) => {
  const [linkData, setLinkData] = useState<DocumentLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLinkData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLinkMetadata(url);
        setLinkData(data);
      } catch (err) {
        setError('Failed to load preview');
        console.error('Error fetching link metadata:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLinkData();
  }, [url]);

  if (isLoading) {
    return (
      <PreviewContainer className={className}>
        <LoadingState>
          <LoadingSpinner />
          Loading preview...
        </LoadingState>
      </PreviewContainer>
    );
  }

  if (error || !linkData) {
    return (
      <PreviewContainer className={className}>
        <ErrorState>
          Unable to load preview for this link
        </ErrorState>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer className={className}>
      <PreviewContent href={url} target="_blank" rel="noopener noreferrer">
        <PreviewThumbnail>
          {linkData.thumbnail ? (
            <ThumbnailImage 
              src={linkData.thumbnail} 
              alt={linkData.title}
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<div style="font-size: 24px;">${getTypeIcon(linkData.type)}</div>`;
              }}
            />
          ) : (
            <ThumbnailIcon>
              {getTypeIcon(linkData.type)}
            </ThumbnailIcon>
          )}
        </PreviewThumbnail>

        <PreviewInfo>
          <PreviewTitle>{linkData.title}</PreviewTitle>
          {linkData.description && (
            <PreviewDescription>{linkData.description}</PreviewDescription>
          )}
          <PreviewDomain>
            <DomainIcon />
            {linkData.domain}
          </PreviewDomain>
        </PreviewInfo>
      </PreviewContent>
    </PreviewContainer>
  );
};