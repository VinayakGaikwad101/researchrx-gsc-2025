import { create } from "zustand";

const useMedicalReportStore = create((set) => ({
  medicalReports: [],
  isLoading: false,
  error: null,

  // Fetch all medical reports
  fetchMedicalReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/medical/patient/get-medical-reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        set({ medicalReports: data.reports, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Upload a new medical report
  uploadMedicalReport: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/medical/patient/add-medical-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        console.log("Success uploading report");
        set((state) => ({
          medicalReports: [...state.medicalReports, data.report],
          isLoading: false,
        }));
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Rename a medical report
  renameMedicalReport: async (id, newName) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/medical/patient/rename-medical-report`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, newName }),
        }
      );
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          medicalReports: state.medicalReports.map((report) =>
            report._id === id ? { ...report, name: newName } : report
          ),
          isLoading: false,
        }));
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Delete a medical report
  deleteMedicalReport: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/medical/patient/delete-medical-report`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        }
      );
      const data = await response.json();
      if (data.success) {
        set((state) => ({
          medicalReports: state.medicalReports.filter(
            (report) => report._id !== id
          ),
          isLoading: false,
        }));
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useMedicalReportStore;
