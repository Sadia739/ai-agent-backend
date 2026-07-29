import prisma from "../prisma/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
// =========================
// Register User
// =========================
export const registerUser = async (data) => {
    const { name, email, password } = data;
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
    // Generate JWT
    const token = generateToken(user.id);
    // Return token and safe user data
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
    };
};
// =========================
// Login User
// =========================
export const loginUser = async (data) => {
    const { email, password } = data;
    // Find user
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    // Generate JWT
    const token = generateToken(user.id);
    // Return token and safe user data
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
    };
};
export const getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
};
//# sourceMappingURL=service.js.map