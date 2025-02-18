import React, { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "./Model"; // Importe le composant de modèle
import gsap from "gsap";

// Liste des modèles avec chemin et positions
const modelsList = [
  {
    name: "Model 1",
    url: "/models/model1.glb",
    position: [0, -2, 0],
    rotation: [0, Math.PI, 0],
    scale: [1.8, 1.8, 1.8],
    visible: false
  },
  {
    name: "Model 2",
    url: "/models/model2.glb",
    position: [0, -2, 0],
    rotation: [0, Math.PI - 0.5, 0],
    scale: [0.8, 0.8, 0.8],
    visible: false
  },
  {
    name: "Model 3",
    url: "/models/model3.glb",
    position: [0, -4, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: false
  },
  {
    name: "Model 4",
    url: "/models/model4.glb",
    position: [0, -4, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: false
  },
  {
    name: "Model 5",
    url: "/models/model5.glb",
    position: [0, -4, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    visible: false
  },
  {
    name: "Model 6",
    url: "/models/model6.glb",
    position: [0, -4, 0],
    rotation: [0, 0, 0],
    scale: [0.13, 0.13, 0.13],
    visible: false
  },
  {
    name: "Model 7",
    url: "/models/model7.glb",
    position: [0, -4, 0],
    rotation: [0, -Math.PI / 2, 0],
    scale: [0.035, 0.035, 0.035],
    visible: false
  },
  {
    name: "Model 8",
    url: "/models/model8.glb",
    position: [0, -2.2, 0],
    rotation: [0, Math.PI, 0],
    scale: [7, 7, 7],
    visible: false
  },
];

export const CategoryScene = () => {
  const { gl } = useThree();
  const [visibleModelIndex, setVisibleModelIndex] = useState(null);
  const modelRefs = useRef(modelsList.map(() => React.createRef()));

  useEffect(() => {
    gl.setClearColor("#5e66f9", 0.04); // rgba(94, 102, 249, 0.05)
  }, [gl]);

  // Gestion des clics sur les éléments .cat-item
  useEffect(() => {
      const handleClick = (index) => {
          if (index === visibleModelIndex) {
              // Si le modèle cliqué est déjà visible, on ignore le clic
              return;
            }
        
        
        const tl = gsap.timeline({overwrite: true});

      if (visibleModelIndex !== null) {
        // Faire disparaître le modèle précédemment visible avec une rotation inverse
        tl.to(modelRefs.current[visibleModelIndex].current.position, {
          y: modelsList[visibleModelIndex].position[1],
          duration: 0.5,

        }).to(modelRefs.current[visibleModelIndex].current.rotation, {
          y: modelsList[visibleModelIndex].rotation[1],
          duration: 0.5,

        },"<");
      }

      // Faire apparaître le nouveau modèle avec une rotation
      modelRefs.current[index].current.visible = true;
      tl.to(modelRefs.current[index].current.position, {
        y: modelsList[index].position[1] + 2,
        duration: 1.5,
        ease:"power4.out",
        
      }).to(modelRefs.current[index].current.rotation, {
        y: modelsList[index].rotation[1] + Math.PI *2,
        duration: 1.5,
         ease:"power4.out",
         
      },"<");

      setVisibleModelIndex(index);
    };

    // Ajouter les écouteurs d'événements aux éléments .cat-item
    const catItems = document.querySelectorAll('.cat-item');
    catItems.forEach((item, index) => {
      item.addEventListener('click', () => handleClick(index));
    });

    // Nettoyer les écouteurs d'événements
    return () => {
      catItems.forEach((item, index) => {
        item.removeEventListener('click', () => handleClick(index));
      });
    };
  }, [visibleModelIndex]);

  return (
    <>
      {/* Fond et lumières */}
      <OrbitControls enableZoom={false}/>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 5, -5]} intensity={0.7} castShadow />

      {/* Affiche la liste des modèles dynamiquement */}
      {modelsList.map((model, index) => (
        <Model
          key={index}
          ref={modelRefs.current[index]}
          url={model.url}
          position={model.position}
          rotation={model.rotation}
          scale={model.scale}
          visible={index === visibleModelIndex} // Seul le modèle cliqué est visible
        />
      ))}
    </>
  );
};
