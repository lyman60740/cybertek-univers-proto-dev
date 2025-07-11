import React, { forwardRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { LOD } from "three";
import * as THREE from "three";

// 👉 Le composant qui charge selon l’URL reçue
const CarModel = forwardRef(({ url, position, rotation, scale, isMobile, onLoaded }, ref) => {
  const gltf = useLoader(
    GLTFLoader,
    url,
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      loader.setDRACOLoader(dracoLoader);
    }
  );
  const [lodModel, setLodModel] = useState(null);

  useEffect(() => {
    if (!gltf) return;

    const scene = gltf.scene;
    const lod = new LOD();
    lod.addLevel(scene.clone(), 0);

    if (isMobile) {
      const lowPolyModel = scene.clone();
      lowPolyModel.traverse((obj) => {
        if (obj.isMesh) obj.geometry = obj.geometry.toNonIndexed();
      });
      lod.addLevel(lowPolyModel, 10);
    }

    lod.traverse((object) => {
      if (["Rim_LF", "Rim_RF", "Rim_LR", "Rim_RR"].includes(object.name)) {
        object.userData.isWheel = true;
      }
      if (object instanceof THREE.Mesh) {
        object.castShadow = !isMobile;
        object.receiveShadow = !isMobile;
        if (object.material) {
          const oldMat = object.material;
          const newMat = new THREE.MeshPhysicalMaterial({
            color: oldMat.color,
            map: oldMat.map,
            metalness: 0.3,
            roughness: 0.6,
            envMapIntensity: 0.5,
            clearcoat: 0.6,
            clearcoatRoughness: 0.3,
          });
          newMat.map && (newMat.map.anisotropy = isMobile ? 2 : 16);
          object.material = newMat;
        }
      }
    });

    lod.scale.set(...scale);
    lod.position.set(...position);
    lod.rotation.set(...rotation);

    setLodModel(lod);
    onLoaded?.();
  }, [gltf, position, rotation, scale, isMobile]);

  useFrame((state, delta) => {
    if (!lodModel) return;
    lodModel.levels.forEach(({ object }) => {
      object.traverse((child) => {
        if (child.userData.isWheel) child.rotation.x += delta * 1.8;
      });
    });
  });

  if (!lodModel) return null;
  return <primitive ref={ref} object={lodModel} />;
});


// 👉 Le composant parent, qui choisit l’URL
export const Car = forwardRef((props, ref) => {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 799px)");
    setIsMobile(mediaQuery.matches);
    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // URLs de modèles
  const desktopUrl = "https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/models/car/alpine/alpincar-off-ratio-0-0500010.glb";
  const mobileUrl = "https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/models/car/alpine/mobile-alpincar-off-ratio-0-050001.glb";
  // Remplace mobileUrl par ton modèle mobile réel

  // On attend d’avoir déterminé le type d’appareil
  if (isMobile === null) return null;

  return (
    <CarModel
      ref={ref}
      url={isMobile ? mobileUrl : desktopUrl}
      isMobile={isMobile}
      {...props}
    />
  );
});
