import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import type { Project, Task, User, Comment, Attachment } from '../../types';
import { ClientLayout } from './ClientLayout';
import { ClientHeader } from './ClientHeader';
import { ClientProjectSummary } from './ClientProjectSummary';
import { ClientCommentHistory } from './ClientCommentHistory';
import { ClientFileDownloads } from './ClientFileDownloads';
import { generateMockProject, generateMockTasks, generateMockUsers } from '../../utils/mockData';
import { checkClientAccess, getClientPermissions, logClientAccess, sanitizeProjectForClient } from '../../utils/clientAccess';
import { tokens } from '../../styles/tokens';

interface ClientViewProps {
  projectId?: string;
  className?: string;
}

const MainContent = styled.div`
  padding: ${tokens.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    padding: ${tokens.spacing.lg};
  }
  
  @media (max-width: ${tokens.breakpoints.mobile}) {
    padding: ${tokens.spacing.md};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${tokens.spacing.xl};
  margin-top: ${tokens.spacing.xl};
  
  @media (max-width: ${tokens.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${tokens.spacing.lg};
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xl};
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${tokens.colors.text.secondary};
  font-size: ${tokens.typography.sizes.lg};
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: ${tokens.colors.status.error};
  text-align: center;
  gap: ${tokens.spacing.md};
`;

const ErrorTitle = styled.h2`
  font-size: ${tokens.typography.sizes.xl};
  font-weight: ${tokens.typography.weights.semibold};
  margin: 0;
`;

const ErrorMessage = styled.p`
  font-size: ${tokens.typography.sizes.base};
  margin: 0;
  color: ${tokens.colors.text.secondary};
`;



export const ClientView: React.FC<ClientViewProps> = ({
  projectId: propProjectId,
  className,
}) => {
  const { projectId: paramProjectId } = useParams<{ projectId: string }>();
  const projectId = propProjectId || paramProjectId;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const loadClientData = async () => {
      if (!projectId) {
        setError('Project not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check client access permissions
        const accessGranted = await checkClientAccess({ projectId });
        if (!accessGranted) {
          setError('Access denied. You do not have permission to view this project.');
          setLoading(false);
          return;
        }

        setHasAccess(true);
        
        // Log client access for audit purposes
        logClientAccess(projectId, undefined, 'view');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate mock data for the project
        const mockUsers = generateMockUsers(8);
        const mockProject = generateMockProject({
          id: projectId,
          settings: {
            isPublic: false,
            allowClientAccess: true,
            enableTimeTracking: true,
            enableComments: true,
            enableFileSharing: true,
          }
        });

        // Add client to project
        if (mockUsers.length > 0) {
          const clientUser = mockUsers.find(u => u.role === 'client') || mockUsers[0];
          mockProject.client = {
            id: clientUser.id,
            name: `${clientUser.firstName} ${clientUser.lastName}`,
            email: clientUser.email,
            company: 'Client Company Inc.',
            avatar: clientUser.avatar,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }

        // Add team members
        const teamMembers = mockUsers.slice(0, 5).map(user => ({
          userId: user.id,
          user,
          role: (user.role === 'client' ? 'viewer' : 'member') as 'lead' | 'member' | 'viewer',
          joinedAt: new Date(),
        }));
        mockProject.team = teamMembers;

        const mockTasks = generateMockTasks(projectId, 12, mockUsers);

        // Populate task data with user information
        const populatedTasks = mockTasks.map(task => ({
          ...task,
          assignee: task.assigneeId ? mockUsers.find(u => u.id === task.assigneeId) : undefined,
          reporter: mockUsers.find(u => u.id === task.reporterId),
          comments: task.comments.map(comment => ({
            ...comment,
            author: mockUsers.find(u => u.id === comment.authorId),
          })),
          attachments: task.attachments.map(attachment => ({
            ...attachment,
            uploader: mockUsers.find(u => u.id === attachment.uploadedBy),
          })),
        }));

        // Extract all comments and attachments for client view
        const allComments: Comment[] = [];
        const allAttachments: Attachment[] = [];

        populatedTasks.forEach(task => {
          allComments.push(...task.comments);
          allAttachments.push(...task.attachments);
        });

        // Sort comments by date (newest first)
        allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Sort attachments by date (newest first)
        allAttachments.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

        // Sanitize project data for client view
        const sanitizedProject = sanitizeProjectForClient(mockProject);
        
        // Get client permissions
        const permissions = getClientPermissions(sanitizedProject);
        
        // Filter data based on permissions
        const filteredComments = permissions.canViewComments ? allComments : [];
        const filteredAttachments = permissions.canViewFiles ? allAttachments : [];
        
        setProject(sanitizedProject);
        setTasks(populatedTasks);
        setUsers(mockUsers);
        setComments(filteredComments);
        setAttachments(filteredAttachments);

      } catch (err) {
        console.error('Failed to load client data:', err);
        setError('Failed to load project data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [projectId]);

  if (loading) {
    return (
      <ClientLayout 
        className={className}
        header={<ClientHeader />}
      >
        <MainContent>
          <LoadingState>
            Loading project information...
          </LoadingState>
        </MainContent>
      </ClientLayout>
    );
  }

  if (error || !hasAccess) {
    return (
      <ClientLayout 
        className={className}
        header={<ClientHeader />}
      >
        <MainContent>
          <ErrorState>
            <ErrorTitle>
              {error?.includes('Access denied') ? 'Access Denied' : 'Project Not Found'}
            </ErrorTitle>
            <ErrorMessage>
              {error || 'The requested project could not be found.'}
            </ErrorMessage>
          </ErrorState>
        </MainContent>
      </ClientLayout>
    );
  }

  if (!project) {
    return (
      <ClientLayout 
        className={className}
        header={<ClientHeader />}
      >
        <MainContent>
          <ErrorState>
            <ErrorTitle>Project Not Found</ErrorTitle>
            <ErrorMessage>
              The requested project could not be found.
            </ErrorMessage>
          </ErrorState>
        </MainContent>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout 
      className={className}
      header={<ClientHeader project={project} />}
    >
      <MainContent>
        <ContentGrid>
          <LeftColumn>
            <ClientProjectSummary 
              project={project}
              tasks={tasks}
              users={users}
            />
            
            <ClientCommentHistory 
              comments={comments}
              projectId={project.id}
            />
          </LeftColumn>
          
          <RightColumn>
            <ClientFileDownloads 
              attachments={attachments}
              projectId={project.id}
            />
          </RightColumn>
        </ContentGrid>
      </MainContent>
    </ClientLayout>
  );
};