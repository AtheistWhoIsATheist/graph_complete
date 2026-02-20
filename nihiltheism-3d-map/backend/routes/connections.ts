import express, { Request, Response, NextFunction } from 'express';
import { ConnectionModel } from '../models/Connection';
import { validateConnectionData } from '../middleware/validation';

const router = express.Router();

// Get all connections
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      sourceId: req.query.sourceId as string | undefined,
      targetId: req.query.targetId as string | undefined,
      type: req.query.type as string | undefined
    };

    const connections = await ConnectionModel.findAll(filters);
    res.json(connections);
  } catch (error) {
    next(error);
  }
});

// Get single connection
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await ConnectionModel.findById(req.params.id as string);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json(connection);
  } catch (error) {
    next(error);
  }
});

// Get connections for a node
router.get('/node/:nodeId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connections = await ConnectionModel.findByNodeId(req.params.nodeId as string);
    res.json(connections);
  } catch (error) {
    next(error);
  }
});

// Create connection
router.post('/', validateConnectionData, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await ConnectionModel.create(req.body);
    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
});

// Update connection
router.put('/:id', validateConnectionData, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const connection = await ConnectionModel.update(req.params.id as string, req.body);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json(connection);
  } catch (error) {
    next(error);
  }
});

// Delete connection
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await ConnectionModel.delete(req.params.id as string);

    if (!deleted) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
