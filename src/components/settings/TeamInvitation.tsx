import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import type { UserRole } from '../../types';

const SettingsSection = styled.div`
  margin-bottom: 2rem;
`;

const InvitationForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 150px 120px;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
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

const InvitationList = styled.div`
  margin-top: 2rem;
`;

const InvitationTable = styled.div`
  border: 1px solid ${props => props.theme.colors.background.secondary};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const InvitationTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 120px 100px 120px;
  padding: 1rem;
  background: ${props => props.theme.colors.background.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.background.secondary};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};

  @media (max-width: 768px) {
    grid-template-columns: 1fr 100px 100px;
    
    & > div:nth-child(4),
    & > div:nth-child(5) {
      display: none;
    }
  }
`;

const InvitationTableRow = styled.div`
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
    grid-template-columns: 1fr 100px 100px;
    
    & > div:nth-child(4),
    & > div:nth-child(5) {
      display: none;
    }
  }
`;

const EmailInfo = styled.div`
  min-width: 0;
`;

const EmailAddress = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InvitedBy = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const StatusBadge = styled(Badge)<{ status: 'pending' | 'accepted' | 'expired' | 'cancelled' }>`
  background: ${props => {
    switch (props.status) {
      case 'pending': return props.theme.colors.status.warning;
      case 'accepted': return props.theme.colors.status.success;
      case 'expired': return props.theme.colors.status.error;
      case 'cancelled': return '#6B6B6B';
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

const BulkInviteSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.background.secondary};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.background.secondary};
  border-radius: 0.5rem;
  background: ${props => props.theme.colors.background.elevated};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const BulkInviteForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

const SectionDescription = styled(Typography)`
  margin-bottom: 2rem;
`;

const SubSectionTitle = styled(Typography)`
  margin-bottom: 1rem;
`;

const SubSectionDescription = styled(Typography)`
  margin-bottom: 1rem;
`;

interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
}

interface TeamInvitationProps {
  className?: string;
}

export const TeamInvitation: React.FC<TeamInvitationProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [bulkEmails, setBulkEmails] = useState('');
  const [bulkRole, setBulkRole] = useState<UserRole>('member');
  const [isInviting, setIsInviting] = useState(false);
  const [isBulkInviting, setIsBulkInviting] = useState(false);

  // Mock invitations data
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      role: 'member',
      status: 'pending',
      invitedBy: 'Admin User',
      invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      role: 'manager',
      status: 'accepted',
      invitedBy: 'Admin User',
      invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      email: 'expired@example.com',
      role: 'member',
      status: 'expired',
      invitedBy: 'Manager User',
      invitedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  const handleSingleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsInviting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: email.trim(),
      role,
      status: 'pending',
      invitedBy: 'Current User',
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    setInvitations(prev => [newInvitation, ...prev]);
    setEmail('');
    setIsInviting(false);
    
    console.log('Invitation sent:', newInvitation);
  };

  const handleBulkInvite = async () => {
    if (!bulkEmails.trim()) return;

    setIsBulkInviting(true);
    
    // Parse emails from textarea
    const emails = bulkEmails
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInvitations: Invitation[] = emails.map(email => ({
      id: `${Date.now()}-${Math.random()}`,
      email,
      role: bulkRole,
      status: 'pending' as const,
      invitedBy: 'Current User',
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }));

    setInvitations(prev => [...newInvitations, ...prev]);
    setBulkEmails('');
    setIsBulkInviting(false);
    
    console.log('Bulk invitations sent:', newInvitations);
  };

  const handleResendInvitation = async (invitationId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setInvitations(prev => prev.map(inv => 
      inv.id === invitationId 
        ? { ...inv, status: 'pending' as const, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
        : inv
    ));
    
    console.log('Invitation resent:', invitationId);
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!window.confirm('Are you sure you want to cancel this invitation?')) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setInvitations(prev => prev.map(inv => 
      inv.id === invitationId 
        ? { ...inv, status: 'cancelled' as const }
        : inv
    ));
    
    console.log('Invitation cancelled:', invitationId);
  };

  return (
    <div className={className}>
      <SettingsSection>
        <Card padding="lg">
          <SectionTitle variant="h2" weight="bold" color="primary">
            Team Invitations
          </SectionTitle>
          <SectionDescription variant="body" color="secondary">
            Invite new team members and manage pending invitations
          </SectionDescription>

          <SubSectionTitle variant="h3" weight="semibold" color="primary">
            Send Single Invitation
          </SubSectionTitle>
          
          <InvitationForm onSubmit={handleSingleInvite}>
            <FormField>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
            
            <FormField>
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
              </Select>
            </FormField>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isInviting || !email.trim()}
            >
              {isInviting ? 'Sending...' : 'Send Invite'}
            </Button>
          </InvitationForm>

          <BulkInviteSection>
            <SubSectionTitle variant="h3" weight="semibold" color="primary">
              Bulk Invitations
            </SubSectionTitle>
            <SubSectionDescription variant="body" color="secondary">
              Enter multiple email addresses separated by commas, semicolons, or new lines
            </SubSectionDescription>
            
            <BulkInviteForm>
              <FormField>
                <Label htmlFor="bulkEmails">Email Addresses</Label>
                <TextArea
                  id="bulkEmails"
                  placeholder="john@example.com, jane@example.com&#10;bob@example.com"
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                />
              </FormField>
              
              <FormField>
                <Label htmlFor="bulkRole">Role for All</Label>
                <Select
                  id="bulkRole"
                  value={bulkRole}
                  onChange={(e) => setBulkRole(e.target.value as UserRole)}
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBulkInvite}
                  disabled={isBulkInviting || !bulkEmails.trim()}
                  style={{ marginTop: '0.5rem' }}
                >
                  {isBulkInviting ? 'Sending...' : 'Send Bulk Invites'}
                </Button>
              </FormField>
            </BulkInviteForm>
          </BulkInviteSection>

          <InvitationList>
            <SubSectionTitle variant="h3" weight="semibold" color="primary">
              Pending Invitations
            </SubSectionTitle>
            
            {invitations.length === 0 ? (
              <EmptyState>
                <Typography variant="body" color="secondary">
                  No invitations sent yet.
                </Typography>
              </EmptyState>
            ) : (
              <InvitationTable>
                <InvitationTableHeader>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Expires</div>
                  <div>Actions</div>
                </InvitationTableHeader>
                
                {invitations.map((invitation) => (
                  <InvitationTableRow key={invitation.id}>
                    <EmailInfo>
                      <EmailAddress>{invitation.email}</EmailAddress>
                      <InvitedBy>Invited by {invitation.invitedBy}</InvitedBy>
                    </EmailInfo>
                    
                    <div>
                      <Badge variant="info">
                        {invitation.role}
                      </Badge>
                    </div>
                    
                    <div>
                      <StatusBadge status={invitation.status}>
                        {invitation.status}
                      </StatusBadge>
                    </div>
                    
                    <div>
                      <Typography variant="caption" color="secondary">
                        {invitation.expiresAt.toLocaleDateString()}
                      </Typography>
                    </div>
                    
                    <ActionButtons>
                      {invitation.status === 'pending' && (
                        <>
                          <ActionButton onClick={() => handleResendInvitation(invitation.id)}>
                            Resend
                          </ActionButton>
                          <ActionButton 
                            variant="danger" 
                            onClick={() => handleCancelInvitation(invitation.id)}
                          >
                            Cancel
                          </ActionButton>
                        </>
                      )}
                      {invitation.status === 'expired' && (
                        <ActionButton onClick={() => handleResendInvitation(invitation.id)}>
                          Resend
                        </ActionButton>
                      )}
                      {invitation.status === 'accepted' && (
                        <Typography variant="caption" color="secondary">
                          Accepted
                        </Typography>
                      )}
                    </ActionButtons>
                  </InvitationTableRow>
                ))}
              </InvitationTable>
            )}
          </InvitationList>
        </Card>
      </SettingsSection>
    </div>
  );
};