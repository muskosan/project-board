import React from 'react';
import styled, { css } from 'styled-components';
import type { ChatMessage, User } from '../../types';
import { DocumentLinkPreview } from './DocumentLinkPreview';

interface MessageBubbleProps {
  message: ChatMessage;
  currentUser: User;
  isGrouped?: boolean;
  className?: string;
}

const MessageContainer = styled.div<{ isOwn: boolean; isGrouped: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ isGrouped, theme }) => isGrouped ? theme.spacing.xs : theme.spacing.md};
  
  ${({ isOwn }) => isOwn && css`
    flex-direction: row-reverse;
  `}
`;

const Avatar = styled.div<{ isVisible: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: white;
  flex-shrink: 0;
  visibility: ${({ isVisible }) => isVisible ? 'visible' : 'hidden'};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const MessageContent = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  
  ${({ isOwn }) => isOwn && css`
    align-items: flex-end;
  `}
`;

const MessageHeader = styled.div<{ isOwn: boolean; isVisible: boolean }>`
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  ${({ isOwn }) => isOwn && css`
    flex-direction: row-reverse;
  `}
`;

const AuthorName = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MessageTime = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const MessageBubbleStyled = styled.div<{ isOwn: boolean }>`
  background-color: ${({ isOwn, theme }) => 
    isOwn ? theme.colors.accent.primary : theme.colors.background.secondary};
  color: ${({ isOwn, theme }) => 
    isOwn ? 'white' : theme.colors.text.primary};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  
  ${({ isOwn, theme }) => isOwn ? css`
    border-bottom-right-radius: ${theme.borderRadius.sm};
  ` : css`
    border-bottom-left-radius: ${theme.borderRadius.sm};
  `}
`;

const MessageText = styled.div`
  white-space: pre-wrap;
`;

const MentionSpan = styled.span`
  background-color: ${({ theme }) => theme.colors.accent.secondary}30;
  color: ${({ theme }) => theme.colors.accent.secondary};
  padding: 0 ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const EditedIndicator = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-style: italic;
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const AttachmentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.background.primary};
`;

const AttachmentIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.accent.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: white;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
`;

const AttachmentInfo = styled.div`
  flex: 1;
`;

const AttachmentName = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AttachmentSize = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ReactionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ReactionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
};

const renderMessageContent = (content: string, mentions: string[]): React.ReactNode => {
  if (mentions.length === 0) {
    return content;
  }

  let processedContent = content;
  mentions.forEach(mention => {
    const mentionRegex = new RegExp(`@${mention}`, 'gi');
    processedContent = processedContent.replace(
      mentionRegex,
      `<mention>@${mention}</mention>`
    );
  });

  return processedContent.split(/(<mention>.*?<\/mention>)/).map((part, index) => {
    if (part.startsWith('<mention>') && part.endsWith('</mention>')) {
      const mentionText = part.slice(9, -10); // Remove <mention> tags
      return <MentionSpan key={index}>{mentionText}</MentionSpan>;
    }
    return part;
  });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUser,
  isGrouped = false,
  className,
}) => {
  // const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  
  const isOwn = message.authorId === currentUser.id;
  const author = message.author || currentUser;
  const showAvatar = !isGrouped;
  const showHeader = !isGrouped;

  const getInitials = (user: User): string => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  // Extract URLs from message content for document link previews
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = message.content.match(urlRegex) || [];

  return (
    <MessageContainer isOwn={isOwn} isGrouped={isGrouped} className={className}>
      <Avatar isVisible={showAvatar}>
        {author.avatar ? (
          <AvatarImage src={author.avatar} alt={`${author.firstName} ${author.lastName}`} />
        ) : (
          getInitials(author)
        )}
      </Avatar>

      <MessageContent isOwn={isOwn}>
        <MessageHeader isOwn={isOwn} isVisible={showHeader}>
          <AuthorName>{author.firstName} {author.lastName}</AuthorName>
          <MessageTime>{formatTime(new Date(message.createdAt))}</MessageTime>
        </MessageHeader>

        <MessageBubbleStyled isOwn={isOwn}>
          <MessageText>
            {renderMessageContent(message.content, message.mentions)}
            {message.isEdited && <EditedIndicator>(edited)</EditedIndicator>}
          </MessageText>
        </MessageBubbleStyled>

        {/* Document Link Previews */}
        {urls.length > 0 && (
          <div>
            {urls.map((url, index) => (
              <DocumentLinkPreview key={index} url={url} />
            ))}
          </div>
        )}

        {/* Attachments */}
        {message.attachments.length > 0 && (
          <AttachmentsContainer>
            {message.attachments.map(attachment => (
              <AttachmentItem key={attachment.id}>
                <AttachmentIcon>
                  {getFileExtension(attachment.filename).slice(0, 3)}
                </AttachmentIcon>
                <AttachmentInfo>
                  <AttachmentName>{attachment.filename}</AttachmentName>
                  <AttachmentSize>{formatFileSize(attachment.size)}</AttachmentSize>
                </AttachmentInfo>
              </AttachmentItem>
            ))}
          </AttachmentsContainer>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <ReactionsContainer>
            {message.reactions.map(reaction => (
              <ReactionButton key={reaction.id}>
                <span>{reaction.emoji}</span>
                <span>1</span>
              </ReactionButton>
            ))}
          </ReactionsContainer>
        )}
      </MessageContent>
    </MessageContainer>
  );
};