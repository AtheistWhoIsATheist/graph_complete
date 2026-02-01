import express from 'express';
import { NodeModel } from '../models/Node.js';
import { ConnectionModel } from '../models/Connection.js';
import { validateNodeData } from '../middleware/validation.js';

const router = express.Router();

// Get all nodes
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      tags: req.query.tags ? req.query.tags.split(',') : undefined,
      search: req.query.search
    };

    const nodes = await NodeModel.findAll(filters);
    res.json(nodes);
  } catch (error) {
    next(error);
  }
});

// Get single node
router.get('/:id', async (req, res, next) => {
  try {
    const node = await NodeModel.findById(req.params.id);

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    res.json(node);
  } catch (error) {
    next(error);
  }
});

// Create node
router.post('/', validateNodeData, async (req, res, next) => {
  try {
    const node = await NodeModel.create(req.body);
    res.status(201).json(node);
  } catch (error) {
    next(error);
  }
});

// Update node
router.put('/:id', validateNodeData, async (req, res, next) => {
  try {
    const node = await NodeModel.update(req.params.id, req.body);

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    res.json(node);
  } catch (error) {
    next(error);
  }
});

// Delete node
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await NodeModel.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Node not found' });
    }

    // Also delete associated connections
    await ConnectionModel.deleteByNodeId(req.params.id);

    res.json({ message: 'Node deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Search nodes
router.get('/search/:query', async (req, res, next) => {
  try {
    const nodes = await NodeModel.search(req.params.query);
    res.json(nodes);
  } catch (error) {
    next(error);
  }
});

export default router;