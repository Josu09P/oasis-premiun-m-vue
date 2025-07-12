<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Accesos directo', path: '/admin/categories', icon: 'bi bi-house' },
      { name: 'Lista categorías', path: '/admin/categories/list', icon: 'bi bi-grid' },
      { name: 'Crear', icon: 'bi bi-plus-circle' }
    ]" />
    <TitlePage title="Crear categoría" paragraph="Formulario para registrar una nueva categoría." />

    <form class="form-create-update" @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="mb-3">
        <label for="name" class="form-label">Nombre de la Categoría</label>
        <input v-model="name" type="text" class="form-control" id="name" placeholder="Ingresa el nombre" required />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea v-model="description" class="form-control" id="description" rows="3"
          placeholder="Describe la categoría" required></textarea>
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Imagen de la Categoría</label>
        <input @change="handleImageChange" type="file" class="form-control" id="image" accept="image/*" required />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" alt="Vista previa" class="img-thumbnail" width="200" />
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-success w-auto">
          <i class="bi bi-floppy2 me-2"></i> Crear Categoría
        </button>
      </div>

    </form>
  </DashboardLayout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import '@/assets/css/form-create-update.css'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import { createCategoryUseCase } from '@/domain/usecases/categories/CreateCategoryUseCase'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'

const name = ref('')
const description = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] || null
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function handleSubmit() {
  if (!name.value || !description.value || !imageFile.value) return

  const confirm = await Swal.fire({
    title: `¿Crear categoría "${name.value}"?`,
    text: 'Esta acción registrará la nueva categoría.',
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
  formData.append('file', imageFile.value)

  try {
    Swal.fire({
      title: 'Creando categoría...',
      text: 'Por favor espera mientras se valida y sube la imagen.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    await createCategoryUseCase(formData)

    Swal.fire('Éxito', 'Categoría creada correctamente.', 'success')

    name.value = ''
    description.value = ''
    imageFile.value = null
    imagePreview.value = null
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo crear la categoría.', 'error')
  }
}
</script>
<style scoped></style>