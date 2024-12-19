<!-- 灯光与阴影 -->
<!-- 
  1. 材质要满足能够对光照有反应
  2. 设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true;
  3. 设置光照投射阴影 light.castShadow = true;
  4. 设置物体投射阴影 mesh.castShadow = true;
  5. 设置物体接收阴影 mesh.receiveShadow = true;
-->

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
  // 设置渲染器开启阴影计算
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
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

  // 创建平面
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshStandardMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateX(-Math.PI / 2);
  // 接收阴影
  plane.receiveShadow = true;
  scene.add(plane);

  // 创建一个球
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const sphereMaterial = new THREE.MeshStandardMaterial();
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0, 1, 0);
  // 投射阴影
  sphere.castShadow = true;
  scene.add(sphere);

  // 灯光
  // 环境光
  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  // scene.add(ambientLight);

  // 平行光
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  // directionalLight.position.set(10, 10, 10);
  // // 投射阴影
  // directionalLight.castShadow = true;
  // // 设置阴影贴图的模糊程度
  // directionalLight.shadow.radius = 20;
  // // 设置阴影贴图的分辨率
  // directionalLight.shadow.mapSize.set(4096, 4096);
  // // 设置平行光投射相机的属性
  // directionalLight.shadow.camera.near = 0.5;
  // directionalLight.shadow.camera.far = 20;
  // directionalLight.shadow.camera.top = 5;
  // directionalLight.shadow.camera.bottom = -5;
  // directionalLight.shadow.camera.left = -5;
  // directionalLight.shadow.camera.right = 5;
  // scene.add(directionalLight);

  // 聚光灯
  // const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  // spotLight.position.set(5, 5, 5);
  // spotLight.shadow.radius = 20;
  // spotLight.shadow.mapSize.set(4096, 4096);
  // // 投射阴影
  // spotLight.castShadow = true;
  // scene.add(spotLight);

  // 点光源
  // const pointLight = new THREE.PointLight(0xffffff, 0.5);
  // pointLight.position.set(5, 5, 5);
  // pointLight.distance = 20;
  // pointLight.decay = 0;
  // // 投射阴影
  // pointLight.castShadow = true;
  // scene.add(pointLight);

  // 小球绑定点光源
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.castShadow = true;
  const smallBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  )
  smallBall.position.set(2, 2, 2);
  smallBall.add(pointLight);
  scene.add(smallBall);
  
  const clock = new THREE.Clock();
  // 渲染场景和相机
  function render() {
    // 获取时钟运行的总时长
    const time = clock.getElapsedTime();
    // 让小球围绕着Y轴旋转
    smallBall.position.x = Math.sin(time) * 2;
    smallBall.position.z = Math.cos(time) * 2;
    // 更新轨道控制器
    controls.update();
    // 渲染场景和相机
    renderer.render(scene, camera);
    // 循环渲染
    requestAnimationFrame(render);
  }
  // 开始渲染
  render();

  // function onChange() {
  //   directionalLight.shadow.camera.updateProjectionMatrix();
  // }

  const gui = new GUI();
  // const directionalLightGUI = gui.addFolder('平行光属性');
  // directionalLightGUI.add(directionalLight.shadow.camera, 'near', 0, 20, 0.01).onChange(onChange);
  // directionalLightGUI.add(directionalLight.shadow.camera, 'far', 0, 20, 0.01).onChange(onChange);
  // directionalLightGUI.add(directionalLight.shadow.camera, 'top', -10, 10, 0.01).onChange(onChange);
  // directionalLightGUI.add(directionalLight.shadow.camera, 'bottom', -10, 10, 0.01).onChange(onChange);
  // directionalLightGUI.add(directionalLight.shadow.camera, 'left', -10, 10, 0.01).onChange(onChange);
  // directionalLightGUI.add(directionalLight.shadow.camera, 'right', -10, 10, 0.01).onChange(onChange);
  // gui.add(pointLight, 'distance', 0, 20, 0.01);
  // gui.add(pointLight, 'decay', 0, 2, 0.01);
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
