<script setup lang="ts">
// 导入three.js
import * as THREE from 'three';
import gsap from 'gsap';
import { useEventListener } from '@vueuse/core';
import {
  useRenderer,
  useCamera,
  useControls,
  useLoadScene,
  useCreateSceneLight,
  useCreateHouseLight,
  useCreateTreeLight,
  useCreateWater,
  useLoadSky,
  useStars,
} from '@/hooks';

const containerRef = ref(null);
const scene = new THREE.Scene();

const { camera } = useCamera(containerRef);

const { renderer } = useRenderer(containerRef);

const { controls } = useControls(camera, renderer.domElement);

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

// 加载场景
useLoadScene(scene);

// 整个场景的灯光
useCreateSceneLight(scene);

// 创建房子内灯光
useCreateHouseLight(scene);

// 创建点光源组（树上跳动的光点）
useCreateTreeLight(scene, 3);

// 创建水面
useCreateWater(scene);

// 加载天空
useLoadSky(scene);

// 创建漫天繁星
const {
  starsInstance,
  moveToHeart,
  moveToRandom,
} = useStars(0, 7, 7, 100);
scene.add(starsInstance);

/**
 * 切换相机位置
 * @param position 相机的位置
 * @param target 相机的目标点
 */
function translateCamera(position, target) {
  gsap.timeline().to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1,
    ease: 'power1.inOut',
  });
  gsap.timeline().to(controls.target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1,
    ease: 'power1.inOut',
  });
}
const index = ref(0);
const text = ref('1');
const actions = [
  () => {
    translateCamera(
      new THREE.Vector3(-3.23, 3, 4.06),
      new THREE.Vector3(-8, 2, 0)
    );
    text.value = '1';
    moveToRandom();
  },
  () => {
    translateCamera(
      new THREE.Vector3(7, 0, 23),
      new THREE.Vector3(0, 0, 0)
    );
    text.value = '2';
    moveToRandom();
  },
  () => {
    translateCamera(
      new THREE.Vector3(10, 3, 0),
      new THREE.Vector3(5, 2, 0)
    );
    text.value = '3';
    moveToRandom();
  },
  () => {
    translateCamera(
      new THREE.Vector3(7, 0, 23),
      new THREE.Vector3(0, 0, 0)
    );
    text.value = '4';
    moveToHeart();
  },
  () => {
    translateCamera(
      new THREE.Vector3(-20, 1.3, 6.6),
      new THREE.Vector3(5, 2, 0)
    );
    text.value = '5';
    moveToHeart();
  },
];
const handleWheel = useThrottleFn((e) => {
  e.deltaY > 0 ? index.value++ : index.value--;
  if (index.value > actions.length - 1) {
    index.value = actions.length - 1;
  } else if (index.value < 0) {
    index.value = 0;
  }
  actions[index.value]();
}, 1000);
useEventListener(containerRef, 'wheel', handleWheel);
</script>

<template>
  <div class="home">
    <div class="three-js" ref="containerRef"></div>
    <div class="text">{{ text }}</div>
  </div>
</template>

<style scoped>
.home {
  height: 100%;
  width: 100%;
  position: relative;
}

.three-js {
  height: 100%;
  width: 100%;
}

.text {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  color: #fff;
  font-size: 24px;
  font-weight: bolder;
  pointer-events: none;
}
</style>