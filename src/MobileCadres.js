import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from '@react-three/drei';
import { MobileFrames } from "./MobileFrames"; // Composant affichant vos cadres

// Paramètres pour le cercle
const radius = 1.3; // Rayon du cercle
const center = [0, 0, 0.5]; // Centre du cercle

// Données de base pour les images
const imagesData = [
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(1) CHASSIS" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(2) PC GAMER" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(3) PEDALIER" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(4) ECRANS" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(5) VOLANTS" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(6) BASE DE VOLANT" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(7) ACCESSOIRES GAMING" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(8) BUNDLE" }
];

const images = imagesData.map((item, i, arr) => {
  const angle = (i / arr.length) * Math.PI * 2;
  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);
  return {
    ...item,
    position: [x, 0, z],
    rotation: [0, angle, 0]
  };
});

export const MobileCadres = () => {
  const rotatingGroupRef = useRef();

  return (
    <>
    <ambientLight intensity={0.1} />
    <directionalLight
     
      position={[0, 2, 0]}
      intensity={2}

    />
    <group>
      {/* Zone de capture */}
      <OrbitControls 
        target={[0, 0, 0.5]} 
        minPolarAngle={Math.PI / 2.4} 
        maxPolarAngle={Math.PI / 2.4} 
        enablePan={false} 
        enableZoom={false}
      />
      {/* Groupe rotatif */}
      <group ref={rotatingGroupRef} position={center}>
        <MobileFrames images={images} />
      </group>
    </group>
    </>
  );
};
