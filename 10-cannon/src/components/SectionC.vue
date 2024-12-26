<!-- 碰撞组、碰撞事件 -->

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
plane.rotateX(-Math.PI / 2);
scene.add(plane);

const planeBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
  material: new CANNON.Material('planeMaterial'),
  position: new CANNON.Vec3(0, 0, 0),
});
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
planeBody.material!.friction = 0;
planeBody.material!.restitution = 0;
world.addBody(planeBody);

// 创建立方体
const meshBoxes: THREE.Mesh[] = [];
const phyBoxes: CANNON.Body[] = [];

function createBox() {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
  );
  const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    material: new CANNON.Material(),
  });
  boxBody.material!.friction = 0;
  return {
    box,
    boxBody,
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
box1Body.position.set(-2, 0.6, 0);
// 设置初始速度
box1Body.velocity.set(2, 0, 0);
addBox(box1, box1Body);

const { box: box2, boxBody: box2Body } = createBox();
box2.material.color.set(0x00f0a0);
box2Body.position.set(0, 0.6, 0);
addBox(box2, box2Body);

const { box: box3, boxBody: box3Body } = createBox();
box3.material.color.set(0xf0f000);
box3Body.position.set(2, 0.6, 0);
addBox(box3, box3Body);

// 设置碰撞组
const GROUP1 = 1;
const GROUP2 = 2;
const GROUP3 = 4;
const GROUP4 = 8;
planeBody.collisionFilterGroup = GROUP1;
box1Body.collisionFilterGroup = GROUP2;
box2Body.collisionFilterGroup = GROUP3;
box3Body.collisionFilterGroup = GROUP4;
planeBody.collisionFilterMask = GROUP2 | GROUP3 | GROUP4;
box1Body.collisionFilterMask = GROUP1 | GROUP4;

defineRenderCallback(() => {
  updateBox();
});

// 碰撞事件
box1Body.addEventListener('collide', (event) => {
  console.log('box1 collide', event);
});
</script>

<template>
  <ThreeJSDom />
</template>

<style scoped>
</style>