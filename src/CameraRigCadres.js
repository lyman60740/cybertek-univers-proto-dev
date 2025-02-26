import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { easing } from "maath";
import gsap from "gsap";

export const CameraRigCadres = ({
  initialPosition = [0, 0.5, 35],
  defaultTargetPosition = [0, 0.5, 10.5],
  damping = 0.8
}) => {
  const { camera } = useThree();
  const animationDone = useRef(false);
  const [targetPosition, setTargetPosition] = useState(defaultTargetPosition);

  // Position initiale de la caméra
  useEffect(() => {
    camera.position.set(...initialPosition);
  }, [camera, initialPosition]);

  // Réinitialiser le flag d'animation quand la targetPosition change
  useEffect(() => {
    animationDone.current = false;
  }, [targetPosition]);

  // Configurer gsap.matchMedia pour changer targetPosition selon la taille de l'écran
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        small: "(max-width: 1199px)",
        medium: "(min-width: 1200px) and (max-width: 1599px)",
        large: "(min-width: 1600px)"
      },
      (context) => {
        const { conditions } = context;
        if (conditions.small) {
          setTargetPosition([0, 0.5, 17]); // Plus éloigné pour petits écrans
        } else if (conditions.medium) {
          setTargetPosition([0, 0.5, 15]);
        } else if (conditions.large) {
          setTargetPosition([0, 0.5, 13]);
        }
      }
    );
    return () => {
      mm.revert();
    };
  }, []);

  // Animation de la caméra
  useFrame((state, dt) => {
    if (!animationDone.current) {
      easing.damp3(camera.position, targetPosition, damping, dt);
      // Dès que la position z est proche de la cible, on considère l'animation terminée
      if (Math.abs(camera.position.z - targetPosition[2]) < 0.05) {
        animationDone.current = true;
      }
    }
  });

  return null;
};
