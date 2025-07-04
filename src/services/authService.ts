const API_BASE = '/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Always expect JSON for API responses
  const text = await response.text();
  if (text.trim() === '') {
    return {};
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON:', text);
    throw new Error('Invalid JSON response');
  }
};

export const authService = {
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    return handleResponse(response);
  },

  async register(username: string, email: string, password: string, role: string = 'user') {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    return handleResponse(response);
  },

  async verifyToken() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },
};