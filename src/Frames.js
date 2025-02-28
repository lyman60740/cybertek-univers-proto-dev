// components/Frames.jsx
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { easing } from "maath";
import { Text, useCursor } from "@react-three/drei";

export const Frames = ({ images, hoveredObject, selectedObject, setSelectedObject, setHoveredObject }) => {
  return (
    <group>
      {images.map((props, index) => (
        <Frame
          key={props.url}
          {...props}
          isSelected={selectedObject === index}
          isHovered={hoveredObject === index}
          onSelect={() => setSelectedObject(index)}
          onDeselect={() => setSelectedObject(null)}
          setHoveredObject={setHoveredObject}
          index={index}
        />
      ))}
    </group>
  );
};

function Frame({ url, position, rotation, isSelected, isHovered, onSelect, onDeselect,setHoveredObject, index, ...props }) {
    const ref = useRef()
    const image = useRef()
    const frame = useRef()
    const [hovered, hover] = useState(false)
    const [rnd] = useState(() => Math.random())

    const GOLDENRATIO = 1.61803398875
  
    const originalPosition = useRef(new THREE.Vector3(...position))
    const originalRotation = useRef(new THREE.Euler(...rotation))
  
    useCursor(hovered)
  
    // Un seul objet peut être actif (soit par hover, soit par clic)
    const isActive = isSelected || (isHovered && !isSelected)

     // Chargement de la texture pour le plane et désactivation des mipmaps
  const texture = useLoader(THREE.TextureLoader, url);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
   
    useFrame((state, dt) => {
      const targetPosition = isActive ? new THREE.Vector3(0, 0, 4.5) : originalPosition.current
      const targetRotation = isActive ? new THREE.Euler(0, 0, 0) : originalRotation.current
  
      // Animation fluide de la position
      easing.damp3(ref.current.position, targetPosition, 0.4, dt)
  
      // Animation fluide de la rotation
      easing.dampE(ref.current.rotation, targetRotation, 0.4, dt)
  
      // Effet de zoom sur l’image
      // image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
  
      // Changement de couleur du cadre au hover
      easing.dampC(frame.current.material.color, hovered ? '#FFCF00' : 'white', 0.1, dt)
    })
  
    return (
      <group 
        ref={ref} 
        position={position} 
        rotation={rotation}
        onPointerOver={() => setHoveredObject && setHoveredObject(index)} // ✅ Vérifie que `setHoveredObject` existe
        onPointerOut={() => setHoveredObject && setHoveredObject(null)}
        onClick={() => {
          if (isSelected) {
            // Si la frame est déjà sélectionnée, on redirige vers son lien en target="_blank"
            window.open(props.link, '_blank');
          } else {
            // Sinon, on la sélectionne pour lancer l'animation
            onSelect();
          }
        }}
      >
        <mesh
          onPointerOver={(e) => (e.stopPropagation(), hover(true))}
          onPointerOut={() => hover(false)}
          scale={[1, GOLDENRATIO, 0.05]}
          position={[0, 0.9, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial color="#292929"  />
  
          <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
            <boxGeometry />
            <meshBasicMaterial toneMapped={false} fog={false} />
          </mesh>
          <mesh position={[0, 0, 0.7]}>
            <planeGeometry args={[0.8, 0.87]} /> {/* Respecte le ratio 380x235 */}
            <meshBasicMaterial map={texture} fog={false}  />
          </mesh>
  
        </mesh>
        <Text 
         maxWidth={0.5}
          anchorX="left"
           anchorY="top" 
           position={[0.55, 0.2, 0.2]} 
           fontSize={0.05} 
           color={isSelected ? "#FFCF00" : isHovered ? "#FFCF00" : "white"}
           toneMapped={false}    
           onPointerOver={(e) => e.stopPropagation()} 
            onPointerOut={(e) => e.stopPropagation()}    
            fog={false}   
           >
          {props.name}
        </Text>
      </group>
    )
  }
