import { Worker } from "bullmq";
import connection from "./redisConnection.js";
import { dockerExecutePython, initWarmContainer } from "./executors/pythonExecutor.js";
import { dockerExecuteCpp, initCppWarmContainer } from "./executors/cppExecutor.js";
import prisma from "./config/prisma.js";

// Initialize the ultra-fast warm containers before taking jobs
await initWarmContainer();
await initCppWarmContainer();

const workerId = process.pid;
console.log(`Worker ${workerId} starting up... waiting for jobs on queue 'code-execution'`);

const worker = new Worker(
  "code-execution",
  async (job) => {
    console.log(`[Worker ${workerId}] Picked up job ${job.id}`);
    const { language, code } = job.data;

    try {
      // 1. Update status to RUNNING in the database and increment attempts
      await prisma.job.update({
        where: { id: job.id },
        data: { 
          status: "running",
          attempts: { increment: 1 }
        }
      });

      console.log(`[Worker ${workerId}] Job ${job.id} attempt ${job.attemptsMade + 1}`);

      console.log(`[Worker ${workerId}] started job ${job.id} [${language}]`);
      // 2. Track execution start time
      const startTime = Date.now();

      let result;

      // 3. Language Dispatcher
      switch (language) {
        case "python":
          result = await dockerExecutePython(code);
          break;
        case "cpp":
          result = await dockerExecuteCpp(code);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      // 4. Track execution end time
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // 5. Update status to COMPLETED in the database
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "completed",
          output: result.output,
          executionTime: executionTime
        }
      });

      console.log(`[Worker ${workerId}] completed job ${job.id}`);
      return result;
    } catch (error) {
      console.log(`[Worker ${workerId}] failed job ${job.id} on attempt ${job.attemptsMade + 1}`);
      
      const isFinalAttempt = job.attemptsMade + 1 >= job.opts.attempts;
      
      // 5. Update status to FAILED or RETRYING in the database
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: isFinalAttempt ? "failed" : "retrying",
          error: error.message
        }
      });

      // 6. Re-throw the error so BullMQ handles backoff and retries
      throw error;
    }
  },
  { 
    connection,
    concurrency: 2 
  }
);

// Worker event listeners for logging
worker.on("completed", (job, returnvalue) => {
  console.log(`[Worker ${workerId}] Job ${job.id} Completed successfully in ${returnvalue.executionTime}ms`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker ${workerId}] Job ${job.id} Failed: ${err.message}`);
});
