<template>
  <section class="section-categories-summary">
    <div class="container-summary rounded">
      <div class="container-title me-2">
        <h4 class="title">Descuentos Totales:</h4>
      </div>
      <div class="results-container">
        <h4 class="total">: {{ totalDiscounts }}</h4>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { fetchDiscountsAdminUseCase } from '@/domain/usecases/discounts/GetDiscountsAdminUseCase'

const totalDiscounts = ref(0)

onMounted(async () => {
  try {
    const data = await fetchDiscountsAdminUseCase()
    totalDiscounts.value = data.length
  } catch (error) {
    console.error('Error al cargar categorías', error)
    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error')
  }
})
</script>

