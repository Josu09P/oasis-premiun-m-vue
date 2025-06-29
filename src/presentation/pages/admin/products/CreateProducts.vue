<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Accesos directo', path: '/admin/products', icon: 'bi bi-house' },
      { name: 'Lista productos', path: '/admin/products/list', icon: 'bi bi-grid' },
      { name: 'Crear', icon: 'bi bi-plus-circle' }
    ]" />

    <TitlePage title="Crear producto" paragraph="Formulario para registrar un nuevo producto." />

    <form class="form-create-update" @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="row g-4">
        <div class="col-md-6">
          <label for="name" class="form-label">Nombre del Producto</label>
          <input v-model="name" type="text" class="form-control" id="name" placeholder="Ingresa el nombre" required />
        </div>

        <div class="col-md-6">
          <label for="price" class="form-label">Precio</label>
          <input v-model="price" type="number" class="form-control" id="price" placeholder="Ingresa el precio" required
            min="0" step="0.01" />
        </div>

        <div class="col-12">
          <label for="description" class="form-label">Descripción</label>
          <textarea v-model="description" class="form-control" id="description" rows="3"
            placeholder="Describe el producto" required></textarea>
        </div>

        <div class="col-12 position-relative">
          <label for="category" class="form-label">Categoría</label>
          <input type="text" id="category" class="form-control" v-model="searchCategory"
            placeholder="Escribe para buscar una categoría" @focus="showDropdown = true"
            @blur="handleBlur" autocomplete="off" />
          <ul v-if="showDropdown" class="list-group position-absolute w-100 z-3 mt-1"
            style="max-height: 200px; overflow-y: auto;">
            <li v-for="cat in filteredCategories" :key="cat.id" class="list-group-item list-group-item-action"
              @mousedown.prevent="selectCategory(cat)">
              {{ cat.name }}
            </li>
          </ul>
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
          <button type="submit" class="btn btn-success w-auto mt-3">
            <i class="bi bi-floppy2 me-2"></i> Crear Producto
          </button>
        </div>
      </div>
    </form>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import '@/assets/css/form-create-update.css'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import { fetchCategoriesUseCase } from '@/domain/usecases/categories/GetCategoriesUseCase'
import { createProductUseCase } from '@/domain/usecases/products/CreateProductUseCase'
import type { CategoriesGetModel } from '@/domain/models/CategoriesModel'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'

const name = ref('')
const description = ref('')
const price = ref<number | null>(null)
const idCategory = ref<number | ''>('') // Será el valor que se enviará
const imageFiles = ref<(File | null)[]>([null, null, null, null])
const imagePreviews = ref<(string | null)[]>([null, null, null, null])

function handleBlur() {
  window.setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

// 🟨 Autocompletado de categoría
const searchCategory = ref('')
const showDropdown = ref(false)
const categories = ref<CategoriesGetModel[]>([])

const filteredCategories = computed(() => {
  const query = searchCategory.value.toLowerCase().trim()
  return query === ''
    ? categories.value
    : categories.value.filter(cat => cat.name.toLowerCase().includes(query))
})

function selectCategory(cat: CategoriesGetModel) {
  idCategory.value = cat.id
  searchCategory.value = cat.name
  showDropdown.value = false
}

onMounted(async () => {
  try {
    categories.value = await fetchCategoriesUseCase()
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    Swal.fire('Error', 'No se pudieron cargar las categorías', 'error')
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
    title: `¿Crear producto "${name.value}"?`,
    text: 'Esta acción registrará el nuevo producto.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Crear',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  })

  if (!confirm.isConfirmed) return

  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('description', description.value)
  formData.append('price', String(price.value))
  formData.append('id_category', String(idCategory.value))

  imageFiles.value.forEach(file => {
    if (file) formData.append('files[]', file)
  })

  try {
    Swal.fire({
      title: 'Creando producto...',
      text: 'Por favor espera mientras se valida y suben las imágenes.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })

    await createProductUseCase(formData)

    Swal.fire('Éxito', 'Producto creado correctamente.', 'success')

    name.value = ''
    description.value = ''
    price.value = null
    idCategory.value = ''
    searchCategory.value = ''
    imageFiles.value = [null, null, null, null]
    imagePreviews.value = [null, null, null, null]
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo crear el producto.', 'error')
  }
}
</script>

<style scoped></style>
