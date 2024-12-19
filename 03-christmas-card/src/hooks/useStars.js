import * as THREE from 'three';
import gsap from 'gsap';

// 获取爱心路径
function getHeartShape(x, y, size) {
  const shape = new THREE.Shape();
  shape.moveTo(x, y);
  shape.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  shape.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  return shape;
}

export function useStars(x, y, size, count) {
  // 星星实例
  const starsInstance = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.1, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 10,
    }),
    count
  );
  // 是否为爱心形状
  let isHeart = false;
  // 随机位置
  const randomIndexes = [];
  // 爱心位置
  const heartIndexes = [];
  // 爱心路径
  const heartShape = getHeartShape(x, y, size);
  // 记录并初始化星星位置
  for (let i = 0; i < count; i++) {
    // 随机位置 -50~50
    randomIndexes.push(new THREE.Vector3(
      Math.random() * 100 - 50,
      Math.random() * 100 - 50,
      Math.random() * 100 - 50
    ));
    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(randomIndexes[i].x, randomIndexes[i].y, randomIndexes[i].z);
    starsInstance.setMatrixAt(i, matrix);
    // 爱心位置
    const point = heartShape.getPoint(i/count);
    heartIndexes.push(new THREE.Vector3(point.x, point.y, point.z));
  }

  function moveToHeart() {
    if (isHeart) {
      return;
    }
    isHeart = true;
    const params = { time: 0 };
    gsap.to(params, {
      time: 1,
      duration: 1,
      onUpdate: () => {
        for (let i = 0; i < count; i++) {
          const matrix = new THREE.Matrix4();
          matrix.makeTranslation(
            randomIndexes[i].x + (heartIndexes[i].x - randomIndexes[i].x) * params.time,
            randomIndexes[i].y + (heartIndexes[i].y - randomIndexes[i].y) * params.time,
            randomIndexes[i].z + (heartIndexes[i].z - randomIndexes[i].z) * params.time
          );
          starsInstance.setMatrixAt(i, matrix);
        }
        starsInstance.instanceMatrix.needsUpdate = true;
      }
    })
  }

  function moveToRandom() {
    if (!isHeart) {
      return;
    }
    isHeart = false;
    const params = { time: 0 };
    gsap.to(params, {
      time: 1,
      duration: 1,
      onUpdate: () => {
        for (let i = 0; i < count; i++) {
          const matrix = new THREE.Matrix4();
          matrix.makeTranslation(
            heartIndexes[i].x + (randomIndexes[i].x - heartIndexes[i].x) * params.time,
            heartIndexes[i].y + (randomIndexes[i].y - heartIndexes[i].y) * params.time,
            heartIndexes[i].z + (randomIndexes[i].z - heartIndexes[i].z) * params.time
          );
          starsInstance.setMatrixAt(i, matrix);
        }
        starsInstance.instanceMatrix.needsUpdate = true;
      }
    })
  }

  function toggleShape() {
    isHeart = !isHeart;
    if (isHeart) {
      moveToHeart();
    } else {
      moveToRandom();
    }
  }

  return {
    starsInstance,
    moveToHeart,
    moveToRandom,
    toggleShape,
  }
}