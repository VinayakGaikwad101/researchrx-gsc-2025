import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import useMedicalReportStore from "../store/useMedicalReportStore";
import styles from "./MedicalReports.module.css";

const MedicalReports = () => {
  const [viewPdf, setViewPdf] = useState(null);
  const [draggedReport, setDraggedReport] = useState(null);
  const { 
    fetchAllMedicalReports, 
    fetchCollectedReports,
    addToCollection,
    removeFromCollection,
    medicalReports, 
    collectedReports,
    isLoading, 
    error 
  } = useMedicalReportStore();

  useEffect(() => {
    fetchAllMedicalReports();
    fetchCollectedReports();
  }, [fetchAllMedicalReports, fetchCollectedReports]);

  const handleDragStart = (e, report) => {
    setDraggedReport(report);
    e.currentTarget.classList.add('opacity-50', 'scale-105');
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true);
    dragImage.classList.add(styles.dragGhost);
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);

    // Clean up the drag image after dragging
    requestAnimationFrame(() => {
      dragImage.remove();
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add(styles.active);
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove(styles.active);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove(styles.dragging);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.active);
    if (draggedReport) {
      addToCollection(draggedReport._id);
    }
    setDraggedReport(null);
  };

  const ReportCard = ({ report, isDraggable = true }) => (
    <li 
      key={report._id} 
      className={`${styles.reportCard} border p-2 mb-2 ${
        isDraggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      draggable={isDraggable}
      onDragStart={(e) => isDraggable && handleDragStart(e, report)}
      onDragEnd={handleDragEnd}
    >
      <p className="font-semibold">{report.name}</p>
      <div 
        className="relative group"
        title={report.description || "No description available"}
      >
        <p className="text-sm text-gray-600 line-clamp-3">
          {report.description || "No description available"}
        </p>
        <div className="absolute z-50 invisible group-hover:visible bg-white text-gray-800 p-4 rounded-md shadow-md w-80 mt-2 left-0">
          {report.description || "No description available"}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="p-2 bg-blue-500 text-white flex items-center rounded"
          onClick={() => setViewPdf(report.url)}
        >
          <Eye className="mr-2" /> View PDF
        </button>
        {!isDraggable && (
          <button
            className="p-2 bg-red-500 text-white rounded"
            onClick={() => removeFromCollection(report._id)}
          >
            Remove
          </button>
        )}
      </div>
    </li>
  );

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="w-1/2 p-4 bg-gray-100">
          <h2 className="text-lg font-bold">Available Reports</h2>
          <p className="text-sm text-gray-600 mt-1">Drag reports to add to your collection</p>
          <div className="mt-4">
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {medicalReports.length === 0 && !isLoading && (
              <p>No reports found.</p>
            )}
            {medicalReports.length > 0 && (
              <ul>
                {medicalReports.map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </ul>
            )}
          </div>
        </div>
        <div 
          className={`${styles.dropZone} w-1/2 p-4 bg-gray-100 border-l`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h2 className="text-lg font-bold">My Collection</h2>
          <p className="text-sm text-gray-600 mt-1">Drop reports here to add to your collection</p>
          <div className="mt-4">
            {collectedReports.length === 0 ? (
              <p className="text-gray-500">No reports in collection. Drag reports here to add them.</p>
            ) : (
              <ul>
                {collectedReports.map((report) => (
                  <ReportCard key={report._id} report={report} isDraggable={false} />
                ))}
              </ul>
            )}
          </div>
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
              className="mt-2 p-2 bg-red-500 text-white rounded"
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
