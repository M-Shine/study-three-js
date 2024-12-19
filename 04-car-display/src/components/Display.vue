<script setup lang="ts">
import Model from './Model.vue';
import Options from './Options.vue';
</script>

<template>
  <div class="display">
    <Model />
    <Options />
  </div>
</template>

<style lang="scss" scoped>
.display {
  height: 100%;
  width: 100%;
  position: relative;

  .model {
    width: 100%;
    height: 100%;
  }

  .options {
    width: 20%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>