import * as THREE from 'three';
export function useCreateHouseLight(scene) {
  const pointLight = new THREE.PointLight(0xffffff, 50);
  pointLight.position.set(0.5, 2.3, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);
}
