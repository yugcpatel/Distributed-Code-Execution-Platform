const pollJob = async (jobId) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/job/${jobId}`);
        const data = await response.json();
        console.log(`[Status] ${data.state}`);
        if (data.state === 'completed' || data.state === 'failed') {
          clearInterval(interval);
          resolve(data);
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 1000);
  });
};

const runTest = async () => {
  console.log("Submitting job...");
  const response = await fetch('http://localhost:5000/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: "print('hello async polling!')", language: 'python' })
  });
  const data = await response.json();
  const jobId = data.jobId;
  console.log(`Job submitted! ID: ${jobId}`);
  
  const finalResult = await pollJob(jobId);
  console.log("Final Result:", finalResult);
};

runTest();
