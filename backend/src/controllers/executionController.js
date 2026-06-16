// Import our utility functions for creating and deleting temporary files, and logging
import { createTempFile, deleteTempFile, createExecutionLog } from '../utils/tempFileManager.js';
// Import the service that actually runs the code
import { executeCode } from '../services/execution/pythonExecutor.js';
// Import our new validation utility
import { validateExecution } from '../utils/validateExecution.js';

// This is the controller function for our POST /api/execute route
// It receives the request (req), response (res), and the next middleware function (next)
export const runCode = async (req, res, next) => {
  // Extract the 'code' and 'language' values from the request body
  const { code, language } = req.body;
  
  // We declare filePath outside the try block so we can access it in the finally block for cleanup
  let filePath;
  let jobIdForLog;
  try {
    // Validate the payload (this will throw an AppError if invalid)
    validateExecution(code, language);

    // Step 1: Save the user's code to a temporary file on the server's hard drive
    // createTempFile now returns an object with richer metadata
    const tempFileMeta = await createTempFile(code, language);
    filePath = tempFileMeta.filePath;
    const { jobId, createdAt } = tempFileMeta;
    jobIdForLog = jobId;

    console.log(`[Job ${jobId}] Job started`);

    // Step 2: Execute the temporary file in a separate child process and wait for the output
    // executeCode now returns both the output string and the executionTime
    const { output, executionTime } = await executeCode(filePath, language);

    console.log(`[Job ${jobId}] Job completed in ${executionTime}ms`);

    // Step 3: Write the execution log to the logs directory
    await createExecutionLog(jobId, { status: 'SUCCESS', code, output, executionTime });

    // Step 4: Send a successful 200 OK response back to the frontend
    // Standardized response format
    res.status(200).json({ 
      success: true,
      data: {
        output, 
        executionTime, 
        jobId, 
        createdAt 
      }
    });
  } catch (error) {
    if (jobIdForLog) {
      console.log(`[Job ${jobIdForLog}] Job failed`);
      await createExecutionLog(jobIdForLog, { status: 'FAILED', code, output: error.message, executionTime: error.executionTime || 0 });
    }
    // Pass any errors (AppError or system errors) to the global error handling middleware
    next(error);
  } finally {
    // The 'finally' block always runs, whether the try succeeded or threw an error
    // Step 5: Clean up by deleting the temporary file so we don't clutter the server's disk
    if (filePath) {
      await deleteTempFile(filePath);
    }
  }
};
