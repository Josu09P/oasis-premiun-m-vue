<template>
  <section class="section-categories-summary" style="">
    <div class="container-summary rounded">
      <div class="container-title me-2">
        <h4 class="title">Productos Totales:</h4>
      </div>
      <div class="results-container">
        <h4 class="total">: {{ total }}</h4>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
defineProps<{ total: number }>()
</script>