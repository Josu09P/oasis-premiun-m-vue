<template>
  <DashboardLayout>
    <div>
    <h2 class="h4">Añadir stock</h2>
    <form @submit.prevent="submit">
      <input type="number" v-model.number="cantidad" placeholder="Cantidad a ingresar" class="form-control mb-2" />
      <button class="btn btn-success">Agregar stock</button>
    </form>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { addStockUseCase } from '@/domain/usecases/stock/AddStockUseCase'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'

const route = useRoute()
const router = useRouter()
const cantidad = ref<number>(0)

async function submit() {
  try {
    const id = Number(route.params.id)
    await addStockUseCase(id, cantidad.value)
    await Swal.fire('Éxito', 'Stock añadido correctamente', 'success')
    router.push('/admin/stock/list')
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo añadir el stock', 'error')
  }
}
</script>
