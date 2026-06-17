import { codeQueue } from '../queue/codeQueue.js';

export const getJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Fetch the job from Redis via BullMQ
    const job = await codeQueue.getJob(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // BullMQ tracks exactly what stage the job is in
    const state = await job.getState(); // waiting, active, completed, failed
    
    // We start building our response payload
    const responsePayload = {
      success: true,
      state,
    };

    // If it's done, we extract the result (output and execution time)
    if (state === 'completed') {
      responsePayload.result = job.returnvalue;
    } 
    // If it failed (e.g. Docker crashed, invalid syntax), we extract the error
    else if (state === 'failed') {
      responsePayload.error = job.failedReason;
    }

    res.status(200).json(responsePayload);

  } catch (error) {
    next(error);
  }
};
