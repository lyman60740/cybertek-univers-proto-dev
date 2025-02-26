import React, { useRef, useState, useEffect, forwardRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls, RoundedBox  } from "@react-three/drei";

// Exemple simple de composant Model2D qui affiche une image
export const Model2D = forwardRef(({ url, position, rotation, scale, visible }, ref) => {
  return (
    <group ref={ref} visible={visible}>
      {/* Cadre arrondi avec RoundedBox */}
      <RoundedBox args={[4.5, 7, 0.1]} radius={0.5} smoothness={4}>
        <meshStandardMaterial 
          color="#292929" 
          metalness={0.8} 
          roughness={0.2} 
          side={THREE.DoubleSide} 
        />
      </RoundedBox>
      {/* Plan au centre pour afficher l'image */}
      <mesh position={[0, 0, 0.06]}>
        {/* Le plane est légèrement en avant pour éviter le z-fighting */}
        <planeGeometry args={[4, 6.5]} />
        <meshStandardMaterial map={new THREE.TextureLoader().load(url)} side={THREE.DoubleSide} metalness={0.8} 
          roughness={0.2}  />
      </mesh>
    </group>
  );
});

// On attend désormais que la liste d'images soit passée en prop
export const Cat2D = ({ images }) => {
  // Conserver l'index du modèle visible
  const [visibleIndex, setVisibleIndex] = useState(null);
  // Créer une ref pour chaque image passée en prop
  const modelRefs = useRef(images.map(() => React.createRef()));

  useEffect(() => {
    // Ajouter un listener sur tous les éléments HTML ayant la classe "cat-item"
    const catItems = document.querySelectorAll(".cat-item");

    const handleClick = (index) => {
      if (index === visibleIndex) return; // Si le modèle cliqué est déjà visible, ne rien faire

      const tl = gsap.timeline({ overwrite: true });

      // Si un modèle était visible, l'animer pour le faire disparaître
      if (visibleIndex !== null && modelRefs.current[visibleIndex].current) {
        tl.to(modelRefs.current[visibleIndex].current.position, {
          y: -2, // Descendre l'ancien modèle
          duration: 0.5,
          ease: "power2.in"
        });
      }

      // Faire apparaître le nouveau modèle en animation (par exemple, en le remontant)
      if (modelRefs.current[index].current) {
        // Rendre le modèle visible avant de démarrer l'animation
        modelRefs.current[index].current.visible = true;
        tl.to(modelRefs.current[index].current.position, {
          y: 2, // Position finale
          duration: 1,
          ease: "power2.out"
        });
      }

      setVisibleIndex(index);
    };

    catItems.forEach((item, index) => {
      item.addEventListener("click", () => handleClick(index));
    });

    return () => {
      catItems.forEach((item, index) => {
        item.removeEventListener("click", () => handleClick(index));
      });
    };
  }, [visibleIndex, images]);

  return (
    <>
    <OrbitControls/>
    <spotLight
        color={[1, 1, 1]}
        intensity={2}
        angle={0.6}
        penumbra={0.5}
        position={[-5, 5, 4]}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={1} />
      <directionalLight
        position={[0, 5, 3]}
        intensity={2}

      />
      {images.map((model, index) => (
        <Model2D
          key={index}
          ref={modelRefs.current[index]}
          url={model.url}
          visible={true} // Par défaut, aucun modèle n'est visible
        />
      ))}
    </>
  );
};
