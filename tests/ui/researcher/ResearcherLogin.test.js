import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ResearcherLogin from '../../../app/src/screens/Researcher/ResearcherLogin';
import { ENDPOINTS, apiCall, storeAuthData } from '../../../app/src/config/api.config';

// Mock the dependencies
jest.mock('../../../app/src/config/api.config', () => ({
  ENDPOINTS: {
    RESEARCHER_LOGIN: '/api/researcher/login'
  },
  apiCall: jest.fn(),
  storeAuthData: jest.fn()
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('ResearcherLogin Component', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    reset: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <ResearcherLogin navigation={mockNavigation} />
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account? Register")).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
    expect(getByText('Researcher Login')).toBeTruthy(); // Specific to researcher login
  });

  it('handles empty form submission', () => {
    const { getByText } = render(
      <ResearcherLogin navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Login'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
  });

  it('handles successful login', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-researcher-token',
      user: { 
        id: '1', 
        email: 'researcher@example.com',
        role: 'Researcher'
      }
    };
    apiCall.mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = render(
      <ResearcherLogin navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'researcher@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(apiCall).toHaveBeenCalledWith(
        ENDPOINTS.RESEARCHER_LOGIN,
        'POST',
        {
          email: 'researcher@example.com',
          password: 'password123'
        }
      );
      expect(storeAuthData).toHaveBeenCalledWith(mockResponse.token, mockResponse.user);
      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'ResearcherHome' }]
      });
    });
  });

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials';
    apiCall.mockRejectedValueOnce(new Error(errorMessage));

    const { getByPlaceholderText, getByText } = render(
      <ResearcherLogin navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'researcher@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
    });
  });

  it('navigates to registration screen', () => {
    const { getByText } = render(
      <ResearcherLogin navigation={mockNavigation} />
    );

    fireEvent.press(getByText("Don't have an account? Register"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ResearcherRegister');
  });

  it('navigates to forgot password screen', () => {
    const { getByText } = render(
      <ResearcherLogin navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Forgot Password?'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ResearcherForgotPassword');
  });

  it('disables form during login process', async () => {
    apiCall.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { getByPlaceholderText, getByText } = render(
      <ResearcherLogin navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'researcher@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    expect(getByText('Logging in...')).toBeTruthy();
    expect(emailInput.props.editable).toBe(false);
    expect(passwordInput.props.editable).toBe(false);
  });

  it('handles server error response', async () => {
    const errorResponse = {
      success: false,
      message: 'Server error occurred'
    };
    apiCall.mockResolvedValueOnce(errorResponse);

    const { getByPlaceholderText, getByText } = render(
      <ResearcherLogin navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'researcher@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorResponse.message);
    });
  });
});
