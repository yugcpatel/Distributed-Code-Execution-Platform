import AppError from './AppError.js';
import { EXECUTION } from '../config/constants.js';

// This utility function pulls validation logic out of the controller to keep it clean.
export const validateExecution = (code, language) => {
  // Check if payload is missing completely
  if (!code) {
    throw new AppError('Payload must include "code".', 400);
  }
  if (!language) {
    throw new AppError('Payload must include "language".', 400);
  }

  // Define supported languages from config
  if (!EXECUTION.ALLOWED_LANGUAGES.includes(language)) {
    throw new AppError(`Unsupported language: ${language}. Supported languages are: ${EXECUTION.ALLOWED_LANGUAGES.join(', ')}`, 400);
  }

  // Security check: Reject massive payloads to protect the server
  if (code.length > EXECUTION.MAX_CODE_SIZE) {
    throw new AppError(`Code size exceeds the maximum allowed limit of ${EXECUTION.MAX_CODE_SIZE} characters.`, 400);
  }
};
