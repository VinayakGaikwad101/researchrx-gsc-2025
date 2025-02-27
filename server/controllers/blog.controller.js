import Blog from "../models/blog.model.js";
import mongoose from "mongoose";

// Function to create a blog
export const createBlog = async (req, res) => {
  const { title, content, tags, authorId, template } = req.body;

  try {
    const newBlog = new Blog({
      title,
      content,
      tags,
      author: new mongoose.Types.ObjectId(authorId),
      template,
    });

    await newBlog.save();
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// Function to delete a blog
export const deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  const { userId } = req.user;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this blog",
      });
    }

    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

// Function to get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate(
      "author",
      "firstName lastName title"
    );
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// Function to get a blog by ID
export const getBlogById = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId).populate(
      "author",
      "firstName lastName title"
    );
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};
