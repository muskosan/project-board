import type { Project } from '../types';

// Client access control utilities
export interface ClientAccessConfig {
  projectId: string;
  clientId?: string;
  accessToken?: string;
}

export interface ClientPermissions {
  canViewProject: boolean;
  canViewFiles: boolean;
  canDownloadFiles: boolean;
  canViewComments: boolean;
  canViewTeam: boolean;
  canViewProgress: boolean;
}

/**
 * Check if a client has access to a specific project
 */
export const checkClientAccess = async (
  config: ClientAccessConfig
): Promise<boolean> => {
  try {
    // In a real application, this would make an API call to verify:
    // 1. The project exists
    // 2. The client has permission to access it
    // 3. The access token is valid (if using token-based access)
    // 4. The project settings allow client access
    
    // For demo purposes, we'll simulate the check
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock validation logic
    if (!config.projectId) {
      return false;
    }
    
    // In a real app, you'd validate against your backend
    // For now, we'll allow access to demonstrate the functionality
    return true;
    
  } catch (error) {
    console.error('Client access check failed:', error);
    return false;
  }
};

/**
 * Get client permissions for a project based on project settings
 */
export const getClientPermissions = (
  project: Project,
  clientId?: string
): ClientPermissions => {
  const settings = project.settings;
  
  // Base permissions - what clients can generally access
  const basePermissions: ClientPermissions = {
    canViewProject: settings.allowClientAccess,
    canViewFiles: settings.allowClientAccess && settings.enableFileSharing,
    canDownloadFiles: settings.allowClientAccess && settings.enableFileSharing,
    canViewComments: settings.allowClientAccess && settings.enableComments,
    canViewTeam: settings.allowClientAccess,
    canViewProgress: settings.allowClientAccess,
  };
  
  // In a real app, you might have more granular permissions
  // based on the specific client or their role in the project
  if (clientId && project.client?.id === clientId) {
    // This is the project's primary client - they get full access
    return {
      ...basePermissions,
      canViewProject: true,
      canViewFiles: true,
      canDownloadFiles: true,
      canViewComments: true,
      canViewTeam: true,
      canViewProgress: true,
    };
  }
  
  return basePermissions;
};

/**
 * Generate a secure client access URL for a project
 */
export const generateClientAccessUrl = (
  projectId: string,
  clientId?: string,
  expiresIn?: number // hours
): string => {
  // In a real app, this would generate a secure token
  const baseUrl = window.location.origin;
  const token = generateAccessToken(projectId, clientId, expiresIn);
  
  return `${baseUrl}/client/${projectId}?token=${token}`;
};

/**
 * Generate a secure access token for client access
 */
const generateAccessToken = (
  projectId: string,
  clientId?: string,
  expiresIn: number = 24 // hours
): string => {
  // In a real app, this would be generated server-side with proper encryption
  // This is just for demonstration purposes
  const payload = {
    projectId,
    clientId,
    expiresAt: Date.now() + (expiresIn * 60 * 60 * 1000),
    type: 'client_access'
  };
  
  // In production, use proper JWT or similar secure token generation
  return btoa(JSON.stringify(payload));
};

/**
 * Validate a client access token
 */
export const validateAccessToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token));
    
    // Check if token has expired
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return false;
    }
    
    // Check if it's a client access token
    if (payload.type !== 'client_access') {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

/**
 * Extract project ID from access token
 */
export const getProjectIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.projectId || null;
  } catch (error) {
    console.error('Failed to extract project ID from token:', error);
    return null;
  }
};

/**
 * Check if project settings allow client access
 */
export const isClientAccessEnabled = (project: Project): boolean => {
  return project.settings.allowClientAccess && project.settings.isPublic !== false;
};

/**
 * Filter data based on client permissions
 */
export const filterDataForClient = <T>(
  data: T[],
  permissions: ClientPermissions,
  dataType: 'files' | 'comments' | 'team' | 'progress'
): T[] => {
  switch (dataType) {
    case 'files':
      return permissions.canViewFiles ? data : [];
    case 'comments':
      return permissions.canViewComments ? data : [];
    case 'team':
      return permissions.canViewTeam ? data : [];
    case 'progress':
      return permissions.canViewProgress ? data : [];
    default:
      return data;
  }
};

/**
 * Sanitize project data for client view (remove sensitive information)
 */
export const sanitizeProjectForClient = (project: Project): Project => {
  // Remove or mask sensitive information that clients shouldn't see
  const sanitized = { ...project };
  
  // Remove internal notes or sensitive budget details if needed
  // For now, we'll keep most information visible to demonstrate the feature
  
  // You might want to remove:
  // - Internal team communications
  // - Detailed budget breakdowns
  // - Internal project notes
  // - Sensitive client information from other projects
  
  return sanitized;
};

/**
 * Log client access for audit purposes
 */
export const logClientAccess = (
  projectId: string,
  clientId?: string,
  action: string = 'view'
): void => {
  // In a real app, this would send audit logs to your backend
  console.log('Client access logged:', {
    projectId,
    clientId,
    action,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
};