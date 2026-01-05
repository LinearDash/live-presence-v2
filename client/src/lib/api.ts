const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleError = async (response: Response) => {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
};

export const api = {
  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },

  async register(userData: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },

  // User endpoints
  async getCurrentUser() {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Session expired');
      }
      await handleError(response);
    }

    return response.json();
  },

  async getAllUsers() {
    const response = await fetch(`${API_URL}/api/users/getUsers`, {
      credentials: 'include',
    });

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },

  async getUser(userId: string) {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },

  async createUser(userData: { name: string; email: string }) {
    const response = await fetch(`${API_URL}/api/users/createUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },

  // Message endpoints
  async getConversations() {
    const response = await fetch(`${API_URL}/api/messages/conversations`, {
      credentials: 'include',
    });

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },

  async sendMessage(data: { receiverId: string; content: string }) {
    const response = await fetch(`${API_URL}/api/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },

  async getMessageHistory(conversationId: string, limit: number = 50, offset: number = 0) {
    const response = await fetch(
      `${API_URL}/api/messages/${conversationId}/history?limit=${limit}&offset=${offset}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },

  async markMessagesAsRead(conversationId: string) {
    const response = await fetch(`${API_URL}/api/messages/${conversationId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleError(response);
    }

    return response.json();
  },
};