<template>
  <section class="section-categories-summary">
    <div class="container-summary rounded">
      <div class="container-title me-2">
        <h4 class="title">Carruseles Totales:</h4>
      </div>
      <div class="results-container">
        <h4 class="total">: {{ totalCarousels }}</h4>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { fetchCarouselsAdminUseCase } from '@/domain/usecases/carousel/GetCarouselsAdminUseCase'

const totalCarousels = ref(0)

onMounted(async () => {
  try {
    const data = await fetchCarouselsAdminUseCase()
    totalCarousels.value = data.length
  } catch (error) {
    console.error('Error al cargar categorías', error)
    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error')
  }
})
</script>

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
