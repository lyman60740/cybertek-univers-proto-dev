import { Ground } from "./Ground";
import { Car } from "./Car";
import { LogoOnGround } from "./LogoOnGround";
import { CameraRigCarShow } from "./CameraRigCarShow";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { PerspectiveCamera, useHelper   } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import GUI from "lil-gui";



export const CarShowScene = () => {

  const groundRef = useRef();
  const carRef = useRef();

  const [carReady, setCarReady] = useState(false);


  const carPosition = useMemo(() => new THREE.Vector3(-20, -0.51, 0), []);
const dirLightRef = useRef();
 useEffect(() => {
    if (dirLightRef.current) {
      dirLightRef.current.target.position.set(0, 0, 0); // vise le centre
      dirLightRef.current.target.updateMatrixWorld();
    }
  }, []);

   const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
  const mm = gsap.matchMedia()

  mm.add('(max-width: 999px)', () => setIsMobile(true))
  mm.add('(min-width: 1000px)', () => setIsMobile(false))


  return () => mm.revert()
}, [])

  // useHelper(dirLightRef, THREE.DirectionalLightHelper, 3, 'cyan');
  return (
    <>
      <CameraRigCarShow
        groundRef={groundRef}
        carRef={carRef}
        carPosition={carPosition}
      />
      
    {isMobile ? (
  <fog attach="fog" args={['#15151a', 19, 30]} /> // 📱 mobile
) : (
 <fog attach="fog" args={['#15151a', 15, 20]} /> // 💻 desktop
)}
   

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
<LogoOnGround url="https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/images/cyb-white1.png" x={3} z={0} height={0.5} ratio={5} animEnd={isMobile ? -12 : -8}/>
<LogoOnGround url="https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/images/alpine-white.png" x={4} z={-0.12} height={2} ratio={3} animEnd={isMobile ? -12 : -8}/>
<LogoOnGround url="https://cdn.jsdelivr.net/gh/lyman60740/cybertek-univers-proto-dev@master/build/images/cross.png" x={3.5} z={0} height={0.3} ratio={1} animEnd={isMobile ? -12 : -8} />

      <Car
        ref={carRef}
        onLoaded={() => setCarReady(true)}
        rotation={[0, Math.PI / 2, 0]}
        position={carPosition.toArray()} 
        scale={[1.5, 1.5, 1.5]}
      />
<directionalLight
  position={[-2, 5, 0]}
  intensity={2.2}
  ref={dirLightRef}
/>


        <Ground
          ref={groundRef}
          position={[0, -.53, 0]}
          planeSize={[40, 40]}
          normalScale={[20, 40]}
          roughnessValue={0.7}
          metalnessValue={0}
          mixBlur={0}
          mixStrength={0}
          resolution={256}
          mirror={1}
          depthScale={0}
          scrollSpeed={0.1}
          color={[0.082, 0.082, 0.102]}
        />

      
      {/* <Effects /> */}
      
    </>
  );
};
