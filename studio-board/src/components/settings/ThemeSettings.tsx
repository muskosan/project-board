import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

import type { UserPreferences } from '../../types';

const SettingsSection = styled.div`
  margin-bottom: 2rem;
`;

const SettingsGroup = styled.div`
  margin-bottom: 2rem;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const ThemeCard = styled.div<{ selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? props.theme.colors.accent.primary : props.theme.colors.background.secondary};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.background.elevated};

  &:hover {
    border-color: ${props => props.selected ? props.theme.colors.accent.primary : props.theme.colors.accent.secondary};
  }
`;

const ThemePreview = styled.div<{ theme: 'light' | 'dark' }>`
  height: 60px;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  background: ${props => props.theme === 'light' ? '#FAF9F7' : '#1A1A1A'};
  border: 1px solid ${props => props.theme === 'light' ? '#E5E5E5' : '#333'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 12px;
    background: ${props => props.theme === 'light' ? '#FFFFFF' : '#2A2A2A'};
    border-bottom: 1px solid ${props => props.theme === 'light' ? '#E5E5E5' : '#333'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 8px;
    width: 40px;
    height: 8px;
    background: ${props => props.theme === 'light' ? '#D2691E' : '#5F9EA0'};
    border-radius: 2px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SelectField = styled.div`
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.background.secondary};
  border-radius: 0.5rem;
  background: ${props => props.theme.colors.background.elevated};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent.primary};
  }
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

const ThemeTitle = styled(Typography)`
  margin-bottom: 0.25rem;
`;

const ThemeDescription = styled(Typography)`
  margin-top: 0.25rem;
`;

const LabelText = styled(Typography)`
  margin-bottom: 0.5rem;
  display: block;
`;

interface ThemeSettingsProps {
  className?: string;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ className }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      taskUpdates: true,
      projectUpdates: true,
      mentions: true,
      deadlines: true,
    },
    timezone: 'America/New_York',
    language: 'en',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setPreferences(prev => ({
      ...prev,
      theme
    }));
  };

  const handleTimezoneChange = (timezone: string) => {
    setPreferences(prev => ({
      ...prev,
      timezone
    }));
  };

  const handleLanguageChange = (language: string) => {
    setPreferences(prev => ({
      ...prev,
      language
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message (would integrate with toast system)
    console.log('Theme preferences saved:', preferences);
  };

  const handleReset = () => {
    setPreferences({
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        taskUpdates: true,
        projectUpdates: true,
        mentions: true,
        deadlines: true,
      },
      timezone: 'America/New_York',
      language: 'en',
    });
  };

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
  ];

  return (
    <div className={className}>
      <SettingsSection>
        <Card padding="lg">
          <SectionTitle variant="h2" weight="bold" color="primary">
            Theme & Appearance
          </SectionTitle>
          <SectionDescription variant="body" color="secondary">
            Customize the look and feel of your workspace
          </SectionDescription>

          <SettingsGroup>
            <GroupTitle variant="h3" weight="semibold" color="primary">
              Color Theme
            </GroupTitle>
            
            <ThemeGrid>
              <ThemeCard
                selected={preferences.theme === 'light'}
                onClick={() => handleThemeChange('light')}
              >
                <ThemePreview theme="light" />
                <ThemeTitle variant="body" weight="medium" color="primary">
                  Light Theme
                </ThemeTitle>
                <ThemeDescription variant="caption" color="secondary">
                  Clean and bright interface
                </ThemeDescription>
              </ThemeCard>

              <ThemeCard
                selected={preferences.theme === 'dark'}
                onClick={() => handleThemeChange('dark')}
              >
                <ThemePreview theme="dark" />
                <ThemeTitle variant="body" weight="medium" color="primary">
                  Dark Theme
                </ThemeTitle>
                <ThemeDescription variant="caption" color="secondary">
                  Easy on the eyes
                </ThemeDescription>
              </ThemeCard>
            </ThemeGrid>
          </SettingsGroup>

          <SettingsGroup>
            <GroupTitle variant="h3" weight="semibold" color="primary">
              Localization
            </GroupTitle>
            
            <FormRow>
              <SelectField>
                <LabelText variant="label" weight="medium" color="primary">
                  Timezone
                </LabelText>
                <Select
                  value={preferences.timezone}
                  onChange={(e) => handleTimezoneChange(e.target.value)}
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </Select>
              </SelectField>

              <SelectField>
                <LabelText variant="label" weight="medium" color="primary">
                  Language
                </LabelText>
                <Select
                  value={preferences.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </Select>
              </SelectField>
            </FormRow>
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