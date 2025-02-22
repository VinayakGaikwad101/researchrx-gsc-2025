import { create } from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,
  lastRequestTime: 0,

  forgotPassword: async (email) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/main/auth/researcher/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Failed to send reset link");
        set({ loading: false });
        return;
      }

      toast.success(data.message || "Reset link sent successfully");
      set({ loading: false, lastRequestTime: Date.now() });
    } catch (error) {
      toast.error(
        error.message || "Failed to send reset link. Please try again."
      );
      set({ loading: false });
    } finally {
      set({ loading: false });
    }
  },

  signup: async (signupData, navigate) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/main/auth/researcher/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Registration failed");
        set({ loading: false });
        return;
      }

      toast.success(data.message || "Registration successful");
      set({ loading: false });
      navigate("/otp-verification");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      set({ loading: false });
    } finally {
      set({ loading: false });
    }
  },
  verifyOTP: async (verificationData, navigate) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/main/auth/researcher/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verificationData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Verification Failed");
        set({ loading: false });
        return;
      }

      toast.success(data.message || "Verification Success");
      set({ loading: false });
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Verification Failed");
      set({ loading: false });
    } finally {
      set({ loading: false });
    }
  },

  resendOTP: async (resendData) => {
    set({ loading: true });
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/main/auth/researcher/regenerate-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resendData),
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "Failed to resend OTP");
        return; // Return the response message
      }
      toast.success(data.message || "OTP sent successfully");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      set({ loading: false });
    }
  },

  login: async (loginData, navigate) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/main/auth/researcher/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );
      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Login failed, please try again");
        set({ loading: false });
        return;
      }

      toast.success(data.message || "Login successful");
      localStorage.setItem("authToken", data.token);
      set({ authUser: data.user, loading: false });
      // initializeSocket(data.user._id);

      navigate("/profile");
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
      set({ loading: false });
      return { message: error.message }; // Return the error message
    }
  },

  logout: async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/main/auth/researcher/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Logout successful");
        set({ authUser: null });
        localStorage.removeItem("authToken");
        return true;
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong during logout");
      return false;
    }
  },

  checkAuth: async () => {
    try {
      set({ checkingAuth: true });
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/main/auth/researcher/get-profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        set({ authUser: data.user });
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      set({ authUser: null });
      console.error("Error checking auth:", error);
    } finally {
      set({ checkingAuth: false });
    }
  },

  resetPassword: async (token, newPassword, navigate) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/main/auth/researcher/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "Password reset failed");
        set({ loading: false });
        return;
      }
      toast.success(data.message || "Password reset successful");
      set({ loading: false });
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Password reset failed. Please try again.");
      set({ loading: false });
    } finally {
      set({ loading: false });
    }
  },
  setAuthUser: (user) => set({ authUser: user }),
}));
