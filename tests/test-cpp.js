import prisma from '../backend/src/config/prisma.js';

const submitAndCheck = async (label, code) => {
  console.log(`\n--- Testing: ${label} ---`);
  
  const response = await fetch('http://127.0.0.1:5000/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language: 'cpp' })
  });
  
  const data = await response.json();
  const jobId = data.jobId;
  console.log(`[${label}] Submitted Job ID: ${jobId}`);
  
  // Wait a few seconds for the worker to process it
  await new Promise(resolve => setTimeout(resolve, 8000));

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
  // 1. Standard Success
  await submitAndCheck("Standard Success", `
#include <iostream>
using namespace std;
int main() {
    cout << "Hello C++";
}
  `);

  // 2. Compile Error
  await submitAndCheck("Compile Error", `
#include <iostream>
int main() {
    cout << "hello"
  `);

  // 3. Runtime Error
  await submitAndCheck("Runtime Error", `
int main() {
    int x = 0;
    int y = 10 / x;
}
  `);

  // 4. Infinite Loop
  await submitAndCheck("Infinite Loop", `
int main() {
    while(true){}
}
  `);
};

runAllTests();
