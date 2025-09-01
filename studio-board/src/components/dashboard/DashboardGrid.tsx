import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-template-rows: 1fr auto;
  gap: ${tokens.spacing.xl};
  height: calc(100vh - 120px); /* Account for header and padding */
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: ${tokens.spacing.lg};
    height: auto;
  }
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    gap: ${tokens.spacing.md};
  }
`;

const LeftPanel = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
  min-height: 0; /* Allow flex children to shrink */
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    grid-column: 1;
    grid-row: 1;
  }
`;

const RightPanel = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
  min-height: 0; /* Allow flex children to shrink */
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const ActivitySection = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    grid-column: 1;
    grid-row: 3;
  }
`;

interface DashboardGridProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  activityFeed: React.ReactNode;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  leftPanel,
  rightPanel,
  activityFeed,
}) => {
  return (
    <GridContainer>
      <LeftPanel>
        {leftPanel}
      </LeftPanel>
      <RightPanel>
        {rightPanel}
      </RightPanel>
      <ActivitySection>
        {activityFeed}
      </ActivitySection>
    </GridContainer>
  );
};