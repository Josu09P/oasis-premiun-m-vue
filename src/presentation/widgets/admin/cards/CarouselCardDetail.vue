<template>
  <div class="row" style="margin-top: -10px;">
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-center text-center">
          <i class="bi bi-images fs-2 mb-2"></i>
          <h5 class="card-title">Total de Carruseles</h5>
          <h3>{{ total }}</h3>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-center text-center">
          <i class="bi bi-eye-fill fs-2 mb-2"></i>
          <h5 class="card-title">Carruseles Activos</h5>
          <h3>{{ activos }}</h3>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card danger h-100">
        <div class="card-body d-flex flex-column justify-content-center text-center">
          <i class="bi bi-eye-slash-fill fs-2 mb-2"></i>
          <h5 class="card-title">Carruseles Inactivos</h5>
          <h3>{{ inactivos }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCarouselStore } from '@/stores/carouselStore'

const store = useCarouselStore()

onMounted(async () => {
  await store.loadCarousels()
})


const total = computed(() => store.carousels.length)
const activos = computed(() => store.carousels.filter(c => c.is_enabled).length)
const inactivos = computed(() => store.carousels.filter(c => !c.is_enabled).length)
</script>

<style scoped>
.card {
  border: none;
  background-color: transparent;
  border-radius:5px !important;
}
.card-body {
  background-color: #f5f5f585 !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.196);
  border-radius: 5px;
}
</style>