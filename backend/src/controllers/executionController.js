// Import the validation utility
import { validateExecution } from '../utils/validateExecution.js';
// Import our BullMQ code execution queue
import { codeQueue } from '../queue/codeQueue.js';
// Import Prisma client for database access
import prisma from '../config/prisma.js';

export const runCode = async (req, res, next) => {
  const { code, language } = req.body;
  
  try {
    validateExecution(code, language);

    const dbJob = await prisma.job.create({
      data: {
        language,
        code,
        status: "waiting", // Initial status
      },
    });

    console.log(`[DB] Created job record: ${dbJob.id}`);

    // Add the job to the Redis Queue with Retry logic
    const job = await codeQueue.add(
      "execute",
      {
        language,
        code,
      },
      {
        jobId: dbJob.id,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000
        }
      }
    );

    console.log(`[Queue] Added job to queue: ${job.id}`);

    res.status(200).json({ 
      success: true,
      jobId: dbJob.id
    });
  } catch (error) {
    next(error);
  }
};
