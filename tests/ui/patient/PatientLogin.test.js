import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import PatientLogin from '../../../app/src/screens/Patient/PatientLogin';
import { ENDPOINTS, apiCall, storeAuthData } from '../../../app/src/config/api.config';

// Mock the dependencies
jest.mock('../../../app/src/config/api.config', () => ({
  ENDPOINTS: {
    PATIENT_LOGIN: '/api/patient/login'
  },
  apiCall: jest.fn(),
  storeAuthData: jest.fn()
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('PatientLogin Component', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    reset: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <PatientLogin navigation={mockNavigation} />
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account? Register")).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
  });

  it('handles empty form submission', () => {
    const { getByText } = render(
      <PatientLogin navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Login'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
  });

  it('handles successful login', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-token',
      user: { id: '1', email: 'test@example.com' }
    };
    apiCall.mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = render(
      <PatientLogin navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(apiCall).toHaveBeenCalledWith(
        ENDPOINTS.PATIENT_LOGIN,
        'POST',
        {
          email: 'test@example.com',
          password: 'password123'
        }
      );
      expect(storeAuthData).toHaveBeenCalledWith(mockResponse.token, mockResponse.user);
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'PatientHome' }]
      });
    });
  });

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials';
    apiCall.mockRejectedValueOnce(new Error(errorMessage));

    const { getByPlaceholderText, getByText } = render(
      <PatientLogin navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
    });
  });

  it('navigates to registration screen', () => {
    const { getByText } = render(
      <PatientLogin navigation={mockNavigation} />
    );

    fireEvent.press(getByText("Don't have an account? Register"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PatientRegister');
  });

  it('navigates to forgot password screen', () => {
    const { getByText } = render(
      <PatientLogin navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Forgot Password?'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PatientForgotPassword');
  });

  it('disables form during login process', async () => {
    apiCall.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { getByPlaceholderText, getByText } = render(
      <PatientLogin navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    expect(getByText('Logging in...')).toBeTruthy();
    expect(emailInput.props.editable).toBe(false);
    expect(passwordInput.props.editable).toBe(false);
  });
});
