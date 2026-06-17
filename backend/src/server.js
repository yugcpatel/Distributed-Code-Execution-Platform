import dotenv from "dotenv";
import app from "./app.js";
import { ensureDirectoriesExist } from "./utils/tempFileManager.js";
import { cleanupOldFiles } from "./utils/cleanupService.js";
import { codeQueue } from "./queue/codeQueue.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize the temp folder structure synchronously before accepting requests
ensureDirectoriesExist();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Temporary test: Push a manual job to our new queue on startup
  codeQueue.add("test-job", {
    language: "python",
    code: "print('hello')",
  }).then(() => console.log("Added test job to queue!"));
  
  // Set up the automated cleanup interval to run every 5 minutes (300,000 ms)
  setInterval(() => {
    cleanupOldFiles();
  }, 300000);
});