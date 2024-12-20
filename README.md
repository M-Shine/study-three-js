# Study Three.js

跟着B站老陈打码的视频学习Three.js并跟着敲的代码

[B站视频链接](https://www.bilibili.com/video/BV1Gg411X7FY?spm_id_from=333.788.videopod.episodes&vd_source=47cfa7c0fd2263e8cf71adcc21fbca17)


## 一些知识点
### 1. 阴影的实现
1. 物体材质要满足能够对光照有反应，如：MeshStandardMaterial
2. 设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true;
3. 设置光照投射阴影 light.castShadow = true;
4. 设置物体投射阴影 mesh.castShadow = true;
5. 设置物体接收阴影 mesh.receiveShadow = true;

### 2. 旋转顺序影响最终的效果
```js
// 第4个参数为旋转的顺序，默认为XYZ，字母需大写，顺序不同，旋转的效果也不同
mesh.rotation.set(Math.PI / 4, Math.PI / 4, Math.PI / 4, 'XYZ');
```

### 3. 使用 lil-gui 可快速创建控制面板

### 4. 加载器
1. 普通的纹理贴图使用 TextureLoader 加载
```js
new THREE.TextureLoader().load(url)
```

2. .hdr 格式的纹理贴图使用 RGBELoader 加载
```js
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
new RGBELoader().load('xxx.hdr', envMap => {
  // todo something
});
```

3. 模型使用 GLTFLoader 加载，有时需搭配使用 DRACOLoader 进行解压缩
```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const dracoLoader = new DRACOLoader();
// draco 解码器文件位于 node_modules/three/examples/js/libs/draco/
dracoLoader.setDecoderPath('./draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('./xxx.gltf', gltf => {
  // todo something
});
```

4. 视频纹理使用 VideoTexture 加载
```js
const video = document.createElement('video');
video.src = 'xxx.mp4';
video.loop = true;
video.muted = true;
video.play();
const videoTexture = new THREE.VideoTexture(video);
const videoMaterial = new THREE.MeshBasicMaterial({
  map: videoTexture,
  side: THREE.DoubleSide,
  transparent: true,
  alphaMap: videoTexture,
});
const videoGeometry = new THREE.PlaneGeometry(16, 9);
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
```

### 5. 场景交互
场景交互通过射线判断与物体的碰撞来实现
```js
// 创建射线
const raycaster = new THREE.Raycaster();
// 创建鼠标向量
const mouse = new THREE.Vector2();
// 监听点击事件
useEventListener(DOM, 'click', (event) => {
  // 计算鼠标位置
  mouse.x = (event.clientX / width.value) * 2 - 1;
  mouse.y = -(event.clientY / height.value) * 2 + 1;
  // 通过鼠标位置和相机矩阵计算射线
  raycaster.setFromCamera(mouse, camera);
  // 计算射线和球的碰撞
  const intersects = raycaster.intersectObjects([物体1, 物体2, ...]);
  // 如果有碰撞
  if (intersects.length > 0) {
    // 获取碰撞的对象
    const object = intersects[0].object;
    // todo something
  }
})
```

### 6. 全包围场景实现
*** 注意：需要设置 scale z 为 -1 ***
```js
mesh.geometry.scale(1, 1, -1);
```
1. 天空盒
天空盒贴图顺序：px、nx、py、ny、pz、nz（p为positive缩写，译为正；n为negative缩写，译为负） 或 左、右、上、下、前、后
1. 全景贴图
使用全景贴图贴到球上
