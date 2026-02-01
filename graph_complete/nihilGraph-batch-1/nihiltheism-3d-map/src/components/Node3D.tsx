import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Node } from '@/types';
import { useSettingsStore } from '@/store/settingsStore';

interface Node3DProps {
  node: Node;
  isSelected: boolean;
  onClick: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  ontology: '#FF6B6B',
  epistemology: '#4ECDC4',
  ethics: '#45B7D1',
  mysticism: '#9B59B6',
  existentialism: '#F39C12',
  default: '#95A5A6',
};

export function Node3D({ node, isSelected, onClick }: Node3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const settings = useSettingsStore((state) => state.settings);

  useFrame((state) => {
    if (meshRef.current && (isSelected || hovered)) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.default;
  const scale = isSelected ? 1.5 : hovered ? 1.2 : 1;

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.1}
          metalness={0.3}
          roughness={0.4}
        />
      </Sphere>

      {(settings.display.showLabels || hovered || isSelected) && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.05}
          outlineColor="black"
        >
          {node.title}
        </Text>
      )}
    </group>
  );
}