import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';

interface ClientLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${tokens.colors.background.primary};
`;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${tokens.colors.background.elevated};
  border-bottom: 1px solid ${tokens.colors.background.secondary};
  backdrop-filter: blur(8px);
  box-shadow: ${tokens.shadows.sm};
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${tokens.colors.background.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.text.muted};
    border-radius: 3px;
    
    &:hover {
      background: ${tokens.colors.text.secondary};
    }
  }
`;

export const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  header,
  className,
}) => {
  return (
    <LayoutContainer className={className}>
      {header && (
        <HeaderContainer>
          {header}
        </HeaderContainer>
      )}
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};