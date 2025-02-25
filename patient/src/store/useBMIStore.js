import { create } from "zustand";
import toast from "react-hot-toast";

export const useBMIStore = create((set) => ({
  BMI: 0,
  isLoading: false,
  error: null,

  fetchBMI: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { height, weight, unit } = userData;
      if (!height || !weight) {
        toast.error("Height and Weight required");
        set({ isLoading: false });
        return;
      }
      if (!unit) {
        toast.error("Unit required");
        set({ isLoading: false });
        return;
      }

      const response = await fetch(
        `https://body-mass-index-bmi-calculator.p.rapidapi.com/${unit}?weight=${weight}&height=${height}`,
        {
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_x_rapidapi_key,
            "x-rapidapi-host": import.meta.env.VITE_x_rapidapi_host_BMI,
          },
        }
      );

      const data = await response.json();
      if (response.status !== 200) {
        toast.error(`Error fetching BMI: ${data.message}`);
        set({ isLoading: false });
        return;
      }
      set({ BMI: data.bmi, isLoading: false });
    } catch (error) {
      toast.error(`Error fetching BMI: ${error.message}`);
      set({ isLoading: false, error: error.message });
    }
  },
}));
