import Dexie, { Table } from 'dexie';
import { Node, Connection } from '@/types';

class NihiltheismDatabase extends Dexie {
  nodes!: Table<Node, string>;
  connections!: Table<Connection, string>;

  constructor() {
    super('nihiltheism-3d-map');

    this.version(1).stores({
      nodes: 'id, title, category, *tags, createdAt, updatedAt',
      connections: 'id, sourceId, targetId, type, createdAt',
    });
  }
}

export const db = new NihiltheismDatabase();

export async function initializeDatabase() {
  try {
    await db.open();
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function clearDatabase() {
  await db.nodes.clear();
  await db.connections.clear();
}