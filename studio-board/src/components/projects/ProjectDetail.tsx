import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import type { Project, Task, User } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Heading } from '../ui/Typography';
import { ProjectOverview } from './ProjectOverview';
import { TaskTabs } from './TaskTabs';
import { ClientAccessButton } from './ClientAccessButton';
import { generateMockTasks, generateMockUsers } from '../../utils/mockData';

interface ProjectDetailProps {
  project: Project;
  onBack?: () => void;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BackButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm};
  min-width: auto;
`;

const ProjectTitle = styled(Heading)`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatusBadge = styled(Badge)<{ status: string }>`
  ${({ status, theme }) => {
    const statusColors = {
      planning: theme.colors.status.info,
      active: theme.colors.status.success,
      on_hold: theme.colors.status.warning,
      completed: theme.colors.accent.secondary,
      cancelled: theme.colors.status.error,
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
  gap: ${({ theme }) => theme.spacing.md};
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  width: 400px;
  min-width: 400px;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-right: 1px solid ${({ theme }) => theme.colors.background.secondary};
  overflow-y: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    min-width: 100%;
    border-right: none;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const getStatusLabel = (status: string): string => {
  const labels = {
    planning: 'Planning',
    active: 'Active',
    on_hold: 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status as keyof typeof labels] || status;
};

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBack,
  className,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading project tasks and users
    const loadProjectData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Generate mock data for this project
        const mockUsers = generateMockUsers(10);
        const mockTasks = generateMockTasks(project.id, 15, mockUsers);
        
        // Populate task assignees and reporters with user data
        const populatedTasks = mockTasks.map(task => ({
          ...task,
          assignee: task.assigneeId ? mockUsers.find(u => u.id === task.assigneeId) : undefined,
          reporter: mockUsers.find(u => u.id === task.reporterId),
          comments: task.comments.map(comment => ({
            ...comment,
            author: mockUsers.find(u => u.id === comment.authorId),
          })),
          attachments: task.attachments.map(attachment => ({
            ...attachment,
            uploader: mockUsers.find(u => u.id === attachment.uploadedBy),
          })),
        }));
        
        setUsers(mockUsers);
        setTasks(populatedTasks);
      } catch (error) {
        console.error('Failed to load project data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [project.id]);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  return (
    <Container className={className}>
      <Header>
        <HeaderLeft>
          {onBack && (
            <BackButton
              variant="ghost"
              onClick={onBack}
              aria-label="Go back"
            >
              ←
            </BackButton>
          )}
          <ProjectTitle level={1} size="xl">
            {project.name}
          </ProjectTitle>
          <StatusBadge status={project.status}>
            {getStatusLabel(project.status)}
          </StatusBadge>
        </HeaderLeft>
        
        <HeaderActions>
          <ClientAccessButton project={project} />
          <Button variant="outline" size="sm">
            Share
          </Button>
          <Button variant="primary" size="sm">
            Edit Project
          </Button>
        </HeaderActions>
      </Header>

      <MainContent>
        <LeftPanel>
          <ProjectOverview 
            project={project}
            tasks={tasks}
            users={users}
          />
        </LeftPanel>
        
        <RightPanel>
          {loading ? (
            <LoadingState>
              Loading tasks...
            </LoadingState>
          ) : (
            <TaskTabs
              project={project}
              tasks={tasks}
              users={users}
              onTaskUpdate={handleTaskUpdate}
            />
          )}
        </RightPanel>
      </MainContent>
    </Container>
  );
};