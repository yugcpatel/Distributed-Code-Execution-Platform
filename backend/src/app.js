import express from "express";
import cors from "cors";
import executionRoutes from "./routes/executionRoutes.js";

import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", executionRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// The global error handler must always be registered last!
app.use(errorHandler);

export default app;