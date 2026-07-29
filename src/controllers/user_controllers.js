import { registerUser, loginUser } from "../services/service.js";
import { getProfile } from "../services/service.js";
// =========================
// Register Controller
// =========================
export const register = async (req, res) => {
    try {
        const data = await registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data,
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
// =========================
// Login Controller
// =========================
export const login = async (req, res) => {
    try {
        const data = await loginUser(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data,
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
export const profile = async (req, res) => {
    try {
        const user = await getProfile(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong",
        });
    }
};
//# sourceMappingURL=user_controllers.js.map