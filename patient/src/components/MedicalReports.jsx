import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, Edit, Eye, Upload } from "lucide-react";
import useMedicalReportStore from "../store/useMedicalReportStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Modal } from "./ui/modal";

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

  const [selectedReport, setSelectedReport] = useState(null);
  const [newReportName, setNewReportName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedicalReports();
  }, [fetchMedicalReports]);

  const handleRename = async (id, newName) => {
    await renameMedicalReport(id, newName);
    setNewReportName("");
  };

  const handleDelete = async (id) => {
    await deleteMedicalReport(id);
    setUploadFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }
    setUploadError("");
    setUploadFile(file);
    setNewReportName(file?.name || "");
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

  const handleView = (url) => {
    setSelectedPdfUrl(url);
    setIsViewModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card>
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold">Medical Reports</CardTitle>
              <CardDescription>
                Upload and manage your medical reports securely
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Upload Section */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          accept=".pdf"
                          className="cursor-pointer"
                        />
                      </div>
                      <Button
                        onClick={handleUpload}
                        disabled={isLoading || !uploadFile}
                      >
                        {isLoading ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                            <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                            <span>Uploading...</span>
                          </motion.div>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Report
                          </>
                        )}
                      </Button>
                    </div>
                    {uploadFile && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={newReportName}
                          onChange={(e) => setNewReportName(e.target.value)}
                          placeholder="Report name"
                        />
                      </div>
                    )}
                    {uploadError && (
                      <Alert variant="destructive">
                        <AlertDescription>{uploadError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {medicalReports.map((report) => (
                    <motion.div
                      key={report._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="pt-6">
                          <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{report.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                                <div 
                                  className="relative group"
                                  title={report.description || "No description available"}
                                >
                                  <p className="text-sm mt-2 text-muted-foreground line-clamp-3">
                                    {report.description || "No description available"}
                                  </p>
                                  <div className="absolute z-50 invisible group-hover:visible bg-popover text-popover-foreground p-4 rounded-md shadow-md w-80 mt-2 left-0">
                                    {report.description || "No description available"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleView(report.url)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setNewReportName(report.name);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(report._id)}
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {selectedReport?._id === report._id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={newReportName}
                                  onChange={(e) => setNewReportName(e.target.value)}
                                  placeholder="New name"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    handleRename(report._id, newReportName);
                                    setSelectedReport(null);
                                  }}
                                >
                                  Save
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* PDF Viewer Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
      >
        {selectedPdfUrl && (
          <iframe
            src={selectedPdfUrl}
            title="PDF Viewer"
            className="w-full h-full rounded-lg"
          />
        )}
      </Modal>
    </div>
  );
};

export default MedicalReports;
