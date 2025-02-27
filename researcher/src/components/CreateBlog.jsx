import React, { useEffect, useState } from "react";
import useGetBlogTemplateStore from "../store/useGetBlogTemplateStore";
import { Eye } from "lucide-react";

const CreateBlog = () => {
  const { templates, fetchTemplates } = useGetBlogTemplateStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openModal = (template) => {
    setSelectedTemplate(template);
  };

  const closeModal = () => {
    setSelectedTemplate(null);
  };

  return (
    <div>
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
            <button
              onClick={() => openModal(template)}
              className="mt-4 text-blue-500 self-end"
            >
              <Eye size={24} />
            </button>
          </div>
        ))}
      </div>

      {selectedTemplate && (
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
