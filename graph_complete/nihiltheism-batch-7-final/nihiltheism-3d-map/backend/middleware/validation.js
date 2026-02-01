export function validateNodeData(req, res, next) {
  const { id, title, description, category, tags, position } = req.body;
  const errors = [];

  if (!id || typeof id !== 'string') {
    errors.push('Valid id is required');
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (title && title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (description && description.length > 5000) {
    errors.push('Description must be less than 5000 characters');
  }

  const validCategories = ['ontology', 'epistemology', 'ethics', 'mysticism', 'existentialism'];
  if (!category || !validCategories.includes(category)) {
    errors.push('Valid category is required');
  }

  if (tags && !Array.isArray(tags)) {
    errors.push('Tags must be an array');
  }

  if (position) {
    if (typeof position.x !== 'number' || typeof position.y !== 'number' || typeof position.z !== 'number') {
      errors.push('Position must have numeric x, y, z coordinates');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export function validateConnectionData(req, res, next) {
  const { id, sourceId, targetId, type, strength } = req.body;
  const errors = [];

  if (!id || typeof id !== 'string') {
    errors.push('Valid id is required');
  }

  if (!sourceId || typeof sourceId !== 'string') {
    errors.push('Valid sourceId is required');
  }

  if (!targetId || typeof targetId !== 'string') {
    errors.push('Valid targetId is required');
  }

  if (sourceId === targetId) {
    errors.push('Source and target nodes must be different');
  }

  const validTypes = ['supports', 'contradicts', 'relates', 'extends', 'questions'];
  if (!type || !validTypes.includes(type)) {
    errors.push('Valid type is required');
  }

  if (strength !== undefined) {
    if (typeof strength !== 'number' || strength < 0 || strength > 1) {
      errors.push('Strength must be a number between 0 and 1');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}