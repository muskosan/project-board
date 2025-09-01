import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { NotificationSettings } from './NotificationSettings';
import { ThemeSettings } from './ThemeSettings';
import { UserManagement } from './UserManagement';
import { PermissionManagement } from './PermissionManagement';
import { TeamInvitation } from './TeamInvitation';

const SettingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SettingsHeader = styled.div`
  margin-bottom: 2rem;
`;

const SettingsTitle = styled(Typography)`
  margin-bottom: 0.5rem;
`;

const SettingsDescription = styled(Typography)`
  margin-top: 0.5rem;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SettingsNav = styled.nav`
  position: sticky;
  top: 2rem;
  height: fit-content;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<{ active?: boolean }>`
  margin-bottom: 0.5rem;
`;

const NavButton = styled.button<{ active?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: ${props => props.active ? props.theme.colors.accent.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.colors.accent.primary : props.theme.colors.background.secondary};
  }
`;

const SettingsContent = styled.div`
  min-height: 600px;
`;

type SettingsSection = 'notifications' | 'theme' | 'users' | 'permissions' | 'team';

interface SettingsProps {
  className?: string;
}

export const Settings: React.FC<SettingsProps> = ({ className }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('notifications');

  const navigationItems = [
    { id: 'notifications' as const, label: 'Notifications', icon: '🔔' },
    { id: 'theme' as const, label: 'Theme & Preferences', icon: '🎨' },
    { id: 'users' as const, label: 'User Management', icon: '👥' },
    { id: 'permissions' as const, label: 'Permissions', icon: '🔐' },
    { id: 'team' as const, label: 'Team Invitations', icon: '✉️' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'notifications':
        return <NotificationSettings />;
      case 'theme':
        return <ThemeSettings />;
      case 'users':
        return <UserManagement />;
      case 'permissions':
        return <PermissionManagement />;
      case 'team':
        return <TeamInvitation />;
      default:
        return <NotificationSettings />;
    }
  };

  return (
    <SettingsContainer className={className}>
      <SettingsHeader>
        <SettingsTitle variant="h1" weight="bold" color="primary">
          Settings
        </SettingsTitle>
        <SettingsDescription variant="body" color="secondary">
          Manage your preferences, team, and system configuration
        </SettingsDescription>
      </SettingsHeader>

      <SettingsGrid>
        <SettingsNav>
          <Card padding="md">
            <NavList>
              {navigationItems.map((item) => (
                <NavItem key={item.id}>
                  <NavButton
                    active={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                    {item.label}
                  </NavButton>
                </NavItem>
              ))}
            </NavList>
          </Card>
        </SettingsNav>

        <SettingsContent>
          {renderContent()}
        </SettingsContent>
      </SettingsGrid>
    </SettingsContainer>
  );
};