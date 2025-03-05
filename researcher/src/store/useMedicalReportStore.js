import { create } from "zustand";
import toast from "react-hot-toast";

const useMedicalReportStore = create((set, get) => ({
  medicalReports: [],
  collectedReports: [],
  isLoading: false,
  error: null,

  fetchAllMedicalReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/medical/researcher/get-medical-reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        set({
          medicalReports: data.medicalReports,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      toast.error("Error fetching medical reports");
      set({ isLoading: false, error: error.message });
    }
  },

  fetchCollectedReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/medical/researcher/collection`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        set({
          collectedReports: data.collectedReports,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      toast.error("Error fetching collected reports");
      set({ isLoading: false, error: error.message });
    }
  },

  addToCollection: async (reportId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/medical/researcher/collection/${reportId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Report added to collection");
        // Refresh the collections
        get().fetchCollectedReports();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding report to collection");
    }
  },

  removeFromCollection: async (reportId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/medical/researcher/collection/${reportId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Report removed from collection");
        // Update the collections state
        set((state) => ({
          collectedReports: state.collectedReports.filter(
            (report) => report._id !== reportId
          ),
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error removing report from collection");
    }
  },
}));

export default useMedicalReportStore;
