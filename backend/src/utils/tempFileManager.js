// Import the promises version of the filesystem module to read/write files asynchronously
import { promises as fs } from 'fs';
// Import path to easily construct file paths across different operating systems
import path from 'path';
// Import uuidv4 to generate unique random IDs for our filenames
import { v4 as uuidv4 } from 'uuid';
// Import fileURLToPath to help us get the current directory in ES modules
import { fileURLToPath } from 'url';

// In ES modules, __dirname isn't available by default, so we calculate it using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// We define the temp directory to be two folders up, in 'backend/temp'
const tempDir = path.join(__dirname, '..', '..', 'temp');

// This function takes the raw code and the language, and saves it to a unique file
export const createTempFile = async (code, language) => {
  // First, try to access the temp directory to see if it exists
  try {
    await fs.access(tempDir);
  } catch {
    // If it doesn't exist (throws an error), we create the directory
    await fs.mkdir(tempDir, { recursive: true });
  }

  // Generate a completely unique ID for the file (e.g., '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')
  const id = uuidv4();
  // Determine the correct file extension
  const extension = language === 'python' ? 'py' : 'js';
  // Combine them to make the filename (e.g., '1b9d6bcd...4bed.py')
  const fileName = `${id}.${extension}`;
  // Create the full absolute path to the file
  const filePath = path.join(tempDir, fileName);

  // Write the user's code into this newly created file
  await fs.writeFile(filePath, code);
  
  // Return the path so the executor knows where to find the file
  return filePath;
};

// This function takes a file path and deletes it from the hard drive
export const deleteTempFile = async (filePath) => {
  try {
    // fs.unlink removes the file
    await fs.unlink(filePath);
  } catch (err) {
    // If deleting fails (e.g., file doesn't exist or permissions issue), we log it
    console.error(`Failed to delete temp file ${filePath}:`, err);
  }
};
