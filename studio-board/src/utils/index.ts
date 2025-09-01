// Export validation utilities
export * from './validation';

// Export mock data generators
export * from './mockData';

// Export API client
export * from './apiClient';

// Export client access utilities
export * from './clientAccess';

// Export responsive utilities
export * from './responsive';

// Re-export specific types to avoid conflicts
export type {
  User,
  Project,
  Task,
  Client,
  CalendarEvent,
  ActivityItem,
  FileItem,
  Comment,
  Attachment,
  Column,
  NavigationItem,
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
  SortOptions,
  SearchOptions,
  Priority,
  ProjectStatus,
  UserRole,
  CalendarEventType,
  ActivityType,
  FileItemType,
  ProjectMemberRole,
} from '../types';