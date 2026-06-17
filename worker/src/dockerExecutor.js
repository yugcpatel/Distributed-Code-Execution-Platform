import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// We define our local temp directory for the worker
const TEMP_DIR = path.resolve(process.cwd(), "temp");

// Ensure the temp directory exists
const ensureTempDir = async () => {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
};

export const dockerExecutePython = async (code) => {
  await ensureTempDir();

  const jobId = uuidv4();
  const fileName = `${jobId}.py`;
  const absoluteFilePath = path.join(TEMP_DIR, fileName);

  // 1. Create the temp file
  await fs.writeFile(absoluteFilePath, code);

  const startTime = Date.now();

  try {
    // 2. Execute via Docker with strict limits
    const args = [
      "run",
      "--rm",
      "--cpus=0.5",
      "--memory=128m",
      "--network=none",
      "--read-only",
      "--tmpfs", "/tmp",
      "-v",
      `${absoluteFilePath.replace(/\\/g, '/')}:/app/code.py`,
      "code-runner-python",
      "python",
      "/app/code.py"
    ];

    const child = spawn("docker", args);

    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    child.stderr.on("data", (data) => {
      output += data.toString();
    });

    const result = await new Promise((resolve) => {
      // Security: Hard timeout of 5 seconds to prevent infinite loops
      const timeout = setTimeout(() => {
        child.kill();
        resolve({
          output: "Execution timed out after 5 seconds",
          executionTime: Date.now() - startTime,
        });
      }, 5000);

      child.on("close", (code) => {
        clearTimeout(timeout);
        if (code === 137) {
           output = "Process exited with code 137 (OOM Killer)";
        }
        resolve({
          output: output || `Process exited with code ${code}`,
          executionTime: Date.now() - startTime,
        });
      });
    });

    return result;
  } finally {
    // 3. Cleanup temp file regardless of success or failure
    try {
      await fs.unlink(absoluteFilePath);
    } catch (err) {
      console.error(`Failed to delete temp file ${absoluteFilePath}`, err);
    }
  }
};
