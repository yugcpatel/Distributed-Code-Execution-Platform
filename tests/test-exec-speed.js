import { spawn } from 'child_process';

const start = Date.now();

const child = spawn("docker", [
  "exec",
  "-i",
  "code-runner-cpp-warm",
  "sh",
  "-c",
  "echo hello"
]);

child.on('close', code => {
  const end = Date.now();
  console.log("Time:", end - start, "ms");
});
