import React, { Suspense, useRef, useEffect, useState   } from "react";
import {  useThree, useFrame   } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./style.css";



const mm = gsap.matchMedia();

function useExternalRenderControl() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const checkRender = () => {
      if (window.isLoaded === true) {
        setCanRender(true);
      }
    };
    
    // Vérifie immédiatement et à intervalles
    checkRender();
    const interval = setInterval(checkRender, 100);
    
    return () => clearInterval(interval);
  }, []);

  return canRender;
}

export const CameraRigCarShow =({ groundRef, spotLightRef1, spotLightRef2, spotLightRef3, targetRef }) => {
  const { camera } = useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 10, 5)); 
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0)); 
 
  const logoElements = document.querySelectorAll(".logo-cyb, .logo-alp, .sep")
  const blocTxtElements = document.querySelectorAll(".surTitre span, h2 span")
  const otherTxtElements = document.querySelectorAll(".bloc-txt__p p, .bloc-txt a ")
  const canRender = useExternalRenderControl();
  const [isLoaded, setIsLoaded] = useState(false);
  const lenisRef = useRef(null);
 
  useEffect(() => {
    // On importe le plugin au moment du montage
    const { ScrollTrigger } = require("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    // ✅ Rends GSAP globalement accessible
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
  }, []);


  useEffect(() => {
 
 // ✅ Position initiale (évite la confusion)
    camera.position.set(0, 10, 5);
    
    // 🛠️ Appliquer un quaternion propre dès le début
    const matrix = new THREE.Matrix4().lookAt(camera.position, lookAtTarget.current, new THREE.Vector3(0, 1, 0));
    camera.quaternion.setFromRotationMatrix(matrix);
  }, []);

  useEffect(() => {

    gsap.set(blocTxtElements, {
      x: 30,
      autoAlpha: 0
    });

    const textAndOtherTl = gsap.timeline({ paused: true });

textAndOtherTl
  .to(blocTxtElements, {
    x: 0,
    autoAlpha: 1,
    stagger: 0.3,
    duration: 0.4,
    ease: "cubic-bezier(.21,.65,.67,1)",
  })
  .to(otherTxtElements, {
    autoAlpha: 1,
    stagger: 0.3,
    duration: 0.4,
    ease: "cubic-bezier(.21,.65,.67,1)",
  }, "<80%"); // "<" signifie que cette animation démarre en même temps que la précédente
  

    // 📌 Timeline GSAP pour déplacer la caméra en douceur
    if(document.querySelector(".carshow-container")) {

      

      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".carshow-container",
          start: "top top",
          end: "+=2000px", 
          scrub: 2,
          pin: true,
          pinSpacing: true,
          markers: true,
          onUpdate: (self) => {
            mm.add("(min-width: 1000px)", ()=> { 
              if (self.progress > 0.75) {
                textAndOtherTl.timeScale(1).play();  // 🔥 Lecture normale
              } else {
                textAndOtherTl.timeScale(1).reverse();  // ⏩ Retour 2x plus rapide
              }
             })
             mm.add("(max-width: 999px)", ()=> { 
              if (self.progress > 0.5) {
                textAndOtherTl.timeScale(1).play();  // 🔥 Lecture normale
              } else {
                textAndOtherTl.timeScale(1).reverse();  // ⏩ Retour 2x plus rapide
              }
             })
          }      

        }
      });

      mm.add("(min-width: 1000px)", ()=> {
      if (spotLightRef1.current && spotLightRef2.current) {
        tl.to(
          [spotLightRef2.current],
          {
            intensity: 1.5, // Les lumières augmentent en intensité
            ease: "linear",
            duration: 1
          }
        );
        tl.to(
          [spotLightRef1.current],
          {
            intensity: 2.5, // Les lumières augmentent en intensité
            ease: "linear",
            duration: 1
          },"<"
        );
      }
    })
      if (logoElements) {
        tl.to(logoElements, {
          opacity: 0,
          y: -20,
          stagger: 0.1,
          duration: 0.5, 
          ease: "cubic-bezier(.21,.65,.67,1)",
        },"<80%"); // 🔄 Démarre en même temps que l’animation de la caméra
      }
    
      
  
      mm.add("(max-width: 999px)", ()=> {  
        if (spotLightRef1.current && spotLightRef2.current ) {
          tl.to(
            [spotLightRef2.current],
            {
              intensity: .5, // Les lumières augmentent en intensité
              ease: "linear",
              duration: 1
            }, "<"
          );
          tl.to(
            [spotLightRef1.current],
            {
              intensity: 1.5, // Les lumières augmentent en intensité
              ease: "linear",
              duration: 1
            },"<"
          );
        } 
    
        tl.to(cameraTarget.current, {
          x: 0,
          y: 0.5,
          z: 5, 
          duration: 1,
          ease: "linear"
        },"<");

        if (groundRef.current) {
          console.log('groundref')
          tl.to(groundRef.current.material, {
            opacity: 0, // ✅ Disparition progressive
            ease: "linear",
            duration: 1,
            onUpdate: () => {
              groundRef.current.material.needsUpdate = true; // ✅ Forcer le rendu du changement d’opacité
            },
          }, "<"); // 🔄 Démarre en même temps que l’animation de la caméra
        }
      })
  
      mm.add("(min-width: 1000px)", ()=> {
        tl.to(cameraTarget.current, {
          x: -5,
          y: 0.5,
          z: -2.5, 
          duration: 3,
          ease: "linear"
        },"<");
      })
  
      
  
      mm.add("(min-width: 1000px)", ()=> {
      if (groundRef.current) {
        tl.to(groundRef.current.material, {
          opacity: 0, // ✅ Disparition progressive
          ease: "linear",
          duration: 1,
          onUpdate: () => {
            groundRef.current.material.needsUpdate = true; // ✅ Forcer le rendu du changement d’opacité
          },
        }, "<"); // 🔄 Démarre en même temps que l’animation de la caméra
      }
    })
      

        if (spotLightRef1.current && spotLightRef2.current) {
          tl.to(
            [spotLightRef2.current, spotLightRef1.current],
            {
              intensity: 0, // Les lumières augmentent en intensité
              ease: "linear",
              duration: 0.5,
            },"<50%"
          );
        }
       
        if (spotLightRef3.current) {
          tl.to([spotLightRef3.current], {
            intensity: .5, // Les lumières augmentent en intensité
            duration: 1,
              ease: "linear",
          },"<");
        }
  
          mm.add("(max-width: 999px)", ()=> {   
            tl.to(spotLightRef3.current, {
              intensity: 0.7,
              duration: 1
            },"<");
              tl.to(spotLightRef3.current.position, {
                x: 0,
                y: 10,
                z: 15,
                duration: 1
              },"<");
          
          })
        
        // tl.to({}, {},"<50%");
    }
    

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [targetRef]);

  // 📌 Applique progressivement la position et la rotation
  useFrame(() => {
    camera.position.lerp(cameraTarget.current, 0.1);

    // ✅ LookAt interpolé pour éviter les sauts
    const matrix = new THREE.Matrix4().lookAt(camera.position, lookAtTarget.current, new THREE.Vector3(0, 1, 0));
    camera.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(matrix), 0.1);
    
    // console.log(`📷 Camera Position: x=${camera.position.x.toFixed(3)}, y=${camera.position.y.toFixed(3)}, z=${camera.position.z.toFixed(3)}`);
    // console.log(`🔄 Camera Rotation: x=${camera.rotation.x.toFixed(3)}, y=${camera.rotation.y.toFixed(3)}, z=${camera.rotation.z.toFixed(3)}`);
  });

  useEffect(() => {

 // 📌 Toujours démarrer en haut de la page :
 window.scrollTo(0, 0);
 if (lenisRef.current) {
   lenisRef.current.scrollTo(0, { immediate: true });
 }

    // ✅ Initialisation de Lenis (smooth scroll)
    const lenis = new Lenis({
      duration: 1.5, // ⏳ Ajuste la vitesse du smooth scroll
      smoothWheel: true, // Active le scroll fluide avec la molette
      smoothTouch: true, // Active le scroll fluide sur mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Courbe d'accélération
    });
  
    lenisRef.current = lenis;

    function raf(time) {
      if (window.isLoaded) {
        lenis.raf(time); // ✅ Scroll fluide uniquement quand isLoaded = true
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.stop();

    
    // ✅ Synchronisation avec ScrollTrigger
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });
  
    // 📌 Rafraîchir ScrollTrigger après setup
    ScrollTrigger.addEventListener("refresh", () => lenis.scrollTo(0, { immediate: true }));
    ScrollTrigger.refresh();
  
    // 🛠️ Supprimer Lenis et les ScrollTriggers à la destruction
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const handleLoaded = () => {
      setIsLoaded(true); // ✅ Met à jour l’état local
      lenisRef.current?.start(); // ✅ Redémarre le scroll avec Lenis
    };
  
    window.addEventListener("loaded", handleLoaded);
    return () => window.removeEventListener("loaded", handleLoaded);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      lenisRef.current?.stop(); // 🚫 Bloque le scroll
    } else {
      lenisRef.current?.start(); // ✅ Réactive le scroll
    }
  }, [isLoaded]);

  return null;
}


