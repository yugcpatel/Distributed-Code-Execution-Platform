const runTest = async () => {
  const response = await fetch('http://localhost:5000/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: "print('hello queue!')", language: 'python' })
  });
  const data = await response.json();
  console.log("API Response:", data);
};
runTest();
