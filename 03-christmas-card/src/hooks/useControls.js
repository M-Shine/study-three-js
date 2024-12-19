import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function useControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.target.set(-8,2,0);

  return {
    controls,
  }
}