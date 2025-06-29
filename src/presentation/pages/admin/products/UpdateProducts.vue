<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Accesos directo', path: '/admin/products', icon: 'bi bi-house' },
      { name: 'Lista productos', path: '/admin/products/list', icon: 'bi bi-grid' },
      { name: 'Editar', icon: 'bi bi-pencil' }
    ]" />

    <TitlePage title="Editar producto" paragraph="Formulario para modificar un producto existente." />

    <form class="form-create-update" @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="row g-4">
        <div class="col-md-6">
          <label for="name" class="form-label">Nombre del Producto</label>
          <input v-model="name" type="text" class="form-control" id="name" placeholder="Nombre del producto" required />
        </div>

        <div class="col-md-6">
          <label for="price" class="form-label">Precio</label>
          <input v-model="price" type="number" class="form-control" id="price" placeholder="Precio" required min="0" step="0.01" />
        </div>

        <div class="col-12">
          <label for="description" class="form-label">Descripción</label>
          <textarea v-model="description" class="form-control" id="description" rows="3" placeholder="Descripción" required></textarea>
        </div>

        <div class="col-12">
          <label for="category" class="form-label">Categoría</label>
          <select v-model="idCategory" id="category" class="form-select" required>
            <option disabled value="">Selecciona una categoría</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div class="col-12">
          <label class="form-label">Imágenes del Producto</label>
          <div class="row g-2">
            <div class="col-6 col-md-3" v-for="(preview, index) in imagePreviews" :key="index">
              <input type="file" class="form-control" accept="image/*" @change="e => handleImageChange(e, index)" />
              <img v-if="preview" :src="preview" alt="Vista previa" class="img-thumbnail mt-2" width="100" />
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-primary w-auto mt-3">
            <i class="bi bi-pencil-square me-2"></i> Actualizar Producto
          </button>
        </div>
      </div>
    </form>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'

import { fetchCategoriesUseCase } from '@/domain/usecases/categories/GetCategoriesUseCase'
import { fetchProductByIdUseCase } from '@/domain/usecases/products/GetProductByIdUseCase'
import { updateProductWithImagesUseCase } from '@/domain/usecases/products/UpdateProductUseCase'

import type { CategoriesGetModel } from '@/domain/models/CategoriesModel'
import type { ProductGetModel } from '@/domain/models/ProductsModel'

const route = useRoute()
const productId = Number(route.params.id)

const name = ref('')
const description = ref('')
const price = ref<number | null>(null)
const idCategory = ref<number | ''>('')
const imageFiles = ref<(File | null)[]>([null, null, null, null])
const imagePreviews = ref<(string | null)[]>([null, null, null, null])
const categories = ref<CategoriesGetModel[]>([])

onMounted(async () => {
  try {
    categories.value = await fetchCategoriesUseCase()

    const product: ProductGetModel = await fetchProductByIdUseCase(productId)
    name.value = product.name
    description.value = product.description
    price.value = product.price
    idCategory.value = typeof product.id_category === 'number' ? product.id_category : ''

    imagePreviews.value = [
      product.image1 || null,
      product.image2 || null,
      product.image3 || null,
      product.image4 || null
    ]
  } catch (error) {
    console.error('Error al cargar datos:', error)
    Swal.fire('Error', 'No se pudieron cargar los datos del producto.', 'error')
  }
})

function handleImageChange(event: Event, index: number) {
  const file = (event.target as HTMLInputElement).files?.[0] || null
  if (file) {
    imageFiles.value[index] = file
    imagePreviews.value[index] = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  if (!name.value || !description.value || price.value === null || idCategory.value === '') return

  const confirm = await Swal.fire({
    title: `¿Actualizar producto "${name.value}"?`,
    text: 'Esta acción modificará los datos del producto.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  })

  if (!confirm.isConfirmed) return

  // Construir el payload de actualización
  const updatePayload = {
    name: name.value,
    description: description.value,
    price: price.value,
    id_category: idCategory.value,
    images_to_update: imageFiles.value
      .map((file, index) => (file ? index : null))
      .filter(index => index !== null) as number[]
  }

  // Filtrar solo los archivos seleccionados
  const filesToUpload = imageFiles.value.filter((file): file is File => !!file)

  try {
    Swal.fire({
      title: 'Actualizando producto...',
      text: 'Por favor espera mientras se actualizan los datos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    await updateProductWithImagesUseCase(productId, updatePayload, filesToUpload)

    Swal.fire('Éxito', 'Producto actualizado correctamente.', 'success')
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo actualizar el producto.', 'error')
  }
}
</script>

