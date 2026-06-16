# System Architecture

This document outlines the internal flow of the Distributed Code Execution Platform from the moment a user submits code to the final response.

## Execution Flow

1. **Frontend Request**
   - The user selects a language and inputs code in the Monaco Editor.
   - The React frontend makes a POST request to `/api/execute` containing `{ code, language }`.

2. **API & Request Logging**
   - `requestLogger.js` intercepts the request, logging the method and timestamp.
   - The request hits `executionController.js`.

3. **Validation (`validateExecution.js`)**
   - The payload is checked for missing fields.
   - The language is verified against `ALLOWED_LANGUAGES`.
   - The payload length is strictly limited to `MAX_CODE_SIZE` (10,000 chars) to prevent server abuse.
   - If validation fails, an `AppError` is thrown and routed to the global error handler.

4. **Temporary File Creation (`tempFileManager.js`)**
   - A unique `UUID` is generated for the job.
   - The code is written asynchronously to `temp/jobs/<uuid>.py` (or `.js`).
   - The job creation time is recorded for metadata.

5. **Local Execution (`services/execution/pythonExecutor.js`)**
   - A Node.js `child_process` spawns the relevant language runtime (e.g., `python`).
   - Execution is strictly bounded by `TIMEOUT_MS` (5 seconds).
   - `stdout` is captured. If the process crashes or emits `stderr`, it is captured and thrown as a `400 AppError` to distinguish bad user code from a server failure.
   - Total execution time is recorded.

6. **Execution Logging**
   - A comprehensive log containing the job ID, code, output, and execution time is appended to `temp/logs/<uuid>.log` for permanent record-keeping.

7. **Cleanup & Response**
   - The temporary execution file (`temp/jobs/<uuid>.py`) is synchronously deleted using `fs.unlink`.
   - A structured JSON response `{ success: true, data: { output, executionTime, jobId, createdAt } }` is returned to the frontend.

## Background Services

- **Garbage Collector (`cleanupService.js`)**: Runs every 5 minutes on a detached interval. Scans `temp/jobs/` and aggressively deletes any dangling files older than 5 minutes to prevent disk bloat during server crashes.
