import express from "express";
import cors from "cors";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router";
import { connectDatabase } from "@datlep/database";
import { seedSiteConfig } from "./controllers/initializeSiteConfig";



const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

// Import and use auth routes
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6001;

const startServer = async () => {
  try {
    // ⚡ Connect to MongoDB first
    await connectDatabase(process.env.MONGO_URI!);
    seedSiteConfig();

    app.listen(port, () => {
      console.log(`Auth Service listening at http://localhost:${port}/api`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}; 

startServer();
