import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { testDb } from '../../setup/testDb.js';
import { 
  mockEmailUtils, 
  mockRequest, 
  mockResponse, 
  generateTestUser,
  testErrorMessages 
} from '../../setup/mockUtils.js';
import { researcherRegister, researcherLogin, verifyEmail } from '../../../server/controllers/researcherAuth.controller.js';
import User from '../../../server/models/user.model.js';

// Mock the email utilities
vi.mock('../../../server/utils/emailer.utils.js', () => mockEmailUtils);

describe('Researcher Authentication Controller', () => {
  beforeEach(async () => {
    await testDb.connect();
  });

  afterEach(async () => {
    await testDb.clearDatabase();
    vi.clearAllMocks();
  });

  describe('researcherRegister', () => {
    it('should successfully register a new researcher', async () => {
      const testUser = generateTestUser('Researcher');
      const req = mockRequest({ ...testUser });
      const res = mockResponse();

      await researcherRegister(req, res);

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
      expect(savedUser.role).toBe('Researcher');
      expect(savedUser.specialization).toBe(testUser.specialization);
    });

    it('should return error for missing specialization', async () => {
      const testUser = generateTestUser('Researcher');
      delete testUser.specialization;
      const req = mockRequest({ ...testUser });
      const res = mockResponse();

      await researcherRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.requiredFields
        })
      );
    });

    it('should return error for existing patient email', async () => {
      // First create a patient user
      const testUser = generateTestUser('Patient');
      const existingUser = new User({
        ...testUser,
        isVerified: true
      });
      await existingUser.save();

      // Try to register researcher with same email
      const researcherUser = generateTestUser('Researcher');
      researcherUser.email = testUser.email;
      const req = mockRequest({ ...researcherUser });
      const res = mockResponse();

      await researcherRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Access denied'
        })
      );
    });

    it('should return error for invalid password length', async () => {
      const userWithShortPassword = generateTestUser('Researcher');
      userWithShortPassword.password = '123';
      const req = mockRequest({ ...userWithShortPassword });
      const res = mockResponse();

      await researcherRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.invalidPassword
        })
      );
    });
  });

  describe('researcherLogin', () => {
    it('should successfully login verified researcher', async () => {
      // Create verified researcher
      const testUser = generateTestUser('Researcher');
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

      await researcherLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Login successful'
        })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'researcherJWT',
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should return error when patient tries to login', async () => {
      // Create verified patient
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

      await researcherLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Access denied'
        })
      );
    });

    it('should return error for unverified email', async () => {
      // Create unverified researcher
      const testUser = generateTestUser('Researcher');
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

      await researcherLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: testErrorMessages.emailNotVerified
        })
      );
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify researcher email with valid code', async () => {
      // Create unverified researcher with verification code
      const testUser = generateTestUser('Researcher');
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
      expect(mockEmailUtils.sendWelcomeEmail).toHaveBeenCalled();
    });
  });
});
