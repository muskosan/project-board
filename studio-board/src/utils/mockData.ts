import type {
  User,
  Project,
  Task,
  Client,
  CalendarEvent,
  ActivityItem,
  Comment,
  Attachment,
  FileItem,
  Column,
  UserRole,
  ProjectStatus,
  Priority,
  CalendarEventType,
  ActivityType,
} from '../types';

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

// Utility functions for generating random data
const randomId = (): string => Math.random().toString(36).substr(2, 9);

const randomDate = (start: Date = new Date(2023, 0, 1), end: Date = new Date()): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomFutureDate = (daysFromNow: number = 30): Date => {
  const now = new Date();
  return new Date(now.getTime() + Math.random() * daysFromNow * 24 * 60 * 60 * 1000);
};

const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Color assignment counter for consistent project colors
let colorIndex = 0;
const getNextColor = (): string => {
  const color = softBlueColors[colorIndex % softBlueColors.length];
  colorIndex++;
  return color;
};

const randomChoices = <T>(array: T[], count: number = 3): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

const randomBoolean = (): boolean => Math.random() > 0.5;

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Sample data arrays
const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
  'Sage', 'River', 'Phoenix', 'Rowan', 'Skyler', 'Cameron', 'Drew', 'Emery'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'
];

const companyNames = [
  'Creative Studios', 'Design Co.', 'Digital Agency', 'Brand Works', 'Studio Plus',
  'Pixel Perfect', 'Modern Design', 'Creative Lab', 'Design House', 'Art Studio',
  'Visual Works', 'Creative Space', 'Design Studio', 'Brand Agency', 'Creative Hub'
];

const projectNames = [
  'Brand Redesign', 'Website Overhaul', 'Mobile App', 'Marketing Campaign', 'Logo Design',
  'E-commerce Platform', 'Social Media Strategy', 'Product Launch', 'Annual Report',
  'Corporate Identity', 'User Experience Audit', 'Digital Transformation', 'Content Strategy',
  'Brand Guidelines', 'Website Optimization'
];

const taskTitles = [
  'Design mockups', 'Review content', 'Update documentation', 'Client feedback',
  'Code review', 'Testing phase', 'Deploy to staging', 'Final approval',
  'Asset creation', 'Quality assurance', 'Performance optimization', 'Bug fixes',
  'User testing', 'Content migration', 'SEO optimization'
];

// Soft blue palette for consistent project colors
const softBlueColors = [
  '#E3F2FD', // Very light blue
  '#BBDEFB', // Light blue
  '#90CAF9', // Medium light blue
  '#64B5F6', // Medium blue
  '#42A5F5', // Medium blue
  '#2196F3', // Primary blue
  '#1E88E5', // Medium dark blue
  '#1976D2', // Dark blue
  '#1565C0', // Darker blue
  '#0D47A1', // Very dark blue
  '#81C784', // Soft green (complementary)
  '#AED581', // Light green (complementary)
];

const tags = [
  'urgent', 'design', 'development', 'review', 'testing', 'client',
  'marketing', 'branding', 'mobile', 'web', 'content', 'seo'
];

const taskStatuses = ['todo', 'in-progress', 'review', 'done'];

const fileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain', 'application/zip'];

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

export const generateMockUser = (overrides: Partial<User> = {}): User => {
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  
  return {
    id: randomId(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    firstName,
    lastName,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    role: randomChoice(['admin', 'manager', 'member', 'client'] as UserRole[]),
    permissions: [],
    preferences: {
      theme: randomChoice(['light', 'dark'] as const),
      notifications: {
        email: randomBoolean(),
        push: randomBoolean(),
        taskUpdates: randomBoolean(),
        projectUpdates: randomBoolean(),
        mentions: randomBoolean(),
        deadlines: randomBoolean(),
      },
      timezone: 'America/New_York',
      language: 'en',
    },
    createdAt: randomDate(),
    updatedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockClient = (overrides: Partial<Client> = {}): Client => {
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  
  return {
    id: randomId(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomChoice(companyNames).toLowerCase().replace(/\s+/g, '')}.com`,
    company: randomChoice(companyNames),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    phone: `+1-${randomNumber(100, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`,
    createdAt: randomDate(),
    updatedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockProject = (overrides: Partial<Project> = {}): Project => {
  const startDate = randomDate();
  const dueDate = randomFutureDate(60);
  
  return {
    id: randomId(),
    name: randomChoice(projectNames),
    description: `A comprehensive project focused on delivering high-quality results for our client. This project involves multiple phases and requires close collaboration between team members.`,
    status: randomChoice(['planning', 'active', 'on_hold', 'completed', 'cancelled'] as ProjectStatus[]),
    priority: randomChoice(['low', 'medium', 'high', 'urgent'] as Priority[]),
    startDate,
    dueDate,
    completedAt: undefined,
    progress: randomNumber(0, 100),
    budget: randomNumber(5000, 50000),
    client: undefined, // Will be populated separately
    team: [], // Will be populated separately
    tags: randomChoices(tags, randomNumber(1, 4)),
    color: getNextColor(), // Use systematic color assignment
    settings: {
      isPublic: randomBoolean(),
      allowClientAccess: randomBoolean(),
      enableTimeTracking: randomBoolean(),
      enableComments: randomBoolean(),
      enableFileSharing: randomBoolean(),
    },
    createdAt: randomDate(),
    updatedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockTask = (projectId: string, overrides: Partial<Task> = {}): Task => {
  return {
    id: randomId(),
    projectId,
    title: randomChoice(taskTitles),
    description: `Detailed description of the task requirements and expected deliverables. This task is part of the overall project workflow and requires attention to detail.`,
    status: randomChoice(taskStatuses),
    priority: randomChoice(['low', 'medium', 'high', 'urgent'] as Priority[]),
    assigneeId: undefined, // Will be set separately
    reporterId: randomId(),
    dueDate: randomFutureDate(14),
    estimatedHours: randomNumber(1, 40),
    actualHours: randomNumber(0, 35),
    tags: randomChoices(tags, randomNumber(1, 3)),
    dependencies: [],
    attachments: [],
    comments: [],
    createdAt: randomDate(),
    updatedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockComment = (authorId: string, overrides: Partial<Comment> = {}): Comment => {
  const comments = [
    'Great work on this! Looking forward to the next iteration.',
    'I have some feedback on the design approach. Can we schedule a quick call?',
    'The latest changes look good. Ready for client review.',
    'Found a small issue with the implementation. Details in the attached file.',
    'This is exactly what we needed. Excellent execution!',
    'Can we adjust the timeline slightly? Client requested some changes.',
  ];

  return {
    id: randomId(),
    content: randomChoice(comments),
    authorId,
    createdAt: randomDate(),
    mentions: [],
    ...overrides,
  };
};

export const generateMockAttachment = (uploadedBy: string, overrides: Partial<Attachment> = {}): Attachment => {
  const filenames = [
    'design-mockup.png', 'project-brief.pdf', 'assets.zip', 'wireframes.sketch',
    'content-draft.docx', 'brand-guidelines.pdf', 'logo-variations.ai', 'screenshots.zip'
  ];

  const filename = randomChoice(filenames);
  const extension = filename.split('.').pop() || 'png';
  const mimeType = fileTypes.find(type => type.includes(extension)) || 'application/octet-stream';

  return {
    id: randomId(),
    filename,
    url: `https://example.com/files/${randomId()}/${filename}`,
    size: randomNumber(1024, 10485760), // 1KB to 10MB
    mimeType,
    uploadedBy,
    uploadedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockCalendarEvent = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => {
  const eventTitles = [
    'Client Meeting', 'Design Review', 'Project Kickoff', 'Status Update',
    'Deadline', 'Team Standup', 'Presentation', 'Feedback Session'
  ];

  const start = randomFutureDate(30);
  const end = new Date(start.getTime() + randomNumber(1, 4) * 60 * 60 * 1000); // 1-4 hours later

  return {
    id: randomId(),
    title: randomChoice(eventTitles),
    description: 'Important project milestone or meeting.',
    start,
    end,
    type: randomChoice(['deadline', 'meeting', 'milestone'] as CalendarEventType[]),
    color: getNextColor(), // Use systematic color assignment
    attendees: [],
    createdBy: randomId(),
    createdAt: randomDate(),
    updatedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockActivityItem = (overrides: Partial<ActivityItem> = {}): ActivityItem => {
  const activities = [
    'commented on a task',
    'updated project status',
    'uploaded a new file',
    'completed a task',
    'created a new task',
    'mentioned you in a comment',
  ];

  return {
    id: randomId(),
    type: randomChoice(['comment', 'task_update', 'file_upload', 'project_update'] as ActivityType[]),
    userId: randomId(),
    timestamp: randomDate(),
    content: randomChoice(activities),
    metadata: {},
    ...overrides,
  };
};

export const generateMockFileItem = (overrides: Partial<FileItem> = {}): FileItem => {
  const filenames = [
    'project-assets', 'design-files', 'documentation', 'client-feedback',
    'final-deliverables', 'work-in-progress', 'archive', 'resources'
  ];

  const isFolder = randomBoolean();
  const name = isFolder ? randomChoice(filenames) : `${randomChoice(filenames)}.${randomChoice(['png', 'pdf', 'docx', 'zip'])}`;

  return {
    id: randomId(),
    name,
    type: isFolder ? 'folder' : 'file',
    size: isFolder ? undefined : randomNumber(1024, 10485760),
    mimeType: isFolder ? undefined : randomChoice(fileTypes),
    thumbnail: isFolder ? undefined : `https://example.com/thumbnails/${randomId()}.jpg`,
    lastModified: randomDate(),
    version: isFolder ? undefined : randomNumber(1, 5),
    ...overrides,
  };
};

export const generateMockColumn = (title: string, taskCount: number = 5): Column => {
  return {
    id: randomId(),
    title,
    tasks: Array.from({ length: taskCount }, () => generateMockTask(randomId())),
    color: getNextColor(), // Use systematic color assignment
    limit: randomNumber(5, 15),
    order: 0,
  };
};

// ============================================================================
// BULK DATA GENERATORS
// ============================================================================

export const generateMockUsers = (count: number = 10): User[] => {
  return Array.from({ length: count }, () => generateMockUser());
};

export const generateMockProjects = (count: number = 5, users: User[] = []): Project[] => {
  return Array.from({ length: count }, () => {
    const project = generateMockProject();
    
    // Add team members
    if (users.length > 0) {
      const teamSize = randomNumber(2, Math.min(6, users.length));
      const teamUsers = randomChoices(users, teamSize);
      project.team = teamUsers.map(user => ({
        userId: user.id,
        user,
        role: randomChoice(['lead', 'member', 'viewer'] as const),
        joinedAt: randomDate(),
      }));
    }

    return project;
  });
};

export const generateMockTasks = (projectId: string, count: number = 10, users: User[] = []): Task[] => {
  return Array.from({ length: count }, () => {
    const task = generateMockTask(projectId);
    
    // Assign random user if available
    if (users.length > 0) {
      task.assigneeId = randomChoice(users).id;
      task.reporterId = randomChoice(users).id;
    }

    // Add comments
    const commentCount = randomNumber(0, 5);
    task.comments = Array.from({ length: commentCount }, () => 
      generateMockComment(users.length > 0 ? randomChoice(users).id : randomId())
    );

    // Add attachments
    const attachmentCount = randomNumber(0, 3);
    task.attachments = Array.from({ length: attachmentCount }, () =>
      generateMockAttachment(users.length > 0 ? randomChoice(users).id : randomId())
    );

    return task;
  });
};

export const generateMockKanbanBoard = (): Column[] => {
  const columnTitles = ['To Do', 'In Progress', 'Review', 'Done'];
  
  return columnTitles.map((title, index) => ({
    ...generateMockColumn(title, randomNumber(3, 8)),
    order: index,
  }));
};

export const generateMockChatMessage = (threadId: string, authorId: string, overrides: Partial<import('../types').ChatMessage> = {}): import('../types').ChatMessage => {
  const messages = [
    'Hey team, how are we progressing on the design mockups?',
    'I just uploaded the latest wireframes to the project folder.',
    'Great work on the user research! The insights are really valuable.',
    'Can we schedule a quick sync to discuss the timeline?',
    'The client feedback looks positive. Let\'s implement those changes.',
    'I\'ve updated the project requirements based on our last meeting.',
    'The new color palette looks amazing! 🎨',
    'Don\'t forget about the deadline next Friday.',
    'I think we should consider a different approach for the navigation.',
    'The prototype is ready for testing. Who wants to take a look?',
  ];

  return {
    id: randomId(),
    content: randomChoice(messages),
    authorId,
    threadId,
    mentions: [],
    attachments: [],
    reactions: [],
    isEdited: randomBoolean() && Math.random() < 0.1, // 10% chance of being edited
    editedAt: randomBoolean() ? randomDate() : undefined,
    createdAt: randomDate(),
    updatedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockChatThread = (projectId?: string, overrides: Partial<import('../types').ChatThread> = {}): import('../types').ChatThread => {
  const threadTitles = [
    'General Discussion',
    'Design Review',
    'Development Updates',
    'Client Feedback',
    'Project Planning',
    'Bug Reports',
    'Feature Requests',
    'Team Announcements',
  ];

  return {
    id: randomId(),
    title: randomChoice(threadTitles),
    projectId,
    participants: [], // Will be populated separately
    messageCount: randomNumber(0, 50),
    isArchived: randomBoolean() && Math.random() < 0.1, // 10% chance of being archived
    createdBy: randomId(),
    createdAt: randomDate(),
    updatedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockNote = (authorId: string, projectId?: string, overrides: Partial<import('../types').Note> = {}): import('../types').Note => {
  const noteTitles = [
    'Meeting Notes - Client Kickoff',
    'Design System Guidelines',
    'User Research Findings',
    'Technical Requirements',
    'Project Timeline',
    'Brand Guidelines Summary',
    'Accessibility Checklist',
    'Performance Optimization Ideas',
    'Content Strategy Notes',
    'Testing Scenarios',
  ];

  const noteContents = [
    'Key takeaways from today\'s meeting:\n\n• Client wants to focus on mobile-first approach\n• Budget approved for additional features\n• Timeline is flexible but prefer earlier delivery\n• Need to schedule follow-up in 2 weeks',
    'Design system components and guidelines:\n\n• Color palette: Primary blues, secondary grays\n• Typography: Inter for body, Playfair for headings\n• Spacing: 8px base unit system\n• Components: Buttons, forms, cards, navigation',
    'User research insights:\n\n• Users prefer simple navigation\n• Mobile usage is 70% of traffic\n• Loading speed is critical\n• Visual hierarchy needs improvement',
    'Technical requirements and constraints:\n\n• Must support IE11+\n• Performance budget: <3s load time\n• Accessibility: WCAG 2.1 AA compliance\n• SEO optimization required',
  ];

  const allTags = ['meeting', 'design', 'research', 'technical', 'client', 'timeline', 'requirements', 'notes', 'ideas', 'feedback'];

  return {
    id: randomId(),
    title: randomChoice(noteTitles),
    content: randomChoice(noteContents),
    authorId,
    projectId,
    tags: randomChoices(allTags, randomNumber(1, 4)),
    isPinned: randomBoolean() && Math.random() < 0.2, // 20% chance of being pinned
    isPublic: randomBoolean(),
    attachments: [],
    mentions: [],
    version: randomNumber(1, 5),
    createdAt: randomDate(),
    updatedAt: randomDate(),
    ...overrides,
  };
};

export const generateMockDocumentLink = (url: string, overrides: Partial<import('../types').DocumentLink> = {}): import('../types').DocumentLink => {
  const domain = new URL(url).hostname;
  
  return {
    id: randomId(),
    url,
    title: `Document from ${domain}`,
    description: 'Shared document or webpage',
    domain,
    type: 'webpage',
    createdAt: new Date(),
    ...overrides,
  };
};

// ============================================================================
// BULK CHAT DATA GENERATORS
// ============================================================================

export const generateMockChatData = (users: User[], projects: Project[] = []) => {
  const threads: import('../types').ChatThread[] = [];
  const messages: import('../types').ChatMessage[] = [];

  // Generate threads
  const threadCount = randomNumber(3, 8);
  for (let i = 0; i < threadCount; i++) {
    const projectId = projects.length > 0 && randomBoolean() ? randomChoice(projects).id : undefined;
    const thread = generateMockChatThread(projectId);
    
    // Add participants
    const participantCount = randomNumber(2, Math.min(6, users.length));
    thread.participants = randomChoices(users, participantCount).map(user => user.id);
    
    threads.push(thread);

    // Generate messages for this thread
    const messageCount = randomNumber(5, 25);
    for (let j = 0; j < messageCount; j++) {
      const author = randomChoice(users);
      const message = generateMockChatMessage(thread.id, author.id);
      
      // Add some mentions
      if (Math.random() < 0.3) { // 30% chance of mentions
        const mentionedUsers = randomChoices(users.filter(u => u.id !== author.id), randomNumber(1, 2));
        message.mentions = mentionedUsers.map(u => `${u.firstName} ${u.lastName}`);
        message.content += ` @${message.mentions[0]}`;
      }

      // Add some attachments
      if (Math.random() < 0.1) { // 10% chance of attachments
        message.attachments = [generateMockAttachment(author.id)];
      }

      messages.push(message);
    }

    // Update thread with last message
    const threadMessages = messages.filter(m => m.threadId === thread.id);
    if (threadMessages.length > 0) {
      const lastMessage = threadMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      thread.lastMessageId = lastMessage.id;
      thread.lastMessage = lastMessage;
      thread.messageCount = threadMessages.length;
    }
  }

  return { threads, messages };
};

export const generateMockNotesData = (users: User[], projects: Project[] = []): import('../types').Note[] => {
  const notes: import('../types').Note[] = [];
  const noteCount = randomNumber(8, 20);

  for (let i = 0; i < noteCount; i++) {
    const author = randomChoice(users);
    const projectId = projects.length > 0 && randomBoolean() ? randomChoice(projects).id : undefined;
    const note = generateMockNote(author.id, projectId);
    
    // Add some attachments
    if (Math.random() < 0.2) { // 20% chance of attachments
      const attachmentCount = randomNumber(1, 3);
      note.attachments = Array.from({ length: attachmentCount }, () =>
        generateMockAttachment(author.id)
      );
    }

    // Add some mentions
    if (Math.random() < 0.3) { // 30% chance of mentions
      const mentionedUsers = randomChoices(users.filter(u => u.id !== author.id), randomNumber(1, 2));
      note.mentions = mentionedUsers.map(u => u.id);
    }

    notes.push(note);
  }

  return notes;
};

// ============================================================================
// COMPLETE DATASET GENERATOR
// ============================================================================

export interface MockDataset {
  users: User[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  calendarEvents: CalendarEvent[];
  activityItems: ActivityItem[];
  fileItems: FileItem[];
  kanbanBoard: Column[];
  chatThreads: import('../types').ChatThread[];
  chatMessages: import('../types').ChatMessage[];
  notes: import('../types').Note[];
}

export const generateCompleteDataset = (): MockDataset => {
  // Reset color index for consistent colors
  colorIndex = 0;
  
  // Generate users first
  const users = generateMockUsers(15);
  const clients = Array.from({ length: 5 }, () => generateMockClient());
  
  // Generate projects with team assignments
  const projects = generateMockProjects(8, users);
  
  // Assign clients to some projects
  projects.forEach(project => {
    if (randomBoolean()) {
      project.client = randomChoice(clients);
    }
  });

  // Generate tasks for each project
  const allTasks: Task[] = [];
  projects.forEach(project => {
    const projectTasks = generateMockTasks(project.id, randomNumber(5, 15), users);
    allTasks.push(...projectTasks);
  });

  // Generate calendar events
  const calendarEvents = Array.from({ length: 20 }, () => {
    const event = generateMockCalendarEvent();
    // Link some events to projects
    if (randomBoolean() && projects.length > 0) {
      const project = randomChoice(projects);
      event.projectId = project.id;
      event.project = project;
    }
    return event;
  });

  // Generate activity items
  const activityItems = Array.from({ length: 50 }, () => {
    const activity = generateMockActivityItem();
    activity.userId = randomChoice(users).id;
    
    // Link to projects and tasks
    if (randomBoolean() && projects.length > 0) {
      const project = randomChoice(projects);
      activity.projectId = project.id;
      activity.project = project;
    }
    
    if (randomBoolean() && allTasks.length > 0) {
      const task = randomChoice(allTasks);
      activity.taskId = task.id;
      activity.task = task;
    }
    
    return activity;
  });

  // Generate file items
  const fileItems = Array.from({ length: 30 }, () => generateMockFileItem());

  // Generate Kanban board
  const kanbanBoard = generateMockKanbanBoard();

  // Generate chat data
  const { threads: chatThreads, messages: chatMessages } = generateMockChatData(users, projects);

  // Generate notes
  const notes = generateMockNotesData(users, projects);

  return {
    users,
    clients,
    projects,
    tasks: allTasks,
    calendarEvents,
    activityItems,
    fileItems,
    kanbanBoard,
    chatThreads,
    chatMessages,
    notes,
  };
};