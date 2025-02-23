import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
