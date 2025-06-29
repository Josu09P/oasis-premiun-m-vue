<template>
  <div class="button-container">
    <RouterLink
      v-if="href"
      :to="href"
      class="btn"
      :class="color"
    >
      <i :class="icon" class="me-2"></i>
      {{ title }}
    </RouterLink>
  </div>
</template>


<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  href?: string
  icon: string
  title: string
  color?: string
}>()
</script>

<style scoped>
.button-container {
  display: inline-block;
}
</style>
