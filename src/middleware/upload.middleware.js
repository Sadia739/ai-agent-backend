import multer from "multer";
import fs from "fs";
const uploadPath = "uploads";
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        const uniqueName = Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "-");
        cb(null, uniqueName);
    },
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
};
export const upload = multer({
    storage,
    fileFilter,
});
//# sourceMappingURL=upload.middleware.js.map