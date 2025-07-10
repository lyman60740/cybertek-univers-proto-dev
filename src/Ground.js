import React, { useEffect, forwardRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader } from "three";
import * as THREE from "three";

export const Ground = forwardRef(({
  position = [0, -.53, 0],
  normalScale = [1, 1], // Mets une valeur raisonnable ici !
  roughnessValue = 0.8,
  metalnessValue = 0.05,
  planeSize = [20, 40],
  textureURLs = [
    process.env.PUBLIC_URL + "https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev/public/textures/terrain-roughness1.webp",
    process.env.PUBLIC_URL + "https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev/public/textures/terrain-normal1.webp"
  ],
  scrollSpeed = 0.128,
  color=[0.082, 0.082, 0.102],
  ...props
}, ref) => {
  const [roughness, normal] = useLoader(TextureLoader, textureURLs);

  useEffect(() => {
    [normal, roughness].forEach((t) => {
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.repeat.set(5, 5);
      t.offset.set(0, 0);
      t.needsUpdate = true;
    });
    normal.colorSpace = THREE.SRGBColorSpace;
  }, [normal, roughness]);

  useFrame((state) => {
    let t = -state.clock.getElapsedTime() * scrollSpeed;
    roughness.offset.set(-t % 1, 0);
    normal.offset.set(-t % 1, 0);
  });

  useEffect(() => {
    return () => {
      normal.dispose();
      roughness.dispose();
    };
  }, []);

  return (
    <mesh
      ref={ref}
      {...props}
      rotation-x={-Math.PI * 0.5}
      position={position}
      receiveShadow
    >
      <planeGeometry args={planeSize} />
      <meshStandardMaterial
        color={color}
        roughness={roughnessValue}
        metalness={metalnessValue}
        roughnessMap={roughness}
        normalMap={normal}
        normalScale={new THREE.Vector2(...normalScale)}
      />
    </mesh>
  );
});
