import Blog from "../models/blog.model.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

export const createBlog = async (req, res) => {
  const { title, content, tags, style, template } = req.body;
  const author = req.user._id;
  let images = [];

  try {
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "blogs",
          use_filename: true,
        });
        images.push(result.secure_url);
        fs.unlinkSync(file.path); // Remove file from tmp directory after upload
      }
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      tags,
      images,
      style,
      template,
    });
    await newBlog.save();
    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating blog",
      error,
      success: false,
    });
  }
};

export const previewBlog = (req, res) => {
  const { title, content, tags, style, template } = req.body;
  const imagePaths = req.files.map((file) => file.path); // Local paths for preview
  res.render(template, { title, content, tags, style, images: imagePaths });
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "firstName lastName");
    res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching blogs",
      error,
      success: false,
    });
  }
};
