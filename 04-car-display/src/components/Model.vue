<script setup lang="ts">
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThreeJS, useGlobalState } from '@/hooks';
import { watch } from 'vue';

const { ThreeJSDom, scene } = useThreeJS();

const {
  bodyColor,
  faceColor,
  hoodColor,
  wheelColor,
  bodyMaterialType,
  glassMaterialType,
} = useGlobalState();

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: bodyColor.value,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
const faceMaterial = new THREE.MeshPhysicalMaterial({
  color: faceColor.value,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
const hoodMaterial = new THREE.MeshPhysicalMaterial({
  color: hoodColor.value,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
const wheelMaterial = new THREE.MeshPhysicalMaterial({
  color: wheelColor.value,
  metalness: 1,
  roughness: 0.1,
});
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  transparent: true,
});

function updateColor(material, color) {
  material && material.color.set(color);
}
watch(bodyColor, () => {
  updateColor(bodyMaterial, bodyColor.value);
});
watch(faceColor, () => {
  updateColor(faceMaterial, faceColor.value);
});
watch(hoodColor, () => {
  updateColor(hoodMaterial, hoodColor.value);
});
watch(wheelColor, () => {
  updateColor(wheelMaterial, wheelColor.value);
});

function updateBodyMaterialType() {
  bodyMaterial.clearcoatRoughness = bodyMaterialType.value;
  faceMaterial.clearcoatRoughness = bodyMaterialType.value;
  hoodMaterial.clearcoatRoughness = bodyMaterialType.value;
}
watch(bodyMaterialType, updateBodyMaterialType);

function updateGlassMaterialType() {
  glassMaterial.transmission = glassMaterialType.value;
}
watch(glassMaterialType, updateGlassMaterialType);

// 加载汽车模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('./model/bmw01.glb', (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  scene.add(gltf.scene);

  // 获取各个部件对象
  const body = gltf.scene.getObjectByName('Mesh002');
  body!.material = bodyMaterial;
  const face = gltf.scene.getObjectByName('前脸');
  face!.material = faceMaterial;
  const hood = gltf.scene.getObjectByName('引擎盖_1');
  hood!.material = hoodMaterial;
  const glass = gltf.scene.getObjectByName('挡风玻璃');
  glass!.material = glassMaterial;
  [
    gltf.scene.getObjectByName('前轮毂'),
    gltf.scene.getObjectByName('左后轮毂'),
    gltf.scene.getObjectByName('右后轮毂'),
  ].forEach((wheel) => {
    wheel!.traverse((child) => {
      child.isMesh && (child.material = wheelMaterial);
    });
  });

  // 初始化
  updateColor(bodyMaterial, bodyColor.value);
  updateColor(faceMaterial, faceColor.value);
  updateColor(hoodMaterial, hoodColor.value);
  updateColor(wheelMaterial, wheelColor.value);
  updateBodyMaterialType();
  updateGlassMaterialType();
});

// 添加平行光
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(0, 0, 10);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(0, 0, -10);
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight3.position.set(10, 0, 0);
const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight4.position.set(-10, 0, 0);
const directionalLight5 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight5.position.set(0, 10, 0);
const directionalLight6 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight6.position.set(5, 10, 0);
const directionalLight7 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight7.position.set(-5, 10, 0);
const directionalLight8 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight8.position.set(0, 10, 5);
const directionalLight9 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight9.position.set(0, 10, -5);
scene.add(
  directionalLight1,
  directionalLight2,
  directionalLight3,
  directionalLight4,
  directionalLight5,
  directionalLight6,
  directionalLight7,
  directionalLight8,
  directionalLight9,
);
</script>

<template>
  <ThreeJSDom />
</template>

<style scoped>
</style>
