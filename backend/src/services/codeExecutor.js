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

  try {
    // Execute the shell command
    // We pass a { timeout: 5000 } option to kill the process if it takes longer than 5 seconds (e.g., an infinite loop)
    const { stdout, stderr } = await execAsync(command, { timeout: 5000 });
    
    // If the execution is successful, return the standard output (stdout).
    // If there is standard error (stderr) but it didn't cause the program to crash, append it too.
    return stdout + (stderr ? `\nErrors:\n${stderr}` : '');
  } catch (error) {
    // If the execution crashes (like a syntax error or a timeout), it throws an error
    // We catch it and return the error details so the user can see what went wrong in their code
    return error.stderr || error.message || 'Execution failed with an unknown error.';
  }
};
