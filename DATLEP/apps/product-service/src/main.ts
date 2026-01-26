import express from "express";
import "./jobs/product-crone.job";
import cors from "cors";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
import { connectDatabase } from "@datlep/database";
import router from "./routes/product.route";





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

app.get("/product", (req, res) => {
  res.send({ message: "Hello product service api is running" });
});

app.use("/api", router);
app.use(errorMiddleware);

const port = process.env.PORT || 6002;

const startServer = async () => {
  try {
     await connectDatabase(process.env.MONGO_URI!);

    app.listen(port, () => {
      console.log(`Product Service listening at http://localhost:${port}/api`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}; 

startServer();



