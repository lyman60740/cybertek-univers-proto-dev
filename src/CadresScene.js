// scenes/CadresScene.js
import React, { useState, useEffect, useMemo, useRef  } from "react";
import { CameraRigCadres } from "./CameraRigCadres";
// import { OrbitControls } from "@react-three/drei";
import { Frames } from "./Frames";
import { Ground } from "./Ground";

function useExternalRenderControl() {
  const [canRender, setCanRender] = useState(window.isLoaded || false);

  useEffect(() => {
    const checkRender = () => {
      if (window.isLoaded) {
        setCanRender(true);
      }
    };

    // Vérifie immédiatement
    checkRender();

    // Vérifie toutes les 100ms jusqu'à ce que `window.isLoaded === true`
    const interval = setInterval(() => {
      if (window.isLoaded) {
        setCanRender(true);
        clearInterval(interval); // ✅ Arrête l'interval dès que `isLoaded` est `true`
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return canRender;
}




export const CadresScene = ({ images }) => {
  const [hoveredObject, setHoveredObject] = useState(null) // Hover des `<li>`
  const [selectedObject, setSelectedObject] = useState(null) // Clic sur une frame
  const canRender = useExternalRenderControl();
  const [key, setKey] = useState(0); // Permet de forcer le rechargement de la scène
  const resizeTimeout = useRef(null);

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

useEffect(() => {
  const handleResize = () => {
    if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      setKey((prevKey) => prevKey + 1);
    }, 500);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

const cameraRigMemo = useMemo(() => (
  <CameraRigCadres />
), []); // ✅ Ne recrée jamais CameraRigCadres

// ✅ Ne rend rien tant que canRender est false
if (!canRender) return null;

  return (
    <React.Fragment key={key}>
 <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 0, 20]} />
      {/* <OrbitControls /> */}
      {cameraRigMemo}
      <ambientLight intensity={1} />
      <directionalLight
        ref={lightRef}
        position={[0, 2, -3]}
        intensity={0.05}

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
        scrollSpeed={-0.064}
        color={[0.01, 0.01, 0.01]}
      />
      </group>
    
      </React.Fragment>
  )
};
