// Import the express library to create a router
import express from 'express';
// Import our controller function that will handle the execution logic
import { runCode } from '../controllers/executionController.js';
import { getJobStatus } from '../controllers/jobController.js';

// Create a new Express Router instance to group our routes together
const router = express.Router();

// Define a POST route at the path '/execute'
// When the frontend sends a POST request here, the 'runCode' function will be executed
// POST /api/execute
// We don't apply rate limiting here anymore, since the queue handles bursts gracefully
router.post('/execute', runCode);

// GET /api/job/:id
// Polling endpoint for the frontend to check job status
router.get('/job/:id', getJobStatus);

// Export the router so it can be used in app.js
export default router;
