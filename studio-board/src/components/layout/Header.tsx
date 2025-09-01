import React from 'react';
import styled from 'styled-components';
import { Menu, Search, Bell } from 'lucide-react';
import { tokens } from '../../styles/tokens';
import { useBreakpoint } from '../../utils/responsive';

const HeaderContainer = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${tokens.spacing.xl};
  background-color: ${tokens.colors.background.elevated};
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    padding: 0 ${tokens.spacing.lg};
    height: 56px;
  }
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    padding: 0 ${tokens.spacing.md};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.lg};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    gap: ${tokens.spacing.md};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: ${tokens.touch.minTarget};
  height: ${tokens.touch.minTarget};
  border: none;
  background: none;
  color: ${tokens.colors.text.secondary};
  border-radius: ${tokens.borderRadius.md};
  cursor: pointer;
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    background-color: ${tokens.colors.background.secondary};
    color: ${tokens.colors.text.primary};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    display: flex;
  }
`;

const Logo = styled.h1`
  font-size: ${tokens.typography.sizes.xl};
  font-weight: ${tokens.typography.weights.bold};
  color: ${tokens.colors.text.primary};
  font-family: ${tokens.typography.fonts.heading};
  margin: 0;
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    font-size: ${tokens.typography.sizes.lg};
  }
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    font-size: ${tokens.typography.sizes.base};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    gap: ${tokens.spacing.sm};
  }
`;

const MobileActions = styled.div`
  display: none;
  align-items: center;
  gap: ${tokens.spacing.sm};
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    display: flex;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${tokens.touch.minTarget};
  height: ${tokens.touch.minTarget};
  border: none;
  background: none;
  color: ${tokens.colors.text.secondary};
  border-radius: ${tokens.borderRadius.md};
  cursor: pointer;
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    background-color: ${tokens.colors.background.secondary};
    color: ${tokens.colors.text.primary};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.lg};
  transition: background-color ${tokens.transitions.fast};
  cursor: pointer;

  &:hover {
    background-color: ${tokens.colors.background.secondary};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${tokens.colors.accent.primary}, ${tokens.colors.accent.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${tokens.typography.weights.medium};
  font-size: ${tokens.typography.sizes.sm};
`;

const UserName = styled.span`
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.weights.medium};
  color: ${tokens.colors.text.primary};

  @media (max-width: ${tokens.breakpoints.mobile}) {
    display: none;
  }
`;

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { isMobile, isTablet } = useBreakpoint();
  const isCompact = isMobile || isTablet;

  return (
    <HeaderContainer>
      <LeftSection>
        {isCompact && (
          <MobileMenuButton onClick={onMenuToggle} title="Open menu">
            <Menu />
          </MobileMenuButton>
        )}
        <Logo>StudioBoard</Logo>
      </LeftSection>
      <RightSection>
        {isCompact && (
          <MobileActions>
            <ActionButton title="Search">
              <Search />
            </ActionButton>
            <ActionButton title="Notifications">
              <Bell />
            </ActionButton>
          </MobileActions>
        )}
        <UserSection>
          <Avatar>JD</Avatar>
          <UserName>John Doe</UserName>
        </UserSection>
      </RightSection>
    </HeaderContainer>
  );
};
