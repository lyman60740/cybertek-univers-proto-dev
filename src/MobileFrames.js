import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
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

  // Créer un matériau "gris" avec un rendu PBR léger
  const carboneMaterial = new THREE.MeshStandardMaterial({
    color: "gray",
    metalness : .2,
    roughness:0.7,
    side: THREE.DoubleSide
  });

  useFrame((state, dt) => {
    // Laissez vide ou ajoutez des animations si nécessaire
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh scale={[1, GOLDENRATIO, 0.05]} position={[0, 0.9, 0.2]}>
        <boxGeometry />
        {/* Appliquer le matériau gris */}
        <meshStandardMaterial
  color="#292929"
  metalness={0.2}
  roughness={0.7}
  side={THREE.DoubleSide}
/>

        <mesh scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshStandardMaterial/>
        </mesh>
        <mesh position={[0, 0, 0.7]}>
          <planeGeometry args={[0.8, 0.87]} />
          {/* Garder l'image si nécessaire, sinon remplacez par un matériau uni */}
          <meshStandardMaterial map={new THREE.TextureLoader().load(url)} />
        </mesh>
      </mesh>
      <Text
        maxWidth={0.5}
        anchorX="left"
        anchorY="top"
        position={[-0.2, 0, 0.2]}
        fontSize={0.07}
        color="white"
        toneMapped={false}
      >
        {name}
      </Text>
    </group>
  );
}
