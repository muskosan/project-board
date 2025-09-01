import React, { useState } from 'react';
import styled from 'styled-components';
import type { Comment, User } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Heading, Text, Label } from '../ui/Typography';

interface TaskCommentsProps {
  comments: Comment[];
  users: User[];
  onCommentAdd: (content: string) => void;
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

const CommentCount = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CommentItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.accent.primary};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AuthorName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CommentTime = styled(Label)`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

const CommentText = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
`;

const CommentForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  line-height: 1.5;
  resize: vertical;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent.primary};
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentHint = styled(Label)`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
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

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  }).format(date);
};

export const TaskComments: React.FC<TaskCommentsProps> = ({
  comments,
  onCommentAdd,
  className,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onCommentAdd(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  // Sort comments by creation date (newest first for real-time feel)
  const sortedComments = React.useMemo(() => {
    return [...comments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [comments]);

  return (
    <Container className={className}>
      <Header>
        <Title level={3} size="lg">
          Comments
        </Title>
        <CommentCount>
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </CommentCount>
      </Header>

      <CommentForm>
        <CommentInput
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment... (Cmd/Ctrl + Enter to submit)"
          disabled={isSubmitting}
        />
        
        <CommentActions>
          <CommentHint>
            Use @username to mention team members
          </CommentHint>
          
          <ActionButtons>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewComment('')}
              disabled={!newComment.trim() || isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSubmit({} as React.FormEvent)}
              disabled={!newComment.trim() || isSubmitting}
              loading={isSubmitting}
            >
              Comment
            </Button>
          </ActionButtons>
        </CommentActions>
      </CommentForm>

      {sortedComments.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No comments yet</EmptyTitle>
          <EmptyDescription>
            Start the conversation by adding the first comment.
          </EmptyDescription>
        </EmptyState>
      ) : (
        <CommentsList>
          {sortedComments.map((comment) => (
            <CommentItem key={comment.id}>
              <Avatar
                src={comment.author?.avatar}
                alt={`${comment.author?.firstName} ${comment.author?.lastName}`}
              />
              
              <CommentContent>
                <CommentHeader>
                  <AuthorName>
                    {comment.author?.firstName} {comment.author?.lastName}
                  </AuthorName>
                  <CommentTime>
                    {formatTimeAgo(comment.createdAt)}
                  </CommentTime>
                </CommentHeader>
                
                <CommentText>
                  {comment.content}
                </CommentText>
              </CommentContent>
            </CommentItem>
          ))}
        </CommentsList>
      )}
    </Container>
  );
};