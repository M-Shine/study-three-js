<!-- 材质与摩擦系数 -->

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
  gravity: new CANNON.Vec3(0, -9.8, 0),
});

// 创建平面
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);
plane.rotateX(-Math.PI / 2 + 0.1);
scene.add(plane);

const planeBodyMaterial = new CANNON.Material('planeMaterial');
// 设置摩擦系数
planeBodyMaterial.friction = 0.7;
// 设置弹性系数
planeBodyMaterial.restitution = 1;
const planeBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(5, 0.1, 5)),
  material: planeBodyMaterial,
  position: new CANNON.Vec3(0, 0, 0),
});
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1);
world.addBody(planeBody);

// 创建立方体
const meshBoxes: THREE.Mesh[] = [];
const phyBoxes: CANNON.Body[] = [];

function createBox() {
  return {
    box: new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial()
    ),
    boxBody: new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
      material: new CANNON.Material(),
    })
  };
}
function addBox(box, boxBody) {
  scene.add(box);
  meshBoxes.push(box);
  world.addBody(boxBody);
  phyBoxes.push(boxBody);
}
const updateBox = (() => {
  const clock = new THREE.Clock();
  return () => {
    const delta = clock.getDelta();
    world.step(delta);
    for (let i = 0; i < phyBoxes.length; i++) {
      meshBoxes[i].position.copy(phyBoxes[i].position);
      meshBoxes[i].quaternion.copy(phyBoxes[i].quaternion);
    }
  }
})()

const { box: box1, boxBody: box1Body } = createBox();
box1.material.color.set(0x00a0f0);
// 设置摩擦系数
box1Body.material!.friction = 0.7;
// 设置弹性系数
box1Body.material!.restitution = 0;
box1Body.position.set(0, 5, 0);
addBox(box1, box1Body);

const { box: box2, boxBody: box2Body } = createBox();
box2.material.color.set(0x00f0a0);
// 设置摩擦系数
box2Body.material!.friction = 0;
// 设置弹性系数
box2Body.material!.restitution = 0.5;
box2Body.position.set(2, 5, 0);
addBox(box2, box2Body);

const { box: box3, boxBody: box3Body } = createBox();
box3.material.color.set(0xf0f000);
// // 设置摩擦系数
// box3Body.material!.friction = 0;
// // 设置弹性系数
// box3Body.material!.restitution = 1;
box3Body.position.set(-2, 5, 0);
addBox(box3, box3Body);

// 材质与材质之间的碰撞
const contactMaterial = new CANNON.ContactMaterial(
  planeBodyMaterial,
  box3Body.material!,
  {
    friction: 0,
    restitution: 1,
  }
);
world.addContactMaterial(contactMaterial);

defineRenderCallback(() => {
  updateBox();
});
</script>

<template>
  <ThreeJSDom />
</template>

<style scoped>
</style>