import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { tokens } from '../../styles/tokens';
import type { ActivityItem } from '../../types';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { staggerContainer, staggerItem } from '../../utils/animations';

const FeedContainer = styled(Card)`
  padding: ${tokens.spacing.xl};
  max-height: 400px;
  overflow-y: auto;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${tokens.colors.background.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.text.muted};
    border-radius: 3px;
    
    &:hover {
      background: ${tokens.colors.text.secondary};
    }
  }
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${tokens.spacing.lg};
  padding-bottom: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.background.secondary};
`;

const FeedList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
`;

const ActivityItemContainer = styled(motion.div)`
  display: flex;
  gap: ${tokens.spacing.md};
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.md};
  transition: background-color 150ms ease;
  
  &:hover {
    background-color: ${tokens.colors.background.secondary};
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: ${tokens.colors.background.secondary};
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled(Typography)`
  margin-bottom: ${tokens.spacing.xs};
  line-height: 1.4;
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const Timestamp = styled(Typography)`
  color: ${tokens.colors.text.muted};
`;

const ProjectBadge = styled.span`
  background-color: ${tokens.colors.accent.primary};
  color: white;
  padding: 2px 8px;
  border-radius: ${tokens.borderRadius.sm};
  font-size: ${tokens.typography.sizes.xs};
  font-weight: 500;
`;

const LoadMoreButton = styled.button`
  background: none;
  border: 1px solid ${tokens.colors.background.secondary};
  color: ${tokens.colors.text.secondary};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.md};
  cursor: pointer;
  margin-top: ${tokens.spacing.md};
  transition: all 150ms ease;
  
  &:hover {
    background-color: ${tokens.colors.background.secondary};
    border-color: ${tokens.colors.text.muted};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${tokens.spacing.xl};
  color: ${tokens.colors.text.muted};
`;

interface ActivityFeedProps {
  items: ActivityItem[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

const getActivityTypeIcon = (type: string): string => {
  switch (type) {
    case 'comment': return '💬';
    case 'task_update': return '✅';
    case 'file_upload': return '📎';
    case 'project_update': return '📋';
    default: return '📌';
  }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  onLoadMore,
  isLoading = false,
  hasMore = false,
}) => {
  if (items.length === 0) {
    return (
      <FeedContainer>
        <FeedHeader>
          <Typography variant="h3" weight="medium">
            Team Activity
          </Typography>
        </FeedHeader>
        <EmptyState>
          <Typography variant="body" color="muted">
            No recent activity to show
          </Typography>
        </EmptyState>
      </FeedContainer>
    );
  }

  return (
    <FeedContainer>
      <FeedHeader>
        <Typography variant="h3" weight="medium">
          Team Activity
        </Typography>
      </FeedHeader>
      
      <FeedList
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {items.map((item) => (
          <ActivityItemContainer 
            key={item.id}
            variants={staggerItem}
            whileHover={{
              backgroundColor: tokens.colors.background.secondary,
              transition: { duration: 0.15 },
            }}
          >
            <Avatar
              src={item.user?.avatar}
              alt={`${item.user?.firstName} ${item.user?.lastName}`}
            />
            <ActivityContent>
              <ActivityText variant="body">
                <strong>{item.user?.firstName} {item.user?.lastName}</strong>{' '}
                {getActivityTypeIcon(item.type)} {item.content}
              </ActivityText>
              <ActivityMeta>
                <Timestamp variant="caption">
                  {formatTimestamp(item.timestamp)}
                </Timestamp>
                {item.project && (
                  <ProjectBadge>
                    {item.project.name}
                  </ProjectBadge>
                )}
              </ActivityMeta>
            </ActivityContent>
          </ActivityItemContainer>
        ))}
      </FeedList>
      
      {hasMore && onLoadMore && (
        <LoadMoreButton
          onClick={onLoadMore}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </LoadMoreButton>
      )}
    </FeedContainer>
  );
};