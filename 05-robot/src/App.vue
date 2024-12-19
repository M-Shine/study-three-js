<script setup>
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { useThreeJS } from '@/hooks';

const { ThreeJSDom, scene, containerWidth, containerHeight } = useThreeJS();

// 加载球形机器人模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
const gltf = gltfLoader.load('./model/robot.glb', (gltf) => {
  scene.add(gltf.scene);
});

// 添加灯光
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(0, 10, 10);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(0, 10, -10);
const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(10, 10, 10);
scene.add(light1, light2, light3);

// 加载环境贴图
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./texture/sky12.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});

// 添加视频纹理
const video = document.createElement('video');
video.src = './texture/zp2.mp4';
video.loop = true;
video.muted = true;
video.play();
const videoTexture = new THREE.VideoTexture(video);
const videoMaterial = new THREE.MeshBasicMaterial({
  map: videoTexture,
  side: THREE.DoubleSide,
  transparent: true,
  alphaMap: videoTexture,
});
const videoGeometry = new THREE.PlaneGeometry(8, 4.5);
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
videoMesh.position.set(0, 0.2, 0);
videoMesh.rotation.x = -Math.PI / 2;
scene.add(videoMesh);

// 添加镜面反射
const reflectorGeometry = new THREE.PlaneGeometry(100, 100);
const reflectorPlane = new Reflector(reflectorGeometry, {
  color: 0x666666,
  textureWidth: containerWidth.value,
  textureHeight: containerHeight.value,
});
reflectorPlane.rotation.x = -Math.PI / 2;
scene.add(reflectorPlane);
</script>
<template>
  <div class="root">
    <ThreeJSDom />
  </div>
</template>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
