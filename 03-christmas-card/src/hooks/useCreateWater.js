import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water2';

export function useCreateWater(scene) {
  const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
  const water = new Water(
    waterGeometry,
    {
      color: 0xeeeeff,
      scale: 100,
      flowDirection: new THREE.Vector2(1, 1),
      textureWidth: 1024,
      textureHeight: 1024,
    }
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.4;
  scene.add(water);
}