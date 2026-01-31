import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Connection, Position3D } from '@/types';

interface Connection3DProps {
  connection: Connection;
  sourcePosition: Position3D;
  targetPosition: Position3D;
}

const CONNECTION_COLORS: Record<string, string> = {
  supports: '#2ECC71',
  contradicts: '#E74C3C',
  relates: '#3498DB',
  extends: '#9B59B6',
  questions: '#F39C12',
  default: '#95A5A6',
};

export function Connection3D({
  connection,
  sourcePosition,
  targetPosition,
}: Connection3DProps) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(
      sourcePosition.x,
      sourcePosition.y,
      sourcePosition.z
    );
    const end = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y,
      targetPosition.z
    );

    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
    const distance = start.distanceTo(end);
    mid.y += distance * 0.1;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(50);
  }, [sourcePosition, targetPosition]);

  const color =
    CONNECTION_COLORS[connection.type] || CONNECTION_COLORS.default;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={connection.strength * 2}
      transparent
      opacity={0.6}
    />
  );
}