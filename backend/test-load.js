const testLoad = async () => {
  console.log("🚀 Starting Load Test: Submitting 20 Heavy Jobs...");

  const code = `
import time
print("Starting heavy work...")
time.sleep(4)
print("Done with heavy work!")
  `;

  // We will fire off 20 requests at the exact same time
  const promises = [];
  for (let i = 1; i <= 20; i++) {
    const p = fetch('http://127.0.0.1:5000/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: 'python' })
    }).then(res => res.json())
      .then(data => {
        console.log(`✅ [Job ${i}] Submitted successfully. Database ID: ${data.jobId}`);
        return data.jobId;
      })
      .catch(err => {
        console.error(`❌ [Job ${i}] Submission failed:`, err.message);
      });
    
    promises.push(p);
  }

  // Wait for all HTTP POST requests to finish
  const jobIds = await Promise.all(promises);
  console.log(`\n🎉 All ${promises.length} jobs submitted to the queue! Check your worker terminals to watch them process in parallel.`);
};

testLoad();
