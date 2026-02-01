import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nihiltheism-3d-map';
const DB_NAME = process.env.MONGODB_DB_NAME || 'nihiltheism-3d-map';

const sampleNodes = [
  {
    id: uuidv4(),
    title: 'The Void as Foundation',
    description: 'Exploration of nothingness as the fundamental ground of being.',
    category: 'ontology',
    tags: ['void', 'nothingness', 'foundation'],
    position: { x: 0, y: 0, z: 0 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Transcendent Awareness',
    description: 'The awakening beyond conventional understanding.',
    category: 'mysticism',
    tags: ['awakening', 'transcendence', 'consciousness'],
    position: { x: 5, y: 3, z: -2 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Epistemological Nihilism',
    description: 'The impossibility of certain knowledge and its implications.',
    category: 'epistemology',
    tags: ['knowledge', 'certainty', 'skepticism'],
    position: { x: -4, y: 2, z: 3 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Ethical Void',
    description: 'The absence of objective moral values and meaning-making.',
    category: 'ethics',
    tags: ['morality', 'values', 'meaning'],
    position: { x: 3, y: -2, z: 4 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Existential Dread',
    description: 'The confrontation with meaninglessness and freedom.',
    category: 'existentialism',
    tags: ['anxiety', 'freedom', 'authenticity'],
    position: { x: -3, y: 4, z: -3 },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedDatabase() {
  let client;

  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    console.log(`✅ Connected to database: ${DB_NAME}`);

    // Clear existing data
    await db.collection('nodes').deleteMany({});
    await db.collection('connections').deleteMany({});
    console.log('✅ Existing data cleared');

    // Insert sample nodes
    await db.collection('nodes').insertMany(sampleNodes);
    console.log(`✅ Inserted ${sampleNodes.length} sample nodes`);

    // Create sample connections
    const sampleConnections = [
      {
        id: uuidv4(),
        sourceId: sampleNodes[0].id,
        targetId: sampleNodes[1].id,
        type: 'relates',
        strength: 0.8,
        description: 'Void connects to transcendence',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sourceId: sampleNodes[0].id,
        targetId: sampleNodes[2].id,
        type: 'supports',
        strength: 0.7,
        description: 'Ontological void supports epistemological nihilism',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sourceId: sampleNodes[2].id,
        targetId: sampleNodes[3].id,
        type: 'extends',
        strength: 0.75,
        description: 'Epistemological nihilism extends to ethics',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        sourceId: sampleNodes[3].id,
        targetId: sampleNodes[4].id,
        type: 'relates',
        strength: 0.9,
        description: 'Ethical void creates existential dread',
        createdAt: new Date()
      }
    ];

    await db.collection('connections').insertMany(sampleConnections);
    console.log(`✅ Inserted ${sampleConnections.length} sample connections`);

    console.log('✅ Database seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

seedDatabase();