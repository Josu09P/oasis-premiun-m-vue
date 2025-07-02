<template>
  <section class="section-categories-summary">
    <div class="container-summary rounded">
      <div class="container-title me-2">
        <h4 class="title">Categorías Totales:</h4>
      </div>
      <div class="results-container">
        <h4 class="total">: {{ totalCategories }}</h4>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { fetchCategoriesUseCase } from '@/domain/usecases/categories/GetCategoriesUseCase'

const totalCategories = ref(0)

onMounted(async () => {
  try {
    const data = await fetchCategoriesUseCase()
    totalCategories.value = data.length
  } catch (error) {
    console.error('Error al cargar categorías', error)
    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error')
  }
})
</script>
