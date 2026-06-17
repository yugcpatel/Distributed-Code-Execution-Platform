// Import the validation utility
import { validateExecution } from '../utils/validateExecution.js';
// Import our BullMQ code execution queue
import { codeQueue } from '../queue/codeQueue.js';
// Import Prisma client for database access
import prisma from '../config/prisma.js';

// This is the controller function for our POST /api/execute route
// It receives the request (req), response (res), and the next middleware function (next)
export const runCode = async (req, res, next) => {
  // Extract the 'code' and 'language' values from the request body
  const { code, language } = req.body;
  
  try {
    // Validate the payload (this will throw an AppError if invalid)
    validateExecution(code, language);

    // 1. Create a permanent record in the database first
    const dbJob = await prisma.job.create({
      data: {
        language,
        code,
        status: "waiting", // Initial status
      },
    });

    console.log(`[DB] Created job record: ${dbJob.id}`);

    // 2. Add the job to the Redis Queue, explicitly setting the jobId to match our DB id
    const job = await codeQueue.add(
      "execute",
      {
        language,
        code,
      },
      {
        jobId: dbJob.id,
      }
    );

    console.log(`[Queue] Added job to queue: ${job.id}`);

    // 3. Immediately respond to the user with the Database Job ID
    res.status(200).json({ 
      success: true,
      jobId: dbJob.id
    });
  } catch (error) {
    // Pass any errors (AppError or system errors) to the global error handling middleware
    next(error);
  }
};
