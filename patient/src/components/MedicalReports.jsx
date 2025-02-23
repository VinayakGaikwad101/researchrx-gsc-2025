import React, { useEffect, useState, useRef } from "react";
import { Trash, Edit, Eye } from "lucide-react";
import useMedicalReportStore from "../store/useMedicalReportStore";

const MedicalReports = () => {
  const {
    medicalReports,
    fetchMedicalReports,
    uploadMedicalReport,
    renameMedicalReport,
    deleteMedicalReport,
    isLoading,
    error,
  } = useMedicalReportStore();

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReportName, setNewReportName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedicalReports();
  }, [fetchMedicalReports]);

  const handleRename = async () => {
    if (selectedReport && newReportName) {
      await renameMedicalReport(selectedReport._id, newReportName);
      setIsRenameModalOpen(false);
      setNewReportName("");
    }
  };

  const handleDelete = async (id) => {
    await deleteMedicalReport(id);
    setIsRenameModalOpen(false);
    setUploadFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }
    setUploadError("");
    setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("medicalReport", uploadFile);
    formData.append("name", newReportName || uploadFile.name);

    await uploadMedicalReport(formData);
    setUploadFile(null);
    setNewReportName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleView = (pdfUrl) => {
    console.log("PDF URL:", pdfUrl); // Debugging line
    setSelectedPdf(pdfUrl);
    setIsViewModalOpen(true);
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Medical Reports</h1>
      <div className="mt-4">
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <input
          type="text"
          value={newReportName}
          onChange={(e) => setNewReportName(e.target.value)}
          placeholder="New report name"
          className="mt-2 block w-full p-2 border rounded"
        />
        {uploadError && <p className="text-red-500">{uploadError}</p>}
        <button
          onClick={handleUpload}
          className={`mt-2 p-2 ${
            isLoading ? "bg-gray-500" : "bg-blue-500"
          } text-white rounded`}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Report"}
        </button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {medicalReports.map((report) => (
          <div
            key={report._id}
            className="border p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{report.name}</h2>
              <p>{report.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleView(report.url)}
                className="p-2 bg-green-500 text-white rounded flex items-center"
              >
                <Eye className="m-1" />
                View
              </button>
              <button
                onClick={() => {
                  setSelectedReport(report);
                  setNewReportName(report.name);
                  setIsRenameModalOpen(true);
                }}
                className="p-2 bg-blue-500 text-white rounded flex items-center"
              >
                <Edit className="m-1" />
                Rename
              </button>
              <button
                onClick={() => handleDelete(report._id)}
                className="p-2 bg-red-500 text-white rounded flex items-center"
              >
                <Trash className="m-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isViewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <div
              className="w-full h-full overflow-auto"
              style={{ maxHeight: "80vh" }}
            >
              {selectedPdf ? (
                <iframe
                  src={selectedPdf}
                  title="PDF Viewer"
                  width="1000px"
                  height="800px"
                ></iframe>
              ) : (
                <p>No PDF file specified.</p>
              )}
            </div>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="mt-4 p-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isRenameModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Rename Report</h2>
            <input
              type="text"
              value={newReportName}
              onChange={(e) => setNewReportName(e.target.value)}
              placeholder="New report name"
              className="block w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleRename}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Rename
            </button>
            <button
              onClick={() => setIsRenameModalOpen(false)}
              className="mt-4 p-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReports;
