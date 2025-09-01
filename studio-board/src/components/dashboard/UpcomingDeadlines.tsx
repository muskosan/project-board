import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';
import type { Project } from '../../types';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';

const DeadlinesContainer = styled(Card)`
  padding: ${tokens.spacing.xl};
`;

const DeadlinesHeader = styled.div`
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

const DeadlinesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
`;

const DeadlineItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.md};
  transition: background-color 150ms ease;
  cursor: pointer;
  
  &:hover {
    background-color: ${tokens.colors.background.secondary};
  }
`;

const DateColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.md};
  background-color: ${tokens.colors.background.secondary};
`;

const DateDay = styled(Typography)`
  font-weight: 700;
  font-size: ${tokens.typography.sizes.lg};
  line-height: 1;
`;

const DateMonth = styled(Typography)`
  font-size: ${tokens.typography.sizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
`;

const DeadlineContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const DeadlineTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: ${tokens.spacing.xs};
`;

const DeadlineMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  flex-wrap: wrap;
`;

const ProjectBadge = styled.span<{ color: string }>`
  background-color: ${props => props.color};
  color: white;
  padding: 2px 8px;
  border-radius: ${tokens.borderRadius.sm};
  font-size: ${tokens.typography.sizes.xs};
  font-weight: 500;
`;

const UrgencyIndicator = styled.div<{ urgency: 'overdue' | 'urgent' | 'soon' | 'normal' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.urgency) {
      case 'overdue': return tokens.colors.status.error;
      case 'urgent': return tokens.colors.status.warning;
      case 'soon': return tokens.colors.accent.primary;
      default: return tokens.colors.status.success;
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${tokens.spacing.xl};
  color: ${tokens.colors.text.muted};
`;

interface DeadlineItemType {
  id: string;
  title: string;
  dueDate: Date;
  project?: Project;
  type: 'task' | 'project' | 'milestone';
}

interface UpcomingDeadlinesProps {
  deadlines: DeadlineItemType[];
  onDeadlineClick?: (deadline: DeadlineItemType) => void;
  onViewAll?: () => void;
}

const formatDate = (date: Date): { day: string; month: string } => {
  const day = date.getDate().toString();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return { day, month };
};

const getUrgency = (dueDate: Date): 'overdue' | 'urgent' | 'soon' | 'normal' => {
  const now = new Date();
  const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) return 'overdue';
  if (diffInDays <= 1) return 'urgent';
  if (diffInDays <= 3) return 'soon';
  return 'normal';
};

const getUrgencyText = (dueDate: Date): string => {
  const now = new Date();
  const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    const overdueDays = Math.abs(diffInDays);
    return `${overdueDays} day${overdueDays === 1 ? '' : 's'} overdue`;
  }
  if (diffInDays === 0) return 'Due today';
  if (diffInDays === 1) return 'Due tomorrow';
  if (diffInDays <= 7) return `Due in ${diffInDays} days`;
  
  return dueDate.toLocaleDateString();
};



export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  deadlines,
  onDeadlineClick,
  onViewAll,
}) => {
  // Sort deadlines by due date
  const sortedDeadlines = [...deadlines].sort((a, b) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  );

  if (sortedDeadlines.length === 0) {
    return (
      <DeadlinesContainer>
        <DeadlinesHeader>
          <Typography variant="h3" weight="medium">
            Upcoming Deadlines
          </Typography>
        </DeadlinesHeader>
        <EmptyState>
          <Typography variant="body" color="muted">
            No upcoming deadlines
          </Typography>
        </EmptyState>
      </DeadlinesContainer>
    );
  }

  return (
    <DeadlinesContainer>
      <DeadlinesHeader>
        <Typography variant="h3" weight="medium">
          Upcoming Deadlines
        </Typography>
        {onViewAll && (
          <ViewAllButton onClick={onViewAll}>
            View All
          </ViewAllButton>
        )}
      </DeadlinesHeader>
      
      <DeadlinesList>
        {sortedDeadlines.map((deadline) => {
          const { day, month } = formatDate(deadline.dueDate);
          const urgency = getUrgency(deadline.dueDate);
          
          return (
            <DeadlineItem
              key={deadline.id}
              onClick={() => onDeadlineClick?.(deadline)}
            >
              <DateColumn>
                <DateDay variant="body" weight="bold">
                  {day}
                </DateDay>
                <DateMonth variant="caption" color="secondary">
                  {month}
                </DateMonth>
              </DateColumn>
              
              <DeadlineContent>
                <DeadlineTitle variant="body">
                  {deadline.title}
                </DeadlineTitle>
                <DeadlineMeta>
                  <UrgencyIndicator urgency={urgency} />
                  <Typography 
                    variant="caption" 
                    color={urgency === 'overdue' ? 'error' : 'secondary'}
                  >
                    {getUrgencyText(deadline.dueDate)}
                  </Typography>
                  {deadline.project && (
                    <ProjectBadge color={deadline.project.color}>
                      {deadline.project.name}
                    </ProjectBadge>
                  )}
                </DeadlineMeta>
              </DeadlineContent>
            </DeadlineItem>
          );
        })}
      </DeadlinesList>
    </DeadlinesContainer>
  );
};