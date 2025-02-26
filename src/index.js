// index.js
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { CarShowScene } from "./CarShowScene";
import { CadresScene } from "./CadresScene";
import { MobileCadres } from "./MobileCadres";
import { CategoryScene } from "./CategoryScene";
import { Cat2D } from "./Cat2D";
import React, {Suspense, useEffect, useRef } from "react";
import { useInView } from "./useInView";
import gsap from "gsap";

const mm = gsap.matchMedia();

const radius = 2.5; // Rayon du cercle (ajuste selon ton besoin)
const center = [0, 0, 1.5]; // Point central de la scène
const angleOffset = Math.PI / 9; // Angle supplémentaire pour ajuster la courbure

const images = [

  // Arrière légèrement tourné vers le centre
  { position:[-radius * 1.6, 0, center[2] + 2.1], rotation: [0, Math.PI / 2.5, 0] , url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/bundle.jpg', name: "(1) PACK SIMRACING" },
  { position: [-radius * 1.3, 0, center[2] + 0.8], rotation: [0, Math.PI / 3.5, 0], url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/volant1.jpg', name: "(2) VOLANTS" },

  // Côtés gauches
  { position: [-radius * 0.9, 0, center[2] + 0.2], rotation: [0, Math.PI / 4, 0], url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/base_de_volant.jpg', name: "(3) BASES DE VOLANT" },
  { position: [-radius * 0.3, 0, center[2] - 0.5], rotation: [0, 0, 0], url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/chassis.jpg', name: "(4) CHÂSSIS" },
  { position:[radius * 0.3, 0, center[2] - 0.5], rotation: [0, 0, 0] , url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/pedalier1.jpg', name: "(5) PÉDALIERS" },

  // Côtés droits
  { position: [radius * 0.9, 0, center[2] + 0.2], rotation: [0, -Math.PI / 4, 0], url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/boite_de_vitesse.jpg', name: "(6) ACCÉSSOIRES GAMING" },
  { position: [radius * 1.3, 0, center[2] + 0.8], rotation: [0, -Math.PI / 3.5, 0], url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/pc_gamer.jpg', name: "(7) ÉCRANS" },
  { position: [radius * 1.6, 0, center[2] + 2.1], rotation: [0, -Math.PI / 2.5, 0], url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/pc_gamer.jpg', name: "(8) PC GAMER" }
];


const rootElement = document.getElementById("root");
const cadresElement = document.getElementById("cadres");
const categoryElement = document.getElementById("category");

// const LazyCanvas = React.memo(({ sceneName, children, camera }) => {
//   const [ref, isVisible] = useInView();
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (isVisible) {
//       console.log(`Scene active: ${sceneName}`);
//     }
//   }, [isVisible, sceneName]);

//   return (
//     <div ref={ref} className="canvas-wrapper">
//       <Canvas
//         ref={canvasRef}
//         key={sceneName} // 🔥 Force React à ne pas recréer inutilement le Canvas
//         dpr={[1, 1.5]}
//         gl={{ powerPreference: "low-power" }}
//         shadows={false}
//         frameloop={isVisible ? "always" : "demand"}
//         camera={camera}
//       >
//         {children}
//       </Canvas>
//     </div>
//   );
// });


// Vérification avant de monter l'application
if (rootElement) {
  createRoot(rootElement).render(
    <Suspense fallback={null}>
       <Canvas
        dpr={[1, 1.5]}
        frameloop={"always"}
      >
        <CarShowScene />
        </Canvas>
    </Suspense>
  );
}


mm.add("(min-width: 1000px)", ()=> {   
  if (cadresElement) {
    createRoot(cadresElement).render(
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ fov: 20, position: [0, 0.5, 10] }}
          frameloop={"always"}
        >
        <CadresScene images={images} />
        </Canvas>
      </Suspense>
    );
  }
})

mm.add("(max-width: 999px)", ()=> {   
  if (cadresElement) {
    createRoot(cadresElement).render(
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ fov: 30, position: [0, 0.5, 10] }}
          frameloop={"demand"}
        >
        <MobileCadres images={images} />
        </Canvas>
      </Suspense>
    );
  }
})


// mm.add("(min-width: 800px)", ()=> {   
//   if (categoryElement) {
//     createRoot(categoryElement).render(
//       <Suspense fallback={null}>
        
//         <Canvas
//           dpr={[1, 1.5]}
//           camera={{ fov: 45, position: [0, 0.5, 8] }}
//           frameloop={"always"}
//         >
//           <CategoryScene />
//           </Canvas>
//       </Suspense>
//     );
//   }
// })

// mm.add("(min-width: 800px)", ()=> {   
//   if (categoryElement) {
//     createRoot(categoryElement).render(
//       <Suspense fallback={null}>
//         <Canvas
//           dpr={[1, 1.5]}
//           camera={{ fov: 45, position: [0, 0, 6] }}
//           frameloop={"always"}
//         >
//           <Cat2D images={images} />
//         </Canvas>
//       </Suspense>
//     );
//   }
// });

