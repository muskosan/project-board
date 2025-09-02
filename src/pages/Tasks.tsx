import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskBoard } from '../components/tasks';
import { generateMockKanbanBoard, generateMockTask } from '../utils/mockData';
import type { Column, Task } from '../types';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.primary};
`;

const PageHeader = styled.div`
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  background: ${({ theme }) => theme.colors.background.elevated};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  font-size: 1rem;
`;

const BoardContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

// ============================================================================
// COMPONENT
// ============================================================================

export const Tasks: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(() => generateMockKanbanBoard());

  const handleTaskMove = (taskId: string, fromColumnId: string, toColumnId: string, newIndex?: number) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      
      // Find source and destination columns
      const fromColumn = newColumns.find(col => col.id === fromColumnId);
      const toColumn = newColumns.find(col => col.id === toColumnId);
      
      if (!fromColumn || !toColumn) return prevColumns;
      
      // Find and remove task from source column
      const taskIndex = fromColumn.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return prevColumns;
      
      const [movedTask] = fromColumn.tasks.splice(taskIndex, 1);
      
      // Update task status to match destination column
      const updatedTask = {
        ...movedTask,
        status: toColumn.title.toLowerCase().replace(/\s+/g, '-'),
        updatedAt: new Date(),
      };
      
      // Add task to destination column
      if (newIndex !== undefined && newIndex >= 0) {
        toColumn.tasks.splice(newIndex, 0, updatedTask);
      } else {
        toColumn.tasks.push(updatedTask);
      }
      
      return newColumns;
    });
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setColumns(prevColumns => {
      return prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ),
      }));
    });
  };

  const handleTaskCreate = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;

    const newTask = generateMockTask('demo-project', {
      title: 'New Task',
      description: 'Click to edit this task description',
      status: column.title.toLowerCase().replace(/\s+/g, '-'),
      priority: 'medium',
      tags: ['new'],
    });

    setColumns(prevColumns => {
      return prevColumns.map(col => 
        col.id === columnId 
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      );
    });
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Task Board</PageTitle>
        <PageDescription>
          Manage your tasks with drag-and-drop functionality. Move tasks between columns to update their status.
        </PageDescription>
      </PageHeader>
      
      <BoardContainer>
        <TaskBoard
          columns={columns}
          onTaskMove={handleTaskMove}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreate={handleTaskCreate}
        />
      </BoardContainer>
    </PageContainer>
  );
};