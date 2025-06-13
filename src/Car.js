import React, { forwardRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { LOD } from "three";
import * as THREE from "three";

export const Car = forwardRef(
  ({ position = [], rotation = [0, 0, 0], scale = [1.5, 1.5, 1.5] }, ref) => {
    const [isMobile, setIsMobile] = useState(false);
    const [lodModel, setLodModel] = useState(null); // ✅ Stocke le LOD

    // ✅ Détection des mobiles avec matchMedia
    useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 799px)");
      setIsMobile(mediaQuery.matches);

      const handleResize = () => setIsMobile(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleResize);

      return () => {
        mediaQuery.removeEventListener("change", handleResize);
      };
    }, []);

    // ✅ Charger le modèle GLB
    const gltf = useLoader(
      GLTFLoader,
      process.env.PUBLIC_URL +
        "https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/models/car/alpine/alpincar-off8.glb",
      (loader) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/v1/decoders/"
        );
        loader.setDRACOLoader(dracoLoader);
      }
    );

    // ✅ Appliquer les optimisations
    useEffect(() => {
      if (!gltf) return;

      const scene = gltf.scene;

      // 🔥 Appliquer les niveaux de détail (LOD)
      const lod = new LOD();
      lod.addLevel(scene.clone(), 0); // Détail complet (proche)

      if (isMobile) {
        const lowPolyModel = scene.clone();
        lowPolyModel.traverse((obj) => {
          if (obj.isMesh) {
            obj.geometry = obj.geometry.toNonIndexed(); // Réduction de la géométrie
          }
        });
        lod.addLevel(lowPolyModel, 10); // Modèle simplifié à distance
      }

      // ✅ Optimisation des matériaux et ombres
      lod.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (
            ["wheel_FL", "wheel_FR", "wheel_RL", "wheel_RR"].includes(
              object.name
            )
          ) {
            object.userData.isWheel = true; // Marquage des roues
          }

          // ❌ Désactiver les ombres sur mobile
          object.castShadow = !isMobile;
          object.receiveShadow = !isMobile;

          // ✅ Réduire la qualité des textures sur mobile
          if (object.material && object.material.map) {
            object.material.map.anisotropy = isMobile ? 2 : 16;
          }

        
        }
      });

      // ✅ Appliquer position, échelle et rotation
      lod.scale.set(...scale);
      lod.position.set(...position);
      lod.rotation.set(...rotation);

      // ✅ Stocker le modèle avec LOD pour le rendre ensuite
      setLodModel(lod);
    }, [gltf, position, rotation, scale, isMobile]);

    // ✅ Animation des roues avec un framerate réduit sur mobile
    useFrame((state, delta) => {
      if (!lodModel) return;

      // 🔄 Réduire les calculs sur mobile
      if (isMobile && Math.floor(state.clock.elapsedTime) % 2 !== 0) return;

      lodModel.traverse((object) => {
        if (object.userData.isWheel) {
          object.rotation.x += delta * 1.8;
        }
      });
    });

    // ✅ Si le modèle n'est pas encore prêt, ne rien afficher
    if (!lodModel) return null;

    return <primitive ref={ref} object={lodModel} />;
  }
);
