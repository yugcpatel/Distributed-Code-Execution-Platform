import "dotenv/config";
import prisma from "./src/config/prisma.js";

async function test() {
  const jobs = await prisma.job.findMany();
  console.log("Found jobs:", jobs.length);
  if (jobs.length > 0) {
    console.log("Sample job:", jobs[0]);
  }
}

test();
