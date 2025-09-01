import React from 'react';
import styled from 'styled-components';
import type { Project, Task, User } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Heading, Text, Label } from '../ui/Typography';

interface ProjectOverviewProps {
  project: Project;
  tasks: Task[];
  users: User[];
  className?: string;
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const OverviewCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  }
`;

const SectionTitle = styled(Heading)`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number; color: string }>`
  height: 100%;
  background-color: ${({ color }) => color};
  width: ${({ progress }) => progress}%;
  transition: width ${({ theme }) => theme.transitions.normal};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatCard = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const InfoLabel = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const InfoValue = styled(Text)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const MemberInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MemberName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const MemberRole = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  text-transform: capitalize;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Tag = styled(Badge)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.text.muted};
`;

const ClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ClientAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ClientDetails = styled.div`
  flex: 1;
`;

const ClientName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const ClientCompany = styled(Label)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getRoleLabel = (role: string): string => {
  const labels = {
    lead: 'Project Lead',
    member: 'Team Member',
    viewer: 'Viewer',
  };
  return labels[role as keyof typeof labels] || role;
};

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  tasks,
  className,
}) => {
  // Calculate task statistics
  const taskStats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'done').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const todo = tasks.filter(task => task.status === 'todo').length;
    const review = tasks.filter(task => task.status === 'review').length;
    
    return { total, completed, inProgress, todo, review };
  }, [tasks]);

  // Calculate time statistics
  const timeStats = React.useMemo(() => {
    const totalEstimated = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    const totalActual = tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
    
    return { totalEstimated, totalActual };
  }, [tasks]);

  return (
    <Container className={className}>
      <OverviewCard>
        <Section>
          <SectionTitle level={3} size="lg">
            Project Progress
          </SectionTitle>
          
          <ProgressSection>
            <ProgressHeader>
              <Label>Overall Progress</Label>
              <Text weight="medium">{project.progress}%</Text>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill progress={project.progress} color={project.color} />
            </ProgressBar>
          </ProgressSection>

          <StatsGrid>
            <StatCard>
              <StatValue>{taskStats.total}</StatValue>
              <StatLabel>Total Tasks</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{taskStats.completed}</StatValue>
              <StatLabel>Completed</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{taskStats.inProgress}</StatValue>
              <StatLabel>In Progress</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{taskStats.todo}</StatValue>
              <StatLabel>To Do</StatLabel>
            </StatCard>
          </StatsGrid>
        </Section>

        <Section>
          <SectionTitle level={3} size="lg">
            Project Details
          </SectionTitle>
          
          <InfoRow>
            <InfoLabel>Start Date</InfoLabel>
            <InfoValue>{formatDate(project.startDate)}</InfoValue>
          </InfoRow>
          
          {project.dueDate && (
            <InfoRow>
              <InfoLabel>Due Date</InfoLabel>
              <InfoValue>{formatDate(project.dueDate)}</InfoValue>
            </InfoRow>
          )}
          
          {project.budget && (
            <InfoRow>
              <InfoLabel>Budget</InfoLabel>
              <InfoValue>{formatCurrency(project.budget)}</InfoValue>
            </InfoRow>
          )}
          
          <InfoRow>
            <InfoLabel>Priority</InfoLabel>
            <InfoValue>
              {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
            </InfoValue>
          </InfoRow>

          {timeStats.totalEstimated > 0 && (
            <>
              <InfoRow>
                <InfoLabel>Estimated Hours</InfoLabel>
                <InfoValue>{timeStats.totalEstimated}h</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Actual Hours</InfoLabel>
                <InfoValue>{timeStats.totalActual}h</InfoValue>
              </InfoRow>
            </>
          )}
        </Section>

        {project.client && (
          <Section>
            <SectionTitle level={3} size="lg">
              Client
            </SectionTitle>
            
            <ClientInfo>
              <ClientAvatar
                src={project.client.avatar}
                alt={project.client.name}
              />
              <ClientDetails>
                <ClientName>{project.client.name}</ClientName>
                <ClientCompany>{project.client.company}</ClientCompany>
              </ClientDetails>
            </ClientInfo>
          </Section>
        )}

        <Section>
          <SectionTitle level={3} size="lg">
            Team Members
          </SectionTitle>
          
          <TeamSection>
            {project.team.map((member) => (
              <TeamMember key={member.userId}>
                <Avatar
                  src={member.user?.avatar}
                  alt={`${member.user?.firstName} ${member.user?.lastName}`}
                />
                <MemberInfo>
                  <MemberName>
                    {member.user?.firstName} {member.user?.lastName}
                  </MemberName>
                  <MemberRole>{getRoleLabel(member.role)}</MemberRole>
                </MemberInfo>
              </TeamMember>
            ))}
          </TeamSection>
        </Section>

        {project.tags.length > 0 && (
          <Section>
            <SectionTitle level={3} size="lg">
              Tags
            </SectionTitle>
            
            <TagsContainer>
              {project.tags.map((tag) => (
                <Tag key={tag} size="sm">
                  {tag}
                </Tag>
              ))}
            </TagsContainer>
          </Section>
        )}

        <Section>
          <SectionTitle level={3} size="lg">
            Description
          </SectionTitle>
          
          <Text color="secondary">
            {project.description}
          </Text>
        </Section>
      </OverviewCard>
    </Container>
  );
};