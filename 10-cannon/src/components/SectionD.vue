<!-- 物体组合 -->

<script setup lang="ts">
import { useThreeJS } from '@/hooks';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const { ThreeJSDom, scene, defineRenderCallback } = useThreeJS();

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.8, 0),
});

/**
 * 创建地面
 */
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide })
);
plane.rotateX(-Math.PI / 2);
scene.add(plane);

const planeBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
  material: new CANNON.Material('plane'),
});
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

/**
 * 创建物体
 */
// 创建一个球
const topSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00a0f0 })
);
topSphere.position.set(0, 1, 0);
const bottomSphere = topSphere.clone();
bottomSphere.position.set(0, -1, 0);
// 创建一个圆柱 
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 2, 32),
  new THREE.MeshBasicMaterial({ color: 0x00f0a0 })
);
cylinder.add(topSphere, bottomSphere);
scene.add(cylinder);

const capsuleBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 2, 0),
  material: new CANNON.Material('capsule'),
});
const topShape = new CANNON.Sphere(1);
const bottomShape = new CANNON.Sphere(1);
const cylinderShape = new CANNON.Cylinder(1, 1, 2, 32);
capsuleBody.addShape(topShape, new CANNON.Vec3(0, 1, 0));
capsuleBody.addShape(bottomShape, new CANNON.Vec3(0, -1, 0));
capsuleBody.addShape(cylinderShape, new CANNON.Vec3(0, 0, 0));
capsuleBody.velocity.set(5, 0, 5);
// world.addBody(capsuleBody);

setTimeout(() => {
  world.addBody(capsuleBody);
}, 2000);

const clock = new THREE.Clock();
defineRenderCallback(() => {
  const delta = clock.getDelta();
  world.step(delta);
  cylinder.position.copy(capsuleBody.position);
  cylinder.quaternion.copy(capsuleBody.quaternion);
});
</script>

<template>
  <ThreeJSDom />
</template>

<style scoped>
</style>