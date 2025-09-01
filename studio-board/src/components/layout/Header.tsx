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
  padding: 0 ${tokens.spacing[6]};
  background-color: ${tokens.colors.background.elevated};
  border-bottom: 1px solid ${tokens.colors.border.light};
  box-shadow: ${tokens.shadows.sm};
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    padding: 0 ${tokens.spacing[4]};
    height: 56px;
  }
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    padding: 0 ${tokens.spacing[4]};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[6]};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    gap: ${tokens.spacing[4]};
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
  transition: ${tokens.transitions.colors};
  
  &:hover {
    background-color: ${tokens.colors.interactive.secondaryHover};
    color: ${tokens.colors.text.primary};
  }
  
  &:active {
    background-color: ${tokens.colors.interactive.secondaryActive};
    transform: scale(0.95);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadows.focus};
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
  gap: ${tokens.spacing[3]};
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    gap: ${tokens.spacing[2]};
  }
`;

const MobileActions = styled.div`
  display: none;
  align-items: center;
  gap: ${tokens.spacing[1]};
  
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
  transition: ${tokens.transitions.colors};
  
  &:hover {
    background-color: ${tokens.colors.interactive.secondaryHover};
    color: ${tokens.colors.text.primary};
  }
  
  &:active {
    background-color: ${tokens.colors.interactive.secondaryActive};
    transform: scale(0.95);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadows.focus};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing[3]};
  padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
  border-radius: ${tokens.borderRadius.lg};
  transition: ${tokens.transitions.colors};
  cursor: pointer;

  &:hover {
    background-color: ${tokens.colors.interactive.secondaryHover};
  }
  
  &:active {
    background-color: ${tokens.colors.interactive.secondaryActive};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadows.focus};
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
