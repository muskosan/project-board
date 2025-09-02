import { describe, it, expect } from 'vitest';
import {
  validateUser,
  validateProject,
  validateTask,
  validateClient,
  validateEmail,
  validateRequired,
  isValidEmail,
  isValidDate,
} from '../validation';
import type { User, Project, Task, Client } from '../../types';

describe('Validation Utilities', () => {
  describe('Basic validators', () => {
    it('should validate email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should validate dates correctly', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2023-01-01'))).toBe(true);
      expect(isValidDate('not a date')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  describe('Form validators', () => {
    it('should validate required fields', () => {
      expect(validateRequired('test', 'Field')).toBeUndefined();
      expect(validateRequired('', 'Field')).toBe('Field is required');
      expect(validateRequired(null, 'Field')).toBe('Field is required');
      expect(validateRequired(undefined, 'Field')).toBe('Field is required');
    });

    it('should validate email format', () => {
      expect(validateEmail('test@example.com')).toBeUndefined();
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address');
    });
  });

  describe('Entity validators', () => {
    it('should validate user objects', () => {
      const validUser: Partial<User> = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = validateUser(validUser);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid user objects', () => {
      const invalidUser: Partial<User> = {
        id: '',
        email: 'invalid-email',
        firstName: '',
        lastName: 'Doe',
        role: 'invalid-role' as any,
      };

      const result = validateUser(invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('User ID is required');
      expect(result.errors).toContain('Valid email is required');
      expect(result.errors).toContain('First name is required');
      expect(result.errors).toContain('Valid user role is required');
    });

    it('should validate project objects', () => {
      const validProject: Partial<Project> = {
        id: 'project-123',
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        priority: 'medium',
        startDate: new Date('2023-01-01'),
        dueDate: new Date('2023-12-31'),
        progress: 50,
        team: [],
        tags: ['test'],
        color: '#FF0000',
      };

      const result = validateProject(validProject);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject projects with invalid date ranges', () => {
      const invalidProject: Partial<Project> = {
        id: 'project-123',
        name: 'Test Project',
        description: 'A test project',
        status: 'active',
        priority: 'medium',
        startDate: new Date('2023-12-31'),
        dueDate: new Date('2023-01-01'), // Due date before start date
        progress: 50,
        team: [],
        tags: ['test'],
        color: '#FF0000',
      };

      const result = validateProject(invalidProject);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Start date cannot be after due date');
    });

    it('should validate task objects', () => {
      const validTask: Partial<Task> = {
        id: 'task-123',
        projectId: 'project-123',
        title: 'Test Task',
        description: 'A test task',
        status: 'todo',
        priority: 'high',
        reporterId: 'user-123',
        tags: ['urgent'],
        dependencies: [],
      };

      const result = validateTask(validTask);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate client objects', () => {
      const validClient: Partial<Client> = {
        id: 'client-123',
        name: 'John Smith',
        email: 'john@company.com',
        company: 'Test Company',
      };

      const result = validateClient(validClient);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});