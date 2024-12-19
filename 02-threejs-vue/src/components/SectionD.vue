<!-- 物体的材质 -->

<script setup>
// 导入 three.js
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 导入HDR加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// 导入lil-gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

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
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);

  // 纹理加载器
  const textureLoader = new THREE.TextureLoader();
  
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    // 纹理贴图
    map: textureLoader.load('./texture/watercover/CityNewYork002_COL_VAR1_1K.png'),
    // 允许透明
    transparent: true,
    // 环境遮挡贴图
    aoMap: textureLoader.load('./texture/watercover/CityNewYork002_AO_1K.jpg'),
    // 环境遮挡强度（0-1）
    // aoMapIntensity: 1,
    // 透明度贴图
    // alphaMap: textureLoader.load('./texture/watercover/CityNewYork002_REFL_1K.jpg'),
    // 光照贴图
    // lightMap: textureLoader.load('./texture/colors.png'),
    // 光照贴图强度（0-1）
    // lightMapIntensity: 1,
    // 反射强度（0-1）
    // reflectivity: 1,
    // 高光贴图
    specularMap: textureLoader.load('./texture/watercover/CityNewYork002_GLOSS_1K.jpg'),
  });
  // 设置纹理贴图的颜色空间为sRGB
  planeMaterial.map.colorSpace = THREE.SRGBColorSpace;

  // HDR加载器
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
    // 设置球形贴图
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置场景的背景贴图
    scene.background = envMap;
    // 设置场景的环境贴图
    scene.environment = envMap;
    // 设置plane的环境贴图
    planeMaterial.envMap = envMap;
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  scene.add(plane);

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
  // gui.add(planeMaterial, 'aoMapIntensity').min(0).max(1).step(0.1).name('环境遮挡贴图效果强度');
  // gui.add(planeMaterial, 'lightMapIntensity').min(0).max(1).step(0.1).name('光照贴图效果强度');
  gui.add(planeMaterial, 'reflectivity').min(0).max(1).step(0.1).name('反射强度');
  gui.add(planeMaterial.map, 'colorSpace').options({
    LinearSRGBColorSpace: THREE.LinearSRGBColorSpace,
    SRGBColorSpace: THREE.SRGBColorSpace,
  }).name('颜色空间').onChange(() => {
    // 注意：在修改颜色空间后，需要手动更新纹理贴图
    planeMaterial.map.needsUpdate = true;
  });
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
