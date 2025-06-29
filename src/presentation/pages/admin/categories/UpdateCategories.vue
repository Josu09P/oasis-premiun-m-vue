<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Accesos directo', path: '/admin/categories', icon: 'bi bi-house' },
      { name: 'Lista categorías', path: '/admin/categories/list', icon: 'bi bi-grid' },
      { name: 'Editar', icon: 'bi bi-pencil' }
    ]" />
    <TitlePage title="Editar categoría" paragraph="Formulario para modificar una categoría existente." />

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
        <input @change="handleImageChange" type="file" class="form-control" id="image" accept="image/*" />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" alt="Vista previa" class="img-thumbnail" width="200" />
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-success w-auto">
          <i class="bi bi-floppy2 me-2"></i> Actualizar Categoría
        </button>
      </div>
    </form>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'
import '@/assets/css/form-create-update.css'

import { fetchCategoryById } from '@/data/services/categories/CategoriesServices'
import { updateCategoryUseCase } from '@/domain/usecases/categories/UpdateCategoryUseCase'

const route = useRoute()
const id = Number(route.params.id)

const name = ref('')
const description = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const router = useRouter();

onMounted(async () => {
  try {
    const category = await fetchCategoryById(id)
    name.value = category.name
    description.value = category.description
    imagePreview.value = category.image // URL pública
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo cargar la categoría.', 'error')
  }
})

function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] || null
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}


async function handleSubmit() {
  if (!name.value || !description.value) return

  const confirm = await Swal.fire({
    title: `¿Actualizar categoría "${name.value}"?`,
    text: 'Esta acción modificará la categoría actual.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  })

  if (!confirm.isConfirmed) return

  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('description', description.value)
  if (imageFile.value) {
    formData.append('file', imageFile.value)
  }

  try {
    Swal.fire({
      title: 'Actualizando categoría...',
      text: 'Por favor espera mientras se guarda la información.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })

    await updateCategoryUseCase(id, formData)

    await Swal.fire({
      title: 'Éxito',
      text: 'Categoría actualizada correctamente.',
      icon: 'success',
      confirmButtonText: 'Ir al listado'
    })

    await router.push('/admin/categories/list')
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo actualizar la categoría.', 'error')
  }
}
</script>

<style scoped>
.form-create-update {
  background: #ffffffc7;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}
</style>
