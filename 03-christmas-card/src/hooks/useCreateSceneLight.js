import * as THREE from 'three';

export function useCreateSceneLight(scene) {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 50, 0);
  scene.add(directionalLight);
}