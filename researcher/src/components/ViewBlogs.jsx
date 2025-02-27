import React, { useEffect } from "react";
import useBlogStore from "../store/useBlogStore";
import { Link } from "react-router-dom";

const ViewBlogs = () => {
  const { blogs, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-700 truncate">{blog.content}</p>
              <div className="mt-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 rounded-full mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to={`/blogs/${blog._id}`}
              className="mt-4 text-blue-500 self-end"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewBlogs;
