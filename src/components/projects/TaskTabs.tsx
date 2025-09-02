import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Project, Task, User } from '../../types';
import { TaskList } from './TaskList';
import { TaskDetail } from './TaskDetail';

interface TaskTabsProps {
  project: Project;
  tasks: Task[];
  users: User[];
  onTaskUpdate: (task: Task) => void;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const TabsHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const TabsList = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: none;
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  ${({ active, theme }) => active ? css`
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.primary};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${theme.colors.accent.primary};
    }
  ` : css`
    color: ${theme.colors.text.secondary};
    
    &:hover {
      color: ${theme.colors.text.primary};
      background-color: ${theme.colors.background.secondary};
    }
  `}
`;

const TabBadge = styled.span<{ variant?: 'default' | 'primary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  ${({ variant = 'default', theme }) => variant === 'primary' ? css`
    background-color: ${theme.colors.accent.primary};
    color: white;
  ` : css`
    background-color: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
  `}
`;

const TabContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const TaskListPanel = styled.div<{ showDetail: boolean }>`
  width: ${({ showDetail }) => showDetail ? '400px' : '100%'};
  min-width: 400px;
  border-right: ${({ showDetail, theme }) => 
    showDetail ? `1px solid ${theme.colors.background.secondary}` : 'none'};
  overflow-y: auto;
  transition: width ${({ theme }) => theme.transitions.normal};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    min-width: 100%;
    border-right: none;
  }
`;

const TaskDetailPanel = styled.div<{ show: boolean }>`
  flex: 1;
  display: ${({ show }) => show ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.background.primary};
    z-index: 10;
  }
`;

type TabType = 'all' | 'todo' | 'in-progress' | 'review' | 'done';

const tabs: { id: TabType; label: string; statusFilter?: string[] }[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'todo', label: 'To Do', statusFilter: ['todo'] },
  { id: 'in-progress', label: 'In Progress', statusFilter: ['in-progress'] },
  { id: 'review', label: 'Review', statusFilter: ['review'] },
  { id: 'done', label: 'Done', statusFilter: ['done'] },
];

export const TaskTabs: React.FC<TaskTabsProps> = ({
  tasks,
  users,
  onTaskUpdate,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks based on active tab
  const filteredTasks = React.useMemo(() => {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab || !tab.statusFilter) {
      return tasks;
    }
    return tasks.filter(task => tab.statusFilter!.includes(task.status));
  }, [tasks, activeTab]);

  // Calculate task counts for each tab
  const taskCounts = React.useMemo(() => {
    const counts: Record<TabType, number> = {
      all: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
    return counts;
  }, [tasks]);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskClose = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    onTaskUpdate(updatedTask);
    
    // Update selected task if it's the same one
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  return (
    <Container className={className}>
      <TabsHeader>
        <TabsList>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <TabBadge variant={activeTab === tab.id ? 'primary' : 'default'}>
                {taskCounts[tab.id]}
              </TabBadge>
            </Tab>
          ))}
        </TabsList>
      </TabsHeader>

      <TabContent>
        <TaskListPanel showDetail={!!selectedTask}>
          <TaskList
            tasks={filteredTasks}
            users={users}
            onTaskSelect={handleTaskSelect}
            onTaskUpdate={handleTaskUpdate}
            selectedTaskId={selectedTask?.id}
          />
        </TaskListPanel>

        <TaskDetailPanel show={!!selectedTask}>
          {selectedTask && (
            <TaskDetail
              task={selectedTask}
              users={users}
              onTaskUpdate={handleTaskUpdate}
              onClose={handleTaskClose}
            />
          )}
        </TaskDetailPanel>
      </TabContent>
    </Container>
  );
};