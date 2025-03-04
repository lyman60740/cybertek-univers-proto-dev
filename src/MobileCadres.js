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
  { url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/base_de_volant.jpg', name: "(1) BASE DE VOLANT", link: "https://www.cybertek.fr/Base-de-volant-Simracing-159.aspx" },
  { url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/volant1.jpg', name: "(2) VOLANTS", link: "https://www.cybertek.fr/volant-pc-160.aspx" },
  { url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/pedalier1.jpg', name: "(3) PÉDALIERS", link: "https://www.cybertek.fr/pedalier-simracing-161.aspx" },
  { url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/frein_a_main.jpg', name: "(4) FREIN À MAIN", link: "https://www.cybertek.fr/frein-a-main-162.aspx" },
  { url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/boite_de_vitesse1.jpg', name: "(5) LEVIER DE VITESSE", link: "https://www.cybertek.fr/Levier-de-Vitesse-PC-163.aspx" },
  { url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/accessoires.jpg', name: "(6) ACCESSOIRES GAMING", link: "https://www.cybertek.fr/Accessoires-Simracing-164.aspx" },
  { url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/bundle.jpg', name: "(7) PACK SIMRACING", link: "https://www.cybertek.fr/Pack-Simracing-165.aspx" },
  { url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/chassis.jpg', name: "(8) CHÂSSIS", link: "https://www.cybertek.fr/Chassis-Simracing-166.aspx" }
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
    camera.position.set(0, 0.5, 5);
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
    <ambientLight intensity={1.5} />
      <fog attach="fog" args={['black', 0, 12]} />
    <group>
    <directionalLight
        position={[0,2,0]}
        intensity={1.5}
        color={'white'}
      />
      {/* Zone de capture */}
      <OrbitControls 
        target={[0, 0.7, 0.5]} 
        minPolarAngle={Math.PI / 2.1} 
        maxPolarAngle={Math.PI / 2.1} 
        enablePan={false} 
        enableZoom={false}
        rotateSpeed={0.3}
      />
      {/* Groupe rotatif */}
      <group ref={rotatingGroupRef} position={center}>
        <MobileFrames images={images} />
      </group>
    </group>
     <Ground 
            position={[0, -0.3, 0]}
            planeSize={[10, 10]}
            normalScale={[0.8, 0.8]}
            roughnessValue={0.7}
            mixBlur={15}
            mixStrength={15}
            resolution={1024}
            mirror={1}
            depthScale={0.01}
            scrollSpeed={0}
            color={[0.01, 0.01, 0.01]}
          />
    </>
  );
};
