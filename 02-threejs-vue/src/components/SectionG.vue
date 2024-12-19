<!-- 光线投射实现3D场景交互 -->

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
  camera.position.set(5, 5, 15);
  camera.lookAt(0, 0, 0);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);

  // 创建三个球
  const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  sphere1.position.set(-4, 0, 0);
  scene.add(sphere1);

  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );
  scene.add(sphere2);

  const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
  );
  sphere3.position.set(4, 0, 0);
  scene.add(sphere3);

  // 创建射线
  const raycaster = new THREE.Raycaster();
  // 创建鼠标向量
  const mouse = new THREE.Vector2();
  // 监听点击事件
  useEventListener(threejsContainer, 'click', (event) => {
    // 计算鼠标位置
    mouse.x = (event.clientX / width.value) * 2 - 1;
    mouse.y = -(event.clientY / height.value) * 2 + 1;
    // 通过鼠标位置和相机矩阵计算射线
    raycaster.setFromCamera(mouse, camera);
    // 计算射线和球的碰撞
    const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
    // 如果有碰撞
    if (intersects.length > 0) {
      // 获取碰撞的对象
      const object = intersects[0].object;
      object.material._otherColor = object.material._otherColor || new THREE.Color(0xff0000);
      const temp = object.material.color;
      object.material.color = object.material._otherColor;
      object.material._otherColor = temp;
    }
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
