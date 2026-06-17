// Import the validation utility
import { validateExecution } from '../utils/validateExecution.js';
// Import our BullMQ code execution queue
import { codeQueue } from '../queue/codeQueue.js';

// This is the controller function for our POST /api/execute route
// It receives the request (req), response (res), and the next middleware function (next)
export const runCode = async (req, res, next) => {
  // Extract the 'code' and 'language' values from the request body
  const { code, language } = req.body;
  
  try {
    // Validate the payload (this will throw an AppError if invalid)
    validateExecution(code, language);

    // Instead of waiting for Docker to run the code, we simply add it to our Redis Queue
    // The name "execute" is the name of this specific job type
    const job = await codeQueue.add("execute", {
      language,
      code,
    });

    console.log(`[Queue] Added job to queue: ${job.id}`);

    // Immediately respond to the user with the Job ID. We don't wait for the output!
    res.status(200).json({ 
      success: true,
      jobId: job.id
    });
  } catch (error) {
    // Pass any errors (AppError or system errors) to the global error handling middleware
    next(error);
  }
};
