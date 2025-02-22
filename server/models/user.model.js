import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  phoneNo: {
    type: String,
    required: true,
    minlength: 10,
    maxLength: 10,
  },
  dob: {
    type: Date,
    required: true,
  },
  consultationFile: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  role: {
    type: String,
    required: true,
    enum: ["Patient", "Researcher"],
  },
  avataar: {
    type: String,
    default: "",
  },
  specialization: {
    type: String,
    default: "",
  },
  verificationCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpGeneratedAt: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
