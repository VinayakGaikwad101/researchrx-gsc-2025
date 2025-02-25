import { create } from "zustand";
import toast from "react-hot-toast";

const useMedicalReportStore = create((set) => ({
  medicalReports: [],
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
        console.log(data.medicalReports);
      }
    } catch (error) {
      toast.error("Error fetching medical reports");
      set({ isLoading: false, error: error.message });
    }
  },
}));

export default useMedicalReportStore;
