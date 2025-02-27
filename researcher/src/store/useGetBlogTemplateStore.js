import { create } from "zustand";
import toast from "react-hot-toast";

const useGetBlogTemplateStore = create((set) => ({
  templates: [],
  fetchTemplates: async () => {
    const token = localStorage.getItem("authToken");
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/templates/blog/getTemplates`;

    try {
      const response = await fetch(encodeURI(url), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        set({ templates: data.templates });
      } else {
        toast.error(data.message || "Failed to fetch templates");
      }
    } catch (error) {
      toast.error(`Failed to fetch templates: ${error.message}`);
      console.error("Fetch error:", error); // Debug log
    }
  },
}));

export default useGetBlogTemplateStore;
