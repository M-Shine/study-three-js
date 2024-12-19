import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function useThreeJS() {
  const containerRef = ref(null);
  const { width: containerWidth, height: containerHeight } = useElementSize(containerRef);
  const ThreeJSDom = () => (
    <div
      style="width: 100%; height: 100%;"
      ref={containerRef}
    ></div>
  )

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#ccc');

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  const camera = new THREE.PerspectiveCamera(
    75,
    containerWidth.value / containerHeight.value,
    0.1,
    1000
  );
  camera.position.set(0, 2, 6);

  const renderer = new THREE.WebGLRenderer({
    // 抗锯齿
    antialias: true,
  });
  renderer.setClearColor('#000');
  // 开启阴影
  renderer.shadowMap.enabled = true;
  // 物理上正确的光照
  renderer.physicallyCorrectLights = true;
  onMounted(() => {
    renderer.setSize(containerWidth.value, containerHeight.value);
    containerRef.value.appendChild(renderer.domElement);
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  // 自动旋转
  controls.autoRotate = true;

  function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  watch(() => [containerWidth.value, containerHeight.value], () => {
    camera.aspect = containerWidth.value / containerHeight.value;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth.value, containerHeight.value);
  });

  return {
    ThreeJSDom,
    scene,
    camera,
    renderer,
    controls,
  }
}