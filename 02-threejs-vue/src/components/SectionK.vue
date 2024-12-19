<!-- 包围盒 -->

<script setup>
// 导入 three.js
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 导入lil-gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 导入GLTFLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 导入RGBELoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const threejsContainer = ref(null);
// 渲染器
let renderer;
// 相机
let camera;

const { width, height } = useElementSize(threejsContainer);
watch(() => [width.value, height.value], () => {
  // 更新相机的宽高比
  camera.aspect = width.value / height.value;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器的大小
  renderer.setSize(width.value, height.value);
});

onMounted(() => {
  // 创建场景
  const scene = new THREE.Scene();

  // 创建渲染器
  renderer = new THREE.WebGLRenderer();
  // 设置渲染器的大小
  renderer.setSize(width.value, height.value);
  // 将渲染器添加到文档中
  threejsContainer.value.appendChild(renderer.domElement);

  // 添加坐标轴
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    // 视角角度
    45,
    // 宽高比
    width.value / height.value,
    // 近平面（相机最近能看到的距离）
    0.1,
    // 远平面（相机最远能看到的距离）
    1000
  );
  // 设置相机的位置
  camera.position.set(5, 5, 15);
  camera.lookAt(0, 0, 0);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);

  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (texture) => {
    // 设置贴图的映射方式
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // 设置场景的背景贴图
    scene.background = texture;
    // 设置场景的环境贴图
    scene.environment = texture;
  })

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('./model/Duck.glb', (gltf) => {
    scene.add(gltf.scene);

    const duckMesh = gltf.scene.getObjectByName('LOD3spShape');
    // 获取几何体
    const duckGeometry = duckMesh.geometry;

    // 设置几何体居中
    // duckGeometry.center();

    // 计算几何体的包围盒
    duckGeometry.computeBoundingBox();
    // 获取几何体的包围盒
    const duckBoundingBox = duckGeometry.boundingBox;
    // 更新世界矩阵
    duckMesh.updateWorldMatrix(true, true);
    // 更新包围盒
    duckBoundingBox.applyMatrix4(duckMesh.matrixWorld);
    // 创建包围盒辅助器
    const duckBoundingBoxHelper = new THREE.Box3Helper(duckBoundingBox, 0xffff00);
    // 添加包围盒辅助器到场景中
    scene.add(duckBoundingBoxHelper);
    // 获取包围盒的中心
    const duckBoundingBoxCenter = duckBoundingBox.getCenter(new THREE.Vector3());
    console.log(duckBoundingBoxCenter);
  })

  // 渲染场景和相机
  function render() {
    // 更新轨道控制器
    controls.update();
    // 渲染场景和相机
    renderer.render(scene, camera);
    // 循环渲染
    requestAnimationFrame(render);
  }
  // 开始渲染
  render();

  const gui = new GUI();
  onBeforeUnmount(() => {
    gui.destroy();
  })
});
</script>

<template>
  <div ref="threejsContainer">
  </div>
</template>

<style scoped>
</style>
