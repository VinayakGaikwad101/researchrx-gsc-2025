import React, { useEffect, useState } from "react";
import useBlogStore from "../store/useBlogStore";
import { Eye, Pencil } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const CreateBlog = () => {
  const { templates, fetchTemplates, createBlog } = useBlogStore();
  const { authUser } = useAuthStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    tags: "",
    template: "",
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openViewModal = (template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const openCreateForm = (template) => {
    setSelectedTemplate(template);
    setIsCreateFormOpen(true);
    setBlogData({ ...blogData, template: template.name });
  };

  const closeModal = () => {
    setSelectedTemplate(null);
    setIsViewModalOpen(false);
    setIsCreateFormOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authUser) {
      const newBlog = {
        ...blogData,
        tags: blogData.tags.split(","),
        authorId: authUser._id,
      };
      await createBlog(newBlog);
      closeModal();
    } else {
      console.log("User not authenticated");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create a Blog</h1>
      <Link to="/blogs" className="mb-6 text-blue-500 flex items-center">
        View All Blogs
      </Link>
      <h1 className="text-3xl font-bold mb-6">Create a Blog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.name}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{template.name}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: template.content }}
                className="text-sm text-gray-700 truncate"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => openViewModal(template)}
                className="text-blue-500"
              >
                <Eye size={24} />
              </button>
              <button
                onClick={() => openCreateForm(template)}
                className="text-green-500"
              >
                <Pencil size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isCreateFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedTemplate.name}</h2>
            <form onSubmit={handleSubmit} className="mb-6">
              <input
                type="text"
                name="title"
                placeholder="Blog Title"
                value={blogData.title}
                onChange={handleInputChange}
                required
                className="w-full p-2 mb-4 border rounded"
              />
              <textarea
                name="content"
                placeholder="Blog Content"
                value={blogData.content}
                onChange={handleInputChange}
                required
                className="w-full p-2 mb-4 border rounded"
              ></textarea>
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={blogData.tags}
                onChange={handleInputChange}
                required
                className="w-full p-2 mb-4 border rounded"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded"
              >
                Create Blog
              </button>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedTemplate.name}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlog;
