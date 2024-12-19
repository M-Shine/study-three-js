import { watchOnce } from '@vueuse/core';
import * as THREE from 'three';

export function useRenderer(container) {
  const renderer = new THREE.WebGLRenderer({
    // 开启抗锯齿
    antialias: true,
  });
  // 开启场景中的阴影
  renderer.shadowMap.enabled = true;
  // 物理上正确的光照
  renderer.physicallyCorrectLights = true;
  // 设置输出编码
  renderer.outputEncoding = THREE.sRGBEncoding;
  // 设置色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // 设置曝光度
  renderer.toneMappingExposure = 0.5;

  watchOnce(container, () => {
    container.value.appendChild(renderer.domElement);
  });
  
  const { width: containerWidth, height: containerHeight } = useElementSize(container);
  watch(() => [containerWidth.value, containerHeight.value], () => {
    renderer.setSize(containerWidth.value, containerHeight.value);
  }, {
    immediate: true,
  })

  return {
    renderer,
  }
}