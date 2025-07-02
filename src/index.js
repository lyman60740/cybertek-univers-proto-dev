// index.js
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { CarShowScene } from "./CarShowScene";
import { CadresScene } from "./CadresScene";
import { MobileCadres } from "./MobileCadres";
import { CategoryScene } from "./CategoryScene";
import { Cat2D } from "./Cat2D";
import { Suspense } from "react";
import { useInView } from "./useInView";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

const radius = 2.5; // Rayon du cercle (ajuste selon ton besoin)
const center = [0, 0, 1.5]; // Point central de la scène
const angleOffset = Math.PI / 9; // Angle supplémentaire pour ajuster la courbure

const images = [
  // Arrière légèrement tourné vers le centre
  { 
    position: [-radius * 1.6, 0, center[2] + 2.1], 
    rotation: [0, Math.PI / 2.5, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/base_de_volant.webp', 
    name: "(1) BASE DE VOLANT",
    link: "https://www.cybertek.fr/Base-de-volant-Simracing-159.aspx" 
  },
  { 
    position: [-radius * 1.3, 0, center[2] + 0.8], 
    rotation: [0, Math.PI / 3.5, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/volant1.webp', 
    name: "(2) VOLANTS",
    link: "https://www.cybertek.fr/volant-pc-160.aspx" 
  },
  // Côtés gauches
  { 
    position: [-radius * 0.9, 0, center[2] + 0.2], 
    rotation: [0, Math.PI / 4, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/pedalier1.webp', 
    name: "(3) PÉDALIERS",
    link: "https://www.cybertek.fr/pedalier-simracing-161.aspx" 
  },
  { 
    position: [-radius * 0.3, 0, center[2] - 0.5], 
    rotation: [0, 0, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/frein_a_main.webp', 
    name: "(4) FREIN À MAIN",
    link: "https://www.cybertek.fr/frein-a-main-162.aspx" 
  },
  { 
    position: [radius * 0.3, 0, center[2] - 0.5], 
    rotation: [0, 0, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/boite_de_vitesse1.webp', 
    name: "(5) LEVIER DE VITESSE",
    link: "https://www.cybertek.fr/Levier-de-Vitesse-PC-163.aspx" 
  },
  // Côtés droits
  { 
    position: [radius * 0.9, 0, center[2] + 0.2], 
    rotation: [0, -Math.PI / 4, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/accessoires.webp', 
    name: "(6) ACCESSOIRES GAMING",
    link: "https://www.cybertek.fr/Accessoires-Simracing-164.aspx" 
  },
  { 
    position: [radius * 1.3, 0, center[2] + 0.8], 
    rotation: [0, -Math.PI / 3.5, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/bundle.webp', 
    name: "(7) PACK SIMRACING",
    link: "https://www.cybertek.fr/Pack-Simracing-165.aspx" 
  },
  { 
    position: [radius * 1.6, 0, center[2] + 2.1], 
    rotation: [0, -Math.PI / 2.5, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/chassis.webp', 
    name: "(8) CHÂSSIS",
    link: "https://www.cybertek.fr/Chassis-Simracing-166.aspx" 
  }
];


const rootElement = document.getElementById("root");
const cadresElement = document.getElementById("cadres");
const categoryElement = document.getElementById("category");

// ====================
// LENIS CONTROLLER
// ====================
function LenisController() {
  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.5,             // Ajuste la vitesse du smooth scroll
      smoothWheel: true,         // Active le scroll fluide avec la molette
      smoothTouch: true,         // Active le scroll fluide sur mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wrapper: document.body,
      content: document.querySelector(".us-container"),
    });


    function raf(time) {
      // On lance le raf uniquement si window.isLoaded est true
    
        lenis.raf(time);
      
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    ScrollTrigger.refresh();

    // Lorsque le chargement est terminé (indiqué par l'événement "loaded"), on démarre Lenis
    const handleLoaded = () => {
      lenis.start();
      // Déclenche un événement 'scroll' pour notifier les écouteurs (comme ta navbar)
      window.dispatchEvent(new Event('scroll'));
    };
    window.addEventListener("loaded", handleLoaded);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("loaded", handleLoaded);
    };
  }, []);

  return null;
}


// ====================
// Rendu de l'application
// ====================

if (rootElement) {
  createRoot(rootElement).render(
    <Suspense fallback={null}>
      <>
        {/* Le composant LenisController gère la logique de scroll */}
        <LenisController />
        <Canvas dpr={[1, 1.5]} frameloop={"always"}>
          <CarShowScene />
        </Canvas> 
      </>
    </Suspense>
  );
}

mm.add("(min-width: 1000px)", () => {   
  if (cadresElement) {
    createRoot(cadresElement).render(
      <Suspense fallback={null}>
        <>
          {/* Ne pas supprimer les parties commentées ci-dessous */}
          <Canvas
            dpr={[1, 1.5]}
            camera={{ fov: 20, position: [0, 0.5, 10] }}
            frameloop={"always"}
          >
            <CadresScene images={images} />
          </Canvas>
        </>
      </Suspense>
    );
  }
});

mm.add("(max-width: 999px)", () => {   
  if (cadresElement) {
    createRoot(cadresElement).render(
      <Suspense fallback={null}>
        <>
          {/* Ne pas supprimer les parties commentées ci-dessous */}
          <Canvas
            dpr={[1, 1.5]}
            camera={{ fov: 30, position: [0, 0.5, 10] }}
            frameloop={"demand"}
          >
            <MobileCadres images={images} />
          </Canvas>
        </>
      </Suspense>
    );
  }
});

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
//         </Canvas>
//       </Suspense>
//     );
//   }
// });

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
