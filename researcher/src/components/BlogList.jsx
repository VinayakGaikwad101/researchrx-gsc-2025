import React, { useEffect } from "react";
import useBlogStore from "../store/useBlogStore";
import { Link } from "react-router-dom";

const BlogList = () => {
  const { blogs, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white p-4 rounded-lg shadow-md"
            style={{ height: "300px", width: "100%" }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: blog.renderedHtml }}
              className="overflow-hidden h-40"
            />
            <Link
              to={`/blogs/${blog._id}`}
              className="mt-4 text-blue-500 block text-center"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
