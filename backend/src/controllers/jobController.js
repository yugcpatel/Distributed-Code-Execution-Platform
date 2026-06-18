import prisma from "../config/prisma.js";

export const getJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Fetch the job from PostgreSQL database instead of Redis
    const job = await prisma.job.findUnique({
      where: {
        id: id
      }
    });

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Return the database fields exactly as they are stored
    return res.status(200).json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        output: job.output,
        error: job.error,
        executionTime: job.executionTime,
        createdAt: job.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};
