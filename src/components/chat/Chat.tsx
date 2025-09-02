import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { ChatMessage, ChatThread, User } from '../../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ThreadList } from './ThreadList';

interface ChatProps {
  currentUser: User;
  projectId?: string;
  threads: ChatThread[];
  messages: ChatMessage[];
  onSendMessage: (content: string, threadId?: string, mentions?: string[]) => void;
  onCreateThread: (title?: string) => void;
  onSelectThread: (threadId: string) => void;
  selectedThreadId?: string;
  className?: string;
}

const ChatContainer = styled.div`
  display: flex;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const ThreadSidebar = styled.div`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.background.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-height: 150px;
  }
`;

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const ChatHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.primary};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const ThreadTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ThreadSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const InputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.background.primary};
  background-color: ${({ theme }) => theme.colors.background.elevated};
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

const EmptyStateTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.muted};
  max-width: 300px;
`;

export const Chat: React.FC<ChatProps> = ({
  currentUser,
  projectId,
  threads,
  messages,
  onSendMessage,
  onCreateThread,
  onSelectThread,
  selectedThreadId,
  className,
}) => {
  const [, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedThread = threads.find(thread => thread.id === selectedThreadId);
  const threadMessages = messages.filter(message => message.threadId === selectedThreadId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadMessages]);

  const handleSendMessage = (content: string, mentions: string[] = []) => {
    onSendMessage(content, selectedThreadId, mentions);
    setIsComposing(false);
  };

  const renderChatContent = () => {
    if (!selectedThread) {
      return (
        <EmptyState>
          <EmptyStateTitle>Select a conversation</EmptyStateTitle>
          <EmptyStateText>
            Choose a thread from the sidebar to start chatting, or create a new conversation.
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <>
        <ChatHeader>
          <ThreadTitle>{selectedThread.title || 'General Discussion'}</ThreadTitle>
          <ThreadSubtitle>
            {selectedThread.participants.length} participant{selectedThread.participants.length !== 1 ? 's' : ''}
            {selectedThread.messageCount > 0 && ` • ${selectedThread.messageCount} messages`}
          </ThreadSubtitle>
        </ChatHeader>

        <MessagesContainer>
          <MessageList
            messages={threadMessages}
            currentUser={currentUser}
          />
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <MessageInput
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onComposingChange={setIsComposing}
            placeholder="Type a message..."
            projectId={projectId}
          />
        </InputContainer>
      </>
    );
  };

  return (
    <ChatContainer className={className}>
      <ThreadSidebar>
        <ThreadList
          threads={threads}
          selectedThreadId={selectedThreadId}
          onSelectThread={onSelectThread}
          onCreateThread={onCreateThread}
          currentUser={currentUser}
        />
      </ThreadSidebar>

      <ChatMain>
        {renderChatContent()}
      </ChatMain>
    </ChatContainer>
  );
};