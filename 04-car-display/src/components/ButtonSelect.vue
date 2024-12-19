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
      class="button-option"
      :class="{ selected: value === option.value }"
      v-for="option in options"
      :key="option.value"
      @click="value = option.value"
    >
      {{ option.name }}
    </div>
  </div>
</template>

<style scoped>
.options-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .button-option {
    padding: 4px 8px;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    letter-spacing: 0.5em;
    text-indent: 0.5em;
    border: 1px solid #ccc;

    &.selected {
      border: 1px solid #666;
    }
  }
}
</style>
