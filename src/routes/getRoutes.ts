import express, { Request, Response } from 'express';
import Build from '../models/Build';

const router = express.Router();

router.get('/latest', async (req: Request, res: Response) => {
    const { serviceName } = req.query;
  
    if (!serviceName) {
      res.status(400).json({ error: 'serviceName is a required parameters.' });
      return;
    }
  
    try {
      // Query to find the latest successful record by serviceName
      const latestBuild = await Build.find({
        'substitutions._SERVICE_NAME': serviceName,
        status: 'SUCCESS'
      })
        .sort({ finishTime: -1 }) // Sort by finishTime in descending order
        .limit(30)
        .exec();
  
      if (!latestBuild || latestBuild.length === 0) {
        res.status(404).json({ error: 'No successful record found for the specified service and environment.' });
        return;
      }
  
      res.status(200).json(latestBuild);
    } catch (error) {
      console.error('Error fetching latest successful record:', error);
      res.status(500).json({ error: 'Failed to fetch the latest successful record' });
    }
  });
  
  export default router;