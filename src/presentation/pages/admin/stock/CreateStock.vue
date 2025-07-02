<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Inventario', path: '/admin/stocks', icon: 'bi bi-box' },
      { name: 'Lista de stock', path: '/admin/stock/list', icon: 'bi bi-grid' },
      { name: 'Crear', icon: 'bi bi-plus-circle' }
    ]" />

    <TitlePage title="Crear Stock" paragraph="Formulario para registrar cantidad inicial del producto." />

    <form class="form-create-update" @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Buscar Producto</label>

        <div class="d-flex gap-3 align-items-center mb-2">
          <div class="form-check">
            <input class="form-check-input me-2" type="radio" id="searchByName" value="name" v-model="productSearchMode">
            <label class="form-check-label" for="searchByName" style="font-size: 13px;">Nombre</label>
          </div>
          <div class="form-check">
            <input class="form-check-input me-2" type="radio" id="searchById" value="id" v-model="productSearchMode">
            <label class="form-check-label" for="searchById" style="font-size: 13px;">ID</label>
          </div>
        </div>

        <input type="text" v-model="searchProduct" class="form-control"
          :placeholder="productSearchMode === 'id' ? 'Ingrese ID del producto' : 'Ingrese nombre del producto'"
          @focus="showProductDropdown = true"
          @blur="onProductInputBlur"
        />

        <ul v-if="showProductDropdown" class="list-group position-absolute w-100 z-3 mt-1"
            style="max-height: 200px; max-width: 400px; overflow-y: auto;">
          <li v-for="p in filteredProducts" :key="p.id" class="list-group-item list-group-item-action"
              @mousedown.prevent="selectProduct(p)">
            ID: {{ p.id }} - {{ p.name }} - S/.{{ p.price }}
          </li>
        </ul>
      </div>

      <div class="mb-3">
        <label for="quantity" class="form-label">Cantidad en stock</label>
        <input v-model.number="quantity" type="number" class="form-control" id="quantity"
               placeholder="Cantidad disponible" required />
      </div>

      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-success w-auto">
          <i class="bi bi-floppy2 me-2"></i> Crear Stock
        </button>
      </div>
    </form>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import '@/assets/css/form-create-update.css'

import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'

import { createStockUseCase } from '@/domain/usecases/stock/CreateStockUseCase'
import { fetchProductsUseCase } from '@/domain/usecases/products/GetProductsUseCase'
import type { ProductGetModel } from '@/domain/models/ProductsModel'

const quantity = ref<number | null>(null)
const selectedProductId = ref<number | null>(null)

// --- Búsqueda de productos ---
const products = ref<ProductGetModel[]>([])
const searchProduct = ref('')
const productSearchMode = ref<'name' | 'id'>('name')
const showProductDropdown = ref(false)

const filteredProducts = computed(() => {
  const query = searchProduct.value.toLowerCase().trim()
  if (!query) return products.value
  return products.value.filter(p =>
    productSearchMode.value === 'name'
      ? p.name.toLowerCase().includes(query)
      : p.id.toString().includes(query)
  )
})

function onProductInputBlur() {
  setTimeout(() => {
    showProductDropdown.value = false
  }, 200)
}

function selectProduct(product: ProductGetModel) {
  selectedProductId.value = product.id
  searchProduct.value = `ID: ${product.id} - ${product.name} - S/.${product.price}`
  showProductDropdown.value = false
}

// --- Cargar productos al iniciar ---
onMounted(async () => {
  try {
    products.value = await fetchProductsUseCase()
  } catch (error) {
    console.error('Error al cargar productos:', error)
    Swal.fire('Error', 'No se pudieron cargar los productos', 'error')
  }
})

// --- Crear stock ---
async function handleSubmit() {
  if (!selectedProductId.value || !quantity.value) return

  const confirm = await Swal.fire({
    title: `¿Crear stock para el producto ID ${selectedProductId.value}?`,
    text: 'Esta acción registrará el stock inicial.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Crear',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  })

  if (!confirm.isConfirmed) return

  try {
    Swal.fire({
      title: 'Registrando stock...',
      text: 'Espere mientras se guarda la información.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })

    await createStockUseCase({
      id_product: selectedProductId.value,
      quantity: quantity.value
    })

    Swal.fire('Éxito', 'Stock registrado correctamente.', 'success')
    quantity.value = null
    selectedProductId.value = null
    searchProduct.value = ''
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo registrar el stock.', 'error')
  }
}
</script>
