

const runCode = async (code) => {
  const response = await fetch('http://localhost:5000/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language: 'python' })
  });
  const data = await response.json();
  return { status: response.status, data };
};

const tests = [
  {
    name: "Infinite Loop",
    code: "while True:\n    pass"
  },
  {
    name: "Memory Bomb",
    code: "a = []\nwhile True:\n    a.append('x' * 1000000)"
  },
  {
    name: "Internet Test",
    code: "import urllib.request\ntry:\n    urllib.request.urlopen('https://google.com')\n    print('SUCCESS')\nexcept Exception as e:\n    print('FAILED:', str(e))"
  },
  {
    name: "Filesystem Test",
    code: "try:\n    with open('hack.txt', 'w') as f:\n        f.write('hacked')\n    print('SUCCESS')\nexcept Exception as e:\n    print('FAILED:', str(e))"
  }
];

async function runTests() {
  for (const test of tests) {
    console.log(`\n--- Running Test: ${test.name} ---`);
    const result = await runCode(test.code);
    console.log(`Status Code: ${result.status}`);
    console.log(result.data);
  }
}

runTests();
