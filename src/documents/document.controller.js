import { uploadDocument } from "./document.service.js";
export const upload = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const document = await uploadDocument({
            userId: req.user.id,
            fileName: req.file.originalname,
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
        });
        res.status(201).json({
            success: true,
            data: document,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong",
        });
    }
};
//# sourceMappingURL=document.controller.js.map