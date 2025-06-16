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

export const CameraRigCarShow = ({ groundRef, spotLightRef1, spotLightRef2, spotLightRef3, carRef, carReady  }) => {
  const { camera } = useThree();
  const cameraTarget = useRef(new THREE.Vector3(0, 10, 5));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const carTargetPosition = useRef(new THREE.Vector3(0, -.51, -5));

  const logoElements = document.querySelectorAll(".logo-cyb, .logo-alp, .sep");
  const blocTxtElements = document.querySelectorAll(".surTitre span, h2 span");
  const otherTxtElements = document.querySelectorAll(".bloc-txt__p p, .bloc-txt a");

  const [isMobile, setIsMobile] = useState(false);

const orbitState = useRef({
  height: 10,
  radius: 8   
});
const angleRef = useRef({ value: Math.PI / 2 });


  useEffect(() => {
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
 if (!carReady || !carRef.current) return;

    camera.position.set(0, 10, 5);

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
      }, "<80%"); 

    if (
      document.querySelector(".carshow-container") 
      && spotLightRef1.current 
      && spotLightRef2.current 
      && spotLightRef3.current 
      && groundRef.current
    ) {
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".carshow-container",
          start: isMobile ? "top-=70px top" : "top top",
          end: isMobile ? "+=2000px" : "+=3000px",
          scrub: isMobile ? 1 : 2,
          pin: true,
          pinSpacing: true,
          markers: false,
          onUpdate: (self) => {
            mm.add("(min-width: 1000px)", () => {
              if (self.progress > 0.75) {
                textAndOtherTl.timeScale(1).play(); // 🔥 Lecture normale
              } else {
                textAndOtherTl.timeScale(1).reverse(); 
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
       
          tl.to(
            [spotLightRef2.current],
            {
              intensity: 1.5, 
              ease: "linear",
              duration: 2
            }
          );
          tl.to(
            [spotLightRef1.current],
            {
              intensity: 2.5, 
              ease: "linear",
              duration: 2
            },
            "<"
          );
        
      });

      mm.add("(max-width: 999px)", () => {
        if (spotLightRef1.current && spotLightRef2.current) {
          tl.to(
            [spotLightRef2.current],
            {
              intensity: 1.5, 
              ease: "linear",
              duration: 0.3
            },
            "<"
          );
          tl.to(
            [spotLightRef1.current],
            {
              intensity: 2.5, 
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
          }, "<80%"); 
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
            opacity: 0, 
            ease: "linear",
            duration: 0.5,
            onUpdate: () => {
              groundRef.current.material.needsUpdate = true;
            }
          }, "<"); 
        }
      });

      mm.add("(min-width: 1000px)", () => {
        if (logoElements) {
          tl.to(logoElements, {
            opacity: 0,
            y: -20,
            stagger: 0.1,
            duration: 1,
            ease: "cubic-bezier(.21,.65,.67,1)"
          }, "<80%"); 
        }

tl.to(orbitState.current, {
  height: 1,
  duration: 3,
  ease: "linear"
}, "<");


          tl.to(groundRef.current.material, {
            opacity: 0, // ✅ Disparition progressive
            ease: "linear",
            duration: 1,
            onUpdate: () => {
              groundRef.current.material.needsUpdate = true;
            }
          }, "<"); 
        
          tl.to(
            [spotLightRef2.current, spotLightRef1.current],
            {
              intensity: 0, 
              ease: "linear",
              duration: 0.5
            },
            "<"
          );
        
          tl.to([spotLightRef3.current], {
            intensity: .5,
            duration: 1,
            ease: "linear"
          }, "<");
          
        
tl.to(carTargetPosition.current, {
  z: 1.8,
  duration: 5,
  ease: "linear"
});

tl.to(angleRef.current, {
  value: -Math.PI * 0.05, // 1ere demi rotation
  duration: 5,
  ease: "linear"
}, "<");
tl.to(orbitState.current, {
  radius: 3, 
  duration: 5,
  ease: "linear"
}, "<");
tl.to(angleRef.current, {
  value: -Math.PI * .85, // 2eme demi rotation
  duration: 5,
  ease: "linear"
});
tl.to(orbitState.current, {
  radius: 7, 
  duration: 5,
  ease: "linear"
}, "<");

  tl.to(spotLightRef3.current.position, {
    x: -2,
    duration: 2,
    ease: "linear"
  }, "<");

tl.to(carTargetPosition.current, {
  z: -7,
  duration: 2.5,
  ease: "linear"
});

       
      });

      tl.to({}, {}, "<50%");
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [carReady, isMobile]);

  // 📌 Applique progressivement la position et la rotation
 useFrame(() => {
  const angle = angleRef.current.value;
  const radius = orbitState.current.radius;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = orbitState.current.height;

  cameraTarget.current.set(x, y, z);

  camera.position.lerp(cameraTarget.current, 0.1);

  const matrix = new THREE.Matrix4().lookAt(
    camera.position,
    lookAtTarget.current,
    new THREE.Vector3(0, 1, 0)
  );
  camera.quaternion.slerp(new THREE.Quaternion().setFromRotationMatrix(matrix), 0.1);

  if (carRef.current) {
   carRef.current.position.lerp(carTargetPosition.current, 0.1);
}
});


  // >>> LOGIQUE LENIS DÉPLACÉE DANS index.js <<<
  // Les useEffect suivants liés à Lenis (initialisation, synchronisation avec ScrollTrigger,
  // écoute de l'événement "loaded" et gestion du démarrage/arrêt) ont été retirés de ce fichier.
  // Ils sont désormais gérés dans index.js pour centraliser la logique de scroll fluide.

  return null;
};
