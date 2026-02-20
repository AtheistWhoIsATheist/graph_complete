export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export type NodeCategory =
  | 'ontology'
  | 'epistemology'
  | 'ethics'
  | 'mysticism'
  | 'existentialism';

export interface Node {
  id: string;
  title: string;
  description: string;
  category: NodeCategory;
  tags: string[];
  position: Position3D;
  createdAt: Date;
  updatedAt: Date;
}

export type ConnectionType =
  | 'supports'
  | 'contradicts'
  | 'relates'
  | 'extends'
  | 'questions';

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  strength: number;
  description?: string;
  createdAt: Date;
}

export interface Filters {
  categories: NodeCategory[];
  tags: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
}

export interface SearchResult {
  item: Node;
  score: number;
  matches: string[];
}