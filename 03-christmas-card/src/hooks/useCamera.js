import * as THREE from 'three';

export function useCamera(container) {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.set(-3.23, 3, 4.06);

  function updateAspect(aspect) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  const { width: containerWidth, height: containerHeight } = useElementSize(container);
  watch(() => [containerWidth.value, containerHeight.value], () => {
    updateAspect(containerWidth.value / containerHeight.value);
  }, {
    immediate: true,
  })

  return {
    camera,
    updateAspect,
  }
}