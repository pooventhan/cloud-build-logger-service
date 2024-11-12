import express, { Request, Response } from 'express';
import Build from '../models/Build';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const buildPayload = new Build(req.body);
    await buildPayload.save();
    res.status(201).json();
  } catch (error) {
    console.error('Error saving payload:', error);
    console.error(`Payload=${JSON.stringify(req.body)}`);
    res.status(500).json({ error: 'Failed to save payload' });
  }
});

export default router;