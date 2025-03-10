// The base URL will be updated when the server starts and provides the tunnel URL
let API_BASE_URL = 'http://localhost:3000';

// Function to update the base URL if we're using the tunnel
export const updateBaseUrl = (url) => {
  API_BASE_URL = url;
};

export const ENDPOINTS = {
  // Patient endpoints
  PATIENT_LOGIN: `${API_BASE_URL}/api/patient/login`,
  PATIENT_REGISTER: `${API_BASE_URL}/api/patient/register`,
  
  // Researcher endpoints
  RESEARCHER_LOGIN: `${API_BASE_URL}/api/researcher/login`,
  RESEARCHER_REGISTER: `${API_BASE_URL}/api/researcher/register`,
};

// API call helper with error handling
export const apiCall = async (endpoint, method = 'POST', data = null) => {
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(data && { body: JSON.stringify(data) }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
