import type {
  User,
  Project,
  Task,
  Client,
  CalendarEvent,
  ActivityItem,
  FileItem,
  Comment,
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
  SortOptions,
  SearchOptions,
} from '../types';

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

export const defaultConfig: ApiClientConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
};

// ============================================================================
// HTTP CLIENT
// ============================================================================

export class HttpClient {
  private config: ApiClientConfig;
  private authToken?: string;

  constructor(config: ApiClientConfig = defaultConfig) {
    this.config = config;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...this.config.headers };
    
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = this.getHeaders();

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new HttpError(
            errorData.code || `HTTP_${response.status}`,
            errorData.message || response.statusText,
            errorData.details,
            new Date(),
            this.authToken ? 'current_user' : undefined
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof HttpError && error.message.includes('HTTP_4')) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.config.retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError!;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.config.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.config.baseUrl}${endpoint}`);
      
      // Add auth header if available
      if (this.authToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.authToken}`);
      }

      xhr.send(formData);
    });
  }
}

// ============================================================================
// API SERVICE CLASSES
// ============================================================================

export class UserService {
  private client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.client.get<ApiResponse<User>>('/users/me');
  }

  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<PaginatedResponse<User>> {
    return this.client.get<PaginatedResponse<User>>('/users', params);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.client.get<ApiResponse<User>>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return this.client.put<ApiResponse<User>>(`/users/${id}`, data);
  }

  async updateUserPreferences(id: string, preferences: User['preferences']): Promise<ApiResponse<User>> {
    return this.client.patch<ApiResponse<User>>(`/users/${id}/preferences`, preferences);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<ApiResponse<void>>(`/users/${id}`);
  }
}

export class ProjectService {
  private client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  async getProjects(params?: {
    page?: number;
    limit?: number;
    filters?: FilterOptions;
    sort?: SortOptions;
    search?: SearchOptions;
  }): Promise<PaginatedResponse<Project>> {
    return this.client.get<PaginatedResponse<Project>>('/projects', params);
  }

  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    return this.client.get<ApiResponse<Project>>(`/projects/${id}`);
  }

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Project>> {
    return this.client.post<ApiResponse<Project>>('/projects', data);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.client.put<ApiResponse<Project>>(`/projects/${id}`, data);
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<ApiResponse<void>>(`/projects/${id}`);
  }

  async addTeamMember(projectId: string, userId: string, role: string): Promise<ApiResponse<Project>> {
    return this.client.post<ApiResponse<Project>>(`/projects/${projectId}/team`, { userId, role });
  }

  async removeTeamMember(projectId: string, userId: string): Promise<ApiResponse<Project>> {
    return this.client.delete<ApiResponse<Project>>(`/projects/${projectId}/team/${userId}`);
  }

  async updateTeamMemberRole(projectId: string, userId: string, role: string): Promise<ApiResponse<Project>> {
    return this.client.patch<ApiResponse<Project>>(`/projects/${projectId}/team/${userId}`, { role });
  }
}

export class TaskService {
  private client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  async getTasks(projectId?: string, params?: {
    page?: number;
    limit?: number;
    filters?: FilterOptions;
    sort?: SortOptions;
    search?: SearchOptions;
  }): Promise<PaginatedResponse<Task>> {
    const endpoint = projectId ? `/projects/${projectId}/tasks` : '/tasks';
    return this.client.get<PaginatedResponse<Task>>(endpoint, params);
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    return this.client.get<ApiResponse<Task>>(`/tasks/${id}`);
  }

  async createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>): Promise<ApiResponse<Task>> {
    return this.client.post<ApiResponse<Task>>('/tasks', data);
  }

  async updateTask(id: string, data: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.client.put<ApiResponse<Task>>(`/tasks/${id}`, data);
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<ApiResponse<void>>(`/tasks/${id}`);
  }

  async moveTask(id: string, newStatus: string, position?: number): Promise<ApiResponse<Task>> {
    return this.client.patch<ApiResponse<Task>>(`/tasks/${id}/move`, { status: newStatus, position });
  }

  async assignTask(id: string, assigneeId: string): Promise<ApiResponse<Task>> {
    return this.client.patch<ApiResponse<Task>>(`/tasks/${id}/assign`, { assigneeId });
  }
}

export class CommentService {
  private client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  async getComments(taskId: string): Promise<ApiResponse<Comment[]>> {
    return this.client.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
  }

  async createComment(taskId: string, content: string, mentions?: string[]): Promise<ApiResponse<Comment>> {
    return this.client.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content, mentions });
  }

  async updateComment(id: string, content: string): Promise<ApiResponse<Comment>> {
    return this.client.put<ApiResponse<Comment>>(`/comments/${id}`, { content });
  }

  async deleteComment(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<ApiResponse<void>>(`/comments/${id}`);
  }
}

export class FileService {
  private client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  async getFiles(projectId?: string, folderId?: string): Promise<ApiResponse<FileItem[]>> {
    const params: Record<string, any> = {};
    if (projectId) params.projectId = projectId;
    if (folderId) params.folderId = folderId;
    
    return this.client.get<ApiResponse<FileItem[]>>('/files', params);
  }

  async uploadFile(
    file: File,
    projectId?: string,
    folderId?: string,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileItem>> {
    const endpoint = `/files/upload?${new URLSearchParams({
      ...(projectId && { projectId }),
      ...(folderId && { folderId }),
    })}`;
    
    return this.client.upload<ApiResponse<FileItem>>(endpoint, file, onProgress);
  }

  async createFolder(name: string, projectId?: string, parentId?: string): Promise<ApiResponse<FileItem>> {
    return this.client.post<ApiResponse<FileItem>>('/files/folder', { name, projectId, parentId });
  }

  async renameFile(id: string, name: string): Promise<ApiResponse<FileItem>> {
    return this.client.patch<ApiResponse<FileItem>>(`/files/${id}`, { name });
  }

  async deleteFile(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<ApiResponse<void>>(`/files/${id}`);
  }

  async downloadFile(id: string): Promise<Blob> {
    // Use the client's request method for consistency
    return this.client.get<Blob>(`/files/${id}/download`);
  }
}

export class CalendarService {
  private client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  async getEvents(params?: {
    start?: Date;
    end?: Date;
    projectId?: string;
    type?: string;
  }): Promise<ApiResponse<CalendarEvent[]>> {
    return this.client.get<ApiResponse<CalendarEvent[]>>('/calendar/events', params);
  }

  async createEvent(data: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CalendarEvent>> {
    return this.client.post<ApiResponse<CalendarEvent>>('/calendar/events', data);
  }

  async updateEvent(id: string, data: Partial<CalendarEvent>): Promise<ApiResponse<CalendarEvent>> {
    return this.client.put<ApiResponse<CalendarEvent>>(`/calendar/events/${id}`, data);
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<ApiResponse<void>>(`/calendar/events/${id}`);
  }
}

export class ActivityService {
  private client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  async getActivity(params?: {
    page?: number;
    limit?: number;
    projectId?: string;
    userId?: string;
    type?: string;
  }): Promise<PaginatedResponse<ActivityItem>> {
    return this.client.get<PaginatedResponse<ActivityItem>>('/activity', params);
  }
}

export class ClientService {
  private client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  async getClients(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Client>> {
    return this.client.get<PaginatedResponse<Client>>('/clients', params);
  }

  async getClientById(id: string): Promise<ApiResponse<Client>> {
    return this.client.get<ApiResponse<Client>>(`/clients/${id}`);
  }

  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> {
    return this.client.post<ApiResponse<Client>>('/clients', data);
  }

  async updateClient(id: string, data: Partial<Client>): Promise<ApiResponse<Client>> {
    return this.client.put<ApiResponse<Client>>(`/clients/${id}`, data);
  }

  async deleteClient(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<ApiResponse<void>>(`/clients/${id}`);
  }
}

// ============================================================================
// API CLIENT INSTANCE
// ============================================================================

export class ApiClient {
  private httpClient: HttpClient;
  
  public users: UserService;
  public projects: ProjectService;
  public tasks: TaskService;
  public comments: CommentService;
  public files: FileService;
  public calendar: CalendarService;
  public activity: ActivityService;
  public clients: ClientService;

  constructor(config?: Partial<ApiClientConfig>) {
    this.httpClient = new HttpClient({ ...defaultConfig, ...config });
    
    this.users = new UserService(this.httpClient);
    this.projects = new ProjectService(this.httpClient);
    this.tasks = new TaskService(this.httpClient);
    this.comments = new CommentService(this.httpClient);
    this.files = new FileService(this.httpClient);
    this.calendar = new CalendarService(this.httpClient);
    this.activity = new ActivityService(this.httpClient);
    this.clients = new ClientService(this.httpClient);
  }

  setAuthToken(token: string): void {
    this.httpClient.setAuthToken(token);
  }

  clearAuthToken(): void {
    this.httpClient.clearAuthToken();
  }

  updateConfig(config: Partial<ApiClientConfig>): void {
    this.httpClient = new HttpClient({ ...this.httpClient['config'], ...config });
    
    // Recreate services with new client
    this.users = new UserService(this.httpClient);
    this.projects = new ProjectService(this.httpClient);
    this.tasks = new TaskService(this.httpClient);
    this.comments = new CommentService(this.httpClient);
    this.files = new FileService(this.httpClient);
    this.calendar = new CalendarService(this.httpClient);
    this.activity = new ActivityService(this.httpClient);
    this.clients = new ClientService(this.httpClient);
  }
}

// Create and export default instance
export const apiClient = new ApiClient();

// Export custom error class
export class HttpError extends Error {
  public code: string;
  public details?: Record<string, any>;
  public timestamp: Date;
  public userId?: string;

  constructor(
    code: string,
    message: string,
    details?: Record<string, any>,
    timestamp: Date = new Date(),
    userId?: string
  ) {
    super(message);
    this.name = 'HttpError';
    this.code = code;
    this.details = details;
    this.timestamp = timestamp;
    this.userId = userId;
  }
}