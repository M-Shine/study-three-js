<!-- 边缘几何体与线框几何体 -->

<script setup>
// 导入 three.js
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 导入lil-gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 导入RGBELoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// 导入GLTFLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

  new RGBELoader()
    .load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

  new GLTFLoader()
    .load('./model/Duck.glb', (gltf) => {
      scene.add(gltf.scene);

      const duckMesh = gltf.scene.getObjectByName('LOD3spShape');
      duckMesh.updateWorldMatrix(true, true);
      const duckGeometry = duckMesh.geometry;

      // 边缘几何体
      const edgesGeometry = new THREE.EdgesGeometry(duckGeometry);
      const edgesMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
      });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      edges.position.z = 2;
      edgesGeometry.applyMatrix4(duckMesh.matrixWorld);
      scene.add(edges);

      // 线框几何体
      const wireframeGeometry = new THREE.WireframeGeometry(duckGeometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff00,
      });
      const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      wireframe.position.x = 2;
      wireframeGeometry.applyMatrix4(duckMesh.matrixWorld);
      scene.add(wireframe);
    });
  
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
