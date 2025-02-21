import { Ground } from "./Ground";
import { Car } from "./Car";
import { CameraRigCarShow } from "./CameraRigCarShow";
import React, { Suspense, useRef, useEffect, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import gsap from "gsap";

export const CarShowScene = () => {
  const spotLightRef1 = useRef();
  const spotLightRef2 = useRef();
  const spotLightRef3 = useRef();
  const groundRef = useRef();
  const targetRef = useRef();

  // ✅ State pour conditionner le rendu du Ground
  const [showGround, setShowGround] = useState(false);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ✅ Active le Ground uniquement si min-width >= 800px
    mm.add("(min-width: 800px)", () => {
      setShowGround(true); // Active le rendu du Ground
    });

    mm.add("(max-width: 799px)", () => {
      setShowGround(false); // Désactive le rendu du Ground
    });

    // ✅ Cleanup à la destruction du composant
    return () => {
      mm.revert();
    };
  }, []);

  return (
    <>
      <CameraRigCarShow
        groundRef={groundRef}
        spotLightRef1={spotLightRef1}
        spotLightRef2={spotLightRef2}
        spotLightRef3={spotLightRef3}
        targetRef={targetRef}
      />

      <PerspectiveCamera makeDefault fov={50} position={[0, 10, 1]} />
      <color args={[0, 0, 0]} attach="background" />

      <Car
        ref={targetRef}
        position={[-0.25, 0, -5]}
        rotation={[0, 0, 0]}
        scale={[1.5, 1.5, 1.5]}
      />

      <spotLight
        ref={spotLightRef1}
        color={[0.09, 0.078, 0.761]}
        intensity={0}
        angle={0.6}
        penumbra={0.5}
        position={[3, 5, 0]}
        shadow-bias={-0.0001}
      />

      <spotLight
        ref={spotLightRef2}
        color={[1, 0.811, 0]}
        intensity={0}
        angle={0.6}
        penumbra={0.5}
        position={[-3, 5, 0]}
        shadow-bias={-0.0001}
      />

      <spotLight
        ref={spotLightRef3}
        color={[1, 1, 1]}
        intensity={0}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, -2]}
        shadow-bias={-0.0001}
        target={targetRef.current}
      />

      <object3D position={[0, 2, 5]} />

      {/* ✅ Render du Ground conditionné par la taille de l'écran */}
      {showGround && (
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
      )}
    </>
  );
};
