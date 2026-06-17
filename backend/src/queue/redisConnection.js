import Redis from "ioredis";

// Create a new connection to our local Redis server running in the Docker container
const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // BullMQ requires this to be null
});

export default connection;
