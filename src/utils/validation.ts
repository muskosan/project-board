import type {
  User,
  Project,
  Task,
  Client,
  CalendarEvent,
  Comment,
  Attachment,
  UserRole,
  ProjectStatus,
  Priority,
  CalendarEventType,
} from '../types';

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

// Basic validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isNonEmptyString = (value: any): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidId = (id: any): id is string => {
  return typeof id === 'string' && id.length > 0;
};

// Enum validation helpers
export const isValidUserRole = (role: any): role is UserRole => {
  return ['admin', 'manager', 'member', 'client'].includes(role);
};

export const isValidProjectStatus = (status: any): status is ProjectStatus => {
  return ['planning', 'active', 'on_hold', 'completed', 'cancelled'].includes(status);
};

export const isValidPriority = (priority: any): priority is Priority => {
  return ['low', 'medium', 'high', 'urgent'].includes(priority);
};

export const isValidCalendarEventType = (type: any): type is CalendarEventType => {
  return ['deadline', 'meeting', 'milestone'].includes(type);
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// User validation
export const validateUser = (user: Partial<User>): ValidationResult => {
  const errors: string[] = [];

  if (!isValidId(user.id)) {
    errors.push('User ID is required');
  }

  if (!isValidEmail(user.email || '')) {
    errors.push('Valid email is required');
  }

  if (!isNonEmptyString(user.firstName)) {
    errors.push('First name is required');
  }

  if (!isNonEmptyString(user.lastName)) {
    errors.push('Last name is required');
  }

  if (!isValidUserRole(user.role)) {
    errors.push('Valid user role is required');
  }

  if (user.avatar && !isValidUrl(user.avatar)) {
    errors.push('Avatar must be a valid URL');
  }

  if (!isValidDate(user.createdAt)) {
    errors.push('Valid creation date is required');
  }

  if (!isValidDate(user.updatedAt)) {
    errors.push('Valid update date is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Project validation
export const validateProject = (project: Partial<Project>): ValidationResult => {
  const errors: string[] = [];

  if (!isValidId(project.id)) {
    errors.push('Project ID is required');
  }

  if (!isNonEmptyString(project.name)) {
    errors.push('Project name is required');
  }

  if (project.name && project.name.length > 100) {
    errors.push('Project name must be less than 100 characters');
  }

  if (!isNonEmptyString(project.description)) {
    errors.push('Project description is required');
  }

  if (!isValidProjectStatus(project.status)) {
    errors.push('Valid project status is required');
  }

  if (!isValidPriority(project.priority)) {
    errors.push('Valid priority is required');
  }

  if (!isValidDate(project.startDate)) {
    errors.push('Valid start date is required');
  }

  if (project.dueDate && !isValidDate(project.dueDate)) {
    errors.push('Due date must be a valid date');
  }

  if (project.startDate && project.dueDate && project.startDate > project.dueDate) {
    errors.push('Start date cannot be after due date');
  }

  if (typeof project.progress !== 'number' || project.progress < 0 || project.progress > 100) {
    errors.push('Progress must be a number between 0 and 100');
  }

  if (project.budget && (typeof project.budget !== 'number' || project.budget < 0)) {
    errors.push('Budget must be a positive number');
  }

  if (!Array.isArray(project.team)) {
    errors.push('Team must be an array');
  }

  if (!Array.isArray(project.tags)) {
    errors.push('Tags must be an array');
  }

  if (!isNonEmptyString(project.color)) {
    errors.push('Project color is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Task validation
export const validateTask = (task: Partial<Task>): ValidationResult => {
  const errors: string[] = [];

  if (!isValidId(task.id)) {
    errors.push('Task ID is required');
  }

  if (!isValidId(task.projectId)) {
    errors.push('Project ID is required');
  }

  if (!isNonEmptyString(task.title)) {
    errors.push('Task title is required');
  }

  if (task.title && task.title.length > 200) {
    errors.push('Task title must be less than 200 characters');
  }

  if (!isNonEmptyString(task.description)) {
    errors.push('Task description is required');
  }

  if (!isNonEmptyString(task.status)) {
    errors.push('Task status is required');
  }

  if (!isValidPriority(task.priority)) {
    errors.push('Valid priority is required');
  }

  if (!isValidId(task.reporterId)) {
    errors.push('Reporter ID is required');
  }

  if (task.dueDate && !isValidDate(task.dueDate)) {
    errors.push('Due date must be a valid date');
  }

  if (task.estimatedHours && (typeof task.estimatedHours !== 'number' || task.estimatedHours < 0)) {
    errors.push('Estimated hours must be a positive number');
  }

  if (task.actualHours && (typeof task.actualHours !== 'number' || task.actualHours < 0)) {
    errors.push('Actual hours must be a positive number');
  }

  if (!Array.isArray(task.tags)) {
    errors.push('Tags must be an array');
  }

  if (!Array.isArray(task.dependencies)) {
    errors.push('Dependencies must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Client validation
export const validateClient = (client: Partial<Client>): ValidationResult => {
  const errors: string[] = [];

  if (!isValidId(client.id)) {
    errors.push('Client ID is required');
  }

  if (!isNonEmptyString(client.name)) {
    errors.push('Client name is required');
  }

  if (!isValidEmail(client.email || '')) {
    errors.push('Valid email is required');
  }

  if (!isNonEmptyString(client.company)) {
    errors.push('Company name is required');
  }

  if (client.avatar && !isValidUrl(client.avatar)) {
    errors.push('Avatar must be a valid URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Calendar event validation
export const validateCalendarEvent = (event: Partial<CalendarEvent>): ValidationResult => {
  const errors: string[] = [];

  if (!isValidId(event.id)) {
    errors.push('Event ID is required');
  }

  if (!isNonEmptyString(event.title)) {
    errors.push('Event title is required');
  }

  if (!isValidDate(event.start)) {
    errors.push('Valid start date is required');
  }

  if (!isValidDate(event.end)) {
    errors.push('Valid end date is required');
  }

  if (event.start && event.end && event.start >= event.end) {
    errors.push('Start date must be before end date');
  }

  if (!isValidCalendarEventType(event.type)) {
    errors.push('Valid event type is required');
  }

  if (!isNonEmptyString(event.color)) {
    errors.push('Event color is required');
  }

  if (!Array.isArray(event.attendees)) {
    errors.push('Attendees must be an array');
  }

  if (!isValidId(event.createdBy)) {
    errors.push('Creator ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Comment validation
export const validateComment = (comment: Partial<Comment>): ValidationResult => {
  const errors: string[] = [];

  if (!isValidId(comment.id)) {
    errors.push('Comment ID is required');
  }

  if (!isNonEmptyString(comment.content)) {
    errors.push('Comment content is required');
  }

  if (comment.content && comment.content.length > 2000) {
    errors.push('Comment content must be less than 2000 characters');
  }

  if (!isValidId(comment.authorId)) {
    errors.push('Author ID is required');
  }

  if (!isValidDate(comment.createdAt)) {
    errors.push('Valid creation date is required');
  }

  if (!Array.isArray(comment.mentions)) {
    errors.push('Mentions must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Attachment validation
export const validateAttachment = (attachment: Partial<Attachment>): ValidationResult => {
  const errors: string[] = [];

  if (!isValidId(attachment.id)) {
    errors.push('Attachment ID is required');
  }

  if (!isNonEmptyString(attachment.filename)) {
    errors.push('Filename is required');
  }

  if (!attachment.url || !isValidUrl(attachment.url)) {
    errors.push('Valid URL is required');
  }

  if (typeof attachment.size !== 'number' || attachment.size < 0) {
    errors.push('Size must be a positive number');
  }

  if (!isNonEmptyString(attachment.mimeType)) {
    errors.push('MIME type is required');
  }

  if (!isValidId(attachment.uploadedBy)) {
    errors.push('Uploader ID is required');
  }

  if (!isValidDate(attachment.uploadedAt)) {
    errors.push('Valid upload date is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// FORM VALIDATION HELPERS
// ============================================================================

export const validateRequired = (value: any, fieldName: string): string | undefined => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} is required`;
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | undefined => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return undefined;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | undefined => {
  if (value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return undefined;
};

export const validateDateRange = (startDate: Date, endDate: Date): string | undefined => {
  if (startDate >= endDate) {
    return 'Start date must be before end date';
  }
  return undefined;
};

export const validatePositiveNumber = (value: number, fieldName: string): string | undefined => {
  if (value < 0) {
    return `${fieldName} must be a positive number`;
  }
  return undefined;
};