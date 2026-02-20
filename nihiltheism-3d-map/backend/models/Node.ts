import { ObjectId, Filter, WithId, Document } from 'mongodb';
import { getDatabase } from '../config/database';

export interface INode {
  id: string; // Using string UUID as ID
  title: string;
  description: string;
  category: string;
  tags: string[];
  position: { x: number; y: number; z: number };
  evidence_quote_ids?: string[];
  status?: 'PROVEN' | 'INFERENCE' | 'BLOCKED' | 'UNKNOWN';
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class NodeModel {
  static async findAll(filters: { category?: string; tags?: string[]; search?: string } = {}): Promise<INode[]> {
    const db = getDatabase();
    const collection = db.collection<INode>('nodes');

    const query: Filter<INode> = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const nodes = await collection.find(query).sort({ updatedAt: -1 }).toArray();

    // Cast to INode[] to avoid WithId<INode> issues in return type
    return nodes as INode[];
  }

  static async findById(id: string): Promise<INode | null> {
    const db = getDatabase();
    const collection = db.collection<INode>('nodes');
    const node = await collection.findOne({ id });
    return node as INode | null;
  }

  static async create(nodeData: Omit<INode, 'createdAt' | 'updatedAt'>): Promise<INode> {
    const db = getDatabase();
    const collection = db.collection<INode>('nodes');

    const node: INode = {
      ...nodeData,
      createdAt: new Date(),
      updatedAt: new Date(),
      evidence_quote_ids: nodeData.evidence_quote_ids || [],
      status: nodeData.status || 'INFERENCE',
      confidence: nodeData.confidence !== undefined ? nodeData.confidence : 0.5
    };

    await collection.insertOne(node as any);
    return node;
  }

  static async update(id: string, updates: Partial<INode>): Promise<INode | null> {
    const db = getDatabase();
    const collection = db.collection<INode>('nodes');

    const result = await collection.findOneAndUpdate(
      { id } as any,
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    return result as INode | null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    const collection = db.collection<INode>('nodes');
    const result = await collection.deleteOne({ id } as any);
    return result.deletedCount > 0;
  }

  static async search(searchText: string): Promise<INode[]> {
    const db = getDatabase();
    const collection = db.collection<INode>('nodes');

    const nodes = await collection.find(
      { $text: { $search: searchText } } as any
    )
    .sort({ score: { $meta: 'textScore' } })
    .toArray();

    return nodes as unknown as INode[];
  }
}
