import { getDatabase } from '../config/database.js';

export class NodeModel {
  static async findAll(filters = {}) {
    const db = getDatabase();
    const collection = db.collection('nodes');

    const query = {};

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

    return nodes.map(node => ({
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt)
    }));
  }

  static async findById(id) {
    const db = getDatabase();
    const collection = db.collection('nodes');
    const node = await collection.findOne({ id });

    if (!node) {
      return null;
    }

    return {
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt)
    };
  }

  static async create(nodeData) {
    const db = getDatabase();
    const collection = db.collection('nodes');

    const node = {
      ...nodeData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(node);
    return node;
  }

  static async update(id, updates) {
    const db = getDatabase();
    const collection = db.collection('nodes');

    const result = await collection.findOneAndUpdate(
      { id },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return null;
    }

    return {
      ...result.value,
      createdAt: new Date(result.value.createdAt),
      updatedAt: new Date(result.value.updatedAt)
    };
  }

  static async delete(id) {
    const db = getDatabase();
    const collection = db.collection('nodes');
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async search(searchText) {
    const db = getDatabase();
    const collection = db.collection('nodes');

    const nodes = await collection.find(
      { $text: { $search: searchText } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .toArray();

    return nodes.map(node => ({
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt)
    }));
  }
}