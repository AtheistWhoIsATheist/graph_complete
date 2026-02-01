import { Node, Connection } from '@/types';

export function validateNode(node: Partial<Node>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!node.title || node.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (node.title && node.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (!node.category) {
    errors.push('Category is required');
  }

  const validCategories = ['ontology', 'epistemology', 'ethics', 'mysticism', 'existentialism'];
  if (node.category && !validCategories.includes(node.category)) {
    errors.push('Invalid category');
  }

  if (node.description && node.description.length > 5000) {
    errors.push('Description must be less than 5000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateConnection(connection: Partial<Connection>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!connection.sourceId) {
    errors.push('Source node is required');
  }

  if (!connection.targetId) {
    errors.push('Target node is required');
  }

  if (connection.sourceId === connection.targetId) {
    errors.push('Source and target nodes must be different');
  }

  if (!connection.type) {
    errors.push('Connection type is required');
  }

  const validTypes = ['supports', 'contradicts', 'relates', 'extends', 'questions'];
  if (connection.type && !validTypes.includes(connection.type)) {
    errors.push('Invalid connection type');
  }

  if (connection.strength !== undefined) {
    if (connection.strength < 0 || connection.strength > 1) {
      errors.push('Strength must be between 0 and 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}