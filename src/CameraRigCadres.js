import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { easing } from "maath";

export const CameraRigCadres = ({ 
  initialPosition = [0, 10, 55], 
  targetPosition = [0, 0.5, 7.8], 
  damping = 0.8 
}) => {
  const { camera } = useThree();
  const animationDone = useRef(false); // ✅ Utilisation de useRef pour ne pas re-render

  useEffect(() => {
    camera.position.set(...initialPosition);
  }, [camera, initialPosition]);

  useFrame((state, dt) => {
    if (!animationDone.current) {
      easing.damp3(camera.position, targetPosition, damping, dt);
      
      if (Math.abs(camera.position.z - targetPosition[2]) < 0.05) {
        animationDone.current = true; // ✅ Ne relance plus l'animation après la première fois
      }
    }
  });

  return null;
};
