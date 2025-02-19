import React, { forwardRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";

export const Car = forwardRef(({ position = [], rotation = [0, 0, 0], scale = [1.5, 1.5, 1.5] }, ref) => {
  const gltf = useLoader(GLTFLoader, process.env.PUBLIC_URL + "https://cdn.jsdelivr.net/gh/lyman60740/cybertek-proto-simracing-page/public/models/car/alpine/alpine-compressed.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Utilisation d'un CDN Google
    loader.setDRACOLoader(dracoLoader);
  });

  useEffect(() => {
    gltf.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (["wheel_FL", "wheel_FR", "wheel_RL", "wheel_RR"].includes(object.name)) {
          object.userData.isWheel = true;
        }
      }
    });

    gltf.scene.scale.set(...scale);
    gltf.scene.position.set(...position);
    gltf.scene.rotation.set(...rotation);
  }, [gltf, position, rotation, scale]);

  useFrame((state, delta) => {
    gltf.scene.traverse((object) => {
      if (object.userData.isWheel) {
        object.rotation.x += delta * 1.8; // Animation des roues
      }
    });
  });

  return <primitive ref={ref} object={gltf.scene} />;
});
