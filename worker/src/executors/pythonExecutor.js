import { spawn, exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const WARM_CONTAINER_NAME = "code-runner-warm";

// Called once when the worker boots up
export const initWarmContainer = async () => {
  console.log("Initializing ultra-fast warm container...");
  try {
    // Kill old one if exists
    await execAsync(`docker rm -f ${WARM_CONTAINER_NAME}`);
  } catch (err) {}

  // Boot up a sleeping container in the background
  await execAsync(`docker run -d --name ${WARM_CONTAINER_NAME} --cpus=0.5 --memory=128m --network=none code-runner-python sleep infinity`);
  console.log("Warm container initialized!");
};

export const dockerExecutePython = async (code) => {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    // We execute code inside the already running warm container using stdin stream
    // 'timeout 5' ensures infinite loops inside the container are killed
    const child = spawn("docker", [
      "exec",
      "-i",
      WARM_CONTAINER_NAME,
      "timeout",
      "5",
      "python",
      "-"
    ]);

    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    child.stderr.on("data", (data) => {
      output += data.toString();
    });

    child.on("close", (exitCode) => {
      if (exitCode === 124 || exitCode === 137) {
        // 124 is timeout command exit code, 137 is OOM
        output = output || "Execution timed out after 5 seconds";
        return reject(new Error(output));
      }

      if (exitCode !== 0) {
        // Any non-zero exit code (like python syntax error or runtime error) should trigger a retry
        return reject(new Error(output || `Process exited with code ${exitCode}`));
      }

      resolve({
        output: output,
        executionTime: Date.now() - startTime,
      });
    });

    // Pipe the user's python code directly into the container's python process
    child.stdin.write(code);
    child.stdin.end();
  });
};
