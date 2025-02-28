import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useBlogStore from "../store/useBlogStore";

const BlogDetail = () => {
  const { blogId } = useParams();
  const { fetchBlogById, selectedBlog, loading } = useBlogStore();
  const [blogHtml, setBlogHtml] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogHtml = await fetchBlogById(blogId);
        setBlogHtml(blogHtml);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBlog();
  }, [blogId, fetchBlogById]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return selectedBlog && blogHtml ? (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white p-6 shadow-md">
        <div
          className="flex-grow"
          dangerouslySetInnerHTML={{ __html: selectedBlog.renderedHtml }}
        />
      </div>
      <div className="bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {/* Add your comment section implementation here */}
      </div>
    </div>
  ) : (
    <div>No blog data available</div>
  );
};

export default BlogDetail;
