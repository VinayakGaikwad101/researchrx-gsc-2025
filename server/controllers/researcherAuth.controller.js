import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import generateNumericVerificationCode from "../utils/verificationCode.util.js";
import {
  sendVerificationCode,
  sendWelcomeEmail,
  sendPasswordResetSuccessEmail,
  sendResearcherPasswordResetEmail,
} from "../utils/emailer.utils.js";

dotenv.config();

export const researcherRegister = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      dob,
      gender,
      role,
      specialization,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNo ||
      !dob ||
      !gender ||
      !role ||
      !specialization
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password should be at least 8 characters long",
        success: false,
      });
    }
    if (phoneNo.length !== 10) {
      return res.status(400).json({
        message: "Phone number should be 10 digits long",
        success: false,
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      if (userExist.role === "Patient") {
        return res.status(400).json({
          message: "Access denied",
          success: false,
        });
      }
      if (userExist.isVerified) {
        return res.status(400).json({
          message: "Email already exists and is verified",
          success: false,
        });
      } else {
        return res.status(400).json({
          message: "Email already exists, please verify your email",
          success: false,
        });
      }
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const verificationCode = generateNumericVerificationCode(6);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      dob,
      gender,
      role,
      specialization,
      verificationCode,
    });

    await user.save();

    sendVerificationCode(user.email, user.verificationCode);

    return res.status(200).json({
      message: "Registration successful! Please verify your email",
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error in researcher register controller: ", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Verification code is required", success: false });
    }
    const userExist = await User.findOne({ verificationCode: code });
    if (!userExist) {
      console.log("Invalid code");
      return res.status(400).json({
        message: "Invalid or expired verification code",
        success: false,
      });
    }
    userExist.isVerified = true;
    userExist.verificationCode = undefined;
    await userExist.save();
    await sendWelcomeEmail(userExist.email, userExist.firstName);
    return res.status(200).json({
      message: "Email verification successful, please Login",
      success: true,
    });
  } catch (error) {
    console.error("Error in verifyEmail controller: ", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const regenerateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        message: "Email does not exist",
        success: false,
      });
    }

    if (userExist.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
        success: false,
      });
    }

    const currentTime = new Date();
    const otpTimeout = new Date(userExist.otpGeneratedAt);
    otpTimeout.setSeconds(otpTimeout.getSeconds() + 60);

    if (currentTime < otpTimeout) {
      const remainingTime = Math.ceil((otpTimeout - currentTime) / 1000);
      return res.status(400).json({
        message: `You can only request a new OTP after ${remainingTime} seconds`,
        success: false,
      });
    }

    const newVerificationCode = generateNumericVerificationCode(6);
    userExist.verificationCode = newVerificationCode;
    userExist.otpGeneratedAt = currentTime;
    await userExist.save();

    await sendVerificationCode(userExist.email, newVerificationCode);

    return res.status(200).json({
      message: "OTP regenerated and sent to email",
      success: true,
    });
  } catch (error) {
    console.error("Error in regenerate OTP controller: ", error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const researcherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.error("Email or password missing");
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password should be at least 8 characters long",
        success: false,
      });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const validPassword = bcryptjs.compareSync(password, userExist.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    if (!userExist.isVerified) {
      return res.status(400).json({
        message: "Email is not verified. Please verify your email",
        success: false,
      });
    }

    if (userExist.role === "Patient") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("researcherJWT", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: !(process.env.ENVIRONMENT === "development"),
    });

    console.log("Login successful");
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: userExist,
      token: token,
    });
  } catch (error) {
    console.error("Error in researcher login controller: ", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const researcherLogout = async (req, res) => {
  res.clearCookie("researcherJWT");
  console.log("Logout successful");
  return res.status(200).json({
    message: "Logged out successfully",
    success: true,
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        message: "Email does not exist",
        success: false,
      });
    }

    const resetToken = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await sendResearcherPasswordResetEmail(userExist.email, resetToken);

    return res.status(200).json({
      message: "Password reset email sent",
      success: true,
    });
  } catch (error) {
    console.error("Error in researcher forgot password controller: ", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
        success: false,
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password should be at least 8 characters long",
        success: false,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({
          message: "Invalid or expired token",
          success: false,
        });
      }
      throw error;
    }

    const userExist = await User.findById(decoded.id);
    if (!userExist) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    userExist.password = hashedPassword;
    await userExist.save();

    await sendPasswordResetSuccessEmail(userExist.email);

    return res.status(200).json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.error("Error in researcher reset password controller: ", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
