import express, { Request, Response, NextFunction } from 'express';
import { NodeModel } from '../models/Node';
import { ConnectionModel } from '../models/Connection';
import { validateNodeData } from '../middleware/validation';

const router = express.Router();

// Get all nodes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      category: req.query.category as string | undefined,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      search: req.query.search as string | undefined
    };

    const nodes = await NodeModel.findAll(filters);
    res.json(nodes);
  } catch (error) {
    next(error);
  }
});

// Get single node
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const node = await NodeModel.findById(req.params.id as string);

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    res.json(node);
  } catch (error) {
    next(error);
  }
});

// Create node
router.post('/', validateNodeData, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const node = await NodeModel.create(req.body);
    res.status(201).json(node);
  } catch (error) {
    next(error);
  }
});

// Update node
router.put('/:id', validateNodeData, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const node = await NodeModel.update(req.params.id as string, req.body);

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    res.json(node);
  } catch (error) {
    next(error);
  }
});

// Delete node
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await NodeModel.delete(req.params.id as string);

    if (!deleted) {
      return res.status(404).json({ error: 'Node not found' });
    }

    // Also delete associated connections
    await ConnectionModel.deleteByNodeId(req.params.id as string);

    res.json({ message: 'Node deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Search nodes
router.get('/search/:query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nodes = await NodeModel.search(req.params.query as string);
    res.json(nodes);
  } catch (error) {
    next(error);
  }
});

export default router;
