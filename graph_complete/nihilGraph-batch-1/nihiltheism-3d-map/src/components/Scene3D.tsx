import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Node3D } from './Node3D';
import { Connection3D } from './Connection3D';
import { useGraphStore } from '@/store/graphStore';
import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';

function SceneContent() {
  const nodes = useGraphStore((state) => state.nodes);
  const connections = useGraphStore((state) => state.connections);
  const visibleNodes = useGraphStore((state) => state.getVisibleNodes());
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);
  const cameraTarget = useUIStore((state) => state.cameraTarget);
  const settings = useSettingsStore((state) => state.settings);

  const { camera } = useThree();

  useEffect(() => {
    if (cameraTarget && camera) {
      camera.position.lerp(
        new THREE.Vector3(
          cameraTarget.x + 10,
          cameraTarget.y + 10,
          cameraTarget.z + 10
        ),
        0.1
      );
    }
  }, [cameraTarget, camera]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const visibleConnections = connections.filter((conn) => {
    const sourceVisible = visibleNodes.some((n) => n.id === conn.sourceId);
    const targetVisible = visibleNodes.some((n) => n.id === conn.targetId);
    return sourceVisible && targetVisible;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {visibleConnections.map((connection) => {
        const sourceNode = nodes.find((n) => n.id === connection.sourceId);
        const targetNode = nodes.find((n) => n.id === connection.targetId);
        if (!sourceNode || !targetNode) return null;

        return (
          <Connection3D
            key={connection.id}
            connection={connection}
            sourcePosition={sourceNode.position}
            targetPosition={targetNode.position}
          />
        );
      })}

      {visibleNodes.map((node) => (
        <Node3D
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          onClick={() => handleNodeClick(node.id)}
        />
      ))}

      <gridHelper args={[100, 100]} />
      <axesHelper args={[5]} />
    </>
  );
}

export function Scene3D() {
  const settings = useSettingsStore((state) => state.settings);

  return (
    <div className="scene-container">
      <Canvas
        shadows
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <PerspectiveCamera makeDefault position={[20, 20, 20]} fov={60} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
          maxPolarAngle={Math.PI / 2}
        />
        <SceneContent />
      </Canvas>
    </div>
  );
}