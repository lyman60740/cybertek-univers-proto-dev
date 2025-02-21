import React, { useRef } from "react";
import { useThree,useFrame  } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from '@react-three/drei';
import { MobileFrames } from "./MobileFrames"; // Composant affichant vos cadres
import { useEffect } from "react";
import { Ground } from "./Ground";

// Paramètres pour le cercle
const radius = 1.3; // Rayon du cercle
const center = [0, 0, 0.5]; // Centre du cercle

// Données de base pour les images
const imagesData = [
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(1) CHASSIS", link: "https://example.com/chassis" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(2) PC GAMER", link: "https://example.com/pc-gamer" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(3) PEDALIER", link: "https://example.com/pedalier" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(4) ECRANS", link: "https://example.com/ecrans" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(5) VOLANTS", link: "https://example.com/volants" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(6) BASE DE VOLANT", link: "https://example.com/base-volant" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(7) ACCESSOIRES GAMING", link: "https://example.com/accessoires" },
  { url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(8) BUNDLE", link: "https://example.com/bundle" }
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
  const { camera } = useThree();
  const lightRef = useRef();
  const { scene } = useThree()

  useEffect(() => {
    // Positionner la caméra si besoin
    camera.position.set(0, 0.5, 4.5);
    camera.fov = 45;
    camera.updateProjectionMatrix();

    if (lightRef.current) {
        camera.add(lightRef.current);
        scene.add(lightRef.current.target);  // Assurez-vous que la target est dans la scène
        // Positionner la lumière dans l'espace local de la caméra
        lightRef.current.position.set(0, 0, 0);
      }
  }, [camera, scene]);
  useFrame(() => {
    if (lightRef.current) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      // Mettre la cible de la lumière à 1 unité devant la caméra
      lightRef.current.target.position.copy(camera.position).add(direction);
      lightRef.current.target.updateMatrixWorld();

      // Créer des vecteurs temporaires pour obtenir les positions mondiales
      const lightWorldPos = new THREE.Vector3();
      lightRef.current.getWorldPosition(lightWorldPos);
      const targetWorldPos = new THREE.Vector3();
      lightRef.current.target.getWorldPosition(targetWorldPos);

      console.log("Light Position:", lightWorldPos);
      console.log("Light Target Position:", targetWorldPos);
      console.log("Camera Direction:", direction);
    }
  });

  return (
    <>
    <ambientLight intensity={1} />
    <group>
    {/* <directionalLight
        position={[0,2,0]}
        intensity={10.5}
        color={'white'}
      /> */}
      {/* Zone de capture */}
      <OrbitControls 
        target={[0, 0.7, 0.5]} 
        minPolarAngle={Math.PI / 2.1} 
        maxPolarAngle={Math.PI / 2.1} 
        enablePan={false} 
        enableZoom={false}
        rotateSpeed={0.2}
      />
      {/* Groupe rotatif */}
      <group ref={rotatingGroupRef} position={center}>
        <MobileFrames images={images} />
      </group>
    </group>
     {/* <Ground 
            position={[0, 0, 5]}
            planeSize={[30, 50]}
            normalScale={[0.8, 0.8]}
            roughnessValue={0.7}
            mixBlur={15}
            mixStrength={15}
            resolution={1024}
            mirror={1}
            depthScale={0.01}
            scrollSpeed={0}
            color={[0.01, 0.01, 0.01]}
          /> */}
    </>
  );
};
