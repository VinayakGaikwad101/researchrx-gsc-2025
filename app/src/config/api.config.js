import AsyncStorage from '@react-native-async-storage/async-storage';

// Get base URL based on environment
const API_BASE_URL = process.env.EXPO_PUBLIC_ENV === 'development' 
  ? process.env.EXPO_PUBLIC_DEV_API_URL 
  : process.env.EXPO_PUBLIC_PROD_API_URL;

// Token storage keys
const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const ENDPOINTS = {
  // Patient endpoints
  PATIENT_LOGIN: `${API_BASE_URL}/api/auth/patient/login`,
  PATIENT_REGISTER: `${API_BASE_URL}/api/auth/patient/register`,
  PATIENT_VERIFY_EMAIL: `${API_BASE_URL}/api/auth/patient/verify-email`,
  PATIENT_FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/patient/forgot-password`,
  PATIENT_LOGOUT: `${API_BASE_URL}/api/auth/patient/logout`,
  
  // Researcher endpoints
  RESEARCHER_LOGIN: `${API_BASE_URL}/api/main/auth/researcher/login`,
  RESEARCHER_REGISTER: `${API_BASE_URL}/api/main/auth/researcher/register`,
  RESEARCHER_VERIFY_EMAIL: `${API_BASE_URL}/api/main/auth/researcher/verify-email`,
  RESEARCHER_FORGOT_PASSWORD: `${API_BASE_URL}/api/main/auth/researcher/forgot-password`,
  RESEARCHER_LOGOUT: `${API_BASE_URL}/api/main/auth/researcher/logout`,
};

// Token management
export const storeAuthData = async (token, userData) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw error;
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getAuthUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

// API call helper with error handling
export const apiCall = async (endpoint, method = 'POST', data = null) => {
  try {
    const token = await getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(endpoint, {
      method,
      headers,
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

// Function to update base URL (used by localtunnel)
export const updateBaseUrl = (url) => {
  if (process.env.EXPO_PUBLIC_ENV === 'development') {
    process.env.EXPO_PUBLIC_DEV_API_URL = url;
  }
};
