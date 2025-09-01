import React, { useMemo } from 'react';
import styled from 'styled-components';
import { tokens } from '../styles/tokens';
import { Typography } from '../components/ui/Typography';
import { 
  DashboardGrid, 
  ActivityFeed, 
  PinnedProjects, 
  UpcomingDeadlines 
} from '../components/dashboard';
import { generateCompleteDataset } from '../utils/mockData';
import type { Project } from '../types';

const DashboardContainer = styled.div`
  padding: 0; /* Remove padding since DashboardGrid handles spacing */
`;

const DashboardHeader = styled.div`
  margin-bottom: ${tokens.spacing.xl};
`;

const WelcomeSection = styled.div`
  margin-bottom: ${tokens.spacing.lg};
`;

const LeftPanelContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
  height: 100%;
`;

const RightPanelContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
  height: 100%;
`;

// Transform tasks and projects into deadline items
interface DeadlineItem {
  id: string;
  title: string;
  dueDate: Date;
  project?: Project;
  type: 'task' | 'project' | 'milestone';
}

export const Dashboard: React.FC = () => {
  // Generate mock data (in a real app, this would come from API/state management)
  const mockData = useMemo(() => generateCompleteDataset(), []);
  
  // Get pinned projects (for demo, we'll take the first 3 active projects)
  const pinnedProjects = useMemo(() => {
    return mockData.projects
      .filter(project => project.status === 'active')
      .slice(0, 3);
  }, [mockData.projects]);
  
  // Get recent activity items (last 10)
  const recentActivity = useMemo(() => {
    return mockData.activityItems
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }, [mockData.activityItems]);
  
  // Transform tasks and projects into upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    const deadlines: DeadlineItem[] = [];
    
    // Add project deadlines
    mockData.projects
      .filter(project => project.dueDate && project.status !== 'completed')
      .forEach(project => {
        deadlines.push({
          id: `project-${project.id}`,
          title: `${project.name} - Project Deadline`,
          dueDate: project.dueDate!,
          project,
          type: 'project',
        });
      });
    
    // Add task deadlines
    mockData.tasks
      .filter(task => task.dueDate && task.status !== 'done')
      .forEach(task => {
        const project = mockData.projects.find(p => p.id === task.projectId);
        deadlines.push({
          id: `task-${task.id}`,
          title: task.title,
          dueDate: task.dueDate!,
          project,
          type: 'task',
        });
      });
    
    // Sort by due date and take next 8
    return deadlines
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 8);
  }, [mockData.projects, mockData.tasks]);

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project.name);
    // In a real app, navigate to project detail page
  };

  const handleDeadlineClick = (deadline: DeadlineItem) => {
    console.log('Deadline clicked:', deadline.title);
    // In a real app, navigate to task or project detail
  };

  const handleViewAllProjects = () => {
    console.log('View all projects clicked');
    // In a real app, navigate to projects page
  };

  const handleViewAllDeadlines = () => {
    console.log('View all deadlines clicked');
    // In a real app, navigate to calendar or deadlines page
  };

  const handleLoadMoreActivity = () => {
    console.log('Load more activity clicked');
    // In a real app, load more activity items
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeSection>
          <Typography variant="h1" weight="bold">
            Good morning! 👋
          </Typography>
          <Typography variant="body" color="secondary">
            Here's what's happening with your projects today.
          </Typography>
        </WelcomeSection>
      </DashboardHeader>

      <DashboardGrid
        leftPanel={
          <LeftPanelContent>
            <PinnedProjects
              projects={pinnedProjects}
              onProjectClick={handleProjectClick}
              onViewAll={handleViewAllProjects}
            />
          </LeftPanelContent>
        }
        rightPanel={
          <RightPanelContent>
            <UpcomingDeadlines
              deadlines={upcomingDeadlines}
              onDeadlineClick={handleDeadlineClick}
              onViewAll={handleViewAllDeadlines}
            />
          </RightPanelContent>
        }
        activityFeed={
          <ActivityFeed
            items={recentActivity}
            onLoadMore={handleLoadMoreActivity}
            hasMore={true}
          />
        }
      />
    </DashboardContainer>
  );
};
