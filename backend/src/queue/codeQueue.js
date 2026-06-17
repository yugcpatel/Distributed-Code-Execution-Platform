import { Queue } from "bullmq";
import connection from "./redisConnection.js";

// We create a new Queue instance named "code-execution"
// This is effectively a mailbox where our API will drop new jobs
export const codeQueue = new Queue("code-execution", {
  connection, // We pass the Redis connection we just created
});
