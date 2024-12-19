<script setup lang="ts">
import ColorSelect from './ColorSelect.vue';
import ButtonSelect from './ButtonSelect.vue';
import { useGlobalState } from '@/hooks';
import {
  carName,
  bodyColors,
  hoodColors,
  faceColors,
  wheelColors,
  bodyMaterialTypes,
  glassMaterialTypes,
} from '@/constants';

const {
  bodyColor,
  faceColor,
  hoodColor,
  wheelColor,
  bodyMaterialType,
  glassMaterialType,
} = useGlobalState();
</script>

<template>
  <div class="options">
    <h1>{{ carName }}</h1>

    <ColorSelect
      title="车身颜色"
      :options="bodyColors"
      v-model:value="bodyColor"
    >
    </ColorSelect>

    <ColorSelect
      title="引擎盖颜色"
      :options="hoodColors"
      v-model:value="hoodColor"
    >
    </ColorSelect>

    <ColorSelect
      title="前脸颜色"
      :options="faceColors"
      v-model:value="faceColor"
    >
    </ColorSelect>

    <ColorSelect
      title="轮毂颜色"
      :options="wheelColors"
      v-model:value="wheelColor"
    >
    </ColorSelect>

    <ButtonSelect
      title="车身材质"
      :options="bodyMaterialTypes"
      v-model:value="bodyMaterialType"
    >
    </ButtonSelect>

    <ButtonSelect
      title="挡风玻璃材质"
      :options="glassMaterialTypes"
      v-model:value="glassMaterialType"
    >
    </ButtonSelect>
  </div>
</template>

<style scoped>
.options {
  padding: 20px;
}
</style>