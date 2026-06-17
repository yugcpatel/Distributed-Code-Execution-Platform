import prisma from './src/config/prisma.js';

const runTest = async () => {
  console.log("Submitting job to API...");
  
  // Submit code to the API
  const response = await fetch('http://localhost:5000/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: "print('Database Job Persistence Test')", language: 'python' })
  });
  
  const data = await response.json();
  const jobId = data.jobId;
  console.log(`Job submitted! Received ID: ${jobId}`);
  
  // Wait a split second
  await new Promise(resolve => setTimeout(resolve, 100));

  // Query the database to ensure the API created the record before returning
  const dbJob = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (dbJob) {
    console.log("Success! Job found in database:");
    console.log(`- ID: ${dbJob.id}`);
    console.log(`- Code: ${dbJob.code}`);
    console.log(`- Status: ${dbJob.status}`);
  } else {
    console.error("Failure! Job was not found in the database.");
  }
};

runTest();
