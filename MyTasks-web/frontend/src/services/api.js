const rawBaseUrl = (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL)
  ? process.env.VITE_API_URL.trim()
  : '';

const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_URL = normalizedBaseUrl
  ? (normalizedBaseUrl.endsWith('/api') ? normalizedBaseUrl : `${normalizedBaseUrl}/api`)
  : '/api';

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Erro na requisição',
          errors: data.errors
        };
      }

      return data;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message: 'Erro de conexão. Verifique sua internet.'
      };
    }
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async getTasks(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.urgency) params.append('urgency', filters.urgency);
    
    const query = params.toString();
    return this.request(`/tasks${query ? `?${query}` : ''}`);
  }

  async getTaskById(id) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async markTaskComplete(id) {
    return this.request(`/tasks/${id}/complete`, {
      method: 'PATCH'
    });
  }

  async markTaskPending(id) {
    return this.request(`/tasks/${id}/reopen`, {
      method: 'PATCH'
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  async getTaskStats() {
    return this.request('/tasks/stats');
  }
}

export const api = new ApiService();
export default api;
