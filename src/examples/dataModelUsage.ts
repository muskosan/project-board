/**
 * Example usage of data models, validation, and API client
 * This file demonstrates how to use the implemented data structures
 */

import {
  generateCompleteDataset,
  validateUser,
  validateProject,
  apiClient,
  type User,
  type Project,
  type Task,
} from '../utils';

// ============================================================================
// EXAMPLE 1: Using Mock Data Generators
// ============================================================================

export const exampleMockDataUsage = () => {
  console.log('=== Mock Data Generation Example ===');
  
  // Generate a complete dataset for development
  const dataset = generateCompleteDataset();
  
  console.log(`Generated ${dataset.users.length} users`);
  console.log(`Generated ${dataset.projects.length} projects`);
  console.log(`Generated ${dataset.tasks.length} tasks`);
  console.log(`Generated ${dataset.calendarEvents.length} calendar events`);
  
  // Use the first user as an example
  const firstUser = dataset.users[0];
  console.log('Sample user:', {
    name: `${firstUser.firstName} ${firstUser.lastName}`,
    email: firstUser.email,
    role: firstUser.role,
  });
  
  return dataset;
};

// ============================================================================
// EXAMPLE 2: Data Validation
// ============================================================================

export const exampleValidationUsage = () => {
  console.log('=== Data Validation Example ===');
  
  // Example of validating user data
  const userData: Partial<User> = {
    id: 'user-123',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'member',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const userValidation = validateUser(userData);
  console.log('User validation result:', userValidation);
  
  // Example of validating project data
  const projectData: Partial<Project> = {
    id: 'project-123',
    name: 'Website Redesign',
    description: 'Complete redesign of company website',
    status: 'active',
    priority: 'high',
    startDate: new Date('2024-01-01'),
    dueDate: new Date('2024-06-30'),
    progress: 45,
    team: [],
    tags: ['design', 'web', 'urgent'],
    color: '#D2691E',
  };
  
  const projectValidation = validateProject(projectData);
  console.log('Project validation result:', projectValidation);
  
  // Example of invalid data
  const invalidUserData: Partial<User> = {
    id: '', // Invalid: empty ID
    email: 'invalid-email', // Invalid: not a proper email
    firstName: '', // Invalid: empty name
    role: 'invalid-role' as any, // Invalid: not a valid role
  };
  
  const invalidValidation = validateUser(invalidUserData);
  console.log('Invalid user validation:', invalidValidation);
  
  return {
    userValidation,
    projectValidation,
    invalidValidation,
  };
};

// ============================================================================
// EXAMPLE 3: API Client Usage
// ============================================================================

export const exampleApiClientUsage = async () => {
  console.log('=== API Client Example ===');
  
  // Set authentication token
  apiClient.setAuthToken('your-jwt-token-here');
  
  try {
    // Example: Fetch current user
    // const currentUser = await apiClient.users.getCurrentUser();
    // console.log('Current user:', currentUser.data);
    
    // Example: Fetch projects with filters
    // const projects = await apiClient.projects.getProjects({
    //   page: 1,
    //   limit: 10,
    //   filters: {
    //     status: ['active', 'planning'],
    //     priority: ['high', 'urgent'],
    //   },
    //   sort: {
    //     field: 'dueDate',
    //     direction: 'asc',
    //   },
    // });
    // console.log('Projects:', projects.data);
    
    // Example: Create a new task
    // const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'> = {
    //   projectId: 'project-123',
    //   title: 'Implement user authentication',
    //   description: 'Add login and registration functionality',
    //   status: 'todo',
    //   priority: 'high',
    //   reporterId: 'user-123',
    //   tags: ['backend', 'security'],
    //   dependencies: [],
    // };
    // const createdTask = await apiClient.tasks.createTask(newTask);
    // console.log('Created task:', createdTask.data);
    
    console.log('API client is configured and ready to use');
    console.log('Uncomment the API calls above when you have a backend server running');
    
  } catch (error) {
    console.error('API Error:', error);
  }
};

// ============================================================================
// EXAMPLE 4: Type Safety Demonstration
// ============================================================================

export const exampleTypeSafety = () => {
  console.log('=== Type Safety Example ===');
  
  const dataset = generateCompleteDataset();
  
  // TypeScript will enforce type safety
  const activeProjects = dataset.projects.filter(project => project.status === 'active');
  const highPriorityTasks = dataset.tasks.filter(task => task.priority === 'high');
  
  // This would cause a TypeScript error:
  // const invalidFilter = dataset.projects.filter(project => project.status === 'invalid-status');
  
  console.log(`Found ${activeProjects.length} active projects`);
  console.log(`Found ${highPriorityTasks.length} high priority tasks`);
  
  // Demonstrate type inference
  activeProjects.forEach(project => {
    // TypeScript knows project is of type Project
    console.log(`Project: ${project.name} (${project.progress}% complete)`);
    
    // TypeScript will autocomplete available properties
    const teamSize = project.team.length;
    const isOverdue = project.dueDate && project.dueDate < new Date();
    
    console.log(`  Team size: ${teamSize}, Overdue: ${isOverdue}`);
  });
  
  return {
    activeProjects: activeProjects.length,
    highPriorityTasks: highPriorityTasks.length,
  };
};

// ============================================================================
// EXAMPLE 5: Working with Relationships
// ============================================================================

export const exampleRelationships = () => {
  console.log('=== Relationships Example ===');
  
  const dataset = generateCompleteDataset();
  
  // Find all tasks for a specific project
  const firstProject = dataset.projects[0];
  const projectTasks = dataset.tasks.filter(task => task.projectId === firstProject.id);
  
  console.log(`Project "${firstProject.name}" has ${projectTasks.length} tasks`);
  
  // Group tasks by status
  const tasksByStatus = projectTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
  
  console.log('Tasks by status:', Object.keys(tasksByStatus).map(status => 
    `${status}: ${tasksByStatus[status].length}`
  ));
  
  // Find team members for projects
  dataset.projects.forEach(project => {
    if (project.team.length > 0) {
      console.log(`Project "${project.name}" team:`);
      project.team.forEach(member => {
        const user = dataset.users.find(u => u.id === member.userId);
        if (user) {
          console.log(`  - ${user.firstName} ${user.lastName} (${member.role})`);
        }
      });
    }
  });
  
  return {
    projectTasks: projectTasks.length,
    tasksByStatus,
  };
};

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

export const runAllExamples = async () => {
  console.log('🚀 Running Data Model Examples...\n');
  
  const mockData = exampleMockDataUsage();
  console.log('\n');
  
  const validation = exampleValidationUsage();
  console.log('\n');
  
  await exampleApiClientUsage();
  console.log('\n');
  
  const typeSafety = exampleTypeSafety();
  console.log('\n');
  
  const relationships = exampleRelationships();
  console.log('\n');
  
  console.log('✅ All examples completed successfully!');
  
  return {
    mockData,
    validation,
    typeSafety,
    relationships,
  };
};

// Uncomment to run examples in development
// runAllExamples().catch(console.error);