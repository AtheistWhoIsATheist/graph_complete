import express from 'express';
import { ConnectionModel } from '../models/Connection.js';
import { validateConnectionData } from '../middleware/validation.js';

const router = express.Router();

// Get all connections
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      sourceId: req.query.sourceId,
      targetId: req.query.targetId,
      type: req.query.type
    };

    const connections = await ConnectionModel.findAll(filters);
    res.json(connections);
  } catch (error) {
    next(error);
  }
});

// Get single connection
router.get('/:id', async (req, res, next) => {
  try {
    const connection = await ConnectionModel.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json(connection);
  } catch (error) {
    next(error);
  }
});

// Get connections for a node
router.get('/node/:nodeId', async (req, res, next) => {
  try {
    const connections = await ConnectionModel.findByNodeId(req.params.nodeId);
    res.json(connections);
  } catch (error) {
    next(error);
  }
});

// Create connection
router.post('/', validateConnectionData, async (req, res, next) => {
  try {
    const connection = await ConnectionModel.create(req.body);
    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
});

// Update connection
router.put('/:id', validateConnectionData, async (req, res, next) => {
  try {
    const connection = await ConnectionModel.update(req.params.id, req.body);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json(connection);
  } catch (error) {
    next(error);
  }
});

// Delete connection
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await ConnectionModel.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;