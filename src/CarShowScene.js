import { Ground } from "./Ground";
import { Car } from "./Car";
import { LogoOnGround } from "./LogoOnGround";
import { CameraRigCarShow } from "./CameraRigCarShow";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import GUI from "lil-gui";
import { Effects } from './Effects'


export const CarShowScene = () => {

  const groundRef = useRef();
  const carRef = useRef();

  const [carReady, setCarReady] = useState(false);

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
  const mm = gsap.matchMedia()

  mm.add('(max-width: 999px)', () => setIsMobile(true))
  mm.add('(min-width: 1000px)', () => setIsMobile(false))


  return () => mm.revert()
}, [])
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


  const carPosition = useMemo(() => new THREE.Vector3(-20, -0.51, 0), []);

  return (
    <>
      <CameraRigCarShow
        groundRef={groundRef}
        carRef={carRef}
        carPosition={carPosition}
      />
      
   
  <fog attach="fog" args={['#15151a', 10, 20]} /> // 💻 desktop

{/* <Environment files="https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev/public/hdri/studio_small_09_1k.hdr" background={false} /> */}

      <PerspectiveCamera makeDefault fov={50} position={[0, 10, 1]} />
      <color attach="background" args={['#15151a']} />
<mesh scale={3} position={[-2, -0.48, 3]} rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[10, 0.15]} />
  <meshBasicMaterial color="white" />
</mesh>
<mesh scale={3} position={[-2, -0.48, -3]} rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[10, 0.15]} />
  <meshBasicMaterial color="white" />
</mesh>
<LogoOnGround url="https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/images/cyb-white.png" x={3} z={0} height={0.5} ratio={5} />
<LogoOnGround url="https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/images/alpine-white.png" x={4} z={-0.12} height={2} ratio={3} />
<LogoOnGround url="https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/images/cross.png" x={3.5} z={0} height={0.3} ratio={1} />

      <Car
        ref={carRef}
        onLoaded={() => setCarReady(true)}
        rotation={[0, Math.PI / 2, 0]}
        position={carPosition.toArray()} 
        scale={[1.5, 1.5, 1.5]}
      />
<directionalLight
  position={[0, 2, 0]}
  intensity={4.2}
  castShadow
  shadow-mapSize-width={1024}
  shadow-mapSize-height={1024}
/>

        <Ground
          ref={groundRef}
          position={[0, -.53, 0]}
          planeSize={[20, 40]}
          normalScale={[20, 40]}
          roughnessValue={0.7}
          mixBlur={0}
          mixStrength={0}
          resolution={256}
          mirror={1}
          depthScale={0}
          scrollSpeed={0.228}
          color={[0.082, 0.082, 0.102]}
        />

      
      <Effects />
      
    </>
  );
};
