import { Position3D } from '@/types';

export function calculateDistance(pos1: Position3D, pos2: Position3D): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dz = pos2.z - pos1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function normalizeVector(v: Position3D): Position3D {
  const magnitude = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (magnitude === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: v.x / magnitude,
    y: v.y / magnitude,
    z: v.z / magnitude,
  };
}

export function addVectors(v1: Position3D, v2: Position3D): Position3D {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
    z: v1.z + v2.z,
  };
}

export function scaleVector(v: Position3D, scalar: number): Position3D {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
    z: v.z * scalar,
  };
}

export function calculateRepulsionForce(
  pos1: Position3D,
  pos2: Position3D,
  repulsionStrength: number = 1000
): Position3D {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  const distanceSquared = dx * dx + dy * dy + dz * dz;

  if (distanceSquared < 0.01) {
    return { x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 };
  }

  const force = repulsionStrength / distanceSquared;
  const distance = Math.sqrt(distanceSquared);

  return {
    x: (dx / distance) * force,
    y: (dy / distance) * force,
    z: (dz / distance) * force,
  };
}

export function calculateAttractionForce(
  pos1: Position3D,
  pos2: Position3D,
  attractionStrength: number = 0.1
): Position3D {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dz = pos2.z - pos1.z;

  return {
    x: dx * attractionStrength,
    y: dy * attractionStrength,
    z: dz * attractionStrength,
  };
}