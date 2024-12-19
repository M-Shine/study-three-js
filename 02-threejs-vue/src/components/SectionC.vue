<!-- 自定义坐标点 -->

<script setup>
// 导入 three.js
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

  // 创建一个三角形
  const geometry = new THREE.BufferGeometry();
  // 顶点数组
  const vertices = new Float32Array([
    0.0, 0.0, 0.0,
    2.0, 0.0, 2.0,
    0.0, 2.0, 0.0,
    2.0, 2.0, 2.0,
  ]);
  // 设置顶点数组
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  // 使用索引可以共用顶点
  // 创建索引数组
  const indices = new Uint16Array([
    0, 1, 2,
    1, 2, 3
  ]);
  // 设置索引数组
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  console.log(geometry);
  // 设置顶点组，分别使用两个材质
  geometry.addGroup(0, 3, 0);
  geometry.addGroup(3, 3, 1);

  // 创建一个网格材质
  const material1 = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    wireframe: false
  });
  const material2 = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
    wireframe: false
  });
  // 创建一个网格
  const cube = new THREE.Mesh(geometry, [material1, material2]);

  // 将网格添加到场景中
  scene.add(cube);

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
});
</script>

<template>
  <div ref="threejsContainer">
  </div>
</template>

<style scoped>
</style>
