import React from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Column, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ColumnContainer = styled.div<{ $isDraggedOver: boolean }>`
  display: flex;
  flex-direction: column;
  width: 320px;
  min-height: 500px;
  background: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid ${({ $isDraggedOver, theme }) => 
    $isDraggedOver ? theme.colors.accent.primary : 'transparent'};
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 280px;
    min-height: 400px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 260px;
    min-height: 350px;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1rem 1rem 0.75rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.75rem 0.75rem 0.5rem;
  }
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ColumnIndicator = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const ColumnName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const TaskCount = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
`;

const TaskLimit = styled.span<{ $isNearLimit: boolean }>`
  font-size: 0.75rem;
  color: ${({ $isNearLimit, theme }) => 
    $isNearLimit ? theme.colors.status.warning : theme.colors.text.muted};
  margin-left: 0.5rem;
`;

const ColumnContent = styled.div`
  flex: 1;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  min-height: 200px;
  
  /* Touch scrolling optimization */
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
    min-height: 150px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
    min-height: 120px;
    
    /* Hide scrollbar on mobile */
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  min-height: 150px;
`;

const AddTaskButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px dashed ${({ theme }) => theme.colors.text.muted};
  background: transparent;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.accent.primary};
    color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const DropZone = styled.div<{ $isDraggedOver: boolean }>`
  min-height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px dashed ${({ $isDraggedOver, theme }) => 
    $isDraggedOver ? theme.colors.accent.primary : 'transparent'};
  background: ${({ $isDraggedOver, theme }) => 
    $isDraggedOver ? `${theme.colors.accent.primary}10` : 'transparent'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
`;

// ============================================================================
// COMPONENT
// ============================================================================

interface TaskColumnProps {
  column: Column;
  onTaskUpdate: (task: Task) => void;
  onTaskCreate?: (columnId: string) => void;
  isDraggedOver?: boolean;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  onTaskUpdate,
  onTaskCreate,
  isDraggedOver = false,
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const taskCount = column.tasks.length;
  const isNearLimit = column.limit ? taskCount >= column.limit * 0.8 : false;
  const isAtLimit = column.limit ? taskCount >= column.limit : false;

  const handleAddTask = () => {
    if (onTaskCreate && !isAtLimit) {
      onTaskCreate(column.id);
    }
  };

  return (
    <ColumnContainer ref={setNodeRef} $isDraggedOver={isDraggedOver}>
      <ColumnHeader>
        <ColumnTitle>
          <ColumnIndicator $color={column.color} />
          <ColumnName>{column.title}</ColumnName>
          <TaskCount>
            {taskCount}
            {column.limit && (
              <TaskLimit $isNearLimit={isNearLimit}>
                / {column.limit}
              </TaskLimit>
            )}
          </TaskCount>
        </ColumnTitle>
      </ColumnHeader>

      <ColumnContent>
        <TaskList>
          <SortableContext 
            items={column.tasks.map(task => task.id)} 
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onTaskUpdate}
              />
            ))}
          </SortableContext>
        </TaskList>

        {column.tasks.length === 0 && !isDraggedOver && (
          <EmptyState>
            <p>No tasks yet</p>
            <p>Drag tasks here or create a new one</p>
          </EmptyState>
        )}

        {isDraggedOver && column.tasks.length === 0 && (
          <DropZone $isDraggedOver={true}>
            Drop task here
          </DropZone>
        )}

        {onTaskCreate && !isAtLimit && (
          <AddTaskButton
            variant="ghost"
            size="sm"
            onClick={handleAddTask}
          >
            <Plus size={16} />
            Add task
          </AddTaskButton>
        )}

        {isAtLimit && (
          <EmptyState>
            <p>Column limit reached</p>
            <p>Move tasks to other columns to add more</p>
          </EmptyState>
        )}
      </ColumnContent>
    </ColumnContainer>
  );
};