import { describe, it, expect } from 'vitest';
import {
  generateMockUser,
  generateMockProject,
  generateMockTask,
  generateMockClient,
  generateCompleteDataset,
  generateMockUsers,
  generateMockProjects,
} from '../mockData';

describe('Mock Data Generators', () => {
  describe('Individual generators', () => {
    it('should generate valid user objects', () => {
      const user = generateMockUser();
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('preferences');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      
      expect(typeof user.id).toBe('string');
      expect(user.email).toContain('@');
      expect(['admin', 'manager', 'member', 'client']).toContain(user.role);
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should generate valid project objects', () => {
      const project = generateMockProject();
      
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('status');
      expect(project).toHaveProperty('priority');
      expect(project).toHaveProperty('progress');
      expect(project).toHaveProperty('tags');
      expect(project).toHaveProperty('color');
      
      expect(typeof project.progress).toBe('number');
      expect(project.progress).toBeGreaterThanOrEqual(0);
      expect(project.progress).toBeLessThanOrEqual(100);
      expect(Array.isArray(project.tags)).toBe(true);
      expect(['planning', 'active', 'on_hold', 'completed', 'cancelled']).toContain(project.status);
    });

    it('should generate valid task objects', () => {
      const projectId = 'test-project-123';
      const task = generateMockTask(projectId);
      
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('projectId');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('tags');
      
      expect(task.projectId).toBe(projectId);
      expect(Array.isArray(task.tags)).toBe(true);
      expect(['low', 'medium', 'high', 'urgent']).toContain(task.priority);
    });

    it('should generate valid client objects', () => {
      const client = generateMockClient();
      
      expect(client).toHaveProperty('id');
      expect(client).toHaveProperty('name');
      expect(client).toHaveProperty('email');
      expect(client).toHaveProperty('company');
      expect(client).toHaveProperty('createdAt');
      
      expect(client.email).toContain('@');
      expect(client.createdAt).toBeInstanceOf(Date);
    });

    it('should accept overrides', () => {
      const customName = 'Custom User Name';
      const user = generateMockUser({ firstName: customName });
      
      expect(user.firstName).toBe(customName);
    });
  });

  describe('Bulk generators', () => {
    it('should generate multiple users', () => {
      const users = generateMockUsers(5);
      
      expect(users).toHaveLength(5);
      expect(users.every(user => typeof user.id === 'string')).toBe(true);
      expect(users.every(user => user.email.includes('@'))).toBe(true);
    });

    it('should generate projects with team assignments', () => {
      const users = generateMockUsers(3);
      const projects = generateMockProjects(2, users);
      
      expect(projects).toHaveLength(2);
      projects.forEach(project => {
        expect(Array.isArray(project.team)).toBe(true);
        project.team.forEach(member => {
          expect(member).toHaveProperty('userId');
          expect(member).toHaveProperty('role');
          expect(member).toHaveProperty('joinedAt');
          expect(['lead', 'member', 'viewer']).toContain(member.role);
        });
      });
    });
  });

  describe('Complete dataset generator', () => {
    it('should generate a complete dataset with all entities', () => {
      const dataset = generateCompleteDataset();
      
      expect(dataset).toHaveProperty('users');
      expect(dataset).toHaveProperty('clients');
      expect(dataset).toHaveProperty('projects');
      expect(dataset).toHaveProperty('tasks');
      expect(dataset).toHaveProperty('calendarEvents');
      expect(dataset).toHaveProperty('activityItems');
      expect(dataset).toHaveProperty('fileItems');
      expect(dataset).toHaveProperty('kanbanBoard');
      
      expect(Array.isArray(dataset.users)).toBe(true);
      expect(Array.isArray(dataset.projects)).toBe(true);
      expect(Array.isArray(dataset.tasks)).toBe(true);
      expect(dataset.users.length).toBeGreaterThan(0);
      expect(dataset.projects.length).toBeGreaterThan(0);
      expect(dataset.tasks.length).toBeGreaterThan(0);
      
      // Verify relationships
      dataset.tasks.forEach(task => {
        const projectExists = dataset.projects.some(p => p.id === task.projectId);
        expect(projectExists).toBe(true);
      });
    });

    it('should generate consistent data relationships', () => {
      const dataset = generateCompleteDataset();
      
      // Check that activity items reference valid entities
      dataset.activityItems.forEach(activity => {
        if (activity.projectId) {
          const projectExists = dataset.projects.some(p => p.id === activity.projectId);
          expect(projectExists).toBe(true);
        }
        
        if (activity.taskId) {
          const taskExists = dataset.tasks.some(t => t.id === activity.taskId);
          expect(taskExists).toBe(true);
        }
      });
    });
  });
});