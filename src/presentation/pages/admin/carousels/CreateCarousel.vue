<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directo', path: '/admin/carousel', icon: 'bi bi-house' },
            { name: 'Lista carruseles', path: '/admin/carousel/list', icon: 'bi bi-images' },
            { name: 'Crear', icon: 'bi bi-plus-circle' }
        ]" />

        <TitlePage title="Crear carrusel" paragraph="Formulario para registrar un nuevo carrusel." />

        <form class="form-create-update" @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <div class="row g-4">
                <div class="col-md-6">
                    <label for="title" class="form-label">Título</label>
                    <input v-model="title" type="text" class="form-control" id="title"
                        placeholder="Título del carrusel" required/>
                </div>

                <div class="col-md-6">
                    <label for="description" class="form-label">Descripción</label>
                    <input v-model="description" type="text" class="form-control" id="description"
                        placeholder="Descripción breve" required />
                </div>

                <div class="col-12">
                    <label class="form-label">Imágenes del Carrusel</label>
                    <div class="alert alert-info py-2 px-3 mb-3" style="font-size: 0.9rem;">
                        <strong>Nota:</strong> La <strong>Imagen 1</strong> es obligatoria. Las imágenes 2, 3, 4 y 5 son
                        opcionales.
                    </div>
                    <div class="row g-2">
                        <div class="col-6 col-md-3" v-for="(preview, index) in imagePreviews" :key="index">
                            <input type="file" class="form-control" accept="image/*"
                                @change="e => handleImageChange(e, index)" />
                            <div v-if="preview" class="position-relative mt-2">
                                <img :src="preview" alt="Vista previa" class="img-thumbnail" width="300" />
                                <button type="button" @click="removeImage(index)"
                                    class="btn btn-light btn-sm position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
                                    style="width: 22px; height: 22px; border-radius: 50%; font-size: 12px; padding: 0; transform: translate(40%, -40%); box-shadow: 0 0 3px rgba(0,0,0,0.2);">
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
                        <i class="bi bi-floppy2 me-2"></i> Crear Carrusel
                    </button>
                </div>
            </div>
        </form>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import '@/assets/css/form-create-update.css'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'
import { createCarouselUseCase } from '@/domain/usecases/carousel/CreateCarouselUseCase'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'

const title = ref('')
const description = ref('')
const imageFiles = ref<(File | null)[]>([null, null, null, null, null])
const imagePreviews = ref<(string | null)[]>([null, null, null, null, null])

//ELIMINAR IMAGEN MAL SELECCIONADA:
function removeImage(index: number) {
    imageFiles.value[index] = null
    imagePreviews.value[index] = null
}

function handleImageChange(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0] || null
    if (file) {
        imageFiles.value[index] = file
        imagePreviews.value[index] = URL.createObjectURL(file)
    }
    if (!title.value.trim() || !description.value.trim()) {
    Swal.fire('Campos requeridos', 'Por favor completa el título y la descripción.', 'warning')
    return
  }

  const filledFiles = imageFiles.value.filter(f => f !== null)
  if (filledFiles.length === 0) {
    Swal.fire('Error', 'Debes subir al menos una imagen', 'error')
    return
  }
}

async function handleSubmit() {
    const filledFiles = imageFiles.value.filter(f => f !== null)
    if (filledFiles.length === 0) {
        Swal.fire('Error', 'Debes subir al menos una imagen', 'error')
        return
    }

    const confirm = await Swal.fire({
        title: '¿Crear carrusel?',
        text: '¿Estás seguro de que deseas crear este carrusel?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    })

    if (!confirm.isConfirmed) return

    const formData = new FormData()
    if (title.value) formData.append('title', title.value)
    if (description.value) formData.append('description', description.value)
    imageFiles.value.forEach(file => {
        if (file) formData.append('files[]', file)
    })

    try {
        Swal.fire({
            title: 'Creando carrusel...',
            text: 'Espere mientras se suben las imágenes.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        })

        await createCarouselUseCase(formData)

        Swal.fire('Éxito', 'Carrusel creado correctamente.', 'success')

        // Limpiar formulario
        title.value = ''
        description.value = ''
        imageFiles.value = [null, null, null, null, null]
        imagePreviews.value = [null, null, null, null, null]
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudo crear el carrusel.', 'error')
    }
}

</script>

<style scoped>
.img-thumbnail {
    height: auto;
    max-height: 120px;
    object-fit: cover;
}
</style>