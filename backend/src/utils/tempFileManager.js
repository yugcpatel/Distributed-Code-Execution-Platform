// Import the promises version of the filesystem module to read/write files asynchronously
import { promises as fsAsync } from 'fs';
// Import the synchronous fs module for startup directory creation
import fs from 'fs';
// Import path to easily construct file paths across different operating systems
import path from 'path';
// Import uuidv4 to generate unique random IDs for our filenames
import { v4 as uuidv4 } from 'uuid';
// Import fileURLToPath to help us get the current directory in ES modules
import { fileURLToPath } from 'url';

// In ES modules, __dirname isn't available by default, so we calculate it using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We define the base temp directory and subdirectories
const tempBaseDir = path.join(__dirname, '..', '..', 'temp');
const tempJobsDir = path.join(tempBaseDir, 'jobs');
const tempLogsDir = path.join(tempBaseDir, 'logs');

// This function runs at startup to ensure our folder structure exists
export const ensureDirectoriesExist = () => {
  const dirs = [tempBaseDir, tempJobsDir, tempLogsDir];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// This function takes the raw code and the language, and saves it to a unique file
export const createTempFile = async (code, language) => {
  // Generate a completely unique ID for the file (e.g., '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')
  const jobId = uuidv4();
  // Determine the correct file extension
  const extension = language === 'python' ? 'py' : 'js';
  // Combine them to make the filename (e.g., '1b9d6bcd...4bed.py')
  const fileName = `${jobId}.${extension}`;
  // Create the full absolute path to the file inside the jobs directory
  const filePath = path.join(tempJobsDir, fileName);

  // Write the user's code into this newly created file
  await fsAsync.writeFile(filePath, code);
  
  // Record exactly when this job was created
  const createdAt = Date.now();

  // Return richer metadata so the controller has context
  return {
    filePath,
    jobId,
    createdAt
  };
};

// This function takes a file path and deletes it from the hard drive
export const deleteTempFile = async (filePath) => {
  try {
    console.log(`Deleting file: ${filePath}`);
    // fs.unlink removes the file
    await fsAsync.unlink(filePath);
  } catch (err) {
    // If deleting fails (e.g., file doesn't exist or permissions issue), we log it
    console.error(`Failed to delete temp file ${filePath}:`, err);
  }
};
