import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';
import type { Project } from '../../types';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';

const ProjectsContainer = styled(Card)`
  padding: ${tokens.spacing.xl};
  height: 100%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    padding: ${tokens.spacing.lg};
  }
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    padding: ${tokens.spacing.md};
  }
`;

const ProjectsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.lg};
  padding-bottom: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.background.secondary};
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: ${tokens.colors.accent.primary};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: 500;
  cursor: pointer;
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.sm};
  transition: background-color 150ms ease;
  
  &:hover {
    background-color: ${tokens.colors.background.secondary};
  }
`;

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
  flex: 1;
  overflow-y: auto;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.text.muted};
    border-radius: 2px;
  }
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    /* Hide scrollbar on mobile */
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const ProjectCard = styled.div`
  padding: ${tokens.spacing.lg};
  border: 1px solid ${tokens.colors.background.secondary};
  border-radius: ${tokens.borderRadius.lg};
  transition: all 150ms ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${tokens.colors.text.muted};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${tokens.spacing.sm};
`;

const ProjectTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: ${tokens.spacing.xs};
`;



const ProgressContainer = styled.div`
  margin: ${tokens.spacing.sm} 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${tokens.colors.background.secondary};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number; color: string }>`
  height: 100%;
  background-color: ${props => props.color};
  width: ${props => props.progress}%;
  transition: width 300ms ease;
`;

const ProgressText = styled(Typography)`
  margin-top: ${tokens.spacing.xs};
  text-align: right;
`;

const TeamAvatars = styled.div`
  display: flex;
  margin-top: ${tokens.spacing.sm};
  gap: -${tokens.spacing.xs}; /* Negative gap for overlap */
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${tokens.colors.background.elevated};
  background-color: ${tokens.colors.background.secondary};
  margin-left: -${tokens.spacing.xs};
  
  &:first-child {
    margin-left: 0;
  }
`;

const MoreAvatars = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${tokens.colors.background.elevated};
  background-color: ${tokens.colors.text.muted};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${tokens.typography.sizes.xs};
  font-weight: 600;
  margin-left: -${tokens.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${tokens.spacing.xl};
  color: ${tokens.colors.text.muted};
`;

interface PinnedProjectsProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
  onViewAll?: () => void;
}

const getStatusVariant = (status: string): 'success' | 'warning' | 'info' | 'error' | 'default' => {
  switch (status) {
    case 'active': return 'success';
    case 'on_hold': return 'warning';
    case 'completed': return 'info';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active': return 'Active';
    case 'on_hold': return 'On Hold';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    case 'planning': return 'Planning';
    default: return status;
  }
};

export const PinnedProjects: React.FC<PinnedProjectsProps> = ({
  projects,
  onProjectClick,
  onViewAll,
}) => {
  if (projects.length === 0) {
    return (
      <ProjectsContainer>
        <ProjectsHeader>
          <Typography variant="h3" weight="medium">
            Pinned Projects
          </Typography>
        </ProjectsHeader>
        <EmptyState>
          <Typography variant="body" color="muted">
            No pinned projects yet
          </Typography>
        </EmptyState>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer>
      <ProjectsHeader>
        <Typography variant="h3" weight="medium">
          Pinned Projects
        </Typography>
        {onViewAll && (
          <ViewAllButton onClick={onViewAll}>
            View All
          </ViewAllButton>
        )}
      </ProjectsHeader>
      
      <ProjectsList>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            onClick={() => onProjectClick?.(project)}
          >
            <ProjectHeader>
              <div>
                <ProjectTitle variant="h4">
                  {project.name}
                </ProjectTitle>
                <Typography variant="body" color="secondary">
                  {project.description}
                </Typography>
              </div>
              <Badge
                variant={getStatusVariant(project.status)}
              >
                {getStatusLabel(project.status)}
              </Badge>
            </ProjectHeader>
            
            <ProgressContainer>
              <ProgressBar>
                <ProgressFill
                  progress={project.progress}
                  color={project.color}
                />
              </ProgressBar>
              <ProgressText variant="caption" color="secondary">
                {project.progress}% complete
              </ProgressText>
            </ProgressContainer>
            
            {project.team && project.team.length > 0 && (
              <TeamAvatars>
                {project.team.slice(0, 4).map((member) => (
                  <Avatar
                    key={member.userId}
                    src={member.user?.avatar}
                    alt={`${member.user?.firstName} ${member.user?.lastName}`}
                  />
                ))}
                {project.team.length > 4 && (
                  <MoreAvatars>
                    +{project.team.length - 4}
                  </MoreAvatars>
                )}
              </TeamAvatars>
            )}
          </ProjectCard>
        ))}
      </ProjectsList>
    </ProjectsContainer>
  );
};