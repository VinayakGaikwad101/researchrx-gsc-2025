import { create } from "zustand";
import toast from "react-hot-toast";

const useBlogStore = create((set) => ({
  blogs: [],
  templates: [],
  selectedBlog: null,
  loading: false,

  setLoading: (loading) => set({ loading }),

  fetchTemplates: async () => {
    const token = localStorage.getItem("authToken");
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/templates/blog/getTemplates`;
    set({ loading: true });

    try {
      const response = await fetch(encodeURI(url), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        set({ templates: data.templates, loading: false });
      } else {
        toast.error(data.message || "Failed to fetch templates");
        set({ loading: false });
      }
    } catch (error) {
      toast.error(`Failed to fetch templates: ${error.message}`);
      console.error("Fetch error:", error); // Debug log
      set({ loading: false });
    }
  },

  fetchBlogs: async () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/blog/all`;
    set({ loading: true });

    try {
      const response = await fetch(encodeURI(url), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        set({ blogs: data.blogs, loading: false });
      } else {
        toast.error(data.message || "Failed to fetch blogs");
        set({ loading: false });
      }
    } catch (error) {
      toast.error(`Failed to fetch blogs: ${error.message}`);
      console.error("Fetch error:", error); // Debug log
      set({ loading: false });
    }
  },

  fetchBlogById: async (blogId) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/blog/${blogId}`;
    set({ loading: true });

    try {
      const response = await fetch(encodeURI(url), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const html = await response.text();
      if (response.ok) {
        set({
          selectedBlog: { renderedHtml: html, blogId },
          loading: false,
        });
        return html;
      } else {
        toast.error("Failed to fetch blog");
        set({ loading: false });
        return "";
      }
    } catch (error) {
      toast.error(`Failed to fetch blog: ${error.message}`);
      console.error("Fetch blog error:", error); // Debug log
      set({ loading: false });
      return "";
    }
  },

  createBlog: async (newBlog) => {
    const token = localStorage.getItem("authToken");
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/blog/create`;
    set({ loading: true });

    try {
      const response = await fetch(encodeURI(url), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBlog),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Blog created successfully");
        set((state) => ({
          blogs: [...state.blogs, data.blog],
          loading: false,
        }));
      } else {
        toast.error(data.message || "Failed to create blog");
        set({ loading: false });
      }
    } catch (error) {
      toast.error(`Failed to create blog: ${error.message}`);
      console.error("Create blog error:", error); // Debug log
      set({ loading: false });
    }
  },

  deleteBlog: async (blogId) => {
    const token = localStorage.getItem("authToken");
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/blog/delete/${blogId}`;
    set({ loading: true });

    try {
      const response = await fetch(encodeURI(url), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Blog deleted successfully");
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog._id !== blogId),
          loading: false,
        }));
      } else {
        toast.error(data.message || "Failed to delete blog");
        set({ loading: false });
      }
    } catch (error) {
      toast.error(`Failed to delete blog: ${error.message}`);
      console.error("Delete blog error:", error); // Debug log
      set({ loading: false });
    }
  },
}));

export default useBlogStore;
