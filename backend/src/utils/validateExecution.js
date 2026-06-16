import AppError from './AppError.js';

// This utility function pulls validation logic out of the controller to keep it clean.
export const validateExecution = (code, language) => {
  // Check if payload is missing completely
  if (!code) {
    throw new AppError('Payload must include "code".', 400);
  }
  if (!language) {
    throw new AppError('Payload must include "language".', 400);
  }

  // Define supported languages
  const supportedLanguages = ['python', 'javascript'];
  if (!supportedLanguages.includes(language)) {
    throw new AppError(`Unsupported language: ${language}. Supported languages are: ${supportedLanguages.join(', ')}`, 400);
  }

  // Security check: Reject massive payloads to protect the server
  if (code.length > 10000) {
    throw new AppError('Code size exceeds the maximum allowed limit of 10,000 characters.', 400);
  }
};
