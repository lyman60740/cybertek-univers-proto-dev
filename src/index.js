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
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/base_de_volant.jpg', 
    name: "(1) BASE DE VOLANT",
    link: "#" 
  },
  { 
    position: [-radius * 1.3, 0, center[2] + 0.8], 
    rotation: [0, Math.PI / 3.5, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/volant1.jpg', 
    name: "(2) VOLANTS",
    link: "#" 
  },
  // Côtés gauches
  { 
    position: [-radius * 0.9, 0, center[2] + 0.2], 
    rotation: [0, Math.PI / 4, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/pedalier1.jpg', 
    name: "(3) PÉDALIERS",
    link: "#" 
  },
  { 
    position: [-radius * 0.3, 0, center[2] - 0.5], 
    rotation: [0, 0, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/frein_a_main.jpg', 
    name: "(4) FREIN À MAIN",
    link: "#" 
  },
  { 
    position: [radius * 0.3, 0, center[2] - 0.5], 
    rotation: [0, 0, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/boite_de_vitesse1.jpg', 
    name: "(5) LEVIER DE VITESSE",
    link: "#" 
  },
  // Côtés droits
  { 
    position: [radius * 0.9, 0, center[2] + 0.2], 
    rotation: [0, -Math.PI / 4, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/accessoires.jpg', 
    name: "(6) ACCESSOIRES GAMING",
    link: "#" 
  },
  { 
    position: [radius * 1.3, 0, center[2] + 0.8], 
    rotation: [0, -Math.PI / 3.5, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/bundle.jpg', 
    name: "(7) PACK SIMRACING",
    link: "#" 
  },
  { 
    position: [radius * 1.6, 0, center[2] + 2.1], 
    rotation: [0, -Math.PI / 2.5, 0], 
    url: 'https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/images/chassis.jpg', 
    name: "(8) CHÂSSIS",
    link: "#" 
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
    // Toujours démarrer en haut de la page
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.5,             // Ajuste la vitesse du smooth scroll
      smoothWheel: true,         // Active le scroll fluide avec la molette
      smoothTouch: true,         // Active le scroll fluide sur mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Courbe d'accélération
    });

    // Désactive le scroll dès le départ
    lenis.stop();

    function raf(time) {
      // On lance le raf uniquement si window.isLoaded est true
      if (window.isLoaded) {
        lenis.raf(time);
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronisation avec ScrollTrigger (seulement la synchronisation, pas les animations)
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length
          ? lenis.scrollTo(value, { immediate: true })
          : lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    ScrollTrigger.addEventListener("refresh", () =>
      lenis.scrollTo(0, { immediate: true })
    );
    ScrollTrigger.refresh();

    // Lorsque le chargement est terminé (indiqué par l'événement "loaded"), on démarre Lenis
    const handleLoaded = () => {
      lenis.start();
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
        {/* <Canvas dpr={[1, 1.5]} frameloop={"always"}>
          <CarShowScene />
        </Canvas> */}
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
