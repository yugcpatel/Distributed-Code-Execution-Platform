import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CLEANUP } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target the temp jobs directory for cleanup
const tempJobsDir = path.join(__dirname, '..', '..', 'temp', 'jobs');

// This function automatically deletes files that have been abandoned
export const cleanupOldFiles = () => {
  try {
    // If the directory doesn't exist yet, there's nothing to clean up
    if (!fs.existsSync(tempJobsDir)) return;

    // Read all files in the directory
    const files = fs.readdirSync(tempJobsDir);
    const now = Date.now();

    files.forEach((file) => {
      const filePath = path.join(tempJobsDir, file);
      
      try {
        const stats = fs.statSync(filePath);

        // Check if the file is older than the configured max age
        if (now - stats.birthtimeMs > CLEANUP.MAX_FILE_AGE_MS) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up stale file: ${file}`);
        }
      } catch (err) {
        // We log errors individually so one failing file doesn't stop the loop
        console.error(`Failed to process stale file ${file}:`, err);
      }
    });
  } catch (error) {
    console.error('Error during old file cleanup sweep:', error);
  }
};
