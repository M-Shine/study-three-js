<script setup>
import { useThreeJS } from '@/hooks';
import * as THREE from 'three';
import { Tween, Easing, update as tweenUpdate } from 'three/examples/jsm/libs/tween.module.js';

const {
  ThreeJSDom,
  scene,
  defineRenderCallback,
} = useThreeJS();

const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
box1.position.set(-2, 0, 0);
scene.add(box1);

const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
box2.position.set(2, 0, 0);
scene.add(box2);

// 绘制抛物线
const curve = new THREE.QuadraticBezierCurve3(
  // 起点
  new THREE.Vector3(-2, 0.5, 0),
  // 控制点
  new THREE.Vector3(0, 2.5, 0),
  // 终点
  new THREE.Vector3(2, 0.5, 0)
);
// 绘制路径
const points = curve.getPoints(50);
// 线条
const curveLine = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints(points),
  new THREE.LineBasicMaterial({ color: 0xff0000 })
);
scene.add(curveLine);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
scene.add(sphere);
// 设置小球飞行动画
const tween = new Tween({ t: 0 })
  .to({ t: 1 }, 2000)
  .easing(Easing.Quadratic.InOut)
  .onUpdate(({ t }) => {
    const point = curve.getPoint(t);
    sphere.position.copy(point);
  })
  .repeat(Infinity)
  .repeatDelay(500)
  .start();

defineRenderCallback(() => {
  tweenUpdate();
});
</script>

<template>
  <div class="root">
    <ThreeJSDom />
  </div>
</template>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}
</style>
