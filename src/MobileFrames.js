import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export const MobileFrames = ({ images }) => {
  return (
    <group>
      {images.map((item, index) => (
        <MobileFrame key={index} {...item} />
      ))}
    </group>
  );
};

function MobileFrame({ url, position, rotation, name }) {
  const ref = useRef();
  const GOLDENRATIO = 1.61803398875;

  // 1. Charger vos textures (base color, normal, roughness)
  const [colorMap, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    "/textures/metal_0076_color_1k.jpg",
    "/textures/metal_0076_normal_opengl_1k.png",
    "/textures/metal_0076_roughness_1k.jpg"
  ]);

  // (Optionnel) Anisotropie pour améliorer la netteté des textures quand on les regarde en biais
  colorMap.anisotropy = 8;
  normalMap.anisotropy = 8;
  roughnessMap.anisotropy = 8;

  // 2. Créer le matériau "carbone"
  //    - meshStandardMaterial ou meshPhysicalMaterial pour tirer parti du PBR
  //    - side = DoubleSide si vous voulez voir le dos
  const carboneMaterial = new THREE.MeshStandardMaterial({
    map: colorMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    metalness: 0.9,  // Ajustez pour un rendu plus ou moins métallique
    roughness: 0.8,  // Peut être affiné si vous utilisez la roughnessMap
    side: THREE.DoubleSide
  });

  useFrame((state, dt) => {
    // Laissez vide ou ajoutez des animations si nécessaire
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh scale={[1, GOLDENRATIO, 0.05]} position={[0, 0.9, 0.2]}>
        <boxGeometry />
        {/* 3. Appliquer le matériau carbone sur la face "cadre noir" */}
        <primitive object={carboneMaterial} attach="material" />
        
        <mesh
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={true} />
        </mesh>
        <mesh position={[0, 0, 0.7]}>
          <planeGeometry args={[0.8, 0.87]} />
          <meshBasicMaterial map={useLoader(THREE.TextureLoader, url)} />
        </mesh>
      </mesh>
      <Text
        maxWidth={0.5}
        anchorX="left"
        anchorY="top"
        position={[0.55, GOLDENRATIO, 0.2]}
        fontSize={0.05}
        color="white"
        toneMapped={false}
      >
        {name}
      </Text>
    </group>
  );
}
