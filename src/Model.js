import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export const Model = React.forwardRef(({ url, position, rotation, scale, visible }, ref) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.visible = visible;
    }
  }, [visible]);

  return (
    <primitive
      ref={(el) => {
        modelRef.current = el;
        if (ref) {
          ref.current = el;
        }
      }}
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
});
