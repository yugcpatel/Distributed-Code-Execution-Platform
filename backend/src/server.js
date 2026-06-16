import dotenv from "dotenv";
import app from "./app.js";
import { ensureDirectoriesExist } from "./utils/tempFileManager.js";
import { cleanupOldFiles } from "./utils/cleanupService.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize the temp folder structure synchronously before accepting requests
ensureDirectoriesExist();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Set up the automated cleanup interval to run every 5 minutes (300,000 ms)
  setInterval(() => {
    cleanupOldFiles();
  }, 300000);
});