import "dotenv/config";
import prisma from "./src/config/prisma.js";

async function check() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  console.log(jobs);
}

check();
