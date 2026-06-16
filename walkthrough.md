# Day 5 — Robust File Lifecycle Management

Your code execution engine just graduated to a production-grade system! We have successfully rebuilt the entire temporary file lifecycle. Here is exactly what I built and how it functions.

## Architectural Changes

### 1. Folder Structure & Automatic Initialization
Instead of dumping everything into a chaotic `temp/` folder, user jobs are now isolated:
- `backend/temp/jobs/` (stores active code)
- `backend/temp/logs/` (ready for future logging)

I added an `ensureDirectoriesExist` routine to `server.js` that runs synchronously at boot. This guarantees that your server will never crash due to a missing folder; it will safely reconstruct the directories automatically on startup.

### 2. Execution Metadata & Performance Tracking
Your backend now natively calculates how fast the user's code ran.
When `codeExecutor.js` is triggered, we track `Date.now()` at the start and end of the execution (whether it succeeds or crashes). 

The backend API response format changed from returning a simple string, to a rich JSON payload:
```json
{
  "output": "Hello world\n",
  "executionTime": 142,
  "jobId": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "createdAt": 1718420000000
}
```

The frontend `OutputPanel` was updated to seamlessly catch this `executionTime` parameter and neatly render it (e.g. `Execution time: 142ms`) right beside the terminal title.

## The Cleanup Engine

The biggest vulnerability in Day 4 was that server crashes or dangling execution promises would leave files permanently trapped on the disk.

### The Garbage Collector (`cleanupService.js`)
I built an automated background service that scans the `jobs` directory, compares the file creation timestamps (`birthtimeMs`) to the current server time, and aggressively `unlink`s any file older than **5 minutes**.

### Background Daemon
In `server.js`, I hooked the cleanup service into a non-blocking `setInterval` daemon. It fires quietly every 300,000 milliseconds (5 minutes). You no longer need to worry about disk-space creeping up over a few weeks of usage.

Your backend will now cleanly manage memory and disk I/O under load!
