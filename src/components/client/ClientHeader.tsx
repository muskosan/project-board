import React from 'react';
import styled from 'styled-components';
import { Shield, ExternalLink } from 'lucide-react';
import type { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { tokens } from '../../styles/tokens';

interface ClientHeaderProps {
  project?: Project;
  className?: string;
}

const HeaderContainer = styled.header`
  background-color: ${tokens.colors.background.elevated};
  border-bottom: 1px solid ${tokens.colors.background.secondary};
  padding: ${tokens.spacing.lg} ${tokens.spacing.xl};
  box-shadow: ${tokens.shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${tokens.spacing.md};
    align-items: flex-start;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.lg};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${tokens.spacing.sm};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const LogoText = styled.h1`
  font-size: ${tokens.typography.sizes.xl};
  font-weight: ${tokens.typography.weights.bold};
  color: ${tokens.colors.text.primary};
  font-family: ${tokens.typography.fonts.heading};
  margin: 0;
`;

const LogoSubtext = styled.span`
  font-size: ${tokens.typography.sizes.sm};
  color: ${tokens.colors.text.secondary};
  font-weight: ${tokens.typography.weights.normal};
  margin-left: ${tokens.spacing.sm};
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
`;

const ProjectName = styled.h2`
  font-size: ${tokens.typography.sizes.lg};
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.text.primary};
  margin: 0;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  flex-wrap: wrap;
`;

const StatusBadge = styled(Badge)<{ $status: string }>`
  background-color: ${({ $status }) => {
    const statusColors = {
      planning: tokens.colors.status.info,
      active: tokens.colors.status.success,
      on_hold: tokens.colors.status.warning,
      completed: tokens.colors.accent.secondary,
      cancelled: tokens.colors.status.error,
    };
    return statusColors[$status as keyof typeof statusColors] || tokens.colors.text.muted;
  }}20;
  
  color: ${({ $status }) => {
    const statusColors = {
      planning: tokens.colors.status.info,
      active: tokens.colors.status.success,
      on_hold: tokens.colors.status.warning,
      completed: tokens.colors.accent.secondary,
      cancelled: tokens.colors.status.error,
    };
    return statusColors[$status as keyof typeof statusColors] || tokens.colors.text.muted;
  }};
  
  border: 1px solid ${({ $status }) => {
    const statusColors = {
      planning: tokens.colors.status.info,
      active: tokens.colors.status.success,
      on_hold: tokens.colors.status.warning,
      completed: tokens.colors.accent.secondary,
      cancelled: tokens.colors.status.error,
    };
    return statusColors[$status as keyof typeof statusColors] || tokens.colors.text.muted;
  }}40;
`;

const ProgressBadge = styled(Badge)`
  background-color: ${tokens.colors.accent.primary}20;
  color: ${tokens.colors.accent.primary};
  border: 1px solid ${tokens.colors.accent.primary}40;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
`;

const ClientBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  background-color: ${tokens.colors.accent.secondary}20;
  color: ${tokens.colors.accent.secondary};
  border: 1px solid ${tokens.colors.accent.secondary}40;
  border-radius: ${tokens.borderRadius.md};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.weights.medium};
`;

const SecureIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
  color: ${tokens.colors.status.success};
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.weights.medium};
`;

const LastUpdated = styled.div`
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.sm};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    display: none;
  }
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

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  project,
  className,
}) => {
  return (
    <HeaderContainer className={className}>
      <HeaderContent>
        <LeftSection>
          <Logo>
            <LogoText>
              StudioBoard
              <LogoSubtext>Client Portal</LogoSubtext>
            </LogoText>
          </Logo>
          
          {project && (
            <ProjectInfo>
              <ProjectName>{project.name}</ProjectName>
              <ProjectMeta>
                <StatusBadge $status={project.status} size="sm">
                  {getStatusLabel(project.status)}
                </StatusBadge>
                <ProgressBadge size="sm">
                  {project.progress}% Complete
                </ProgressBadge>
              </ProjectMeta>
            </ProjectInfo>
          )}
        </LeftSection>
        
        <RightSection>
          <SecureIndicator>
            <Shield size={16} />
            Secure View
          </SecureIndicator>
          
          <ClientBadge>
            <ExternalLink size={14} />
            Client Access
          </ClientBadge>
          
          {project && (
            <LastUpdated>
              Last updated {formatDate(project.updatedAt)}
            </LastUpdated>
          )}
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};