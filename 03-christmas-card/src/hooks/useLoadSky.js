import * as THREE from 'three';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export function useLoadSky(scene) {
  new RGBELoader().load('./textures/sky.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });
}