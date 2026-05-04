import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9_-]/gi, "_")
      .slice(0, 40);
    cb(null, `${Date.now()}-${base}${ext.toLowerCase()}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = /^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.mimetype);
  const isVideo = /^video\/(mp4|webm|ogg|quicktime|x-matroska)$/i.test(file.mimetype);
  if (isImage || isVideo) cb(null, true);
  else cb(new Error("Only image and video files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export const productMediaUpload = upload.fields([
  { name: "images", maxCount: 8 },
  { name: "videos", maxCount: 4 },
]);

export default upload;
