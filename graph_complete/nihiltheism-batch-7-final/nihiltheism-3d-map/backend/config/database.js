import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nihiltheism-3d-map';
const DB_NAME = process.env.MONGODB_DB_NAME || 'nihiltheism-3d-map';

let client = null;
let db = null;

export async function connectDatabase() {
  try {
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    db = client.db(DB_NAME);

    console.log('✅ Connected to MongoDB');

    // Create indexes
    await createIndexes();

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function createIndexes() {
  try {
    const nodesCollection = db.collection('nodes');
    const connectionsCollection = db.collection('connections');

    await nodesCollection.createIndex({ title: 'text', description: 'text' });
    await nodesCollection.createIndex({ category: 1 });
    await nodesCollection.createIndex({ tags: 1 });
    await nodesCollection.createIndex({ createdAt: -1 });

    await connectionsCollection.createIndex({ sourceId: 1 });
    await connectionsCollection.createIndex({ targetId: 1 });
    await connectionsCollection.createIndex({ type: 1 });

    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});