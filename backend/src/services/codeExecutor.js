// Import 'exec' from Node's built-in child_process module to run shell commands (like in a terminal)
import { exec } from 'child_process';
// Import the util module to convert callback-based functions into Promise-based ones
import util from 'util';

// Promisify the 'exec' function so we can use async/await syntax with it instead of callbacks
const execAsync = util.promisify(exec);

// This function takes a file path and the language it's written in, and runs it
export const executeCode = async (filePath, language) => {
  // We determine the correct shell command based on the programming language
  let command;
  if (language === 'python') {
    // For Python, we run: python "path/to/file.py"
    command = `python "${filePath}"`;
  } else if (language === 'javascript') {
    // For JavaScript, we run: node "path/to/file.js"
    command = `node "${filePath}"`;
  } else {
    // If the language isn't supported, throw an error
    throw new Error(`Unsupported language: ${language}`);
  }

  // Record the exact time before we start the execution
  const startTime = Date.now();

  try {
    // Execute the shell command
    // We pass a { timeout: 5000 } option to kill the process if it takes longer than 5 seconds
    const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
    
    // Calculate how long it took
    const executionTime = Date.now() - startTime;

    // Combine standard output and any non-crashing standard error
    const output = stdout + (stderr ? `\nErrors:\n${stderr}` : '');
    
    // Return both the output string and the execution metadata
    return { output, executionTime };
  } catch (error) {
    // Calculate how long it took before crashing
    const executionTime = Date.now() - startTime;
    
    // Extract the error message
    const output = error.stderr || error.message || 'Execution failed with an unknown error.';
    
    // Even if it failed, return the output and the time it took to fail
    return { output, executionTime };
  }
};
