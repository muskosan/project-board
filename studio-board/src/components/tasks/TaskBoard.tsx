import React, { useState } from 'react';
import styled from 'styled-components';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Column, Task } from '../../types';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const BoardContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 600px;
  
  /* Touch scrolling optimization */
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 1rem;
    padding: 1rem;
    min-height: 500px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 0.75rem;
    padding: 0.75rem;
    min-height: 400px;
    
    /* Hide scrollbar on mobile */
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const BoardContent = styled.div`
  display: flex;
  gap: 1.5rem;
  min-width: fit-content;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 1rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 0.75rem;
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

interface TaskBoardProps {
  columns: Column[];
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string, newIndex?: number) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskCreate?: (columnId: string) => void;
  className?: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  columns,
  onTaskMove,
  onTaskUpdate,
  onTaskCreate,
  className,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    if (!over) {
      setDraggedOverColumn(null);
      return;
    }

    const overId = over.id as string;

    // Check if we're dragging over a column
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn) {
      setDraggedOverColumn(overId);
      return;
    }

    // Check if we're dragging over a task
    const overTask = findTaskById(overId);
    if (overTask) {
      const overColumn = findColumnByTaskId(overId);
      setDraggedOverColumn(overColumn?.id || null);
      return;
    }

    setDraggedOverColumn(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    setDraggedOverColumn(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = findTaskById(activeId);
    const activeColumn = findColumnByTaskId(activeId);
    
    if (!activeTask || !activeColumn) return;

    // Check if dropping on a column
    const overColumn = columns.find(col => col.id === overId);
    if (overColumn && overColumn.id !== activeColumn.id) {
      onTaskMove(activeId, activeColumn.id, overColumn.id);
      return;
    }

    // Check if dropping on a task
    const overTask = findTaskById(overId);
    if (overTask) {
      const overColumn = findColumnByTaskId(overId);
      if (overColumn && overColumn.id !== activeColumn.id) {
        const overIndex = overColumn.tasks.findIndex(task => task.id === overId);
        onTaskMove(activeId, activeColumn.id, overColumn.id, overIndex);
      }
    }
  };

  const findTaskById = (taskId: string): Task | null => {
    for (const column of columns) {
      const task = column.tasks.find(task => task.id === taskId);
      if (task) return task;
    }
    return null;
  };

  const findColumnByTaskId = (taskId: string): Column | null => {
    for (const column of columns) {
      if (column.tasks.some(task => task.id === taskId)) {
        return column;
      }
    }
    return null;
  };

  const getAllTaskIds = (): string[] => {
    return columns.flatMap(column => column.tasks.map(task => task.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <BoardContainer className={className}>
        <BoardContent>
          <SortableContext items={getAllTaskIds()} strategy={verticalListSortingStrategy}>
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                onTaskUpdate={onTaskUpdate}
                onTaskCreate={onTaskCreate}
                isDraggedOver={draggedOverColumn === column.id}
              />
            ))}
          </SortableContext>
        </BoardContent>
      </BoardContainer>

      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            onUpdate={onTaskUpdate}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};