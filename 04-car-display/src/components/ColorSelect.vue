<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { string, object } from 'vue-types';

const props = defineProps({
  title: string().isRequired,
  options: object<{ name?: string, value: string }>().isRequired,
  value: string().isRequired,
});
const emit = defineEmits(['update:value']);
const value = useVModel(props, 'value', emit);
</script>

<template>
  <h3>{{ props.title }}</h3>
  <div class="options-box">
    <div
      class="color-option"
      :class="{ selected: value === option.value }"
      v-for="option in props.options"
      :key="option.value"
      :style="{ backgroundColor: option.value }"
      :title="option.name"
      @click="value = option.value"
    ></div>
  </div>
</template>

<style scoped>
.options-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .color-option {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;

    &.selected {
      border: 1px solid #666;
    }
  }
}
</style>
