// This file centralizes all magic numbers and configurations for the backend

export const EXECUTION = {
  // Maximum allowed size for a single code payload (in characters)
  MAX_CODE_SIZE: 10000,
  
  // Timeout for a single code execution job (in milliseconds)
  TIMEOUT_MS: 5000,
  
  // List of programming languages currently supported by the engine
  ALLOWED_LANGUAGES: ['python', 'cpp']
};

export const CLEANUP = {
  // How often the background garbage collector runs (in milliseconds)
  // Default: 5 minutes (300,000 ms)
  INTERVAL_MS: 5 * 60 * 1000,
  
  // How old a file must be before the garbage collector deletes it (in milliseconds)
  // Default: 5 minutes (300,000 ms)
  MAX_FILE_AGE_MS: 5 * 60 * 1000
};
