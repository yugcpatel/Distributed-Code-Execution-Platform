import { Worker } from "bullmq";
import connection from "./redisConnection.js";
import { dockerExecutePython, initWarmContainer } from "./dockerExecutor.js";
import prisma from "./config/prisma.js";

// Initialize the ultra-fast warm container before taking jobs
await initWarmContainer();

console.log("Worker starting up... waiting for jobs on queue 'code-execution'");

const worker = new Worker(
  "code-execution",
  async (job) => {
    console.log(`[Job ${job.id}] Picked up job`);
    const { language, code } = job.data;

    try {
      // 1. Update status to RUNNING in the database
      await prisma.job.update({
        where: { id: job.id },
        data: { status: "running" }
      });

      // We only support Python at the moment, but we can expand later
      if (language !== "python") {
        throw new Error(`Unsupported language: ${language}`);
      }

      console.log(`Job ${job.id} started`);
      // 2. Track execution start time
      const startTime = Date.now();

      // Hand off the code to our secure Docker executor
      const result = await dockerExecutePython(code);

      // 3. Track execution end time
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // 4. Update status to COMPLETED in the database
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "completed",
          output: result.output,
          executionTime: executionTime
        }
      });

      console.log(`Job ${job.id} completed`);
      return result;
    } catch (error) {
      console.log(`Job ${job.id} failed`);
      
      // 5. Update status to FAILED in the database
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: "failed",
          error: error.message
        }
      });

      // 6. Re-throw the error so BullMQ knows it failed
      throw error;
    }
  },
  { connection }
);

// Worker event listeners for logging
worker.on("completed", (job, returnvalue) => {
  console.log(`[Job ${job.id}] Completed successfully in ${returnvalue.executionTime}ms`);
});

worker.on("failed", (job, err) => {
  console.error(`[Job ${job.id}] Failed: ${err.message}`);
});
