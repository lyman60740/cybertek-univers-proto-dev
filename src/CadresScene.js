// scenes/CadresScene.js
import React, { useState, useEffect, useMemo, useRef  } from "react";
import { CameraRigCadres } from "./CameraRigCadres";
// import { OrbitControls } from "@react-three/drei";
import { Frames } from "./Frames";
import { Ground } from "./Ground";

function useExternalRenderControl() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const checkRender = () => {
      if (window.isLoaded === true) {
        setCanRender(true);
      }
    };
    
    // Vérifie immédiatement et à intervalles
    checkRender();
    const interval = setInterval(checkRender, 100);
    
    return () => clearInterval(interval);
  }, []);

  return canRender;
}

export const CadresScene = ({ images }) => {
  const [hoveredObject, setHoveredObject] = useState(null) // Hover des `<li>`
  const [selectedObject, setSelectedObject] = useState(null) // Clic sur une frame
  const canRender = useExternalRenderControl();

  const lightRef = useRef();
  const targetRef = useRef();

  // ✅ Force la lumière à suivre la cible dès le premier rendu
  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
      lightRef.current.target.updateMatrixWorld();
    }
  }, []); // 👈 Une seule fois au montage

  useEffect(() => {
    const listItems = document.querySelectorAll('.hero-banner ul li');

    const handleMouseEnter = (index) => () => {
        setHoveredObject(index);
        setSelectedObject(null); // ✅ Réinitialiser la frame mise en avant
    };

    const handleMouseLeave = () => {
        setHoveredObject(null);
    };

    listItems.forEach((li, index) => {
        li.addEventListener('mouseenter', handleMouseEnter(index));
        li.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
        listItems.forEach((li, index) => {
            li.removeEventListener('mouseenter', handleMouseEnter(index));
            li.removeEventListener('mouseleave', handleMouseLeave);
        });
    };
}, [images]);

// ✅ Ajout de la classe `selected` dynamiquement pour les `<li>`
useEffect(() => {
    const listItems = document.querySelectorAll('.hero-banner ul li');

    listItems.forEach((li, index) => {
        li.classList.toggle(
            "selected",
            index === hoveredObject || index === selectedObject
        );
    });
}, [hoveredObject, selectedObject]);

const cameraRigMemo = useMemo(() => (
  <CameraRigCadres />
), []); // ✅ Ne recrée jamais CameraRigCadres

// ✅ Ne rend rien tant que canRender est false
if (!canRender) return null;

  return (
 <>
 <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 0, 20]} />
      {/* <OrbitControls /> */}
      {cameraRigMemo}
      <ambientLight intensity={1} />
      <directionalLight
        ref={lightRef}
        position={[0, 2, -3]}
        intensity={0.05}
        castShadow
      />
      <object3D ref={targetRef} position={[0, 0.5, 1]} />
      <group position={[0, -0.5, 0]}>
      <Frames 
        images={images} 
        hoveredObject={hoveredObject} 
        selectedObject={selectedObject} 
        setSelectedObject={setSelectedObject} 
        setHoveredObject={setHoveredObject} // ✅ Passage de `setHoveredObject`
      />
        <Ground 
        position={[0, 0, 5]}
        planeSize={[30, 50]}
        normalScale={[0.8, 0.8]}
        roughnessValue={0.7}
        mixBlur={15}
        mixStrength={15}
        resolution={1024}
        mirror={1}
        depthScale={0.01}
        scrollSpeed={0.064}
        color={[0.01, 0.01, 0.01]}
      />
      </group>
    
    </>
  )
};
