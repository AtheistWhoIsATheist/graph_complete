import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nihiltheism-3d-map';
const DB_NAME = process.env.MONGODB_DB_NAME || 'nihiltheism-3d-map';

async function setupDatabase() {
  let client;

  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    console.log(`✅ Connected to database: ${DB_NAME}`);

    // Create collections
    await db.createCollection('nodes');
    await db.createCollection('connections');
    console.log('✅ Collections created');

    // Create indexes
    const nodesCollection = db.collection('nodes');
    const connectionsCollection = db.collection('connections');

    await nodesCollection.createIndex({ title: 'text', description: 'text' });
    await nodesCollection.createIndex({ category: 1 });
    await nodesCollection.createIndex({ tags: 1 });
    await nodesCollection.createIndex({ createdAt: -1 });
    await nodesCollection.createIndex({ id: 1 }, { unique: true });

    await connectionsCollection.createIndex({ sourceId: 1 });
    await connectionsCollection.createIndex({ targetId: 1 });
    await connectionsCollection.createIndex({ type: 1 });
    await connectionsCollection.createIndex({ id: 1 }, { unique: true });

    console.log('✅ Indexes created');
    console.log('✅ Database setup complete!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

setupDatabase();