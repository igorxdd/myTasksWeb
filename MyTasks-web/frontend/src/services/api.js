const rawBaseUrl = (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL)
  ? process.env.VITE_API_URL.trim()
  : '';

const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const DEFAULT_REMOTE_API_URL = 'https://mytasksweb.onrender.com/api';
const isBrowser = typeof window !== 'undefined';
const isLocalHost = isBrowser && ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_URL = normalizedBaseUrl
  ? (normalizedBaseUrl.endsWith('/api') ? normalizedBaseUrl : `${normalizedBaseUrl}/api`)
  : (isLocalHost ? '/api' : DEFAULT_REMOTE_API_URL);

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
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw {
          status: response.status,
          message: typeof data === 'object'
            ? (data.message || 'Erro na requisicao')
            : 'Erro na requisicao',
          errors: typeof data === 'object' ? data.errors : undefined
        };
      }

      if (typeof data !== 'object') {
        throw {
          status: 0,
          message: 'Resposta invalida da API. Verifique VITE_API_URL no deploy.'
        };
      }

      return data;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message: 'Erro de conexao. Verifique VITE_API_URL, CORS e disponibilidade da API.'
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
