<script setup>
import * as THREE from 'three';
import gsap from 'gsap';
import { useThreeJS } from '@/hooks';

const {
  ThreeJSDom,
  containerRef,
  containerWidth,
  containerHeight,
  scene,
  camera,
  controls,
} = useThreeJS();

// 添加场景
// 客厅
// 天空盒实现方式
// const livingRoomMaterial = [];
// const livingRoomImgNames = ['left', 'right', 'top', 'bottom', 'front', 'back'];
// livingRoomImgNames.forEach(imgName => {
//   const texture = new THREE.TextureLoader().load(`./images/${imgName}.png`);
//   livingRoomMaterial.push(new THREE.MeshBasicMaterial({ map: texture }));
// });
// const livingRoom = new THREE.Mesh(
//   new THREE.BoxGeometry(10, 10, 10),
//   livingRoomMaterial
// );
// livingRoom.geometry.scale(1, 1, -1);
// scene.add(livingRoom);
// 球型贴图
const livingRoomTexture = new THREE.TextureLoader().load('./images/livingRoom.jpg');
const livingRoom = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshBasicMaterial({ map: livingRoomTexture })
)
livingRoom.geometry.scale(1, 1, -1);
scene.add(livingRoom);
// 厨房
const kitchenTexture = new THREE.TextureLoader().load('./images/kitchen.jpg');
const kitchen = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshBasicMaterial({ map: kitchenTexture })
)
kitchen.geometry.scale(1, 1, -1);
kitchen.position.set(-20, 0, 0);
scene.add(kitchen);

// 通过射线判断鼠标与物体是否有碰撞
const raycaster = new THREE.Raycaster();
function getIntersects(event, objs) {
  // 计算鼠标位置
  const x = (event.clientX / containerWidth.value) * 2 - 1;
  const y = -(event.clientY / containerHeight.value) * 2 + 1;
  // 通过鼠标位置和相机矩阵计算射线
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  // 计算射线和tips的碰撞
  return raycaster.intersectObjects(objs);
}

// 添加tips
const tipRef = ref();
const showTip = ref(false);
const rooms = {
  livingRoom: 'livingRoom',
  kitchen: 'kitchen',
}
const currentRoom = ref(rooms.livingRoom);
let currentTips = [];

function addTips(tipsData) {
  tipsData.forEach(tipData => {
    const tipTexture = new THREE.TextureLoader().load('./images/tip.png');
    const tipMaterial = new THREE.SpriteMaterial({ map: tipTexture });
    const tip = new THREE.Sprite(tipMaterial);
    tip.name = 'tip';
    tip.customContent = tipData;
    const { x, y, z } = tipData.position;
    tip.position.set(x, y, z);
    tip.scale.set(0.25, 0.25, 0.25);
    scene.add(tip);
    currentTips.push(tip);
  });
}

function removeAllTips() {
  const tips = scene.children.filter(child => child.name === 'tip');
  scene.remove(...scene.children.filter(child => child.name === 'tip'));
  currentTips = [];
}

function moveScene(x, y, z) {
  gsap.to(controls.target, {
    x: x,
    y: y,
    z: z,
    duration: 0.5,
  });
  gsap.to(camera.position, {
    x: x,
    y: y,
    z: z + 0.1,
    duration: 0.5,
  });
}

const tipsData = [
  {
    title: '进入厨房',
    roomName: rooms.livingRoom,
    position: { x: -5, y: 0, z: -0.25 },
    toRoomName: rooms.kitchen,
    toPosition: { x: -20, y: 0, z: 0 },
  },
  {
    title: '进入客厅',
    roomName: 'kitchen',
    position: { x: -24.5, y: 0, z: 2 },
    toRoomName: rooms.livingRoom,
    toPosition: { x: 0, y: 0, z: 0 },
  },
];

watch(currentRoom, (newVal, oldVal) => {
  showTip.value = false;
  removeAllTips();
  const position = tipsData.find(tipData => tipData.roomName === oldVal)?.toPosition;
  position && moveScene(position.x, position.y, position.z);
  const willAddTips = tipsData.filter(tipData => tipData.roomName === newVal);
  addTips(willAddTips);
}, {
  immediate: true,
});

const handleMouseMove = useThrottleFn(event => {
  const intersects = getIntersects(event, currentTips);
  // 如果有碰撞
  if (intersects.length > 0) {
    // 获取碰撞的对象
    const tip = intersects[0].object;
    tipRef.value.style.top = `${event.clientY + 15}px`;
    tipRef.value.style.left = `${event.clientX}px`;
    tipRef.value.innerHTML = tip.customContent.title;
    showTip.value = true;
  } else {
    showTip.value = false;
  }
}, 500);
useEventListener(containerRef, 'mousemove', handleMouseMove);

const handleClick = useThrottleFn(event => {
  const intersects = getIntersects(event, currentTips);
  // 如果有碰撞
  if (intersects.length > 0) {
    // 获取碰撞的对象
    const tip = intersects[0].object;
    // action
    currentRoom.value = tip.customContent.toRoomName;
  }
});
useEventListener(containerRef,'click', handleClick);
</script>

<template>
  <div class="root">
    <ThreeJSDom />
    <div ref="tipRef" class="tip" v-show="showTip"></div>
  </div>
</template>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;

  .tip {
    position: absolute;
    top: 0;
    left: 0;
    color: #000;
    user-select: none;
  }
}
</style>
