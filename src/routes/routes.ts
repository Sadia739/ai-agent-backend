import { Router } from "express";
import { register } from "../controllers/user_controllers.js";
import { login } from "../controllers/user_controllers.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { profile } from "../controllers/user_controllers.js";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);


export default router;