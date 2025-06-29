<script setup lang="ts">
defineProps<{ total: number }>()
</script>

<template>
  <section class="section-categories-summary">
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
<style scoped>
.container-summary {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  background-color: #ebe6e6;
  padding: 10px 20px;
}

h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}
</style>
