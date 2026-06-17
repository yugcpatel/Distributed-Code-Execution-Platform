import { Worker } from "bullmq";
import connection from "./redisConnection.js";
import { dockerExecutePython } from "./dockerExecutor.js";

console.log("Worker starting up... waiting for jobs on queue 'code-execution'");

const worker = new Worker(
  "code-execution",
  async (job) => {
    console.log(`[Job ${job.id}] Picked up job`);
    const { language, code } = job.data;

    // We only support Python at the moment, but we can expand later
    if (language !== "python") {
      throw new Error(`Unsupported language: ${language}`);
    }

    // Hand off the code to our secure Docker executor
    const result = await dockerExecutePython(code);
    return result;
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
