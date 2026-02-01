import { getDatabase } from '../config/database.js';

export class ConnectionModel {
  static async findAll(filters = {}) {
    const db = getDatabase();
    const collection = db.collection('connections');

    const query = {};

    if (filters.sourceId) {
      query.sourceId = filters.sourceId;
    }

    if (filters.targetId) {
      query.targetId = filters.targetId;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    const connections = await collection.find(query).sort({ createdAt: -1 }).toArray();

    return connections.map(conn => ({
      ...conn,
      createdAt: new Date(conn.createdAt)
    }));
  }

  static async findById(id) {
    const db = getDatabase();
    const collection = db.collection('connections');
    const connection = await collection.findOne({ id });

    if (!connection) {
      return null;
    }

    return {
      ...connection,
      createdAt: new Date(connection.createdAt)
    };
  }

  static async findByNodeId(nodeId) {
    const db = getDatabase();
    const collection = db.collection('connections');

    const connections = await collection.find({
      $or: [{ sourceId: nodeId }, { targetId: nodeId }]
    }).toArray();

    return connections.map(conn => ({
      ...conn,
      createdAt: new Date(conn.createdAt)
    }));
  }

  static async create(connectionData) {
    const db = getDatabase();
    const collection = db.collection('connections');

    const connection = {
      ...connectionData,
      createdAt: new Date()
    };

    await collection.insertOne(connection);
    return connection;
  }

  static async update(id, updates) {
    const db = getDatabase();
    const collection = db.collection('connections');

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return null;
    }

    return {
      ...result.value,
      createdAt: new Date(result.value.createdAt)
    };
  }

  static async delete(id) {
    const db = getDatabase();
    const collection = db.collection('connections');
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async deleteByNodeId(nodeId) {
    const db = getDatabase();
    const collection = db.collection('connections');

    const result = await collection.deleteMany({
      $or: [{ sourceId: nodeId }, { targetId: nodeId }]
    });

    return result.deletedCount;
  }
}