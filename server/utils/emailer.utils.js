import {
  Verification_Email_Template,
  Welcome_Email_Template,
  Password_Reset_Success_Email_Template,
  Contact_Form_Response_Template,
  Researcher_Password_Reset_Email_Template,
  Patient_Password_Reset_Email_Template,
} from "../libs/EmailTemplate.js";
import { transporter } from "../config/email.config.js";

export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"Verify your email" <vinaayakgaikwad@gmail.com>',
      to: email,
      subject: "Verify your Email",
      text: "Verify your Email",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"Welcome!" <vinaayakgaikwad@gmail.com>',
      to: email,
      subject: "Welcome Email",
      text: "Welcome to ResearchRX",
      html: Welcome_Email_Template.replace("{name}", name),
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

export const sendResearcherPasswordResetEmail = async (email, resetToken) => {
  try {
    const response = await transporter.sendMail({
      from: '"Password Reset" <vinaayakgaikwad@gmail.com>',
      to: email,
      subject: "Password Reset Request",
      text: "You requested a password reset. Click the link below to reset your password.",
      html: Researcher_Password_Reset_Email_Template.replace(
        "{resetToken}",
        resetToken
      ),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

export const sendPatientPasswordResetEmail = async (email, resetToken) => {
  try {
    const response = await transporter.sendMail({
      from: '"Password Reset" <vinaayakgaikwad@gmail.com>',
      to: email,
      subject: "Password Reset Request",
      text: "You requested a password reset. Click the link below to reset your password.",
      html: Patient_Password_Reset_Email_Template.replace(
        "{resetToken}",
        resetToken
      ),
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: '"Password Reset Successful" <vinaayakgaikwad@gmail.com>',
      to: email,
      subject: "Password Reset Successful",
      text: "Your password has been reset successfully.",
      html: Password_Reset_Success_Email_Template,
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

export const sendContactFormResponse = async (name, email, message) => {
  try {
    const response = await transporter.sendMail({
      from: '"Contact Form Response" <vinaayakgaikwad@gmail.com>',
      to: "vinaayakgaikwad@gmail.com",
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: Contact_Form_Response_Template.replace("{name}", name)
        .replace("{email}", email)
        .replace("{message}", message),
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email", error);
  }
};
