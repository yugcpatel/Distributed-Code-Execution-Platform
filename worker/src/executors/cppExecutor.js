import { spawn, exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const WARM_CONTAINER_NAME = "code-runner-cpp-warm";

// Called once when the worker boots up
export const initCppWarmContainer = async () => {
  console.log("Initializing ultra-fast C++ warm container...");
  try {
    await execAsync(`docker rm -f ${WARM_CONTAINER_NAME}`);
  } catch (err) {}

  // Removing --cpus=0.5 because g++ compilation is highly CPU-intensive.
  // Removing volume mounts because Windows/WSL2 Docker Volume sharing causes huge IO latency.
  await execAsync(`docker run -d --name ${WARM_CONTAINER_NAME} --network=none code-runner-cpp sleep infinity`);
  console.log("C++ Warm container initialized!");
};

export const dockerExecuteCpp = async (code) => {
  const startTime = Date.now();
  const uniqueId = Date.now();
  const fileName = `main-${uniqueId}.cpp`;
  const binaryName = `output-${uniqueId}`;

  // 1. Compile and Execute in a single lightning-fast step inside the warm container
  // We bypass Windows volume mounting completely by piping the code into `cat`
  return await new Promise((resolve, reject) => {
    const command = `cat > /app/${fileName} && g++ /app/${fileName} -o /app/${binaryName} && timeout 5 /app/${binaryName}`;
    
    const child = spawn("docker", [
      "exec",
      "-i", // Interactive to keep stdin open
      WARM_CONTAINER_NAME,
      "sh",
      "-c",
      command
    ]);

    let output = "";
    child.stdout.on("data", (data) => { output += data.toString(); });
    child.stderr.on("data", (data) => { output += data.toString(); });

    child.on("close", (exitCode) => {
      // 2. Cleanup inside container (fire and forget)
      execAsync(`docker exec ${WARM_CONTAINER_NAME} sh -c "rm -f /app/${fileName} /app/${binaryName}"`).catch(() => {});

      if (exitCode === 124 || exitCode === 137) {
        return reject(new Error(output || "Execution timed out after 5 seconds"));
      }
      if (exitCode !== 0) {
        // Could be a compilation error or a runtime error
        return reject(new Error(output || `Process exited with code ${exitCode}`));
      }

      resolve({
        output: output,
        executionTime: Date.now() - startTime
      });
    });

    // Pipe the user's C++ code directly into the container's bash command
    child.stdin.write(code);
    child.stdin.end();
  });
};
