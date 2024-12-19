<!-- 创建场景雾 -->

<script setup>
// 导入 three.js
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

  const boxGeometry = new THREE.BoxGeometry(1, 1, 100);
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(box);

  // 创建场景雾
  // scene.fog = new THREE.Fog(0x999999, 0.1, 50);
  // 创建场景指数雾
  scene.fog = new THREE.FogExp2(0x999999, 0.1);
  // 设置背景颜色
  scene.background = new THREE.Color(0x999999);

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
