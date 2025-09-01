import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import type { User } from '../../types';
import { Button } from '../ui/Button';

interface MessageInputProps {
  currentUser: User;
  onSendMessage: (content: string, mentions?: string[]) => void;
  onComposingChange?: (isComposing: boolean) => void;
  placeholder?: string;
  projectId?: string;
  className?: string;
}

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InputWrapper = styled.div<{ isFocused: boolean; hasContent: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border: 2px solid ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  ${({ isFocused, theme }) => isFocused && css`
    border-color: ${theme.colors.accent.primary};
    box-shadow: ${theme.shadows.md}, 0 0 0 3px ${theme.colors.accent.primary}20;
    transform: translateY(-2px);
  `}
  
  ${({ hasContent, theme }) => hasContent && css`
    background-color: ${theme.colors.background.secondary};
  `}
`;

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: none;
  min-height: 20px;
  max-height: 120px;
  line-height: 1.5;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SendButton = styled(Button)<{ isVisible: boolean }>`
  opacity: ${({ isVisible }) => isVisible ? 1 : 0.5};
  transform: ${({ isVisible }) => isVisible ? 'scale(1)' : 'scale(0.9)'};
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 80px;
`;

const MentionSuggestions = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: ${({ isVisible }) => isVisible ? 'block' : 'none'};
`;

const MentionItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  ${({ isSelected, theme }) => isSelected && css`
    background-color: ${theme.colors.accent.primary}20;
  `}
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const MentionAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: white;
`;

const MentionInfo = styled.div`
  flex: 1;
`;

const MentionName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MentionRole = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

// const TypingIndicator = styled.div`
//   font-size: ${({ theme }) => theme.typography.sizes.xs};
//   color: ${({ theme }) => theme.colors.text.muted};
//   font-style: italic;
//   padding: ${({ theme }) => theme.spacing.xs} 0;
// `;

// Mock team members for mention suggestions
const mockTeamMembers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'manager',
    avatar: '',
    permissions: [],
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        taskUpdates: true,
        projectUpdates: true,
        mentions: true,
        deadlines: true,
      },
      timezone: 'UTC',
      language: 'en',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: 'member',
    avatar: '',
    permissions: [],
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        taskUpdates: true,
        projectUpdates: true,
        mentions: true,
        deadlines: true,
      },
      timezone: 'UTC',
      language: 'en',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const MessageInput: React.FC<MessageInputProps> = ({
  currentUser,
  onSendMessage,
  onComposingChange,
  placeholder = "Type a message...",
  projectId: _projectId,
  className,
}) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = content.trim().length > 0;

  // Auto-resize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Handle composing state
  useEffect(() => {
    onComposingChange?.(hasContent);
  }, [hasContent, onComposingChange]);

  // Filter team members for mentions
  const filteredMembers = mockTeamMembers.filter(member =>
    member.id !== currentUser.id &&
    (member.firstName.toLowerCase().includes(mentionQuery.toLowerCase()) ||
     member.lastName.toLowerCase().includes(mentionQuery.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    
    setContent(value);
    setCursorPosition(position);

    // Check for mention trigger
    const beforeCursor = value.slice(0, position);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
      setSelectedMentionIndex(0);
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentions && filteredMembers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < filteredMembers.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev > 0 ? prev - 1 : filteredMembers.length - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredMembers[selectedMentionIndex]);
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertMention = (user: User) => {
    const beforeCursor = content.slice(0, cursorPosition);
    const afterCursor = content.slice(cursorPosition);
    const beforeMention = beforeCursor.replace(/@\w*$/, '');
    const mentionText = `@${user.firstName} ${user.lastName}`;
    
    const newContent = beforeMention + mentionText + ' ' + afterCursor;
    setContent(newContent);
    setShowMentions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      if (textAreaRef.current) {
        const newPosition = beforeMention.length + mentionText.length + 1;
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+\s+\w+)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    
    return mentions;
  };

  const handleSend = () => {
    if (!hasContent) return;
    
    const mentions = extractMentions(content);
    onSendMessage(content.trim(), mentions);
    setContent('');
    setShowMentions(false);
  };

  const getInitials = (user: User): string => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <InputContainer className={className}>
      <MentionSuggestions isVisible={showMentions && filteredMembers.length > 0}>
        {filteredMembers.map((member, index) => (
          <MentionItem
            key={member.id}
            isSelected={index === selectedMentionIndex}
            onClick={() => insertMention(member)}
          >
            <MentionAvatar>
              {member.avatar ? (
                <img src={member.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                getInitials(member)
              )}
            </MentionAvatar>
            <MentionInfo>
              <MentionName>{member.firstName} {member.lastName}</MentionName>
              <MentionRole>{member.role}</MentionRole>
            </MentionInfo>
          </MentionItem>
        ))}
      </MentionSuggestions>

      <InputWrapper isFocused={isFocused} hasContent={hasContent}>
        <TextArea
          ref={textAreaRef}
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={1}
        />
        
        <ActionButtons>
          <IconButton type="button" title="Attach file">
            📎
          </IconButton>
          
          <SendButton
            size="sm"
            variant="primary"
            onClick={handleSend}
            disabled={!hasContent}
            isVisible={hasContent}
          >
            Send
          </SendButton>
        </ActionButtons>
      </InputWrapper>
    </InputContainer>
  );
};