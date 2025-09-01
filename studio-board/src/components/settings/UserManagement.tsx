import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import type { User, UserRole } from '../../types';
import { generateMockUsers } from '../../utils/mockData';

const SettingsSection = styled.div`
  margin-bottom: 2rem;
`;

const SearchAndActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
`;

const UserTable = styled.div`
  border: 1px solid ${props => props.theme.colors.background.secondary};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const UserTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 120px 100px 120px;
  padding: 1rem;
  background: ${props => props.theme.colors.background.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.background.secondary};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};

  @media (max-width: 768px) {
    grid-template-columns: 1fr 80px 80px;
    
    & > div:nth-child(4),
    & > div:nth-child(5) {
      display: none;
    }
  }
`;

const UserTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 120px 100px 120px;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.background.secondary};
  align-items: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background.secondary};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 80px 80px;
    
    & > div:nth-child(4),
    & > div:nth-child(5) {
      display: none;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserDetails = styled.div`
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoleSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.background.secondary};
  border-radius: 0.25rem;
  background: ${props => props.theme.colors.background.elevated};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.75rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent.primary};
  }
`;

const StatusBadge = styled(Badge)<{ status: 'active' | 'inactive' | 'pending' }>`
  background: ${props => {
    switch (props.status) {
      case 'active': return props.theme.colors.status.success;
      case 'inactive': return props.theme.colors.status.error;
      case 'pending': return props.theme.colors.status.warning;
      default: return props.theme.colors.status.info;
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'danger' }>`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  background: ${props => props.variant === 'danger' ? props.theme.colors.status.error : props.theme.colors.accent.primary};
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem 0;
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

const SectionDescription = styled(Typography)`
  margin-bottom: 2rem;
`;

interface UserManagementProps {
  className?: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ className }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    // Simulate loading users
    const loadUsers = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUsers = generateMockUsers(25);
      setUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleDeactivateUser = (userId: string) => {
    // In a real app, this would make an API call
    console.log('Deactivating user:', userId);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };



  const getStatusFromRole = (role: UserRole): 'active' | 'inactive' | 'pending' => {
    // Simple logic for demo - in real app this would be a separate field
    return role === 'client' ? 'pending' : 'active';
  };

  if (isLoading) {
    return (
      <div className={className}>
        <Card padding="lg">
          <Typography variant="body" color="secondary">
            Loading users...
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <SettingsSection>
        <Card padding="lg">
          <SectionTitle variant="h2" weight="bold" color="primary">
            User Management
          </SectionTitle>
          <SectionDescription variant="body" color="secondary">
            Manage team members, roles, and access permissions
          </SectionDescription>

          <SearchAndActions>
            <SearchContainer>
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
            <Button variant="primary">
              Add New User
            </Button>
          </SearchAndActions>

          {paginatedUsers.length === 0 ? (
            <EmptyState>
              <Typography variant="body" color="secondary">
                {searchQuery ? 'No users found matching your search.' : 'No users found.'}
              </Typography>
            </EmptyState>
          ) : (
            <>
              <UserTable>
                <UserTableHeader>
                  <div>User</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Joined</div>
                  <div>Actions</div>
                </UserTableHeader>
                
                {paginatedUsers.map((user) => (
                  <UserTableRow key={user.id}>
                    <UserInfo>
                      <UserAvatar src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                      <UserDetails>
                        <UserName>{user.firstName} {user.lastName}</UserName>
                        <UserEmail>{user.email}</UserEmail>
                      </UserDetails>
                    </UserInfo>
                    
                    <div>
                      <RoleSelect
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="member">Member</option>
                        <option value="client">Client</option>
                      </RoleSelect>
                    </div>
                    
                    <div>
                      <StatusBadge status={getStatusFromRole(user.role)}>
                        {getStatusFromRole(user.role)}
                      </StatusBadge>
                    </div>
                    
                    <div>
                      <Typography variant="caption" color="secondary">
                        {user.createdAt.toLocaleDateString()}
                      </Typography>
                    </div>
                    
                    <ActionButtons>
                      <ActionButton onClick={() => handleDeactivateUser(user.id)}>
                        Edit
                      </ActionButton>
                      <ActionButton 
                        variant="danger" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin'}
                      >
                        Delete
                      </ActionButton>
                    </ActionButtons>
                  </UserTableRow>
                ))}
              </UserTable>

              <Pagination>
                <PaginationInfo>
                  Showing {startIndex + 1}-{Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </PaginationInfo>
                <PaginationButtons>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </PaginationButtons>
              </Pagination>
            </>
          )}
        </Card>
      </SettingsSection>
    </div>
  );
};