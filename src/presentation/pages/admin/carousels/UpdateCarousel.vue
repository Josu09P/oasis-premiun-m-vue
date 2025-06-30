<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Accesos directo', path: '/admin/carousel', icon: 'bi bi-house' },
      { name: 'Lista carruseles', path: '/admin/carousel/list', icon: 'bi bi-images' },
      { name: 'Editar', icon: 'bi bi-pencil-square' }
    ]" />

    <TitlePage title="Editar carrusel" paragraph="Modifica los datos y reemplaza imágenes si es necesario." />

    <form class="form-create-update" @submit.prevent="handleSubmit">
      <div class="row g-4">
        <div class="col-md-6">
          <label class="form-label">Título</label>
          <input v-model="title" type="text" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label">Descripción</label>
          <input v-model="description" type="text" class="form-control" required />
        </div>

        <div class="col-12">
          <label class="form-label">Imágenes del Carrusel</label>
          <div class="alert alert-info py-2 px-3 mb-3" style="font-size: 0.9rem;">
            Puedes reemplazar una imagen seleccionando un nuevo archivo. Imagen 1 es obligatoria.
          </div>
          <div class="row g-2">
            <div class="col-6 col-md-3" v-for="(preview, index) in imagePreviews" :key="index">
              <input type="file" class="form-control" accept="image/*" @change="e => handleImageChange(e, index)" />
              <div v-if="preview" class="position-relative mt-2">
                <img :src="preview" alt="Vista previa" class="img-thumbnail" />
                <button type="button" @click="removeImage(index)"
                  class="btn btn-light btn-sm position-absolute top-0 end-0"
                  style="width: 22px; height: 22px; border-radius: 50%; font-size: 12px; transform: translate(40%, -40%);">
                  ✕
                </button>
              </div>
              <p class="mt-1 small text-muted text-center">
                <span v-if="index === 0" class="text-danger">(obligatoria)</span>
              </p>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-success w-auto mt-3">
            <i class="bi bi-floppy2 me-2"></i> Guardar Cambios
          </button>
        </div>
      </div>
    </form>
  </DashboardLayout>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

import '@/assets/css/form-create-update.css'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import { updateCarouselUseCase } from '@/domain/usecases/carousel/UpdateCarouselUseCase'
import type { CarouselGetModel } from '@/domain/models/CarouselModel'
import { fetchCarouselByIdUseCase } from '@/data/services/carousel/CarouselService'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const title = ref('')
const description = ref('')
const imagePreviews = ref<(string | null)[]>([null, null, null, null, null])
const imageFiles = ref<(File | null)[]>([null, null, null, null, null])
const imagesToUpdate = ref<number[]>([])
const imagesToDelete = ref<number[]>([]) // ✅ NUEVA REFERENCIA

// Obtener datos existentes
async function loadCarouselData() {
  try {
    const data: CarouselGetModel = await fetchCarouselByIdUseCase(id)
    title.value = data.title || ''
    description.value = data.description || ''
    imagePreviews.value = [
      data.image1 || null,
      data.image2 || null,
      data.image3 || null,
      data.image4 || null,
      data.image5 || null
    ]
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo cargar el carrusel', 'error')
    router.push('/admin/carousel/list')
  }
}

onMounted(loadCarouselData)

// Eliminar vista previa de una imagen
function removeImage(index: number) {
  imageFiles.value[index] = null
  imagePreviews.value[index] = null
  imagesToUpdate.value = imagesToUpdate.value.filter(i => i !== index)

  // ✅ Registrar índice para eliminación
  if (!imagesToDelete.value.includes(index)) {
    imagesToDelete.value.push(index)
  }
}

// Reemplazar una imagen existente
function handleImageChange(event: Event, index: number) {
  const file = (event.target as HTMLInputElement).files?.[0] || null
  if (file) {
    imageFiles.value[index] = file
    imagePreviews.value[index] = URL.createObjectURL(file)
    if (!imagesToUpdate.value.includes(index)) {
      imagesToUpdate.value.push(index)
    }

    // Si antes estaba marcado para eliminar y ahora hay nueva imagen, lo quitamos de imagesToDelete
    imagesToDelete.value = imagesToDelete.value.filter(i => i !== index)
  }
}

// Guardar cambios
async function handleSubmit() {
  const confirm = await Swal.fire({
    title: '¿Actualizar carrusel?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, actualizar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  })

  if (!confirm.isConfirmed) return

  // Validación: Imagen 1 es obligatoria
  if (!imagePreviews.value[0] && !imageFiles.value[0]) {
    Swal.fire('Error', 'La imagen 1 es obligatoria y no puede quedar vacía.', 'warning')
    return
  }

  const filesToSend = imageFiles.value.filter(f => f !== null)
  const indicesToSend = imageFiles.value
    .map((f, i) => (f !== null ? i : null))
    .filter(i => i !== null) as number[]

  const formDataPayload = {
    title: title.value,
    description: description.value,
    images_to_update: indicesToSend,
    images_to_delete: imagesToDelete.value
  }

  try {
  Swal.fire({
    title: 'Actualizando...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  })

  await updateCarouselUseCase(id, formDataPayload, filesToSend)

  Swal.close()
  await Swal.fire('Éxito', 'Carrusel actualizado correctamente.', 'success')

  // ✅ Redirige sin recargar la página
  await router.push('/admin/carousel/list')
} catch (err) {
  console.error('Error actualizando carrusel:', err)
  Swal.close()
  Swal.fire('Error', 'No se pudo actualizar el carrusel', 'error')
}
}

</script>

