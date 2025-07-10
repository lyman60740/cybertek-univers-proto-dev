import { useRef, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function LogoOnGround({
  url,
  x = 0,                // Position de départ sur X
  y = -0.499,
  z = 2,
  rotation = [-Math.PI / 2, 0, Math.PI / 2],
  height = 1.2,
  ratio = 5,
  animateX = true,
  animStart = 8,
  animEnd = -8,
  animSpeed = 0.8,
  ...props
}) {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, url);
  const width = height * ratio;

  // Nouvel état pour mémoriser le temps de début de la boucle
  const [loopStarted, setLoopStarted] = useState(false);
  const loopStartTime = useRef(0);

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;

  useFrame((state) => {
    if (animateX && meshRef.current) {
      const range = animStart - animEnd;
      const elapsed = state.clock.elapsedTime * animSpeed;

      if (!loopStarted) {
        // Aller simple de x à animEnd
        const t = x - elapsed;
        if (t > animEnd) {
          meshRef.current.position.x = t;
        } else {
          setLoopStarted(true);
          loopStartTime.current = state.clock.elapsedTime; // On note le temps où la boucle commence
          meshRef.current.position.x = animStart;
        }
      } else {
        // Boucle de animStart à animEnd puis wrap
        const loopElapsed = (state.clock.elapsedTime - loopStartTime.current) * animSpeed;
        let t = animStart - (loopElapsed % range);
        meshRef.current.position.x = t;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      rotation={rotation}
      {...props}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}
