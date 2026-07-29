import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Register all routes
app.use("/", routes);

export default app;