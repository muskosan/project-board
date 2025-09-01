import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  Paperclip, 
  MoreHorizontal,
  Edit3,
  Copy
} from 'lucide-react';
import type { Task, Priority } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TaskTag } from './TaskTag';
import { transitions } from '../../utils/animations';
import { HoverLift } from '../ui/MicroInteractions';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const CardContainer = styled(motion.div)<{ 
  $isDragging: boolean; 
  $priority: Priority;
}>`
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
  padding: 1rem;
  cursor: grab;
  position: relative;
  border-left: 3px solid ${({ $priority, theme }) => {
    switch ($priority) {
      case 'urgent': return theme.colors.status.error;
      case 'high': return theme.colors.status.warning;
      case 'medium': return theme.colors.accent.primary;
      case 'low': return theme.colors.text.muted;
      default: return theme.colors.text.muted;
    }
  }};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.accent.primary};
    transform: translateY(-2px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0.75rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    
    /* Touch-friendly minimum size */
    min-height: ${({ theme }) => theme.touch.minTarget};
    
    /* Reduce hover effects on touch devices */
    @media (hover: none) {
      &:hover {
        transform: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.5rem;
    border-left-width: 2px;
  }

  &:active {
    cursor: grabbing;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const TaskTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.4;
  flex: 1;
  margin-right: 0.5rem;
`;

const HoverActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(Button)`
  padding: 0.25rem;
  min-width: auto;
  height: auto;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const TaskDescription = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const MetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const AssigneeAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
`;

const PriorityBadge = styled(Badge)<{ $priority: Priority }>`
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  background: ${({ $priority, theme }) => {
    switch ($priority) {
      case 'urgent': return `${theme.colors.status.error}20`;
      case 'high': return `${theme.colors.status.warning}20`;
      case 'medium': return `${theme.colors.accent.primary}20`;
      case 'low': return `${theme.colors.text.muted}20`;
      default: return `${theme.colors.text.muted}20`;
    }
  }};
  color: ${({ $priority, theme }) => {
    switch ($priority) {
      case 'urgent': return theme.colors.status.error;
      case 'high': return theme.colors.status.warning;
      case 'medium': return theme.colors.accent.primary;
      case 'low': return theme.colors.text.muted;
      default: return theme.colors.text.muted;
    }
  }};
  border: 1px solid ${({ $priority, theme }) => {
    switch ($priority) {
      case 'urgent': return theme.colors.status.error;
      case 'high': return theme.colors.status.warning;
      case 'medium': return theme.colors.accent.primary;
      case 'low': return theme.colors.text.muted;
      default: return theme.colors.text.muted;
    }
  }};
`;

// ============================================================================
// COMPONENT
// ============================================================================

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onDuplicate?: (task: Task) => void;
  isDragging?: boolean;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDuplicate,
  isDragging = false,
  className,
}) => {
  const [showActions, setShowActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDuplicate = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onDuplicate) {
      onDuplicate(task);
    }
  };

  const handleMoreActions = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowActions(!showActions);
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <HoverLift lift={4} scale={1.01}>
      <CardContainer
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      $isDragging={isDragging || isSortableDragging}
      $priority={task.priority}
      className={className}
      whileHover={!isDragging && !isSortableDragging ? {
        y: -2,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        transition: transitions.fast,
      } : undefined}
      animate={{
        opacity: isDragging || isSortableDragging ? 0.8 : 1,
        rotate: isDragging || isSortableDragging ? 5 : 0,
        boxShadow: isDragging || isSortableDragging 
          ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
      transition={transitions.fast}
    >
      <CardHeader>
        <TaskTitle>{task.title}</TaskTitle>
        <HoverActions>
          <ActionButton
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            title="Edit task"
          >
            <Edit3 />
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="sm"
            onClick={handleDuplicate}
            title="Duplicate task"
          >
            <Copy />
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="sm"
            onClick={handleMoreActions}
            title="More actions"
          >
            <MoreHorizontal />
          </ActionButton>
        </HoverActions>
      </CardHeader>

      {task.description && (
        <TaskDescription>{task.description}</TaskDescription>
      )}

      {task.tags.length > 0 && (
        <TaskTags>
          {task.tags.map((tag) => (
            <TaskTag key={tag} tag={tag} />
          ))}
        </TaskTags>
      )}

      <TaskMeta>
        <MetaLeft>
          {task.dueDate && (
            <MetaItem>
              <Calendar size={12} />
              <span style={{ color: isOverdue ? '#EF4444' : undefined }}>
                {formatDueDate(new Date(task.dueDate))}
              </span>
            </MetaItem>
          )}
          {task.estimatedHours && (
            <MetaItem>
              <Clock size={12} />
              <span>{task.estimatedHours}h</span>
            </MetaItem>
          )}
        </MetaLeft>

        <MetaRight>
          {task.comments.length > 0 && (
            <MetaItem>
              <MessageCircle size={12} />
              <span>{task.comments.length}</span>
            </MetaItem>
          )}
          {task.attachments.length > 0 && (
            <MetaItem>
              <Paperclip size={12} />
              <span>{task.attachments.length}</span>
            </MetaItem>
          )}
          {task.assignee && (
            <AssigneeAvatar
              src={task.assignee.avatar}
              alt={`${task.assignee.firstName} ${task.assignee.lastName}`}
              title={`Assigned to ${task.assignee.firstName} ${task.assignee.lastName}`}
            />
          )}
          <PriorityBadge $priority={task.priority}>
            {task.priority}
          </PriorityBadge>
        </MetaRight>
      </TaskMeta>
    </CardContainer>
    </HoverLift>
  );
};