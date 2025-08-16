import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.util";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "learn-eng",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1200, crop: "limit" }],
    quality: "auto:good",
    resource_type: "image",
  } as any,
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (JPEG/PNG/JPG)"));
    }
  },
});

export default upload;
