import { getDatabase } from '../config/database';
import { Filter } from 'mongodb';

export interface IConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  strength: number;
  description: string;
  evidence_quote_ids?: string[];
  status?: 'PROVEN' | 'INFERENCE' | 'BLOCKED' | 'UNKNOWN';
  confidence?: number;
  createdAt: Date;
}

export class ConnectionModel {
  static async findAll(filters: { sourceId?: string; targetId?: string; type?: string } = {}): Promise<IConnection[]> {
    const db = getDatabase();
    const collection = db.collection<IConnection>('connections');

    const query: Filter<IConnection> = {};

    if (filters.sourceId) query.sourceId = filters.sourceId;
    if (filters.targetId) query.targetId = filters.targetId;
    if (filters.type) query.type = filters.type;

    const connections = await collection.find(query).sort({ createdAt: -1 }).toArray();
    return connections as IConnection[];
  }

  static async findById(id: string): Promise<IConnection | null> {
    const db = getDatabase();
    const collection = db.collection<IConnection>('connections');
    const connection = await collection.findOne({ id });
    return connection as IConnection | null;
  }

  static async findByNodeId(nodeId: string): Promise<IConnection[]> {
    const db = getDatabase();
    const collection = db.collection<IConnection>('connections');
    const connections = await collection.find({
      $or: [{ sourceId: nodeId }, { targetId: nodeId }]
    }).toArray();
    return connections as IConnection[];
  }

  static async create(connectionData: Omit<IConnection, 'createdAt'>): Promise<IConnection> {
    const db = getDatabase();
    const collection = db.collection<IConnection>('connections');

    const connection: IConnection = {
      ...connectionData,
      createdAt: new Date(),
      evidence_quote_ids: connectionData.evidence_quote_ids || [],
      status: connectionData.status || 'INFERENCE',
      confidence: connectionData.confidence !== undefined ? connectionData.confidence : 0.5
    };

    await collection.insertOne(connection as any);
    return connection;
  }

  static async update(id: string, updates: Partial<IConnection>): Promise<IConnection | null> {
    const db = getDatabase();
    const collection = db.collection<IConnection>('connections');

    const result = await collection.findOneAndUpdate(
      { id } as any,
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result as IConnection | null;
  }

  static async delete(id: string): Promise<boolean> {
    const db = getDatabase();
    const collection = db.collection<IConnection>('connections');
    const result = await collection.deleteOne({ id } as any);
    return result.deletedCount > 0;
  }

  static async deleteByNodeId(nodeId: string): Promise<number> {
    const db = getDatabase();
    const collection = db.collection<IConnection>('connections');
    const result = await collection.deleteMany({
      $or: [{ sourceId: nodeId }, { targetId: nodeId }]
    });
    return result.deletedCount;
  }
}
