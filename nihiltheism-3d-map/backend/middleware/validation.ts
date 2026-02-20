import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validCategories = ['ontology', 'epistemology', 'ethics', 'mysticism', 'existentialism'] as const;

const nodeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000),
  category: z.enum(validCategories),
  tags: z.array(z.string()),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number()
  }).optional(),
  evidence_quote_ids: z.array(z.string()).optional(),
  status: z.enum(['PROVEN', 'INFERENCE', 'BLOCKED', 'UNKNOWN']).optional(),
  confidence: z.number().min(0).max(1).optional()
});

const connectionSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string().uuid(),
  targetId: z.string().uuid(),
  type: z.enum(['supports', 'contradicts', 'relates', 'extends', 'questions']),
  strength: z.number().min(0).max(1).optional(),
  description: z.string().optional(),
  evidence_quote_ids: z.array(z.string()).optional(),
  status: z.enum(['PROVEN', 'INFERENCE', 'BLOCKED', 'UNKNOWN']).optional(),
  confidence: z.number().min(0).max(1).optional()
}).refine(data => data.sourceId !== data.targetId, {
  message: "Source and target nodes must be different",
  path: ["targetId"]
});

export const validateNodeData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = nodeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validateConnectionData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = connectionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }
    next();
  } catch (error) {
    next(error);
  }
};
