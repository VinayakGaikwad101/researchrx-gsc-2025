import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// Mock email utilities
export const mockEmailUtils = {
  sendVerificationCode: vi.fn(),
  sendWelcomeEmail: vi.fn(),
  sendPasswordResetSuccessEmail: vi.fn(),
  sendPatientPasswordResetEmail: vi.fn(),
  sendResearcherPasswordResetEmail: vi.fn(),
};

// Mock JWT utilities
export const mockJwtUtils = {
  sign: (payload, secret, options) => {
    return 'mock-jwt-token';
  },
  verify: (token, secret) => {
    if (token === 'invalid-token') {
      throw new jwt.JsonWebTokenError('Invalid token');
    }
    return { id: 'mock-user-id' };
  }
};

// Mock bcrypt utilities
export const mockBcryptUtils = {
  hashSync: (password, salt) => 'hashed-password',
  compareSync: (password, hash) => password === 'valid-password'
};

// Test data generators
export const generateTestUser = (role = 'Patient') => ({
  firstName: 'Test',
  lastName: 'User',
  email: `test${Math.random()}@example.com`,
  password: 'testPassword123',
  phoneNo: '1234567890',
  dob: new Date('1990-01-01'),
  gender: 'Male',
  role,
  specialization: role === 'Researcher' ? 'Cardiology' : undefined
});

// Mock response utilities
export const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
};

// Mock request utilities
export const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query
});

// UI test utilities
export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui);
};

// Mock API response
export const mockApiResponse = {
  success: true,
  message: 'Operation successful',
  data: null
};

// Test error messages
export const testErrorMessages = {
  requiredFields: 'All fields are required',
  invalidPassword: 'Password should be at least 8 characters long',
  invalidPhone: 'Phone number should be 10 digits long',
  emailExists: 'Email already exists and is verified',
  invalidCredentials: 'Invalid credentials',
  emailNotVerified: 'Email is not verified. Please verify your email',
  accessDenied: 'Access denied'
};
