import { Ground } from "./Ground";
import { Car } from "./Car";
import { CameraRigCarShow } from "./CameraRigCarShow";
import React, { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { PerspectiveCamera, useHelper, Environment  } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { PointLightHelper } from "three";
import GUI from "lil-gui";



export const CarShowScene = () => {
 
  const spotLightRef1 = useRef();
  const spotLightRef2 = useRef();

  const ambientLightRef = useRef();
  const groundRef = useRef();
  const carRef = useRef();

  // ✅ State pour conditionner le rendu du Ground
  const [showGround, setShowGround] = useState(false);

  const [carReady, setCarReady] = useState(false);

   // ✅ lil-gui controls setup
  // useEffect(() => {
  //   const gui = new GUI();

  //   const ambientFolder = gui.addFolder("Ambient Light");
  //   const ambientParams = {
  //     color: "#ffffff",
  //     intensity: 0,
  //   };

  //   ambientFolder.addColor(ambientParams, "color").onChange((value) => {
  //     if (ambientLightRef.current) {
  //       ambientLightRef.current.color = new THREE.Color(value);
  //     }
  //   });
  //   ambientFolder.add(ambientParams, "intensity", 0, 2, 0.01).onChange((value) => {
  //     if (ambientLightRef.current) {
  //       ambientLightRef.current.intensity = value;
  //     }
  //   });

  //   const spotFolder = gui.addFolder("Spotlights");
  //   const spot1Params = {
  //     color: "#1713c2",
  //     intensity: 0,
  //   };
  //   const spot2Params = {
  //     color: "#ffd000",
  //     intensity: 0,
  //   };

  //   spotFolder.addColor(spot1Params, "color").name("Spot 1 Color").onChange((value) => {
  //     if (spotLightRef1.current) spotLightRef1.current.color = new THREE.Color(value);
  //   });
  //   spotFolder.add(spot1Params, "intensity", 0, 10, 0.01).name("Spot 1 Intensity").onChange((value) => {
  //     if (spotLightRef1.current) spotLightRef1.current.intensity = value;
  //   });

  //   spotFolder.addColor(spot2Params, "color").name("Spot 2 Color").onChange((value) => {
  //     if (spotLightRef2.current) spotLightRef2.current.color = new THREE.Color(value);
  //   });
  //   spotFolder.add(spot2Params, "intensity", 0, 10, 0.01).name("Spot 2 Intensity").onChange((value) => {
  //     if (spotLightRef2.current) spotLightRef2.current.intensity = value;
  //   });

  //   return () => {
  //     gui.destroy(); // Clean up GUI on unmount
  //   };
  // }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ✅ Active le Ground uniquement si min-width >= 800px
    mm.add("(min-width: 1000px)", () => {
      setShowGround(true); // Active le rendu du Ground
    });

    // mm.add("(max-width: 999px)", () => {
    //   setShowGround(false); // Désactive le rendu du Ground



    // });

    // ✅ Cleanup à la destruction du composant
    return () => {
      mm.revert();
    };
  }, []);

  const carPosition = useMemo(() => new THREE.Vector3(-20, -0.51, 0), []);

  return (
    <>
      <CameraRigCarShow
        groundRef={groundRef}
        spotLightRef1={spotLightRef1}
        spotLightRef2={spotLightRef2}
        carRef={carRef}
        carPosition={carPosition}
      />
      <fog attach="fog" args={['#000000', 10, 20]} />
<Environment files="https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev/public/hdri/studio_small_09_1k.hdr" background={false} />

      <PerspectiveCamera makeDefault fov={50} position={[0, 10, 1]} />
      <color args={[0, 0, 0]} attach="background" />

      <Car
        ref={carRef}
        onLoaded={() => setCarReady(true)}
        rotation={[0, Math.PI / 2, 0]}
        position={carPosition.toArray()} 
        scale={[1.5, 1.5, 1.5]}
      />

      <spotLight
        ref={spotLightRef1}
        color={[0.09, 0.078, 0.761]}
        intensity={0}
        angle={0.6}
        penumbra={0.5}
        position={[0, 5, -3]}
        shadow-bias={-0.0001}
        
      />
      <spotLight
        ref={spotLightRef2}
        color={[1, 0.811, 0]}
        intensity={0}
        angle={0.6}
        penumbra={0.5}
        position={[0, 5, 3]}
        shadow-bias={-0.0001}
       
      />


      <object3D position={[0, 2, 5]} />

      {/* ✅ Render du Ground conditionné par la taille de l'écran */}
    
        <Ground
          ref={groundRef}
          position={[0, -0.51, 5]}
          planeSize={[30, 30]}
          normalScale={[0.8, 0.8]}
          roughnessValue={0.7}
          mixBlur={0}
          mixStrength={0}
          resolution={256}
          mirror={0}
          depthScale={0}
          scrollSpeed={0.128}
          color={[0, 0, 0]}
        />
      
    </>
  );
};
