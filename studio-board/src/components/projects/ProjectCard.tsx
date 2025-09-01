import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import type { Project } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HoverLift } from '../ui/MicroInteractions';


interface ProjectCardProps {
  project: Project;
  variant?: 'grid' | 'list';
  onSelect?: (project: Project) => void;
  className?: string;
}

const CardContainer = styled(Card)<{ variant: 'grid' | 'list' }>`
  cursor: pointer;
  
  ${({ variant }) => variant === 'list' && css`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      flex-direction: column;
      align-items: stretch;
      padding: ${({ theme }) => theme.spacing.sm};
    }
  `}
  
  ${({ variant }) => variant === 'grid' && css`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 280px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      min-height: 240px;
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      min-height: 200px;
    }
  `}
  
  /* Touch-friendly minimum size */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: ${({ theme }) => theme.touch.minTarget};
  }
`;

const ProjectHeader = styled.div<{ variant: 'grid' | 'list' }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${({ variant }) => variant === 'list' && css`
    flex: 1;
    margin-bottom: 0;
    margin-right: ${({ theme }) => theme.spacing.lg};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      margin-right: 0;
      margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
  `}
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const ProjectInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.3;
  
  /* Truncate long titles */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProjectDescription = styled.p<{ variant: 'grid' | 'list' }>`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  line-height: 1.4;
  
  ${({ variant }) => variant === 'grid' && css`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
  
  ${({ variant }) => variant === 'list' && css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
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

const ProjectMeta = styled.div<{ variant: 'grid' | 'list' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  
  ${({ variant }) => variant === 'list' && css`
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
    min-width: 300px;
  `}
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ progress: number; color: string }>`
  height: 100%;
  background-color: ${({ color }) => color};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const TeamAvatars = styled.div<{ variant: 'grid' | 'list' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  ${({ variant }) => variant === 'list' && css`
    min-width: 120px;
  `}
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.background.elevated};
  object-fit: cover;
  
  &:not(:first-child) {
    margin-left: -8px;
  }
`;

const TeamCount = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const TagsContainer = styled.div<{ variant: 'grid' | 'list' }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: auto;
  
  ${({ variant }) => variant === 'list' && css`
    margin-top: 0;
    max-width: 200px;
  `}
`;

const Tag = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  white-space: nowrap;
`;

const DueDate = styled.div<{ variant: 'grid' | 'list' }>`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  ${({ variant }) => variant === 'list' && css`
    min-width: 100px;
    text-align: right;
  `}
`;

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

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

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'grid',
  onSelect,
  className,
}) => {
  const handleClick = () => {
    onSelect?.(project);
  };

  const visibleTeamMembers = project.team.slice(0, 3);
  const remainingCount = Math.max(0, project.team.length - 3);

  return (
    <HoverLift lift={6} scale={1.02}>
      <CardContainer
        variant={variant}
        onClick={handleClick}
        hover
        clickable
        className={className}
      >
      <ProjectHeader variant={variant}>
        <ProjectInfo>
          <ProjectTitle>{project.name}</ProjectTitle>
          <ProjectDescription variant={variant}>
            {project.description}
          </ProjectDescription>
        </ProjectInfo>
        <StatusBadge status={project.status} size="sm">
          {getStatusLabel(project.status)}
        </StatusBadge>
      </ProjectHeader>

      <ProjectMeta variant={variant}>
        <ProgressSection>
          <ProgressLabel>
            <span>Progress</span>
            <span>{project.progress}%</span>
          </ProgressLabel>
          <ProgressBarContainer>
            <ProgressFill 
              progress={project.progress} 
              color={project.color}
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            />
          </ProgressBarContainer>
        </ProgressSection>

        <TeamAvatars variant={variant}>
          {visibleTeamMembers.map((member) => (
            <Avatar
              key={member.userId}
              src={member.user?.avatar}
              alt={`${member.user?.firstName} ${member.user?.lastName}`}
              title={`${member.user?.firstName} ${member.user?.lastName}`}
            />
          ))}
          {remainingCount > 0 && (
            <TeamCount>+{remainingCount}</TeamCount>
          )}
        </TeamAvatars>

        {variant === 'grid' && (
          <TagsContainer variant={variant}>
            {project.tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {project.tags.length > 3 && (
              <Tag>+{project.tags.length - 3}</Tag>
            )}
          </TagsContainer>
        )}

        {project.dueDate && (
          <DueDate variant={variant}>
            Due {formatDate(project.dueDate)}
          </DueDate>
        )}
      </ProjectMeta>

      {variant === 'list' && project.tags.length > 0 && (
        <TagsContainer variant={variant}>
          {project.tags.slice(0, 2).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {project.tags.length > 2 && (
            <Tag>+{project.tags.length - 2}</Tag>
          )}
        </TagsContainer>
      )}
    </CardContainer>
    </HoverLift>
  );
};