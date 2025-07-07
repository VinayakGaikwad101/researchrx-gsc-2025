import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { testDb } from '../../setup/testDb.js';
import { 
  mockEmailUtils, 
  mockRequest, 
  mockResponse, 
  generateTestUser,
  testErrorMessages 
} from '../../setup/mockUtils.js';
import { patientRegister, patientLogin, verifyEmail } from '../../../server/controllers/patientAuth.controller.js';
import User from '../../../server/models/user.model.js';

// Mock the email utilities
vi.mock('../../../server/utils/emailer.utils.js', () => mockEmailUtils);

describe('Patient Authentication Controller', () => {
  beforeEach(async () => {
    await testDb.connect();
  });

  afterEach(async () => {
    await testDb.clearDatabase();
    vi.clearAllMocks();
  });

  describe('patientRegister', () => {
    it('should successfully register a new patient', async () => {
      const testUser = generateTestUser('Patient');
      const req = mockRequest({ ...testUser });
      const res = mockResponse();

      await patientRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Registration successful! Please verify your email'
        })
      );
      expect(mockEmailUtils.sendVerificationCode).toHaveBeenCalled();

      // Verify user was saved to database
      const savedUser = await User.findOne({ email: testUser.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.role).toBe('Patient');
    });

    it('should return error for missing required fields', async () => {
      const incompleteUser = {
        email: 'test@example.com',
        password: 'password123'
      };
      const req = mockRequest({ ...incompleteUser });
      const res = mockResponse();

      await patientRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.requiredFields
        })
      );
    });

    it('should return error for invalid password length', async () => {
      const userWithShortPassword = generateTestUser('Patient');
      userWithShortPassword.password = '123';
      const req = mockRequest({ ...userWithShortPassword });
      const res = mockResponse();

      await patientRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.invalidPassword
        })
      );
    });

    it('should return error for invalid phone number length', async () => {
      const userWithInvalidPhone = generateTestUser('Patient');
      userWithInvalidPhone.phoneNo = '123';
      const req = mockRequest({ ...userWithInvalidPhone });
      const res = mockResponse();

      await patientRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.invalidPhone
        })
      );
    });

    it('should return error for existing verified email', async () => {
      const testUser = generateTestUser('Patient');
      // First create a verified user
      const existingUser = new User({
        ...testUser,
        isVerified: true
      });
      await existingUser.save();

      // Try to register with same email
      const req = mockRequest({ ...testUser });
      const res = mockResponse();

      await patientRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.emailExists
        })
      );
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email with valid code', async () => {
      // Create unverified user with verification code
      const testUser = generateTestUser('Patient');
      const verificationCode = '123456';
      const user = new User({
        ...testUser,
        verificationCode,
        isVerified: false
      });
      await user.save();

      const req = mockRequest({ code: verificationCode });
      const res = mockResponse();

      await verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Email verification successful, please Login'
        })
      );

      // Verify user status was updated
      const updatedUser = await User.findOne({ email: testUser.email });
      expect(updatedUser.isVerified).toBe(true);
      expect(updatedUser.verificationCode).toBeUndefined();
    });

    it('should return error for invalid verification code', async () => {
      const req = mockRequest({ code: 'invalid-code' });
      const res = mockResponse();

      await verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid or expired verification code'
        })
      );
    });
  });

  describe('patientLogin', () => {
    it('should successfully login verified patient', async () => {
      // Create verified user
      const testUser = generateTestUser('Patient');
      const user = new User({
        ...testUser,
        isVerified: true,
        password: 'hashed-password'
      });
      await user.save();

      const req = mockRequest({
        email: testUser.email,
        password: 'valid-password'
      });
      const res = mockResponse();

      await patientLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Login successful'
        })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'patientJWT',
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should return error for unverified email', async () => {
      // Create unverified user
      const testUser = generateTestUser('Patient');
      const user = new User({
        ...testUser,
        isVerified: false,
        password: 'hashed-password'
      });
      await user.save();

      const req = mockRequest({
        email: testUser.email,
        password: 'valid-password'
      });
      const res = mockResponse();

      await patientLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.emailNotVerified
        })
      );
    });

    it('should return error for invalid credentials', async () => {
      const req = mockRequest({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
      const res = mockResponse();

      await patientLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.invalidCredentials
        })
      );
    });
  });
});
