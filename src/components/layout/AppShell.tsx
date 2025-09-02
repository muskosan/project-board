import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';

const ShellContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${tokens.colors.background.primary};
  position: relative;
`;

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: ${tokens.colors.background.elevated};
  border-bottom: 1px solid ${tokens.colors.background.secondary};
  backdrop-filter: blur(8px);
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    height: 56px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-top: 64px; /* Account for fixed header */
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    padding-top: 56px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  min-height: calc(100vh - 64px);
  overflow-y: auto;
  padding: ${tokens.spacing.xl};
  background-color: #fcfcfc;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
  
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

  @media (max-width: ${tokens.breakpoints.tablet}) {
    padding: ${tokens.spacing.lg};
    min-height: calc(100vh - 56px);
  }

  @media (max-width: ${tokens.breakpoints.mobile}) {
    padding: ${tokens.spacing.md};
    
    /* Hide scrollbar on mobile for cleaner look */
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
  
  /* Touch scrolling optimization */
  -webkit-overflow-scrolling: touch;
`;

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebar,
  header,
}) => {
  return (
    <ShellContainer>
      <HeaderContainer>
        {header}
      </HeaderContainer>
      <ContentWrapper>
        {sidebar}
        <MainContent>
          {children}
        </MainContent>
      </ContentWrapper>
    </ShellContainer>
  );
};
