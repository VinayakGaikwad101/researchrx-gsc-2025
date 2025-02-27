import { create } from "zustand";
import toast from "react-hot-toast";

const useBlogStore = create((set) => ({
  blogs: [],
  templates: [],
  selectedBlog: null,

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

  fetchBlogs: async () => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/blog/all`;

    try {
      const response = await fetch(encodeURI(url));
      const data = await response.json();
      if (response.ok) {
        set({ blogs: data.blogs });
      } else {
        toast.error(data.message || "Failed to fetch blogs");
      }
    } catch (error) {
      toast.error(`Failed to fetch blogs: ${error.message}`);
      console.error("Fetch error:", error); // Debug log
    }
  },

  fetchBlogById: async (blogId) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/blogs/${blogId}`;

    try {
      const response = await fetch(encodeURI(url));
      const data = await response.json();
      if (response.ok) {
        set({ selectedBlog: data.blog });
      } else {
        toast.error(data.message || "Failed to fetch blog");
      }
    } catch (error) {
      toast.error(`Failed to fetch blog: ${error.message}`);
      console.error("Fetch blog error:", error); // Debug log
    }
  },

  createBlog: async (newBlog) => {
    const token = localStorage.getItem("authToken");
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/blog/create`;

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
        }));
      } else {
        toast.error(data.message || "Failed to create blog");
      }
    } catch (error) {
      toast.error(`Failed to create blog: ${error.message}`);
      console.error("Create blog error:", error); // Debug log
    }
  },

  deleteBlog: async (blogId) => {
    const token = localStorage.getItem("authToken");
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const url = `${baseUrl}/api/blog/delete/${blogId}`;

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
        }));
      } else {
        toast.error(data.message || "Failed to delete blog");
      }
    } catch (error) {
      toast.error(`Failed to delete blog: ${error.message}`);
      console.error("Delete blog error:", error); // Debug log
    }
  },
}));

export default useBlogStore;
