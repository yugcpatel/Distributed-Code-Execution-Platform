import { spawn } from 'child_process';
import path from 'path';
import AppError from '../../utils/AppError.js';

export const dockerExecuteCode = (filePath, language) => {
  return new Promise((resolve, reject) => {
    // We currently only built a Docker image for Python.
    if (language !== 'python') {
      return reject(new AppError(`Unsupported language: ${language}`, 400));
    }

    const startTime = Date.now();

    // ---------------------------------------------------------
    // EXPLANATION: Docker Volume Mounting on Windows
    // ---------------------------------------------------------
    // When you run Docker, it creates an isolated mini-computer (container).
    // To let that container read your user's code, we use a "Volume Mount" (-v).
    // Syntax: -v "HostFile:ContainerFile"
    // Rule: Docker REQUIRES absolute paths on the host machine.
    // We use `process.cwd()` which gives us the current directory (backend).
    // `path.resolve` safely joins it with `filePath` (temp/jobs/uuid.py).
    // This creates an exact Windows path (e.g., d:\Study\...\temp\jobs\uuid.py).
    const absoluteFilePath = path.resolve(process.cwd(), filePath);

    // Build the Docker arguments
    const args = [
      "run",
      "--rm", // Auto-delete the container when the execution finishes (cleanup).
      "-v", // Volume mount flag
      `${absoluteFilePath}:/app/code.py`, // Map our Windows host file to the container's /app/code.py
      "code-runner-python", // The name of the Docker image to run
      "python", // The command to run inside the container
      "/app/code.py" // The path inside the container to execute
    ];

    // Spawn the Docker process (instead of directly spawning python)
    const child = spawn("docker", args);

    let stdout = "";
    let stderr = "";

    // Capture standard output (what the user's code successfully prints)
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    // Capture standard error (errors from the Python code, or from Docker)
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // Setup a 5-second safety timeout, just like the local executor.
    // If the code has an infinite loop (e.g., `while True: pass`), we kill the container.
    const timeoutId = setTimeout(() => {
      child.kill(); // Kills the docker run process, which stops the container
      reject(new AppError("Execution timed out after 5 seconds", 400));
    }, 5000);

    // When the process finishes
    child.on("close", (code) => {
      clearTimeout(timeoutId); // Stop the 5-second timer
      
      const executionTime = Date.now() - startTime;

      // code !== 0 means it crashed. stderr means it threw an error (like SyntaxError).
      if (code !== 0 || stderr) {
        // We throw it as a 400 Bad Request since it's the user's code that failed.
        return reject(new AppError(stderr || `Process exited with code ${code}`, 400));
      }

      // Success! Return the output.
      resolve({ output: stdout, executionTime });
    });

    // Handle unexpected system errors (e.g., Docker is not running or not installed)
    child.on("error", (error) => {
      clearTimeout(timeoutId);
      reject(new AppError(`Docker error: ${error.message}`, 500));
    });
  });
};
