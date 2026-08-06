import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "./calendar.controller.js";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getById);
router.patch("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);

export default router;
