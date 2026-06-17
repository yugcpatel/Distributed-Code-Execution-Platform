import prisma from './src/config/prisma.js';

async function testDatabase() {
  console.log("Testing database connection...");
  try {
    // Insert a sample job into the database
    const newJob = await prisma.job.create({
      data: {
        language: "python",
        code: "print('hello from prisma test')",
        status: "completed",
        output: "hello from prisma test\n",
        executionTime: 120,
      },
    });

    console.log("Successfully inserted job:");
    console.log(newJob);

    // Query the database to verify it exists
    const fetchedJob = await prisma.job.findUnique({
      where: { id: newJob.id },
    });

    console.log("\nSuccessfully fetched job from database:");
    console.log(fetchedJob);

  } catch (error) {
    console.error("Database test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
