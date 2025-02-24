import React, { useEffect, forwardRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { LinearEncoding, RepeatWrapping, TextureLoader } from "three";
import * as THREE from "three";

export const Ground = forwardRef(({
  position = [0, -0.5, 5],
  planeSize = [30, 30],
  normalScale = [0.15, 0.15],
  roughnessValue = 0.7,
  mixBlur = 0,
  mixStrength = 0,
  resolution = 256,
  mirror = 0,
  depthScale = 0,
  textureURLs = [
    process.env.PUBLIC_URL + "https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/textures/terrain-roughness.webp",
    process.env.PUBLIC_URL + "https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/textures/terrain-normal.webp"
  ],
  scrollSpeed = 0.128, // Vitesse de défilement texture
  color = [0, 0, 0],
  ...props
}, ref) => {
  const [roughness, normal] = useLoader(TextureLoader, textureURLs);

  useEffect(() => {
    [normal, roughness].forEach((t) => {
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.repeat.set(5, 5);
      t.offset.set(0, 0);
    });
    normal.encoding = LinearEncoding;
    normal.colorSpace = THREE.SRGBColorSpace;
  }, [normal, roughness]);

  useFrame((state) => {
    let t = -state.clock.getElapsedTime() * scrollSpeed;
    roughness.offset.set(0, t % 1);
    normal.offset.set(0, t % 1);
  });

  return (
    <mesh ref={ref} {...props} rotation-x={-Math.PI * 0.5} position={position} transparent>
      <planeGeometry args={planeSize} />
      <MeshReflectorMaterial
        envMapIntensity={0}
        normalMap={normal}
        normalScale={normalScale}
        roughnessMap={roughness}
        color={color}
        roughness={roughnessValue}
        blur={[1000, 400]}
        mixBlur={mixBlur}
        mixStrength={mixStrength}
        resolution={resolution}
        mirror={mirror}
        depthScale={depthScale}
        minDepthThreshold={0.9}
        maxDepthThreshold={1}
        depthToBlurRatioBias={0.25}
        reflectorOffset={0}
        transparent
        {...props}
       
      />
    </mesh>
  );
});
