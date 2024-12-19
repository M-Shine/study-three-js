import { createGlobalState } from '@vueuse/core'
import {
  bodyColors,
  hoodColors,
  faceColors,
  wheelColors,
  bodyMaterialTypes,
  glassMaterialTypes,
} from '@/constants';

export const useGlobalState = createGlobalState(() => {
  // 车身颜色
  const bodyColor = ref(bodyColors[0].value);
  // 车辆前脸颜色
  const faceColor = ref(faceColors[0].value);
  // 引擎盖颜色
  const hoodColor = ref(hoodColors[0].value);
  // 轮毂颜色
  const wheelColor = ref(wheelColors[0].value);
  // 车身材质
  const bodyMaterialType = ref(bodyMaterialTypes[0].value);
  // 玻璃材质
  const glassMaterialType = ref(glassMaterialTypes[0].value);

  return {
    bodyColor,
    faceColor,
    hoodColor,
    wheelColor,
    bodyMaterialType,
    glassMaterialType,
  };
})
