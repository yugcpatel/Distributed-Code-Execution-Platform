import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Create a new connection to our local Redis server running in the Docker container
const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // BullMQ requires this to be null
});

export default connection;
