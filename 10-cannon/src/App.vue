<script setup>
import SectionA from './components/SectionA.vue';
import SectionB from './components/SectionB.vue';
import SectionC from './components/SectionC.vue';
import SectionD from './components/SectionD.vue';
const sectionMap = {
  SectionA,
  SectionB,
  SectionC,
  SectionD,
};
const keys = Object.keys(sectionMap);
const activeSection = ref(keys[keys.length - 1]);
</script>

<template>
  <div class="container">
    <select v-model="activeSection">
      <option v-for="(_, key) in sectionMap" :key="key" :value="key">{{ key }}</option>
    </select>
    <component class="section" :is="sectionMap[activeSection]" />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.section {
  flex: 1;
}
</style>
