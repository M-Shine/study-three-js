<script setup>
import SectionA from './components/SectionA.vue';
import SectionB from './components/SectionB.vue';
import SectionC from './components/SectionC.vue';
import SectionD from './components/SectionD.vue';
import SectionE from './components/SectionE.vue';
import SectionF from './components/SectionF.vue';
import SectionG from './components/SectionG.vue';
import SectionH from './components/SectionH.vue';
import SectionI from './components/SectionI.vue';
import SectionJ from './components/SectionJ.vue';
import SectionK from './components/SectionK.vue';
import SectionL from './components/SectionL.vue';
import SectionM from './components/SectionM.vue';
import SectionN from './components/SectionN.vue';
const sectionMap = {
  SectionA,
  SectionB,
  SectionC,
  SectionD,
  SectionE,
  SectionF,
  SectionG,
  SectionH,
  SectionI,
  SectionJ,
  SectionK,
  SectionL,
  SectionM,
  SectionN,
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
