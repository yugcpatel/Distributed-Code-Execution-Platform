import { spawn } from 'child_process';

const code = `
#include <iostream>
using namespace std;
int main() { cout << "Hello Fast C++" << endl; return 0; }
`;

const start = Date.now();

const command = `cat > /app/test.cpp && g++ /app/test.cpp -o /app/out && /app/out`;

const child = spawn("docker", [
  "exec",
  "-i",
  "code-runner-cpp-warm",
  "sh",
  "-c",
  command
]);

let output = "";
child.stdout.on('data', data => output += data.toString());
child.stderr.on('data', data => output += data.toString());

child.on('close', code => {
  const end = Date.now();
  console.log("Output:", output);
  console.log("Time:", end - start, "ms");
});

child.stdin.write(code);
child.stdin.end();
