import React from 'react';
import styled from 'styled-components';
import { Calendar, Users, Target, Clock, DollarSign } from 'lucide-react';
import type { Project, Task, User } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Heading, Text, Label } from '../ui/Typography';
import { tokens } from '../../styles/tokens';

interface ClientProjectSummaryProps {
  project: Project;
  tasks: Task[];
  users: User[];
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
`;

const SummaryCard = styled(Card)`
  padding: ${tokens.spacing.xl};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
  
  &:not(:last-child) {
    margin-bottom: ${tokens.spacing.xl};
    padding-bottom: ${tokens.spacing.xl};
    border-bottom: 1px solid ${tokens.colors.background.secondary};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  margin-bottom: ${tokens.spacing.md};
`;

const SectionIcon = styled.div`
  color: ${tokens.colors.accent.primary};
`;

const SectionTitle = styled(Heading)`
  margin: 0;
  color: ${tokens.colors.text.primary};
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressValue = styled.div`
  font-size: ${tokens.typography.sizes.xl};
  font-weight: ${tokens.typography.weights.bold};
  color: ${tokens.colors.accent.primary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${tokens.colors.background.secondary};
  border-radius: ${tokens.borderRadius.md};
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ $progress: number; $color: string }>`
  height: 100%;
  background: linear-gradient(90deg, ${({ $color }) => $color}, ${({ $color }) => $color}dd);
  width: ${({ $progress }) => $progress}%;
  transition: width ${tokens.transitions.slow};
  border-radius: ${tokens.borderRadius.md};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${tokens.spacing.md};
`;

const StatCard = styled.div`
  padding: ${tokens.spacing.lg};
  background: linear-gradient(135deg, ${tokens.colors.background.secondary}, ${tokens.colors.background.elevated});
  border-radius: ${tokens.borderRadius.lg};
  text-align: center;
  border: 1px solid ${tokens.colors.background.secondary};
  transition: transform ${tokens.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: ${tokens.typography.sizes['2xl']};
  font-weight: ${tokens.typography.weights.bold};
  color: ${tokens.colors.text.primary};
  margin-bottom: ${tokens.spacing.xs};
`;

const StatLabel = styled(Label)`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.weights.medium};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${tokens.spacing.lg};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
`;

const InfoLabel = styled(Label)`
  color: ${tokens.colors.text.secondary};
  font-weight: ${tokens.typography.weights.medium};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
`;

const InfoValue = styled(Text)`
  color: ${tokens.colors.text.primary};
  font-weight: ${tokens.typography.weights.semibold};
  font-size: ${tokens.typography.sizes.base};
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${tokens.spacing.md};
`;

const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.lg};
  background: linear-gradient(135deg, ${tokens.colors.background.secondary}, ${tokens.colors.background.elevated});
  border: 1px solid ${tokens.colors.background.secondary};
  transition: transform ${tokens.transitions.fast};
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${tokens.colors.background.elevated};
`;

const MemberInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
`;

const MemberName = styled(Text)`
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.text.primary};
  margin: 0;
`;

const MemberRole = styled(Label)`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.xs};
  text-transform: capitalize;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacing.xs};
`;

const Tag = styled(Badge)`
  background-color: ${tokens.colors.accent.primary}15;
  color: ${tokens.colors.accent.primary};
  border: 1px solid ${tokens.colors.accent.primary}30;
`;

const Description = styled(Text)`
  color: ${tokens.colors.text.secondary};
  line-height: 1.6;
  font-size: ${tokens.typography.sizes.base};
`;

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
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

const calculateDaysRemaining = (dueDate: Date): number => {
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const ClientProjectSummary: React.FC<ClientProjectSummaryProps> = ({
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

  const daysRemaining = project.dueDate ? calculateDaysRemaining(project.dueDate) : null;

  return (
    <Container className={className}>
      <SummaryCard>
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Target size={20} />
            </SectionIcon>
            <SectionTitle level={2} size="lg">
              Project Progress
            </SectionTitle>
          </SectionHeader>
          
          <ProgressSection>
            <ProgressHeader>
              <Label>Overall Completion</Label>
              <ProgressValue>{project.progress}%</ProgressValue>
            </ProgressHeader>
            <ProgressBar>
              <ProgressFill $progress={project.progress} $color={project.color} />
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
              <StatValue>{taskStats.todo + taskStats.review}</StatValue>
              <StatLabel>Remaining</StatLabel>
            </StatCard>
          </StatsGrid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionIcon>
              <Calendar size={20} />
            </SectionIcon>
            <SectionTitle level={2} size="lg">
              Project Timeline
            </SectionTitle>
          </SectionHeader>
          
          <InfoGrid>
            <InfoItem>
              <InfoLabel>
                <Calendar size={16} />
                Start Date
              </InfoLabel>
              <InfoValue>{formatDate(project.startDate)}</InfoValue>
            </InfoItem>
            
            {project.dueDate && (
              <InfoItem>
                <InfoLabel>
                  <Target size={16} />
                  Due Date
                </InfoLabel>
                <InfoValue>{formatDate(project.dueDate)}</InfoValue>
              </InfoItem>
            )}
            
            {daysRemaining !== null && (
              <InfoItem>
                <InfoLabel>
                  <Clock size={16} />
                  Days Remaining
                </InfoLabel>
                <InfoValue>
                  {daysRemaining > 0 ? `${daysRemaining} days` : 
                   daysRemaining === 0 ? 'Due today' : 
                   `${Math.abs(daysRemaining)} days overdue`}
                </InfoValue>
              </InfoItem>
            )}
            
            {project.budget && (
              <InfoItem>
                <InfoLabel>
                  <DollarSign size={16} />
                  Budget
                </InfoLabel>
                <InfoValue>{formatCurrency(project.budget)}</InfoValue>
              </InfoItem>
            )}
          </InfoGrid>

          {timeStats.totalEstimated > 0 && (
            <InfoGrid>
              <InfoItem>
                <InfoLabel>
                  <Clock size={16} />
                  Estimated Hours
                </InfoLabel>
                <InfoValue>{timeStats.totalEstimated}h</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <Clock size={16} />
                  Hours Logged
                </InfoLabel>
                <InfoValue>{timeStats.totalActual}h</InfoValue>
              </InfoItem>
            </InfoGrid>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionIcon>
              <Users size={20} />
            </SectionIcon>
            <SectionTitle level={2} size="lg">
              Project Team
            </SectionTitle>
          </SectionHeader>
          
          <TeamGrid>
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
          </TeamGrid>
        </Section>

        {project.tags.length > 0 && (
          <Section>
            <SectionTitle level={2} size="lg">
              Project Tags
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
          <SectionTitle level={2} size="lg">
            Project Description
          </SectionTitle>
          
          <Description>
            {project.description}
          </Description>
        </Section>
      </SummaryCard>
    </Container>
  );
};