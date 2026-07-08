const API_BASE_URL = 'https://cograd-pathshala-ygyi.onrender.com/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('cograd_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const handleResponse = async (res) => {
    if (res.status === 401) {
      // Clear stale session credentials
      localStorage.removeItem('cograd_token');
      localStorage.removeItem('cograd_logged_in');
      localStorage.removeItem('cograd_role');
      localStorage.removeItem('cograd_logged_in_email');
      localStorage.removeItem('cograd_teacher_name');
      localStorage.removeItem('cograd_student_name');
      localStorage.removeItem('cograd_parent_name');
      
      // Redirect to login if not already there
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const err = new Error(errorData.message || `HTTP error! status: ${res.status}`);
      err.requiresVerification = errorData.requiresVerification;
      err.email = errorData.email;
      throw err;
    }

    return res.json();
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return await handleResponse(response);
};

export const api = {
  get: (endpoint, options = {}) => apiCall(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => apiCall(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => apiCall(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options = {}) => apiCall(endpoint, { ...options, method: 'DELETE' }),
};
