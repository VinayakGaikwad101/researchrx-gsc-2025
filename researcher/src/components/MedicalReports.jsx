import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react"; // Import Eye icon from lucide-react
import useMedicalReportStore from "../store/useMedicalReportStore";

const MedicalReports = () => {
  const [viewPdf, setViewPdf] = useState(null); // State to hold the URL of the PDF to view
  const { fetchAllMedicalReports, medicalReports, isLoading, error } =
    useMedicalReportStore();

  useEffect(() => {
    fetchAllMedicalReports(); // Fetch reports on component mount
  }, [fetchAllMedicalReports]);

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="w-1/2 p-4 bg-gray-100">
          <h2 className="text-lg font-bold">Show all reports</h2>
          <div className="mt-4">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {medicalReports.length === 0 && !isLoading && (
              <p>No reports found.</p>
            )}
            {medicalReports.length > 0 && (
              <ul>
                {medicalReports.map((report) => (
                  <li key={report._id} className="border p-2 mb-2">
                    <p>{report.name}</p>
                    <p>{report.description}</p>
                    <button
                      className="mt-2 p-2 bg-blue-500 text-white flex items-center"
                      onClick={() => setViewPdf(report.url)}
                    >
                      <Eye className="mr-2" /> View PDF
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="w-1/2 p-4 bg-gray-100 border-l">
          <h2 className="text-lg font-bold">All added reports</h2>
          {/* Add content for added reports here */}
        </div>
      </div>

      {viewPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <iframe
              src={viewPdf}
              width="800px"
              height="600px"
              title="Medical Report PDF"
              className="border"
            ></iframe>
            <button
              className="mt-2 p-2 bg-red-500 text-white"
              onClick={() => setViewPdf(null)}
            >
              Close PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReports;
