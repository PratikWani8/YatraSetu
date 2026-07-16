import multer from "multer";
import path from "path";
import fs from "fs";

const photoDir = "uploads/photos";
const aadhaarDir = "uploads/aadhaar";

if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir, { recursive: true });
}

if (!fs.existsSync(aadhaarDir)) {
  fs.mkdirSync(aadhaarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, photoDir);
    } else if (file.fieldname === "aadhaarImage") {
      cb(null, aadhaarDir);
    } else {
      cb(null, "uploads/");
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png/;

  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, JPEG and PNG files are allowed."));
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;