import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import type { ChatThread, User } from '../../types';
import { Button } from '../ui/Button';

interface ThreadListProps {
  threads: ChatThread[];
  selectedThreadId?: string;
  onSelectThread: (threadId: string) => void;
  onCreateThread: (title?: string) => void;
  currentUser: User;
  className?: string;
}

const ThreadListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ThreadListHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.primary};
`;

const HeaderTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CreateThreadButton = styled(Button)`
  width: 100%;
`;

const ThreadsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const ThreadItem = styled.div<{ isSelected: boolean; isUnread: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border-left: 3px solid transparent;
  position: relative;
  
  ${({ isSelected, theme }) => isSelected && css`
    background-color: ${theme.colors.accent.primary}15;
    border-left-color: ${theme.colors.accent.primary};
  `}
  
  ${({ isUnread, theme }) => isUnread && css`
    background-color: ${theme.colors.background.elevated};
    
    &::after {
      content: '';
      position: absolute;
      right: ${theme.spacing.md};
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background-color: ${theme.colors.accent.primary};
      border-radius: 50%;
    }
  `}
  
  &:hover:not([data-selected="true"]) {
    background-color: ${({ theme }) => theme.colors.background.elevated};
  }
`;

const ThreadAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: white;
  flex-shrink: 0;
`;

const ThreadContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ThreadTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ThreadPreview = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ThreadMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const ThreadTime = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ParticipantCount = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  min-width: 20px;
  text-align: center;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const CreateThreadModal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 90%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ModalInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent.primary}20;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getThreadInitials = (thread: ChatThread): string => {
  if (thread.title) {
    const words = thread.title.split(' ');
    return words.length > 1 
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  }
  return 'GD'; // General Discussion
};

export const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  selectedThreadId,
  onSelectThread,
  onCreateThread,
  currentUser: _currentUser,
  className,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');

  const handleCreateThread = () => {
    if (newThreadTitle.trim()) {
      onCreateThread(newThreadTitle.trim());
    } else {
      onCreateThread();
    }
    setNewThreadTitle('');
    setShowCreateModal(false);
  };

  const handleCancelCreate = () => {
    setNewThreadTitle('');
    setShowCreateModal(false);
  };

  const sortedThreads = [...threads].sort((a, b) => {
    // Sort by last message time, most recent first
    const aTime = a.lastMessage?.createdAt || a.updatedAt;
    const bTime = b.lastMessage?.createdAt || b.updatedAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <>
      <ThreadListContainer className={className}>
        <ThreadListHeader>
          <HeaderTitle>Conversations</HeaderTitle>
          <CreateThreadButton
            size="sm"
            variant="outline"
            onClick={() => setShowCreateModal(true)}
          >
            + New Thread
          </CreateThreadButton>
        </ThreadListHeader>

        <ThreadsContainer>
          {sortedThreads.length === 0 ? (
            <EmptyState>
              <EmptyStateText>
                No conversations yet. Create your first thread to get started!
              </EmptyStateText>
            </EmptyState>
          ) : (
            sortedThreads.map(thread => {
              const isSelected = thread.id === selectedThreadId;
              const isUnread = false; // TODO: Implement unread logic
              const lastMessageTime = thread.lastMessage?.createdAt || thread.updatedAt;

              return (
                <ThreadItem
                  key={thread.id}
                  isSelected={isSelected}
                  isUnread={isUnread}
                  data-selected={isSelected}
                  onClick={() => onSelectThread(thread.id)}
                >
                  <ThreadAvatar>
                    {getThreadInitials(thread)}
                  </ThreadAvatar>

                  <ThreadContent>
                    <ThreadTitle>
                      {thread.title || 'General Discussion'}
                    </ThreadTitle>
                    <ThreadPreview>
                      {thread.lastMessage?.content || 'No messages yet'}
                    </ThreadPreview>
                  </ThreadContent>

                  <ThreadMeta>
                    <ThreadTime>
                      {formatTime(new Date(lastMessageTime))}
                    </ThreadTime>
                    <ParticipantCount>
                      {thread.participants.length}
                    </ParticipantCount>
                  </ThreadMeta>
                </ThreadItem>
              );
            })
          )}
        </ThreadsContainer>
      </ThreadListContainer>

      <CreateThreadModal isVisible={showCreateModal}>
        <ModalContent>
          <ModalTitle>Create New Thread</ModalTitle>
          <ModalInput
            type="text"
            placeholder="Thread title (optional)"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateThread();
              } else if (e.key === 'Escape') {
                handleCancelCreate();
              }
            }}
            autoFocus
          />
          <ModalActions>
            <Button variant="ghost" onClick={handleCancelCreate}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateThread}>
              Create
            </Button>
          </ModalActions>
        </ModalContent>
      </CreateThreadModal>
    </>
  );
};