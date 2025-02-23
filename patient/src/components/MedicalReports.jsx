import React, { useEffect, useState, useRef } from "react";
import { Trash } from "lucide-react";
import useMedicalReportStore from "../store/useMedicalReportStore";
import { Document, Page } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReportName, setNewReportName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null); // State for selected PDF
  const fileInputRef = useRef(null); // Ref for the file input element

  useEffect(() => {
    fetchMedicalReports();
  }, [fetchMedicalReports]);

  const handleRename = async () => {
    if (selectedReport && newReportName) {
      await renameMedicalReport(selectedReport._id, newReportName);
      setIsModalOpen(false);
      setNewReportName(""); // Reset the new report name state after renaming
    }
  };

  const handleDelete = async (id) => {
    await deleteMedicalReport(id);
    setIsModalOpen(false);
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
    setUploadFile(null); // Reset the upload file state after upload
    setNewReportName(""); // Reset the report name state after upload

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input field
    }
  };

  const handleView = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Medical Reports</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {medicalReports.map((report) => (
          <div key={report._id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{report.name}</h2>
            <p>{report.description}</p>
            <button
              onClick={() => handleView(report.pdfUrl)} // Pass PDF URL to view handler
              className="mt-2 p-2 bg-green-500 text-white rounded"
            >
              View
            </button>
            <button
              onClick={() => {
                /* Implement edit logic here */
              }}
              className="mt-2 p-2 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setSelectedReport(report);
                setIsModalOpen(true);
              }}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              Rename
            </button>
            <button
              onClick={() => handleDelete(report._id)}
              className="mt-2 p-2 bg-red-500 text-white rounded flex items-center"
            >
              <Trash className="m-1" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef} // Attach the ref to the file input element
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            {selectedPdf ? (
              <div className="w-full h-full overflow-auto">
                <Document file={selectedPdf}>
                  <Page pageNumber={1} />
                </Document>
              </div>
            ) : (
              <>
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
              </>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
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
