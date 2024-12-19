// 导入 three.js
import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  // 视角角度
  45,
  // 宽高比
  window.innerWidth / window.innerHeight,
  // 近平面（相机最近能看到的距离）
  0.1,
  // 远平面（相机最远能看到的距离）
  1000
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染器的大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染器添加到文档中
document.body.appendChild(renderer.domElement);

// 创建一个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 创建网格
const cube = new THREE.Mesh(geometry, material);

// 将网格添加到场景中
scene.add(cube);

// 设置相机的位置
camera.position.z = 5;
camera.lookAt(0, 0, 0);

// 渲染场景和相机
function render() {
  // 旋转立方体
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // 渲染场景和相机
  renderer.render(scene, camera);
  // 循环渲染
  requestAnimationFrame(render);
}
// 开始渲染
render();