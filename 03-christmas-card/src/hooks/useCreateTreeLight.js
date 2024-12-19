import * as THREE from 'three';
import gsap from 'gsap';

export function useCreateTreeLight(scene, count) {
  const pointLightGroup = new THREE.Group();
  pointLightGroup.position.set(-8, 2.5, -1.5);
  const radius = 3;
  for (let i = 0; i < count; i++) {
    // 创建球体
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10,
      })
    );
    sphere.position.set(
      radius * Math.cos(i * Math.PI * 2 / count),
      Math.cos(i * Math.PI * 2 / count),
      radius * Math.sin(i * Math.PI * 2 / count)
    );
    const pointLight = new THREE.PointLight(0xffffff, 50);
    sphere.add(pointLight);
    pointLightGroup.add(sphere);
  }
  scene.add(pointLightGroup);

  // 创建点光源组动画
  const options = {
    angle: 0,
  };
  gsap.to(options, {
    angle: Math.PI * 2,
    duration: 10,
    repeat: -1,
    ease: 'linear',
    onUpdate: () => {
      pointLightGroup.children.forEach((child, i) => {
        child.position.set(
          radius * Math.cos(options.angle + i * Math.PI * 2 / count),
          Math.cos(options.angle * 5 + i * Math.PI * 2 / count),
          radius * Math.sin(options.angle + i * Math.PI * 2 / count)
        );
      });
    },
  });
}
