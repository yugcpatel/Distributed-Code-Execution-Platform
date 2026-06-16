// Import 'exec' from Node's built-in child_process module to run shell commands (like in a terminal)
import { exec } from 'child_process';
// Import the util module to convert callback-based functions into Promise-based ones
import util from 'util';
// Import our custom AppError to handle execution failures gracefully
import AppError from '../../utils/AppError.js';

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
    // If the language isn't supported, throw a structured 400 error
    throw new AppError(`Unsupported language: ${language}`, 400);
  }

  // Record the exact time before we start the execution
  const startTime = Date.now();

  try {
    // Execute the shell command
    // We pass a { timeout: 5000 } option to kill the process if it takes longer than 5 seconds
    const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
    
    // Calculate how long it took
    const executionTime = Date.now() - startTime;

    // Distinguish: bad code ≠ server failure. 
    // If the script outputs to stderr but exits 0, we still treat it as a code error (e.g. warnings)
    if (stderr) {
      throw new AppError(stderr, 400);
    }
    
    // Return both the output string and the execution metadata
    return { output: stdout, executionTime };
  } catch (error) {
    // If the error is already an AppError (from our stderr check above), re-throw it
    if (error instanceof AppError) {
      throw error;
    }

    // A timeout or syntax error usually surfaces in error.stderr or error.message
    const errorMsg = error.stderr || (error.killed ? 'Execution timed out after 5 seconds' : error.message);
    
    // Throw a 400 error indicating the user's code failed
    throw new AppError(errorMsg || 'Execution failed with an unknown error.', 400);
  }
};
