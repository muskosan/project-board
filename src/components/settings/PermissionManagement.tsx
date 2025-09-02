import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
const SettingsSection = styled.div`
  margin-bottom: 2rem;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const RoleCard = styled(Card)<{ roleColor: string }>`
  border-left: 4px solid ${props => props.roleColor};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const RoleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RoleTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RoleIcon = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const PermissionList = styled.div`
  margin-top: 1rem;
`;

const PermissionGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const PermissionGroupTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const PermissionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.background.secondary};

  &:last-child {
    border-bottom: none;
  }
`;

const PermissionInfo = styled.div`
  flex: 1;
`;

const PermissionName = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.primary};
`;

const PermissionDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const PermissionToggle = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
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
  border-radius: 20px;

  &:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: ${props => props.checked ? '23px' : '3px'};
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

const MatrixTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

const MatrixDescription = styled(Typography)`
  margin-bottom: 1rem;
`;

const PermissionMatrix = styled.div`
  margin-top: 2rem;
`;

const MatrixTable = styled.div`
  border: 1px solid ${props => props.theme.colors.background.secondary};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const MatrixHeader = styled.div`
  display: grid;
  grid-template-columns: 200px repeat(4, 1fr);
  background: ${props => props.theme.colors.background.secondary};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};

  @media (max-width: 768px) {
    grid-template-columns: 150px repeat(4, 1fr);
  }
`;

const MatrixHeaderCell = styled.div`
  padding: 1rem;
  text-align: center;
  border-right: 1px solid ${props => props.theme.colors.background.secondary};

  &:first-child {
    text-align: left;
  }

  &:last-child {
    border-right: none;
  }
`;

const MatrixRow = styled.div`
  display: grid;
  grid-template-columns: 200px repeat(4, 1fr);
  border-bottom: 1px solid ${props => props.theme.colors.background.secondary};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 150px repeat(4, 1fr);
  }
`;

const MatrixCell = styled.div`
  padding: 1rem;
  text-align: center;
  border-right: 1px solid ${props => props.theme.colors.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;

  &:first-child {
    text-align: left;
    justify-content: flex-start;
    font-weight: 500;
  }

  &:last-child {
    border-right: none;
  }
`;

const CheckIcon = styled.div<{ allowed: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.allowed ? props.theme.colors.status.success : props.theme.colors.status.error};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;

  &::after {
    content: '${props => props.allowed ? '✓' : '✗'}';
  }
`;

interface PermissionManagementProps {
  className?: string;
}

interface RolePermissions {
  [key: string]: {
    [permission: string]: boolean;
  };
}

export const PermissionManagement: React.FC<PermissionManagementProps> = ({ className }) => {
  const [permissions, setPermissions] = useState<RolePermissions>({
    admin: {
      'projects.create': true,
      'projects.edit': true,
      'projects.delete': true,
      'projects.view': true,
      'tasks.create': true,
      'tasks.edit': true,
      'tasks.delete': true,
      'tasks.view': true,
      'files.upload': true,
      'files.download': true,
      'files.delete': true,
      'files.view': true,
      'users.create': true,
      'users.edit': true,
      'users.delete': true,
      'users.view': true,
      'settings.manage': true,
    },
    manager: {
      'projects.create': true,
      'projects.edit': true,
      'projects.delete': false,
      'projects.view': true,
      'tasks.create': true,
      'tasks.edit': true,
      'tasks.delete': true,
      'tasks.view': true,
      'files.upload': true,
      'files.download': true,
      'files.delete': true,
      'files.view': true,
      'users.create': false,
      'users.edit': true,
      'users.delete': false,
      'users.view': true,
      'settings.manage': false,
    },
    member: {
      'projects.create': false,
      'projects.edit': false,
      'projects.delete': false,
      'projects.view': true,
      'tasks.create': true,
      'tasks.edit': true,
      'tasks.delete': false,
      'tasks.view': true,
      'files.upload': true,
      'files.download': true,
      'files.delete': false,
      'files.view': true,
      'users.create': false,
      'users.edit': false,
      'users.delete': false,
      'users.view': true,
      'settings.manage': false,
    },
    client: {
      'projects.create': false,
      'projects.edit': false,
      'projects.delete': false,
      'projects.view': true,
      'tasks.create': false,
      'tasks.edit': false,
      'tasks.delete': false,
      'tasks.view': true,
      'files.upload': false,
      'files.download': true,
      'files.delete': false,
      'files.view': true,
      'users.create': false,
      'users.edit': false,
      'users.delete': false,
      'users.view': false,
      'settings.manage': false,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const roleConfig = {
    admin: { color: '#EF4444', icon: '👑', name: 'Administrator' },
    manager: { color: '#F59E0B', icon: '👨‍💼', name: 'Manager' },
    member: { color: '#3B82F6', icon: '👤', name: 'Member' },
    client: { color: '#10B981', icon: '🤝', name: 'Client' },
  };

  const permissionGroups = {
    'Projects': ['projects.create', 'projects.edit', 'projects.delete', 'projects.view'],
    'Tasks': ['tasks.create', 'tasks.edit', 'tasks.delete', 'tasks.view'],
    'Files': ['files.upload', 'files.download', 'files.delete', 'files.view'],
    'Users': ['users.create', 'users.edit', 'users.delete', 'users.view'],
    'Settings': ['settings.manage'],
  };

  const permissionLabels = {
    'projects.create': { name: 'Create Projects', description: 'Create new projects' },
    'projects.edit': { name: 'Edit Projects', description: 'Modify project details' },
    'projects.delete': { name: 'Delete Projects', description: 'Remove projects permanently' },
    'projects.view': { name: 'View Projects', description: 'Access project information' },
    'tasks.create': { name: 'Create Tasks', description: 'Add new tasks to projects' },
    'tasks.edit': { name: 'Edit Tasks', description: 'Modify task details and status' },
    'tasks.delete': { name: 'Delete Tasks', description: 'Remove tasks permanently' },
    'tasks.view': { name: 'View Tasks', description: 'Access task information' },
    'files.upload': { name: 'Upload Files', description: 'Add files to projects' },
    'files.download': { name: 'Download Files', description: 'Download project files' },
    'files.delete': { name: 'Delete Files', description: 'Remove files permanently' },
    'files.view': { name: 'View Files', description: 'Access file listings' },
    'users.create': { name: 'Create Users', description: 'Add new team members' },
    'users.edit': { name: 'Edit Users', description: 'Modify user profiles and roles' },
    'users.delete': { name: 'Delete Users', description: 'Remove users from system' },
    'users.view': { name: 'View Users', description: 'Access user information' },
    'settings.manage': { name: 'Manage Settings', description: 'Access system configuration' },
  };

  const handlePermissionToggle = (role: string, permission: string) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('Permissions saved:', permissions);
  };

  const handleReset = () => {
    // Reset to default permissions
    setPermissions({
      admin: Object.keys(permissionLabels).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      manager: Object.keys(permissionLabels).reduce((acc, key) => ({ 
        ...acc, 
        [key]: !['projects.delete', 'users.create', 'users.delete', 'settings.manage'].includes(key)
      }), {}),
      member: Object.keys(permissionLabels).reduce((acc, key) => ({ 
        ...acc, 
        [key]: ['projects.view', 'tasks.create', 'tasks.edit', 'tasks.view', 'files.upload', 'files.download', 'files.view', 'users.view'].includes(key)
      }), {}),
      client: Object.keys(permissionLabels).reduce((acc, key) => ({ 
        ...acc, 
        [key]: ['projects.view', 'tasks.view', 'files.download', 'files.view'].includes(key)
      }), {}),
    });
  };

  return (
    <div className={className}>
      <SettingsSection>
        <Card padding="lg">
          <SectionTitle variant="h2" weight="bold" color="primary">
            Permission Management
          </SectionTitle>
          <SectionDescription variant="body" color="secondary">
            Configure role-based access control for different user types
          </SectionDescription>

          <RoleGrid>
            {Object.entries(roleConfig).map(([role, config]) => (
              <RoleCard key={role} roleColor={config.color} padding="lg">
                <RoleHeader>
                  <RoleTitle>
                    <RoleIcon color={config.color}>
                      {config.icon}
                    </RoleIcon>
                    <div>
                      <Typography variant="h3" weight="bold" color="primary">
                        {config.name}
                      </Typography>
                      <Typography variant="body" color="secondary">
                        {role.charAt(0).toUpperCase() + role.slice(1)} role permissions
                      </Typography>
                    </div>
                  </RoleTitle>
                </RoleHeader>

                <PermissionList>
                  {Object.entries(permissionGroups).map(([groupName, groupPermissions]) => (
                    <PermissionGroup key={groupName}>
                      <PermissionGroupTitle>{groupName}</PermissionGroupTitle>
                      {groupPermissions.map((permission) => (
                        <PermissionItem key={permission}>
                          <PermissionInfo>
                            <PermissionName>
                              {permissionLabels[permission as keyof typeof permissionLabels].name}
                            </PermissionName>
                            <PermissionDescription>
                              {permissionLabels[permission as keyof typeof permissionLabels].description}
                            </PermissionDescription>
                          </PermissionInfo>
                          <PermissionToggle>
                            <ToggleInput
                              type="checkbox"
                              checked={permissions[role]?.[permission] || false}
                              onChange={() => handlePermissionToggle(role, permission)}
                            />
                            <ToggleSlider checked={permissions[role]?.[permission] || false} />
                          </PermissionToggle>
                        </PermissionItem>
                      ))}
                    </PermissionGroup>
                  ))}
                </PermissionList>
              </RoleCard>
            ))}
          </RoleGrid>

          <PermissionMatrix>
            <MatrixTitle variant="h3" weight="bold" color="primary">
              Permission Matrix
            </MatrixTitle>
            <MatrixDescription variant="body" color="secondary">
              Quick overview of all permissions across roles
            </MatrixDescription>

            <MatrixTable>
              <MatrixHeader>
                <MatrixHeaderCell>Permission</MatrixHeaderCell>
                <MatrixHeaderCell>Admin</MatrixHeaderCell>
                <MatrixHeaderCell>Manager</MatrixHeaderCell>
                <MatrixHeaderCell>Member</MatrixHeaderCell>
                <MatrixHeaderCell>Client</MatrixHeaderCell>
              </MatrixHeader>

              {Object.entries(permissionLabels).map(([permission, label]) => (
                <MatrixRow key={permission}>
                  <MatrixCell>
                    <div>
                      <div style={{ fontWeight: '500' }}>{label.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6B6B6B', marginTop: '0.25rem' }}>
                        {label.description}
                      </div>
                    </div>
                  </MatrixCell>
                  <MatrixCell>
                    <CheckIcon allowed={permissions.admin?.[permission] || false} />
                  </MatrixCell>
                  <MatrixCell>
                    <CheckIcon allowed={permissions.manager?.[permission] || false} />
                  </MatrixCell>
                  <MatrixCell>
                    <CheckIcon allowed={permissions.member?.[permission] || false} />
                  </MatrixCell>
                  <MatrixCell>
                    <CheckIcon allowed={permissions.client?.[permission] || false} />
                  </MatrixCell>
                </MatrixRow>
              ))}
            </MatrixTable>
          </PermissionMatrix>

          <ActionButtons>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Permissions'}
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