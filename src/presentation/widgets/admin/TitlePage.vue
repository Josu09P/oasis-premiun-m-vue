<template>
  <div class="row container-title">
    <div class="col-md-12">
      <h2 class="text-left title-modules">{{ title }}</h2>
      <p v-if="paragraph" class="text-left">{{ paragraph }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  paragraph?: string
}>()
</script>

<style scoped>
.container-title {
  margin-top: -10px;
  margin-bottom: 20px;
}
.title-modules {
  font-size: 1.4rem;
  font-weight: bold;
}
</style>
