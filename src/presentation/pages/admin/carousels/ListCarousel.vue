<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Accesos directo', path: '/admin/carousel', icon: 'bi bi-house' },
      { name: 'Lista carruseles', icon: 'bi bi-images' },
    ]" />

    <TitlePage title="Lista de Carruseles"
      paragraph="Listado completo de carruseles creados, con gestión de imágenes y estados." />

    <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap search-toolbar">
      <div class="container-btns d-flex jusfify-content-between">
        <ButtonWidget href="/admin/carousel/create" icon="bi bi-plus-circle" title="Crear carrusel"
          color="btn-dark me-2" />
        <button class="btn btn-success me-2" @click="exportToExcelHandler">
          <i class="bi bi-filetype-xlsx me-1"></i>
        </button>
        <!--EN MANTENIMIENTO POR ESO EL ATRIBUTO DE:  NONE  EN EL DISPLAY JIJIJI-->
        <button class="btn btn-danger" @click="exportToPDFHandler">
          <i class="bi bi-file-earmark-pdf me-1"></i>
        </button>
      </div>

      <div class="d-flex align-items-center gap-2 mb-2">
        <select v-model="searchType" class="form-select form-select-sm">
          <option disabled value="">Buscar...</option>
          <option value="id">Por ID</option>
          <option value="title">Por Título</option>
        </select>
        <input v-model="searchQuery" :placeholder="searchType === 'id' ? 'ID del carrusel' : 'Título del carrusel'"
          class="form-control-search form-control-sm" type="text" :disabled="!searchType" />
      </div>
    </div>

    <div class="content-2">
      <div class="table-responsive" style="max-height: 600px; overflow-y: auto; margin-top: 0; max-width: 100%;">
        <table class="table table-striped custom-table"
          style="table-layout: fixed; width: 100%; border:none; border-radius: 0;">
          <thead>
            <tr>
              <th style="width: 30px;">ID</th>
              <th class="text-center">Título</th>
              <th style="width: 300px;" class="text-center">Descripción</th>
              <th style="width: 80px;">Estado</th>
              <th class="text-center">Creado</th>
              <th class="text-center">Actualizado</th>
              <th style="width: 270px; text-align: center;">Imágenes</th>
              <th style="width: 200px; text-align: center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCarousels" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.description }}</td>
              <td>
                <span class="badge" :class="item.is_enabled ? 'bg-success' : 'bg-secondary'">
                  {{ item.is_enabled ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>{{ formatDate(item.updatedAt) }}</td>
              <td>
                <div class="d-flex justify-content-around">
                  <img v-for="i in 5" :key="i" :src="getImageSrc(item, i) || '/src/assets/err/image-error.png'"
                    class="img-thumbnail" width="45" height="45" />
                </div>
              </td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <!-- Activar / Desactivar -->
                  <button class="btn btn-secondary btn-sm" @click="handleToggleStatus(item)" style="width: 35px;"
                    :title="item.is_enabled ? 'Desactivar' : 'Activar'">
                    <i :class="item.is_enabled ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>

                  <!-- Editar -->
                  <RouterLink :to="`/admin/carousel/update/${item.id}`" class="btn btn-warning btn-sm"
                    style="width: 35px;">
                    <i class="bi bi-pen"></i>
                  </RouterLink>

                  <!-- Eliminar -->
                  <button class="btn btn-danger btn-sm" @click="confirmDelete(item.id)" style="width: 35px;">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>

            </tr>
            <tr v-if="filteredCarousels.length === 0">
              <td colspan="8" class="text-center">No se encontraron resultados</td>
            </tr>
          </tbody>
        </table>
      </div>
       <div class="cards-summary">
          <CarouselFilterTotal />
        </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import '@/assets/css/styles-table.css'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import ButtonWidget from '@/presentation/widgets/admin/buttons/ButtonWidget.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'

import { exportToExcel } from '@/utils/export/export-excel'
import { exportToPDF } from '@/utils/export/export-pdf'
import type { CarouselGetModel } from '@/domain/models/CarouselModel'
import { fetchCarouselsAdminUseCase } from '@/domain/usecases/carousel/GetCarouselsAdminUseCase'
import { deleteCarouselUseCase } from '@/domain/usecases/carousel/DeleteCarouselUseCase'
import { toggleCarouselStatusUseCase } from '@/domain/usecases/carousel/ToggleCarouselStatusUseCase'
import CarouselFilterTotal from '@/presentation/widgets/admin/filters/CarouselFilterTotal.vue'

const carousels = ref<CarouselGetModel[]>([])
const searchType = ref<'id' | 'title' | ''>('')
const searchQuery = ref('')

onMounted(async () => {
  try {
    carousels.value = await fetchCarouselsAdminUseCase()
  } catch (err) {
    console.error('Error al cargar carruseles', err)
    Swal.fire('Error', 'No se pudieron cargar los carruseles', 'error')
  }
})

const filteredCarousels = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  // 1. Copiar los carruseles para evitar mutaciones
  let list = [...carousels.value]

  // 2. Ordenar por fecha de creación descendente (más reciente primero)
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // 3. Aplicar filtro si hay búsqueda
  if (!query) return list

  return list.filter(item => {
    if (searchType.value === 'id') return item.id.toString().includes(query)
    if (searchType.value === 'title') return (item.title ?? '').toLowerCase().includes(query)
    return true
  })
})

async function handleToggleStatus(item: CarouselGetModel) {
  const nuevoEstado = !item.is_enabled

  // Mensaje diferente si se va a desactivar
  const confirmMessage = nuevoEstado
    ? '¿Deseas activar este carrusel?'
    : '¿Deseas desactivar este carrusel? Esto puede afectar la vista del cliente. Asegúrate de tener otro carrusel activo.'

  const confirm = await Swal.fire({
    title: 'Confirmar cambio de estado',
    text: confirmMessage,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: nuevoEstado ? 'Sí, activar' : 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  })

  if (!confirm.isConfirmed) return

  try {
    await toggleCarouselStatusUseCase(item.id, nuevoEstado)
    item.is_enabled = nuevoEstado // actualizar localmente
    Swal.fire(
      'Éxito',
      `Carrusel ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`,
      'success'
    )
  } catch (err) {
    console.error(err)
    Swal.fire('Error', 'No se pudo cambiar el estado del carrusel.', 'error')
  }
}


function formatDate(dateString: string | null): string {
  if (!dateString) return 'Sin modificar'
  return new Date(dateString).toLocaleString('es-PE', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).replace(',', ' -')
}

async function confirmDelete(id: number) {
  const result = await Swal.fire({
    title: '¿Eliminar carrusel?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    Swal.fire({
      title: 'Eliminando...',
      text: 'Por favor espera mientras se elimina el carrusel.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })

    await deleteCarouselUseCase(id)
    carousels.value = await fetchCarouselsAdminUseCase()
    Swal.fire('Eliminado', 'Carrusel eliminado correctamente.', 'success')
  } catch (error) {
    console.error(error)
    Swal.fire('Error', 'No se pudo eliminar el carrusel.', 'error')
  }
}

async function exportToExcelHandler() {
  const result = await Swal.fire({
    icon: 'question',
    title: 'Exportar carruseles',
    text: '¿Deseas exportar los carruseles visibles a Excel?',
    showCancelButton: true,
    confirmButtonText: 'Exportar',
    cancelButtonText: 'Cancelar',
  })

  if (!result.isConfirmed) return

  const data = filteredCarousels.value.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    is_enabled: c.is_enabled ? 'Activo' : 'Inactivo',
    created_at: formatDate(c.createdAt),
    updated_at: formatDate(c.updatedAt),
    image1: c.image1 ?? 'Sin imagen',
    image2: c.image2 ?? 'Sin imagen',
    image3: c.image3 ?? 'Sin imagen',
    image4: c.image4 ?? 'Sin imagen',
    image5: c.image5 ?? 'Sin imagen',
  }))

  const columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Título', key: 'title', width: 30 },
    { header: 'Descripción', key: 'description', width: 40 },
    { header: 'Estado', key: 'is_enabled', width: 15 },
    { header: 'Creado', key: 'created_at', width: 20 },
    { header: 'Actualizado', key: 'updated_at', width: 20 },
    { header: 'Imagen 1', key: 'image1', width: 40 },
    { header: 'Imagen 2', key: 'image2', width: 40 },
    { header: 'Imagen 3', key: 'image3', width: 40 },
    { header: 'Imagen 4', key: 'image4', width: 40 },
    { header: 'Imagen 5', key: 'image5', width: 40 },
  ]

  await exportToExcel(data, columns, 'REPORTE_CARRUSELES.xlsx')
  Swal.fire('Éxito', 'Excel exportado correctamente.', 'success')
}


async function exportToPDFHandler() {
  const headers = ['ID', 'Título', 'Descripción', 'Estado', 'Creado', 'Actualizado']
  const data = filteredCarousels.value.map(c => [
    c.id ?? '',
    c.title ?? '',
    c.description ?? '',
    c.is_enabled ? 'Activo' : 'Inactivo',
    formatDate(c.createdAt ?? ''),
    formatDate(c.updatedAt ?? '')
  ])

  await exportToPDF({
    title: 'Reporte de Carruseles',
    headers,
    data,
    fileName: 'REPORTE_CARRUSELES.pdf'
  })
  Swal.fire('Éxito', 'PDF exportado correctamente.', 'success')
}

// Helper to safely access image properties
function getImageSrc(item: CarouselGetModel, i: number): string | undefined {
  switch (i) {
    case 1: return item.image1
    case 2: return item.image2
    case 3: return item.image3
    case 4: return item.image4
    case 5: return item.image5
    default: return undefined
  }
}
</script>

<style scoped>
.search-toolbar {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
}

/* Asegúrate de que los botones se ajusten al contenido */
.container-btns button {
  display: inline-flex;
  align-items: center;
  height: 38px;
  width: 100%;
  max-width: 38px;
  font-weight: 500;
  padding: 0 10px;
  border-radius: 8px;
  white-space: nowrap;
  /* Evita que el texto se rompa en varias líneas */
}

#exportExcel,
#exportPdf {
  display: inline-flex;
  align-items: center;
  height: 38px;
  width: 100%;
  max-width: 37px;
  font-weight: 500;
  padding: 0 10px;
  border-radius: 8px;
  white-space: nowrap;
}

.form-select {
  width: 100%;
  max-width: 150px;
  text-align: center;
}

input.form-control-search {
  width: 100%;
}

/* Input y select modernos */
.search-toolbar {
  background-color: #f5f5f5a4;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

.search-toolbar input,
.search-toolbar select {
  height: 38px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 0 10px;
  background-color: #f5f5f585;
  transition: border-color 0.2s ease-in-out;
}

.search-toolbar input:focus,
.search-toolbar select:focus {
  outline: none;
  border-color: #198754;
  box-shadow: 0 0 0 0.15rem rgba(25, 135, 84, 0.25);
}

/* Responsive gap */
@media (max-width: 768px) {
  .search-toolbar {
    flex-direction: column;
  }

  .container-btns,
  .search-toolbar .d-flex {
    width: 100%;
    justify-content: start;
    flex-wrap: wrap;
  }
}
</style>