import { Router } from "express";
import { exportPDF } from "./export.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/pdf/:id",
  authenticate,
  exportPDF
);

export default router;