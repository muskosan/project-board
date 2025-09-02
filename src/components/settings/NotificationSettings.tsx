import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import type { NotificationSettings as NotificationSettingsType } from '../../types';

const SettingsSection = styled.div`
  margin-bottom: 2rem;
`;

const SettingsGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.background.secondary};

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleInfo = styled.div`
  flex: 1;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin-left: 1rem;
`;

const ToggleSlider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.checked ? props.theme.colors.accent.primary : '#ccc'};
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: ${props => props.checked ? '27px' : '3px'};
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

const SectionDescription = styled(Typography)`
  margin-bottom: 2rem;
`;

const GroupTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

const OptionTitle = styled(Typography)`
  margin-bottom: 0.25rem;
`;

const OptionDescription = styled(Typography)`
  margin-top: 0.25rem;
`;

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className }) => {
  const [settings, setSettings] = useState<NotificationSettingsType>({
    email: true,
    push: true,
    taskUpdates: true,
    projectUpdates: true,
    mentions: true,
    deadlines: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key: keyof NotificationSettingsType) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message (would integrate with toast system)
    console.log('Notification settings saved:', settings);
  };

  const handleReset = () => {
    setSettings({
      email: true,
      push: true,
      taskUpdates: true,
      projectUpdates: true,
      mentions: true,
      deadlines: true,
    });
  };

  const notificationOptions = [
    {
      key: 'email' as const,
      title: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      key: 'push' as const,
      title: 'Push Notifications',
      description: 'Receive browser push notifications',
    },
    {
      key: 'taskUpdates' as const,
      title: 'Task Updates',
      description: 'Get notified when tasks are updated or completed',
    },
    {
      key: 'projectUpdates' as const,
      title: 'Project Updates',
      description: 'Get notified about project status changes',
    },
    {
      key: 'mentions' as const,
      title: 'Mentions',
      description: 'Get notified when someone mentions you',
    },
    {
      key: 'deadlines' as const,
      title: 'Deadlines',
      description: 'Get notified about upcoming deadlines',
    },
  ];

  return (
    <div className={className}>
      <SettingsSection>
        <Card padding="lg">
          <SectionTitle variant="h2" weight="bold" color="primary">
            Notification Preferences
          </SectionTitle>
          <SectionDescription variant="body" color="secondary">
            Choose how you want to be notified about updates and activities
          </SectionDescription>

          <SettingsGroup>
            <GroupTitle variant="h3" weight="semibold" color="primary">
              Delivery Methods
            </GroupTitle>
            
            {notificationOptions.slice(0, 2).map((option) => (
              <ToggleRow key={option.key}>
                <ToggleInfo>
                  <OptionTitle variant="body" weight="medium" color="primary">
                    {option.title}
                  </OptionTitle>
                  <OptionDescription variant="caption" color="secondary">
                    {option.description}
                  </OptionDescription>
                </ToggleInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={() => handleToggle(option.key)}
                  />
                  <ToggleSlider checked={settings[option.key]} />
                </ToggleSwitch>
              </ToggleRow>
            ))}
          </SettingsGroup>

          <SettingsGroup>
            <GroupTitle variant="h3" weight="semibold" color="primary">
              Activity Types
            </GroupTitle>
            
            {notificationOptions.slice(2).map((option) => (
              <ToggleRow key={option.key}>
                <ToggleInfo>
                  <OptionTitle variant="body" weight="medium" color="primary">
                    {option.title}
                  </OptionTitle>
                  <OptionDescription variant="caption" color="secondary">
                    {option.description}
                  </OptionDescription>
                </ToggleInfo>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={() => handleToggle(option.key)}
                  />
                  <ToggleSlider checked={settings[option.key]} />
                </ToggleSwitch>
              </ToggleRow>
            ))}
          </SettingsGroup>

          <ActionButtons>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset to Defaults
            </Button>
          </ActionButtons>
        </Card>
      </SettingsSection>
    </div>
  );
};