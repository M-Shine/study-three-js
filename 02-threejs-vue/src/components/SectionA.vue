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

  // 创建一个立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 创建材质
  const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // 材质设置为线框
  parentMaterial.wireframe = true;
  material.wireframe = true;
  // 创建网格
  const parentCube = new THREE.Mesh(geometry, parentMaterial);
  const cube = new THREE.Mesh(geometry, material);
  parentCube.add(cube);
  // 设置立方体的位置、缩放、旋转
  parentCube.position.set(-2, 0, 0);
  cube.position.set(2, 0, 0);
  cube.scale.set(1.5, 1.5, 1.5);
  // TIPS：第4个参数为旋转的顺序，默认为XYZ，字母需大写，顺序不同，旋转的效果也不同
  cube.rotation.set(Math.PI / 4, Math.PI / 4, Math.PI / 4, 'XYZ');

  // 将网格添加到场景中
  scene.add(parentCube);

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
  camera.position.x = 5;
  camera.position.y = 5;
  camera.position.z = 5;
  camera.lookAt(0, 0, 0);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
  // 设置阻尼系数
  controls.dampingFactor = 0.05;
  // 设置自动旋转
  controls.autoRotate = true;

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

  // 创建lil-gui
  const gui = new GUI();
  const { enter: enterFullscreen, exit: exitFullscreen } = useFullscreen(threejsContainer);
  gui.add({ Fullscreent: enterFullscreen }, 'Fullscreent').name('全屏');
  gui.add({ ExitFullscreen: exitFullscreen }, 'ExitFullscreen').name('退出全屏');
  gui.add(controls, 'autoRotate').name('自动旋转');
  const guiMaterialFolder = gui.addFolder('Material 材质参数');
  guiMaterialFolder.add(parentMaterial, 'wireframe').name('红色立方体 线框');
  guiMaterialFolder.add(material, 'wireframe').name('绿色立方体 线框');
  const guiPositionFolder = gui.addFolder('Position 位置参数');
  guiPositionFolder.add(parentCube.position, 'x').min(-5).max(5).step(0.1).name('红色立方体 x 轴');
  guiPositionFolder.add(parentCube.position, 'y').min(-5).max(5).step(0.1).name('红色立方体 y 轴');
  guiPositionFolder.add(parentCube.position, 'z').min(-5).max(5).step(0.1).name('红色立方体 z 轴');
  guiPositionFolder.add(cube.position, 'x').min(-5).max(5).step(0.1).name('绿色立方体 x 轴');
  guiPositionFolder.add(cube.position, 'y').min(-5).max(5).step(0.1).name('绿色立方体 y 轴');
  guiPositionFolder.add(cube.position, 'z').min(-5).max(5).step(0.1).name('绿色立方体 z 轴');
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
