import React from 'react';
import styled from 'styled-components';
import type { ChatMessage, User } from '../../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  currentUser: User;
  className?: string;
}

const MessageListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.background.primary};
  }
`;

const DateText = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

interface GroupedMessage {
  date: string;
  messages: ChatMessage[];
}

const groupMessagesByDate = (messages: ChatMessage[]): GroupedMessage[] => {
  const groups: { [key: string]: ChatMessage[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages: messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  }));
};

const formatDateSeparator = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  className,
}) => {
  const groupedMessages = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <MessageListContainer className={className}>
        <DateText style={{ textAlign: 'center', padding: '2rem' }}>
          No messages yet. Start the conversation!
        </DateText>
      </MessageListContainer>
    );
  }

  return (
    <MessageListContainer className={className}>
      {groupedMessages.map(({ date, messages }) => (
        <React.Fragment key={date}>
          <DateSeparator>
            <DateText>{formatDateSeparator(date)}</DateText>
          </DateSeparator>
          
          <MessageGroup>
            {messages.map((message, index) => {
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const isGrouped = !!(previousMessage && 
                previousMessage.authorId === message.authorId &&
                new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() < 5 * 60 * 1000); // 5 minutes

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  currentUser={currentUser}
                  isGrouped={isGrouped}
                />
              );
            })}
          </MessageGroup>
        </React.Fragment>
      ))}
    </MessageListContainer>
  );
};