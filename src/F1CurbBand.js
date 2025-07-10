import React, { useMemo } from "react";
import * as THREE from "three";

function createF1CurbTexture({ width = 64, height = 4, colors = ["#1b2fcf", "#ffffff", "#e40019"] }) {
  // width : résolution horizontale (stretch après sur le mesh)
  // height : très fin (1 seule ligne)
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Nombre de cases : 12 (modifiable)
  const blocks = 12;
  for (let i = 0; i < blocks; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(i * (width / blocks), 0, width / blocks, height);
  }

  return new THREE.CanvasTexture(canvas);
}

export function F1CurbBand({ position, colorSet = ["#1b2fcf", "#ffffff", "#e40019"] }) {
  // Crée la texture damier bleu/blanc/rouge
  const texture = useMemo(() => createF1CurbTexture({ colors: colorSet }), [colorSet]);
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = 1; // On peut jouer sur ce param pour allonger/répéter

  return (
    <mesh scale={3} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 0.30]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
