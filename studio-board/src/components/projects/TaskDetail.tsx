import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Task, User, Comment, Attachment } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Heading, Text, Label } from '../ui/Typography';
import { TaskComments } from './TaskComments';
import { TaskAttachments } from './TaskAttachments';

interface TaskDetailProps {
  task: Task;
  users: User[];
  onTaskUpdate: (task: Task) => void;
  onClose: () => void;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  min-width: 0;
`;

const CloseButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: auto;
`;

const TaskTitle = styled(Heading)`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusBadge = styled(Badge)<{ status: string }>`
  ${({ status, theme }) => {
    const statusColors = {
      todo: theme.colors.text.muted,
      'in-progress': theme.colors.status.info,
      review: theme.colors.status.warning,
      done: theme.colors.status.success,
    };
    
    const color = statusColors[status as keyof typeof statusColors] || theme.colors.text.muted;
    
    return css`
      background-color: ${color}20;
      color: ${color};
      border: 1px solid ${color}40;
    `;
  }}
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TaskInfo = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  }
`;

const SectionTitle = styled(Heading)`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const InfoLabel = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const InfoValue = styled(Text)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const Description = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
`;

const AssigneeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const UserRole = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

const PriorityBadge = styled(Badge)<{ priority: string }>`
  ${({ priority, theme }) => {
    const priorityColors = {
      low: theme.colors.text.muted,
      medium: theme.colors.status.info,
      high: theme.colors.status.warning,
      urgent: theme.colors.status.error,
    };
    
    const color = priorityColors[priority as keyof typeof priorityColors] || theme.colors.text.muted;
    
    return css`
      background-color: ${color}20;
      color: ${color};
      border: 1px solid ${color}40;
    `;
  }}
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Tag = styled(Badge)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.text.muted};
`;

const TimeTracking = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TimeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-width: 80px;
`;

const TimeValue = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TimeLabel = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  text-align: center;
`;

const StatusSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  cursor: pointer;
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accent.primary};
    outline-offset: 2px;
  }
`;

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const getStatusLabel = (status: string): string => {
  const labels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    review: 'Review',
    done: 'Done',
  };
  return labels[status as keyof typeof labels] || status;
};

const getPriorityLabel = (priority: string): string => {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return labels[priority as keyof typeof labels] || priority;
};

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  users,
  onTaskUpdate,
  onClose,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    const updatedTask = {
      ...task,
      status: newStatus,
      updatedAt: new Date(),
    };
    onTaskUpdate(updatedTask);
  };

  const handleCommentAdd = (content: string) => {
    // In a real app, this would make an API call
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      authorId: users[0]?.id || 'current-user', // Mock current user
      author: users[0], // Mock current user
      createdAt: new Date(),
      mentions: [],
    };

    const updatedTask = {
      ...task,
      comments: [...task.comments, newComment],
      updatedAt: new Date(),
    };
    
    onTaskUpdate(updatedTask);
  };

  const handleAttachmentAdd = (file: File) => {
    // In a real app, this would upload the file and get a URL
    const newAttachment: Attachment = {
      id: Math.random().toString(36).substr(2, 9),
      filename: file.name,
      url: URL.createObjectURL(file), // Mock URL
      size: file.size,
      mimeType: file.type,
      uploadedBy: users[0]?.id || 'current-user', // Mock current user
      uploader: users[0], // Mock current user
      uploadedAt: new Date(),
    };

    const updatedTask = {
      ...task,
      attachments: [...task.attachments, newAttachment],
      updatedAt: new Date(),
    };
    
    onTaskUpdate(updatedTask);
  };

  const handleAttachmentRemove = (attachmentId: string) => {
    const updatedTask = {
      ...task,
      attachments: task.attachments.filter(a => a.id !== attachmentId),
      updatedAt: new Date(),
    };
    
    onTaskUpdate(updatedTask);
  };

  return (
    <Container className={className}>
      <Header>
        <HeaderLeft>
          <CloseButton
            variant="ghost"
            onClick={onClose}
            aria-label="Close task detail"
          >
            ←
          </CloseButton>
          <TaskTitle level={2} size="lg">
            {task.title}
          </TaskTitle>
          <StatusBadge status={task.status}>
            {getStatusLabel(task.status)}
          </StatusBadge>
        </HeaderLeft>
        
        <HeaderActions>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </HeaderActions>
      </Header>

      <Content>
        <TaskInfo>
          <InfoSection>
            <SectionTitle level={3} size="lg">
              Task Details
            </SectionTitle>
            
            {task.description && (
              <Description>{task.description}</Description>
            )}

            <InfoRow>
              <InfoLabel>Status</InfoLabel>
              <StatusSelect
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </StatusSelect>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Priority</InfoLabel>
              <PriorityBadge priority={task.priority}>
                {getPriorityLabel(task.priority)}
              </PriorityBadge>
            </InfoRow>

            {task.assignee && (
              <InfoRow>
                <InfoLabel>Assigned to</InfoLabel>
                <AssigneeInfo>
                  <Avatar
                    src={task.assignee.avatar}
                    alt={`${task.assignee.firstName} ${task.assignee.lastName}`}
                  />
                  <UserInfo>
                    <UserName>
                      {task.assignee.firstName} {task.assignee.lastName}
                    </UserName>
                    <UserRole>{task.assignee.role}</UserRole>
                  </UserInfo>
                </AssigneeInfo>
              </InfoRow>
            )}

            {task.reporter && (
              <InfoRow>
                <InfoLabel>Reporter</InfoLabel>
                <AssigneeInfo>
                  <Avatar
                    src={task.reporter.avatar}
                    alt={`${task.reporter.firstName} ${task.reporter.lastName}`}
                  />
                  <UserInfo>
                    <UserName>
                      {task.reporter.firstName} {task.reporter.lastName}
                    </UserName>
                    <UserRole>{task.reporter.role}</UserRole>
                  </UserInfo>
                </AssigneeInfo>
              </InfoRow>
            )}

            {task.dueDate && (
              <InfoRow>
                <InfoLabel>Due Date</InfoLabel>
                <InfoValue>{formatDate(task.dueDate)}</InfoValue>
              </InfoRow>
            )}

            <InfoRow>
              <InfoLabel>Created</InfoLabel>
              <InfoValue>{formatDate(task.createdAt)}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Updated</InfoLabel>
              <InfoValue>{formatDate(task.updatedAt)}</InfoValue>
            </InfoRow>
          </InfoSection>

          {(task.estimatedHours || task.actualHours) && (
            <InfoSection>
              <SectionTitle level={3} size="lg">
                Time Tracking
              </SectionTitle>
              
              <TimeTracking>
                {task.estimatedHours && (
                  <TimeItem>
                    <TimeValue>{task.estimatedHours}h</TimeValue>
                    <TimeLabel>Estimated</TimeLabel>
                  </TimeItem>
                )}
                
                {task.actualHours && (
                  <TimeItem>
                    <TimeValue>{task.actualHours}h</TimeValue>
                    <TimeLabel>Actual</TimeLabel>
                  </TimeItem>
                )}
                
                {task.estimatedHours && task.actualHours && (
                  <TimeItem>
                    <TimeValue>
                      {task.actualHours > task.estimatedHours ? '+' : ''}
                      {task.actualHours - task.estimatedHours}h
                    </TimeValue>
                    <TimeLabel>Difference</TimeLabel>
                  </TimeItem>
                )}
              </TimeTracking>
            </InfoSection>
          )}

          {task.tags.length > 0 && (
            <InfoSection>
              <SectionTitle level={3} size="lg">
                Tags
              </SectionTitle>
              
              <TagsContainer>
                {task.tags.map((tag) => (
                  <Tag key={tag} size="sm">
                    {tag}
                  </Tag>
                ))}
              </TagsContainer>
            </InfoSection>
          )}
        </TaskInfo>

        <TaskAttachments
          attachments={task.attachments}
          onAttachmentAdd={handleAttachmentAdd}
          onAttachmentRemove={handleAttachmentRemove}
        />

        <TaskComments
          comments={task.comments}
          users={users}
          onCommentAdd={handleCommentAdd}
        />
      </Content>
    </Container>
  );
};