import express from "express";
import cors from "cors";

// Route Imports
import mediaRouter from "./routes/media.routes.js";
import categoryRouter from "./routes/category.routes.js";

const app = express();

// Allowed origins define kora holo
const allowedOrigins = [
  "https://peacekeeping-mission.netlify.app",
  "http://localhost:3000",
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Routes Declaration
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/categories", categoryRouter);

export { app };
