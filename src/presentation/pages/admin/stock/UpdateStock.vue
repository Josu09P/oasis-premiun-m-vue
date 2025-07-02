<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Inventario', path: '/admin/stock', icon: 'bi bi-box' },
      { name: 'Lista de stock', path: '/admin/stock/list', icon: 'bi bi-grid' },
      { name: 'Editar stock', icon: 'bi bi-pen' },
    ]" />

    <TitlePage title="Actualizar Stock"
      paragraph="Modifica la cantidad de stock para el producto seleccionado." />

    <div class="card p-4 shadow-sm mt-3">
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">Producto</label>
          <input type="text" class="form-control" :value="stock?.product.name" disabled />
        </div>

        <div class="mb-3">
          <label class="form-label">Cantidad</label>
          <input type="number" v-model.number="form.quantity" class="form-control" required min="0" />
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-success" type="submit">
            <i class="bi bi-check-circle me-1"></i> Actualizar
          </button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import { getStockByIdUseCase } from '@/domain/usecases/stock/GetStockByIdUseCase'
import type { StockGetModel } from '@/domain/models/StockModel'
import { updateStockUseCase } from '@/domain/usecases/stock/UpdateStockUseCase'

const route = useRoute()
const router = useRouter()
const stock = ref<StockGetModel>()
const form = ref({ quantity: 0 })

const id_product = Number(route.params.id)

onMounted(async () => {
  try {
    stock.value = await getStockByIdUseCase(id_product)
    form.value.quantity = stock.value?.quantity || 0
  } catch (error) {
    console.error('Error cargando el stock', error)
    Swal.fire('Error', 'No se pudo cargar el stock', 'error')
    router.push('/admin/stocks')
  }
})

async function onSubmit() {
  try {
    await updateStockUseCase(id_product, form.value)
    Swal.fire('Actualizado', 'Stock actualizado correctamente', 'success')
    router.push('/admin/stock')
  } catch (error) {
    console.error('Error al actualizar el stock', error)
    Swal.fire('Error', 'No se pudo actualizar el stock', 'error')
  }
}
</script>
