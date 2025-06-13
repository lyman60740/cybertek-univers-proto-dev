import React, { Suspense, useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

export const CameraRigCarShow = ({ groundRef, spotLightRef1, spotLightRef2, spotLightRef3, carRef }) => {
  const { camera } = useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 10, 5));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  const logoElements = document.querySelectorAll(".logo-cyb, .logo-alp, .sep");
  const blocTxtElements = document.querySelectorAll(".surTitre span, h2 span");
  const otherTxtElements = document.querySelectorAll(".bloc-txt__p p, .bloc-txt a");
  const canRender = useExternalRenderControl();
  const [isMobile, setIsMobile] = useState(false);

  const orbitRadius = 10;
const orbitHeight = 1;
const angleRef = useRef({ value: 0 });

  useEffect(() => {
    // On importe le plugin au moment du montage
    const { ScrollTrigger } = require("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    // ✅ Rends GSAP globalement accessible
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;

    mm.add("(min-width: 1000px)", () => {
      setIsMobile(false);
    });

    mm.add("(max-width: 999px)", () => {
      setIsMobile(true);
    });
  }, []);

  useEffect(() => {
 if (!carRef.current) return;

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
        ease: "cubic-bezier(.21,.65,.67,1)"
      })
      .to(otherTxtElements, {
        autoAlpha: 1,
        stagger: 0.3,
        duration: 0.4,
        ease: "cubic-bezier(.21,.65,.67,1)"
      }, "<80%"); // "<" signifie que cette animation démarre en même temps que la précédente

    // 📌 Timeline GSAP pour déplacer la caméra en douceur
    if (document.querySelector(".carshow-container")) {
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".carshow-container",
          start: isMobile ? "top-=70px top" : "top top",
          end: "+=2000px",
          scrub: isMobile ? 1 : 2,
          pin: true,
          pinSpacing: true,
          markers: false,
          onUpdate: (self) => {
            mm.add("(min-width: 1000px)", () => {
              if (self.progress > 0.75) {
                textAndOtherTl.timeScale(1).play(); // 🔥 Lecture normale
              } else {
                textAndOtherTl.timeScale(1).reverse(); // ⏩ Retour 2x plus rapide
              }
            });
            mm.add("(max-width: 999px)", () => {
              if (self.progress > 0.5) {
                textAndOtherTl.timeScale(1).play(); // 🔥 Lecture normale
              } else {
                textAndOtherTl.timeScale(1).reverse(); // ⏩ Retour 2x plus rapide
              }
            });
          }
        }
      });

      mm.add("(min-width: 1000px)", () => {
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
            },
            "<"
          );
        }
      });

      mm.add("(max-width: 999px)", () => {
        if (spotLightRef1.current && spotLightRef2.current) {
          tl.to(
            [spotLightRef2.current],
            {
              intensity: 1.5, // Les lumières augmentent en intensité
              ease: "linear",
              duration: 0.3
            },
            "<"
          );
          tl.to(
            [spotLightRef1.current],
            {
              intensity: 2.5, // Les lumières augmentent en intensité
              ease: "linear",
              duration: 0.3
            },
            "<"
          );
        }
        if (logoElements) {
          tl.to(logoElements, {
            opacity: 0,
            y: -20,
            stagger: 0.1,
            duration: 0.25,
            ease: "cubic-bezier(.21,.65,.67,1)"
          }, "<80%"); // 🔄 Démarre en même temps que l’animation de la caméra
        }

        tl.to(cameraTarget.current, {
          x: 0,
          y: 0.5,
          z: 5,
          duration: 0.5,
          ease: "linear"
        });

        if (groundRef.current) {
          tl.to(groundRef.current.material, {
            opacity: 0, // ✅ Disparition progressive
            ease: "linear",
            duration: 0.5,
            onUpdate: () => {
              groundRef.current.material.needsUpdate = true; // ✅ Forcer le rendu du changement d’opacité
            }
          }, "<"); // 🔄 Démarre en même temps que l’animation de la caméra
        }
      });

      mm.add("(min-width: 1000px)", () => {
        if (logoElements) {
          tl.to(logoElements, {
            opacity: 0,
            y: -20,
            stagger: 0.1,
            duration: 0.5,
            ease: "cubic-bezier(.21,.65,.67,1)"
          }, "<80%"); // 🔄 Démarre en même temps que l’animation de la caméra
        }
        tl.to(cameraTarget.current, {
          y: 1,
          duration: 3,
          ease: "linear"
        }, "<");
tl.to(cameraTarget.current, {
          x: 3,
          z: -10,
          duration: 3,
          ease: "linear"
        }, "<50%");
tl.to(lookAtTarget.current, {
          z: -8,
          y: 1,
          duration: 3,
          ease: "linear"
        }, "<");
        tl.to(cameraTarget.current, {
          x: 3,
          z: -10,
          duration: 3,
          ease: "linear"
        });
        if (groundRef.current) {
          tl.to(groundRef.current.material, {
            opacity: 0, // ✅ Disparition progressive
            ease: "linear",
            duration: 1,
            onUpdate: () => {
              groundRef.current.material.needsUpdate = true;
            }
          }, "<"); // 🔄 Démarre en même temps que l’animation de la caméra
        }
        if (spotLightRef1.current && spotLightRef2.current) {
          tl.to(
            [spotLightRef2.current, spotLightRef1.current],
            {
              intensity: 0, // Les lumières augmentent en intensité
              ease: "linear",
              duration: 0.5
            },
            "<"
          );
        }

        if (spotLightRef3.current) {
          tl.to([spotLightRef3.current], {
            intensity: 0.5,
            duration: 1,
            ease: "linear"
          }, "<");
          tl.to([spotLightRef3.current.position], {
            z: -10,
            duration: 1,
            ease: "linear",
            onUpdate: () => {
              spotLightRef3.current.position.needsUpdate = true;
            }
          }, "<");
        }

        tl.to(angleRef.current, {
  value: -Math.PI * 2, // un tour complet
  duration: 5,
  ease: "power2.inOut",
  onUpdate: () => {
    const angle = angleRef.current.value;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;

    cameraTarget.current.set(x, orbitHeight, z); // 💡 position de la caméra sur le cercle
  }
});
      });

      tl.to({}, {}, "<50%");
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [carRef.current, isMobile]);

  // 📌 Applique progressivement la position et la rotation
  useFrame(() => {
    camera.position.lerp(cameraTarget.current, 0.1);

    // ✅ LookAt interpolé pour éviter les sauts
    const matrix = new THREE.Matrix4().lookAt(
      camera.position,
      lookAtTarget.current,
      new THREE.Vector3(0, 1, 0)
    );
    camera.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(matrix), 0.1);
  });

  // >>> LOGIQUE LENIS DÉPLACÉE DANS index.js <<<
  // Les useEffect suivants liés à Lenis (initialisation, synchronisation avec ScrollTrigger,
  // écoute de l'événement "loaded" et gestion du démarrage/arrêt) ont été retirés de ce fichier.
  // Ils sont désormais gérés dans index.js pour centraliser la logique de scroll fluide.

  // TODO Je viens d'initier une nouvelle logique avec de la trigonometrie pour gerer plus proprement le traveling autour de la voiture 
  // pour pouvoir faire un reel tour en une animation pour eviter les steps, il reste juste à la regler et eventuellement enlever l'ancienne logique avec la camera x

  return null;
};
