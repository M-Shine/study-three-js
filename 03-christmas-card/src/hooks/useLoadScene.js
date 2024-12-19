import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export function useLoadScene(scene) {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/');
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load('./model/scene.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      // 隐藏模型自带的平面
      if (child.name === 'Plane') {
        child.visible = false;
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);
  });
}
