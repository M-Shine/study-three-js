<script setup lang="ts">
import { useThreeJS } from '@/hooks';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  modelUrl: {
    type: String,
    default: '',
  },
  position: {
    type: Object,
    default: () => ({
      x: 0,
      y: 0,
      z: 0,
    }),
  },
  scale: {
    type: Object,
    default: () => ({
      x: 0.1,
      y: 0.1,
      z: 0.1,
    }),
  },
  rotation: {
    type: Object,
    default: () => ({
      x: 0,
      y: 0,
      z: 0,
    }),
  },
});

const {
  ThreeJSDom,
  scene,
  containerRef,
  containerWidth,
  containerHeight,
} = useThreeJS();

let model = null;
new GLTFLoader().load(props.modelUrl, (gltf) => {
  const { position, scale, rotation } = props;
  gltf.scene.position.set(position.x, position.y, position.z);
  gltf.scene.scale.set(scale.x, scale.y, scale.z);
  gltf.scene.rotation.set(rotation.x, rotation.y, rotation.z);
  scene.add(gltf.scene);
  model = gltf.scene;
});

useEventListener(containerRef, 'mousemove', (event) => {
  if (!model) {
    return;
  }
  const x = (event.clientX / containerWidth.value) * 2 - 1;
  const y = (event.clientY / containerHeight.value) * 2 + 1;
  const timeline = gsap.timeline();
  timeline.to(model.rotation, {
    // x: props.rotation.x + y,
    y: props.rotation.y + x,
    duration: 0.5,
  });
});

// 添加平行光
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(0, 10, 10);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(0, 10, -10);
scene.add(light1, light2);
</script>

<template>
  <div class="page">
    <div class="text">
      <h1 class="title">{{ props.title }}</h1>
      <div class="desc">{{ props.desc }}</div>
    </div>
    <ThreeJSDom class="three-js" />
  </div>
</template>

<style scoped>
.page {
  height: 100vh;
  width: 100vw;
  position: relative;

  .text {
    position: absolute;
    top: 35%;
    left: 10%;
    z-index: 2;
    color: #fff;
    pointer-events: none;
  }

  .three-js {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
