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
import { use3DReady } from "./use3DReady";
import { Stats } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
var isMobile;
mm.add('(min-width: 1000px)', () => {
      isMobile = false
    })
    mm.add('(max-width: 999px)', () => {
      isMobile = true;
    })


const rootElement = document.getElementById("root");

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
    // lenis.stop();

    function raf(time) {
      // On lance le raf uniquement si window.isLoaded est true
    
        lenis.raf(time);
      
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

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
      lenis.scrollTo(0, { immediate: true });
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

function App() {
  const is3DReady = use3DReady();
console.log("is3DReady ?", is3DReady);
  if (!is3DReady) return null; 

  return (
    <>
      <LenisController />
      <Canvas dpr={window.devicePixelRatio > 1.1 && !isMobile ? [1, 2] : 1} frameloop="always">
        <CarShowScene />
        <Stats />
      </Canvas>
    </>
  );
}

if (rootElement) {
  createRoot(rootElement).render(
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}


