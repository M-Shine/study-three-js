<script setup>
import Page from '@/components/Page.vue';
import { useThreeJS } from '@/hooks';
import * as THREE from 'three';
import gsap from 'gsap';

const rootRef = ref(null);

const pages = [
  {
    title: '这是标题一',
    desc: '这是描述',
    modelUrl: './models/战机16.gltf',
    position: { x: 2, y: 0, z: -2 },
    scale: { x: 0.35, y: 0.35, z: 0.35 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    title: '这是标题二',
    desc: '这是描述',
    modelUrl: './models/直升机3.gltf',
    position: { x: 2, y: 0, z: -2 },
    scale: { x: 0.55, y: 0.55, z: 0.55 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
  },
  {
    title: '这是标题三',
    desc: '这是描述',
    modelUrl: './models/波音_727.gltf',
    position: { x: 2, y: 0, z: -2 },
    scale: { x: 0.2, y: 0.2, z: 0.2 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
  },
];
let pageDoms = [];
let pageIndex = 0;
onMounted(() => {
  pageDoms = rootRef.value.querySelectorAll('.page');
});
const handleWheel = useThrottleFn((event) => {
  const delta = event.deltaY;
  if (delta > 0) {
    // 向上滚动
    pageIndex = Math.min(pageIndex + 1, pageDoms.length - 1);
  } else {
    // 向下滚动
    pageIndex = Math.max(pageIndex - 1, 0);
  }
  pageDoms[pageIndex].scrollIntoView({
    behavior: 'smooth',
  });
}, 1000);
useEventListener(rootRef, 'wheel', handleWheel);

const {
  ThreeJSDom,
  scene,
} = useThreeJS();

scene.background = new THREE.Color(0x000000);

for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    const count = 100;
    const instance = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
      count
    );
    for (let j = 0; j < count; j++) {
      const x = Math.random() * 1000;
      const y = Math.random() * 1000;
      const z = Math.random() * 1000;
      instance.setMatrixAt(j, new THREE.Matrix4().makeTranslation(x, y, z));
    }
    gsap.to(instance.position, {
      x: -1000,
      y: -1000,
      z: -1000,
      duration: 10,
      ease: 'linear',
      repeat: -1,
    })
    scene.add(instance);
  }, i * 1000);
}
</script>

<template>
  <div class="root" ref="rootRef">
    <Page
      v-for="(item, index) in pages"
      :key="index"
      :title="item.title"
      :desc="item.desc"
      :modelUrl="item.modelUrl"
      :position="item.position"
      :scale="item.scale"
      :rotation="item.rotation"
    ></Page>
    <ThreeJSDom class="stars" />
  </div>
</template>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;

  .stars {
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
