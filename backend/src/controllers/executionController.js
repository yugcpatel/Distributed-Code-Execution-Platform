// Import our utility functions for creating and deleting temporary files
import { createTempFile, deleteTempFile } from '../utils/tempFileManager.js';
// Import the service that actually runs the code
import { executeCode } from '../services/codeExecutor.js';

// This is the controller function for our POST /api/execute route
// It receives the request (req) from the frontend and sends back a response (res)
export const runCode = async (req, res) => {
  // Extract the 'code' and 'language' values from the request body
  const { code, language } = req.body;
  
  // Validate the payload: if either is missing, return a 400 Bad Request error
  if (!code || !language) {
    return res.status(400).json({ error: 'Payload must include "code" and "language".' });
  }

  // We declare filePath outside the try block so we can access it in the finally block for cleanup
  let filePath;
  try {
    // Step 1: Save the user's code to a temporary file on the server's hard drive
    // createTempFile now returns an object with richer metadata
    const tempFileMeta = await createTempFile(code, language);
    filePath = tempFileMeta.filePath;
    const { jobId, createdAt } = tempFileMeta;

    // Step 2: Execute the temporary file in a separate child process and wait for the output
    // executeCode now returns both the output string and the executionTime
    const { output, executionTime } = await executeCode(filePath, language);

    // Step 3: Send a successful 200 OK response back to the frontend containing all metadata
    res.status(200).json({ 
      output, 
      executionTime, 
      jobId, 
      createdAt 
    });
  } catch (error) {
    // If anything goes wrong (like a server error), catch it and send a 500 error response
    res.status(500).json({ error: error.message });
  } finally {
    // The 'finally' block always runs, whether the try succeeded or threw an error
    // Step 4: Clean up by deleting the temporary file so we don't clutter the server's disk
    if (filePath) {
      await deleteTempFile(filePath);
    }
  }
};
