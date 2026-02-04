// API Service Layer
const API_BASE_URL = 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  // Configura headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Effettua fetch
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  // Gestione errore 401 (token scaduto/non valido)
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sessione scaduta. Effettua nuovamente il login.');
  }

  // Gestione errori generici
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.msg || `Errore HTTP: ${response.status}`);
  }

  return await response.json();
};

// AUTH API

export const authAPI = {
  
  // POST /api/auth/login
  login: async (email, password) => {
    return await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // POST /api/auth/register
  register: async (email, password, ruolo = 'Manager') => {
    return await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, ruolo })
    });
  }
};

// VEHICLES API

export const vehiclesAPI = {
  // GET /api/veicoli
  getAll: async () => {
    return await apiFetch('/veicoli', {
      method: 'GET'
    });
  },

  // GET /api/veicoli/:id
  getById: async (id) => {
    return await apiFetch(`/veicoli/${id}`, {
      method: 'GET'
    });
  },

  // POST /api/veicoli
  create: async (vehicleData) => {
    return await apiFetch('/veicoli', {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    });
  },

  // PUT /api/veicoli/:id
  update: async (id, vehicleData) => {
    return await apiFetch(`/veicoli/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData)
    });
  },

  // DELETE /api/veicoli/:id
  delete: async (id) => {
    return await apiFetch(`/veicoli/${id}`, {
      method: 'DELETE'
    });
  }
};

// ALARMS API

export const alarmsAPI = {
  // GET /api/allarmi
  getAll: async () => {
    return await apiFetch('/allarmi', {
      method: 'GET'
    });
  },
 
  // PATCH /api/allarmi/:id
  updateStatus: async (id, stato) => {
    return await apiFetch(`/allarmi/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stato })
    });
  }
};

// TELEMETRY API

export const telemetryAPI = {
  // POST /api/telemetria (no auth - sensori IoT)
  sendData: async (telemetryData) => {
    return await apiFetch('/telemetria', {
      method: 'POST',
      body: JSON.stringify(telemetryData)
    });
  }
};

