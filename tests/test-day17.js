import prisma from '../backend/src/config/prisma.js';

const submitAndCheck = async (label, code) => {
  console.log(`\n--- Testing: ${label} ---`);
  
  const response = await fetch('http://127.0.0.1:5000/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language: 'python' })
  });
  
  const data = await response.json();
  const jobId = data.jobId;
  console.log(`[${label}] Submitted Job ID: ${jobId}`);
  
  // Wait a few seconds for the worker to process it
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Query PostgreSQL
  const dbJob = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (dbJob) {
    console.log(`[${label}] Final DB Status: ${dbJob.status}`);
    console.log(`[${label}] Output: ${dbJob.output ? dbJob.output.trim() : 'N/A'}`);
    console.log(`[${label}] Error: ${dbJob.error || 'N/A'}`);
    console.log(`[${label}] Execution Time: ${dbJob.executionTime || 'N/A'}ms`);
  } else {
    console.error(`[${label}] Job not found in database!`);
  }
};

const runAllTests = async () => {
  await submitAndCheck("Runtime Error Case", "print(1/0)");
};

runAllTests();
