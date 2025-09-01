import React, { useState } from 'react';
import styled from 'styled-components';
import { MessageSquare, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import type { Comment } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Heading, Text, Label } from '../ui/Typography';
import { tokens } from '../../styles/tokens';

interface ClientCommentHistoryProps {
  comments: Comment[];
  projectId: string;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
`;

const HistoryCard = styled(Card)`
  padding: ${tokens.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${tokens.spacing.lg};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${tokens.spacing.md};
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const HeaderIcon = styled.div`
  color: ${tokens.colors.accent.primary};
`;

const Title = styled(Heading)`
  margin: 0;
  color: ${tokens.colors.text.primary};
`;

const CommentCount = styled.span`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.weights.normal};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    width: 100%;
    flex-direction: column;
  }
`;

const SearchInput = styled(Input)`
  min-width: 200px;
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    width: 100%;
    min-width: auto;
  }
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
  max-height: 600px;
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

const CommentItem = styled.div`
  padding: ${tokens.spacing.lg};
  background: linear-gradient(135deg, ${tokens.colors.background.secondary}, ${tokens.colors.background.elevated});
  border-radius: ${tokens.borderRadius.lg};
  border: 1px solid ${tokens.colors.background.secondary};
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${tokens.shadows.md};
  }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${tokens.spacing.sm};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${tokens.spacing.xs};
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${tokens.colors.background.elevated};
`;

const AuthorName = styled(Text)`
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.text.primary};
  margin: 0;
`;

const CommentDate = styled(Label)`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.sm};
`;

const CommentContent = styled(Text)`
  color: ${tokens.colors.text.primary};
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
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

const ShowMoreButton = styled(Button)`
  margin-top: ${tokens.spacing.md};
  align-self: center;
`;

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }).format(date);
  }
};



export const ClientCommentHistory: React.FC<ClientCommentHistoryProps> = ({
  comments,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter comments based on search query
  const filteredComments = React.useMemo(() => {
    if (!searchQuery.trim()) return comments;
    
    const query = searchQuery.toLowerCase();
    return comments.filter(comment => 
      comment.content.toLowerCase().includes(query) ||
      comment.author?.firstName?.toLowerCase().includes(query) ||
      comment.author?.lastName?.toLowerCase().includes(query)
    );
  }, [comments, searchQuery]);

  // Sort comments
  const sortedComments = React.useMemo(() => {
    const sorted = [...filteredComments];
    return sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredComments, sortOrder]);

  // Limit displayed comments if not showing all
  const displayedComments = showAll ? sortedComments : sortedComments.slice(0, 10);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  if (comments.length === 0) {
    return (
      <Container className={className}>
        <HistoryCard>
          <Header>
            <HeaderLeft>
              <HeaderIcon>
                <MessageSquare size={20} />
              </HeaderIcon>
              <Title level={2} size="lg">
                Communication History
              </Title>
            </HeaderLeft>
          </Header>
          
          <EmptyState>
            <EmptyIcon>
              <MessageSquare size={48} />
            </EmptyIcon>
            <EmptyTitle>No comments yet</EmptyTitle>
            <EmptyDescription>
              Project communication will appear here as the team adds updates and feedback.
            </EmptyDescription>
          </EmptyState>
        </HistoryCard>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <HistoryCard>
        <Header>
          <HeaderLeft>
            <HeaderIcon>
              <MessageSquare size={20} />
            </HeaderIcon>
            <Title level={2} size="lg">
              Communication History
              <CommentCount> ({comments.length} comments)</CommentCount>
            </Title>
          </HeaderLeft>
          
          <Controls>
            <SearchInput
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <FilterButton
              variant="outline"
              size="sm"
              onClick={handleSortToggle}
            >
              <Filter size={14} />
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </FilterButton>
          </Controls>
        </Header>

        {filteredComments.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Search size={48} />
            </EmptyIcon>
            <EmptyTitle>No matching comments</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search terms to find relevant comments.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <>
            <CommentsList>
              {displayedComments.map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentHeader>
                    <AuthorInfo>
                      <Avatar
                        src={comment.author?.avatar}
                        alt={`${comment.author?.firstName} ${comment.author?.lastName}`}
                      />
                      <div>
                        <AuthorName>
                          {comment.author?.firstName} {comment.author?.lastName}
                        </AuthorName>
                        <CommentDate>
                          {formatDate(comment.createdAt)}
                        </CommentDate>
                      </div>
                    </AuthorInfo>
                  </CommentHeader>
                  
                  <CommentContent>
                    {comment.content}
                  </CommentContent>
                </CommentItem>
              ))}
            </CommentsList>
            
            {!showAll && sortedComments.length > 10 && (
              <ShowMoreButton
                variant="outline"
                onClick={() => setShowAll(true)}
              >
                <ChevronDown size={16} />
                Show {sortedComments.length - 10} more comments
              </ShowMoreButton>
            )}
            
            {showAll && sortedComments.length > 10 && (
              <ShowMoreButton
                variant="outline"
                onClick={() => setShowAll(false)}
              >
                <ChevronUp size={16} />
                Show less
              </ShowMoreButton>
            )}
          </>
        )}
      </HistoryCard>
    </Container>
  );
};