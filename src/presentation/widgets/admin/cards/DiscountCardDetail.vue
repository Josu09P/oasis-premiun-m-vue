<template>
  <div class="row" style="margin-top: -10px;">
    <!-- TOTAL -->
    <div class="col-md-3">
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-center text-center">
          <i class="bi bi-tags-fill fs-2 mb-2"></i>
          <h5 class="card-title">Total de Descuentos</h5>
          <h3>{{ total }}</h3>
        </div>
      </div>
    </div>

    <!-- ACTIVOS -->
    <div class="col-md-3">
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-center text-center">
          <i class="bi bi-check-circle-fill text-success fs-2 mb-2"></i>
          <h5 class="card-title">Activos</h5>
          <h3>{{ activos }}</h3>
        </div>
      </div>
    </div>

    <!-- PENDIENTES -->
    <div class="col-md-3">
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-center text-center">
          <i class="bi bi-clock-history text-warning fs-2 mb-2"></i>
          <h5 class="card-title">Pendientes</h5>
          <h3>{{ pendientes }}</h3>
        </div>
      </div>
    </div>

    <!-- EXPIRADOS -->
    <div class="col-md-3">
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-center text-center">
          <i class="bi bi-x-circle-fill text-secondary fs-2 mb-2"></i>
          <h5 class="card-title">Expirados</h5>
          <h3>{{ expirados }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDiscountStore } from '@/stores/DiscountStore'

const store = useDiscountStore()

onMounted(async () => {
  await store.loadDiscounts()
})

const total = computed(() => store.discounts.length)
const activos = computed(() => store.discounts.filter(d => d.status === 'ACTIVE').length)
const pendientes = computed(() => store.discounts.filter(d => d.status === 'PENDING').length)
const expirados = computed(() => store.discounts.filter(d => d.status === 'EXPIRED').length)
</script>

<style scoped>
.card {
  border: none;
  background-color: transparent;
  border-radius: 5px !important;
}
.card-body {
  background-color: #f5f5f585 !important;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.196);
  border-radius: 5px;
}
</style>
