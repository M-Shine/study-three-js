<!-- 基础碰撞 -->

<script setup lang="ts">
import { useThreeJS } from '@/hooks';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const {
  ThreeJSDom,
  scene,
  defineRenderCallback,
} = useThreeJS();

const world = new CANNON.World({
  // 重力加速度
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// 创建一个球体
const sphereRadius = 0.5;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(sphereRadius, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00a0f0 }),
);
scene.add(sphere);

// 创建一个球体物理体
const sphereBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Sphere(sphereRadius),
  position: new CANNON.Vec3(0, 5, 0),
});
world.addBody(sphereBody);

// 创建一个平面
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide }),
);
plane.rotation.x = -Math.PI / 2 + 0.1;
scene.add(plane);

// 创建一个平面物理体
// const planeBody = new CANNON.Body({
//   // mass: 0,
//   type: CANNON.Body.STATIC,
//   shape: new CANNON.Plane(),
//   position: new CANNON.Vec3(0, 0, 0),
// });
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
// world.addBody(planeBody);

const boxBody = new CANNON.Body({
  // mass: 1,
  type: CANNON.Body.DYNAMIC,
  shape: new CANNON.Box(new CANNON.Vec3(5, 1, 5)),
  position: new CANNON.Vec3(0, -1, 0),
});
boxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1);
world.addBody(boxBody);

const clock = new THREE.Clock();
defineRenderCallback(() => {
  // 获取时间差
  const delta = clock.getDelta();
  // 更新物理世界
  world.step(delta);
  // 将物理世界中的位置和旋转应用到球体
  sphere.position.copy(sphereBody.position);
  sphere.quaternion.copy(sphereBody.quaternion);
});
</script>

<template>
  <ThreeJSDom />
</template>

<style scoped>
</style>
