import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Task, User, Priority } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Text, Label } from '../ui/Typography';

interface TaskListProps {
  tasks: Task[];
  users: User[];
  onTaskSelect: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  selectedTaskId?: string;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FilterButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const FilterButton = styled(Button)<{ active: boolean }>`
  ${({ active, theme }) => active && css`
    background-color: ${theme.colors.accent.primary};
    color: white;
  `}
`;

const TaskListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const TaskItem = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid transparent;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ selected, theme }) => selected && css`
    border-color: ${theme.colors.accent.primary};
    box-shadow: ${theme.shadows.md};
  `}
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TaskTitle = styled.h4`
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.4;
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm};
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

const TaskDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  line-height: 1.4;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TaskMetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TaskMetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PriorityBadge = styled(Badge)<{ priority: Priority }>`
  ${({ priority, theme }) => {
    const priorityColors = {
      low: theme.colors.text.muted,
      medium: theme.colors.status.info,
      high: theme.colors.status.warning,
      urgent: theme.colors.status.error,
    };
    
    const color = priorityColors[priority] || theme.colors.text.muted;
    
    return css`
      background-color: ${color}20;
      color: ${color};
      border: 1px solid ${color}40;
    `;
  }}
`;

const AssigneeAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.background.elevated};
`;

const DueDate = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
`;

const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const TaskTag = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  padding: ${({ theme }) => `2px ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const CommentCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const AttachmentCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  margin: 0;
`;

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
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

const getPriorityLabel = (priority: Priority): string => {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return labels[priority];
};

type FilterType = 'all' | 'assigned' | 'unassigned' | 'overdue';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskSelect,
  selectedTaskId,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filter tasks based on search and filters
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply additional filters
    switch (activeFilter) {
      case 'assigned':
        filtered = filtered.filter(task => task.assigneeId);
        break;
      case 'unassigned':
        filtered = filtered.filter(task => !task.assigneeId);
        break;
      case 'overdue':
        const now = new Date();
        filtered = filtered.filter(task => 
          task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
        );
        break;
    }

    return filtered;
  }, [tasks, searchQuery, activeFilter]);

  const filterCounts = React.useMemo(() => {
    const now = new Date();
    return {
      all: tasks.length,
      assigned: tasks.filter(t => t.assigneeId).length,
      unassigned: tasks.filter(t => !t.assigneeId).length,
      overdue: tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
      ).length,
    };
  }, [tasks]);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: `All (${filterCounts.all})` },
    { id: 'assigned', label: `Assigned (${filterCounts.assigned})` },
    { id: 'unassigned', label: `Unassigned (${filterCounts.unassigned})` },
    { id: 'overdue', label: `Overdue (${filterCounts.overdue})` },
  ];

  return (
    <Container className={className}>
      <Header>
        <SearchContainer>
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        
        <FilterButtons>
          {filters.map((filter) => (
            <FilterButton
              key={filter.id}
              variant="ghost"
              size="sm"
              active={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterButtons>
      </Header>

      <TaskListContainer>
        {filteredTasks.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No tasks found</EmptyTitle>
            <EmptyDescription>
              {searchQuery || activeFilter !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'No tasks have been created yet.'
              }
            </EmptyDescription>
          </EmptyState>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              selected={task.id === selectedTaskId}
              onClick={() => onTaskSelect(task)}
            >
              <TaskHeader>
                <TaskTitle>{task.title}</TaskTitle>
                <StatusBadge status={task.status} size="sm">
                  {getStatusLabel(task.status)}
                </StatusBadge>
              </TaskHeader>

              {task.description && (
                <TaskDescription>
                  {task.description}
                </TaskDescription>
              )}

              <TaskMeta>
                <TaskMetaLeft>
                  <PriorityBadge priority={task.priority} size="sm">
                    {getPriorityLabel(task.priority)}
                  </PriorityBadge>
                  
                  {task.assignee && (
                    <AssigneeAvatar
                      src={task.assignee.avatar}
                      alt={`${task.assignee.firstName} ${task.assignee.lastName}`}
                      title={`Assigned to ${task.assignee.firstName} ${task.assignee.lastName}`}
                    />
                  )}
                </TaskMetaLeft>

                <TaskMetaRight>
                  {task.comments.length > 0 && (
                    <CommentCount>
                      💬 {task.comments.length}
                    </CommentCount>
                  )}
                  
                  {task.attachments.length > 0 && (
                    <AttachmentCount>
                      📎 {task.attachments.length}
                    </AttachmentCount>
                  )}
                  
                  {task.dueDate && (
                    <DueDate>
                      {formatDate(task.dueDate)}
                    </DueDate>
                  )}
                </TaskMetaRight>
              </TaskMeta>

              {task.tags.length > 0 && (
                <TaskTags>
                  {task.tags.slice(0, 3).map((tag) => (
                    <TaskTag key={tag}>{tag}</TaskTag>
                  ))}
                  {task.tags.length > 3 && (
                    <TaskTag>+{task.tags.length - 3}</TaskTag>
                  )}
                </TaskTags>
              )}
            </TaskItem>
          ))
        )}
      </TaskListContainer>
    </Container>
  );
};