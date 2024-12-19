<script setup>
import { useThreeJS } from '@/hooks';
import * as THREE from 'three';
import gsap from 'gsap';

function coordinates2xyz(R, longitude, latitude) {
  // 转为弧度值
  let lng = (longitude * Math.PI) / 180;
  let lat = (latitude * Math.PI) / 180;
  // js坐标系z轴对应经度-90度，而不是90度
  lng = lng;

  // 经纬度坐标转球面坐标计算公式
  const x = R * Math.cos(lat) * Math.cos(lng);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lng);
  return new THREE.Vector3(x, y, z);
}

const { ThreeJSDom, scene } = useThreeJS();

// 创建星空
const vertices = [];
const count = 500;
for (let i = 0; i < count; i++) {
  const vertex = new THREE.Vector3(
    Math.random() * 800 - 400,
    Math.random() * 800 - 400,
    Math.random() * 800 - 400
  );
  vertices.push(vertex.x, vertex.y, vertex.z);
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(new Float32Array(vertices), 3)
);
const starTexture = new THREE.TextureLoader().load('./images/gradient.png');
const starMaterial = new THREE.PointsMaterial({
  size: 2,
  sizeAttenuation: true,
  color: 0x4dc6ff,
  transparent: true,
  opacity: 1,
  map: starTexture,
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 创建地球
const earth1Texture = new THREE.TextureLoader().load('./images/earth_3.jpg');
const earth1 = new THREE.Mesh(
  new THREE.SphereGeometry(50, 32, 32),
  new THREE.MeshBasicMaterial({
    map: earth1Texture,
  })
);
scene.add(earth1);

// const earth2Texture = new THREE.TextureLoader().load('./images/earth_2.jpg');
// const earth2 = new THREE.Mesh(
//   new THREE.SphereGeometry(50, 32, 32),
//   new THREE.MeshBasicMaterial({
//     map: earth2Texture,
//     alphaMap: earth2Texture,
//     blending: THREE.AdditiveBlending,
//     transparent: true,
//   })
// );
// scene.add(earth2);

// 创建地球发光精灵
const earthGlowTexture = new THREE.TextureLoader().load(
  './images/earth_aperture.jpg'
);
const earthGlowMaterial = new THREE.SpriteMaterial({
  map: earthGlowTexture,
  transparent: true,
  depthWrite: false,
  opacity: 0.75,
  blending: THREE.AdditiveBlending,
});
const earthGlow = new THREE.Sprite(earthGlowMaterial);
earthGlow.scale.set(150, 150, 150);
scene.add(earthGlow);

// 创建波纹效果
function getCircle() {
  const circleTexture = new THREE.TextureLoader().load('./images/bzguangquan.png');
  const circle = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: circleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  circle.rotation.x = -Math.PI / 2;
  circle.position.set(0, -7, 0);
  gsap.to(circle.scale, {
    duration: 1 + Math.random() * 0.5,
    x: 2,
    y: 2,
    z: 2,
    repeat: -1,
    delay: Math.random() * 0.5,
    yoyo: true,
    ease: 'power2.inOut',
  })
  return circle;
}

// 创建光柱
function getLightPillar() {
  const lightPillarTexture = new THREE.TextureLoader().load(
    './images/guangzhu.png'
  );
  const lightPillar = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 20),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: lightPillarTexture,
      alphaMap: lightPillarTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2));
  
  const lng = Math.random() * 360 - 180;
  const lat = Math.random() * 180 - 90;
  const position = coordinates2xyz(60, lng, lat);
  lightPillar.position.set(position.x, position.y, position.z);
  lightPillar.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    position.clone().normalize()
  );

  return lightPillar;
}

for (let i = 0; i < 25; i++) {
  const circle = getCircle();
  const lightPillar = getLightPillar();
  lightPillar.add(circle);
  scene.add(lightPillar);
}

// 创建月球
const moonRingTexture = new THREE.TextureLoader().load('./images/halo.png');
const moonRing = new THREE.Mesh(
  new THREE.RingGeometry(145, 155, 128),
  new THREE.MeshBasicMaterial({
    map: moonRingTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
    opacity: 0.5,
  })
);
moonRing.rotation.x = -Math.PI / 2;
scene.add(moonRing);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
  })
);
moon.position.set(150, 0, 0);
scene.add(moon);

const options = {
  time: 0,
}
gsap.to(options, {
  time: 1,
  duration: 10,
  repeat: -1,
  ease: 'linear',
  onUpdate: () => {
    moon.position.x = 150 * Math.cos(options.time * Math.PI * 2);
    moon.position.z = 150 * Math.sin(options.time * Math.PI * 2);
    moon.rotation.y = options.time * Math.PI * 8;
  }
})
</script>

<template>
  <div class="root">
    <ThreeJSDom />
  </div>
</template>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}
</style>
