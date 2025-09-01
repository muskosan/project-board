import React from 'react';

// ============================================================================
// CORE DATA MODELS
// ============================================================================

// Base types
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'manager' | 'member' | 'client';
export type ProjectMemberRole = 'lead' | 'member' | 'viewer';
export type ActivityType = 'comment' | 'task_update' | 'file_upload' | 'project_update';
export type CalendarEventType = 'deadline' | 'meeting' | 'milestone';
export type FileItemType = 'file' | 'folder';

// User and Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: NotificationSettings;
  timezone: string;
  language: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  taskUpdates: boolean;
  projectUpdates: boolean;
  mentions: boolean;
  deadlines: boolean;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

// Client
export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project Management
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: Date;
  dueDate?: Date;
  completedAt?: Date;
  progress: number;
  budget?: number;
  client?: Client;
  team: ProjectMember[];
  tags: string[];
  color: string;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  userId: string;
  user?: User; // Populated in API responses
  role: ProjectMemberRole;
  joinedAt: Date;
}

export interface ProjectSettings {
  isPublic: boolean;
  allowClientAccess: boolean;
  enableTimeTracking: boolean;
  enableComments: boolean;
  enableFileSharing: boolean;
}

// Task Management
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  priority: Priority;
  assigneeId?: string;
  assignee?: User; // Populated in API responses
  reporterId: string;
  reporter?: User; // Populated in API responses
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  dependencies: string[];
  attachments: Attachment[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User; // Populated in API responses
  createdAt: Date;
  updatedAt?: Date;
  mentions: string[];
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploader?: User; // Populated in API responses
  uploadedAt: Date;
}

// Kanban Board
export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  limit?: number;
  order: number;
}

// File Management
export interface FileItem {
  id: string;
  name: string;
  type: FileItemType;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
  lastModified: Date;
  version?: number;
  parentId?: string;
  projectId?: string;
  uploadedBy?: string;
  uploader?: User; // Populated in API responses
}

// Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type: CalendarEventType;
  project?: Project;
  projectId?: string;
  color: string;
  attendees: string[];
  createdBy: string;
  creator?: User; // Populated in API responses
  createdAt: Date;
  updatedAt: Date;
}

// Activity Feed
export interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  user?: User; // Populated in API responses
  timestamp: Date;
  content: string;
  metadata?: Record<string, any>;
  projectId?: string;
  project?: Project; // Populated in API responses
  taskId?: string;
  task?: Task; // Populated in API responses
}

// Navigation
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  badge?: number;
  icon?: string;
}

// Chat and Notes
export interface ChatMessage {
  id: string;
  content: string;
  authorId: string;
  author?: User; // Populated in API responses
  projectId?: string;
  project?: Project; // Populated in API responses
  threadId?: string;
  parentMessageId?: string;
  mentions: string[];
  attachments: Attachment[];
  reactions: MessageReaction[];
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  user?: User; // Populated in API responses
  createdAt: Date;
}

export interface ChatThread {
  id: string;
  title?: string;
  projectId?: string;
  project?: Project; // Populated in API responses
  participants: string[];
  lastMessageId?: string;
  lastMessage?: ChatMessage; // Populated in API responses
  messageCount: number;
  isArchived: boolean;
  createdBy: string;
  creator?: User; // Populated in API responses
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User; // Populated in API responses
  projectId?: string;
  project?: Project; // Populated in API responses
  tags: string[];
  isPinned: boolean;
  isPublic: boolean;
  attachments: Attachment[];
  mentions: string[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  domain: string;
  type: 'webpage' | 'document' | 'image' | 'video' | 'other';
  metadata?: Record<string, any>;
  createdAt: Date;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

// Form and Input Types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Component Prop Utilities
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentState = 'default' | 'loading' | 'success' | 'error';

// Generic component props
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}

// Layout Types
export interface LayoutProps extends BaseComponentProps {
  children: React.ReactNode;
}

export interface GridProps extends BaseComponentProps {
  columns?: number;
  gap?: string;
  responsive?: boolean;
}

// Filter and Sort Types
export interface FilterOptions {
  status?: ProjectStatus[];
  priority?: Priority[];
  assignee?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchOptions {
  query: string;
  fields?: string[];
}

// Drag and Drop Types
export interface DragItem {
  id: string;
  type: string;
  data: any;
}

export interface DropResult {
  dragId: string;
  dropId: string;
  position?: number;
}

// Theme and Styling Types
export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  accent: {
    primary: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface BreakpointValues {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

// Event Handler Types
export type EventHandler<T = void> = (event?: React.SyntheticEvent) => T;
export type ChangeHandler<T> = (value: T) => void;
export type SubmitHandler<T> = (data: T) => void | Promise<void>;

// Conditional Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

// ID Types for better type safety
export type UserId = string & { readonly brand: unique symbol };
export type ProjectId = string & { readonly brand: unique symbol };
export type TaskId = string & { readonly brand: unique symbol };
export type ClientId = string & { readonly brand: unique symbol };
export type FileId = string & { readonly brand: unique symbol };

// Create branded ID functions
export const createUserId = (id: string): UserId => id as UserId;
export const createProjectId = (id: string): ProjectId => id as ProjectId;
export const createTaskId = (id: string): TaskId => id as TaskId;
export const createClientId = (id: string): ClientId => id as ClientId;
export const createFileId = (id: string): FileId => id as FileId;