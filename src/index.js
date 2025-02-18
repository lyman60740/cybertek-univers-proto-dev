// index.js
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { CarShowScene } from "./CarShowScene";
import { CadresScene } from "./CadresScene";
import { CategoryScene } from "./CategoryScene";
import React, {Suspense } from "react";


const radius = 2.5; // Rayon du cercle (ajuste selon ton besoin)
const center = [0, 0, 1.5]; // Point central de la scène
const angleOffset = Math.PI / 9; // Angle supplémentaire pour ajuster la courbure

const images = [

  // Arrière légèrement tourné vers le centre
  { position: [-radius * 0.3, 0, center[2] - 0.5], rotation: [0, 0, 0], url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(1) CHASSIS" },
  { position: [radius * 0.3, 0, center[2] - 0.5], rotation: [0, 0, 0], url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(2) PC GAMER" },

  // Côtés gauches
  { position: [-radius * 0.9, 0, center[2] + 0.2], rotation: [0, Math.PI / 4, 0], url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(3) PEDALIER" },
  { position: [-radius * 1.3, 0, center[2] + 0.8], rotation: [0, Math.PI / 3.5, 0], url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(4) ECRANS" },
  { position: [-radius * 1.6, 0, center[2] + 2.1], rotation: [0, Math.PI / 2.5, 0], url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(5) VOLANTS" },

  // Côtés droits
  { position: [radius * 0.9, 0, center[2] + 0.2], rotation: [0, -Math.PI / 4, 0], url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(6) BASE DE VOLANT" },
  { position: [radius * 1.3, 0, center[2] + 0.8], rotation: [0, -Math.PI / 3.5, 0], url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(7) ACCESSOIRES GAMING" },
  { position: [radius * 1.6, 0, center[2] + 2.1], rotation: [0, -Math.PI / 2.5, 0], url: 'https://cybertek-r3f-simracing-category.vercel.app/images/common-ph.png', name: "(8) BUNDLE" }
];



const rootElement = document.getElementById("root");
const cadresElement = document.getElementById("cadres");
const categoryElement = document.getElementById("category");

// Vérification avant de monter l'application
if (rootElement) {
  createRoot(rootElement).render(
    <Suspense fallback={null}>
      <Canvas>
        <CarShowScene />
      </Canvas>
    </Suspense>
  );
}

if (cadresElement) {
  createRoot(cadresElement).render(
    <Suspense fallback={null}>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 50, position: [0, 0.5, 7.8] }}>
        <CadresScene images={images} />
      </Canvas>
    </Suspense>
  );
}


if (categoryElement) {
  createRoot(categoryElement).render(
    <Suspense fallback={null}>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 30, position: [0, 0, 10] }}>
      <CategoryScene />
      </Canvas>
    </Suspense>
  );
}
