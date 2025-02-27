import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useBlogStore from "../store/useBlogStore";

const BlogDetail = () => {
  const { blogId } = useParams();
  const { selectedBlog, fetchBlogById } = useBlogStore();

  useEffect(() => {
    fetchBlogById(blogId);
  }, [blogId]);

  if (!selectedBlog) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{selectedBlog.title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
        className="text-gray-700"
      />
      <div className="mt-4">
        {selectedBlog.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium mr-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogDetail;
