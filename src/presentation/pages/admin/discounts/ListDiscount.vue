<template>
  <DashboardLayout>
    <BreadCrumb :customRoutes="[
      { name: 'Accesos directo', path: '/admin/discount', icon: 'bi bi-house' },
      { name: 'Lista descuentos', icon: 'bi bi-tags' },
    ]" />

    <TitlePage title="Lista de Descuentos"
      paragraph="Listado completo de descuentos creados, asociados a productos y con fechas de vigencia." />

    <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap search-toolbar">
      <!-- Botones -->
      <div class="container-btns d-flex jusfify-content-between">
        <ButtonWidget href="/admin/discount/create" icon="bi bi-plus-circle" title="Crear descuento"
          color="btn-dark me-2" />
        <button class="btn btn-success me-2" @click="exportToExcelHandler">
          <i class="bi bi-filetype-xlsx me-1"></i>
        </button>
        <button class="btn btn-danger" @click="exportToPDFHandler" style="display: none;">
          <i class="bi bi-file-earmark-pdf me-1"></i>
        </button>
      </div>

      <!-- Buscador + filtro de estado -->
      <div class="d-flex align-items-center gap-3 mb-2">
        <!-- 🎯 Estado -->
        <select v-model="statusFilter" class="form-select form-select-sm">
          <option value="">Todos</option>
          <option value="ACTIVE">Activo</option>
          <option value="PENDING">Pendiente</option>
          <option value="EXPIRED">Expirado</option>
        </select>
        <!-- 🔍 Tipo búsqueda -->
        <select v-model="searchType" class="form-select form-select-sm">
          <option disabled value="">Buscar...</option>
          <option value="id">Por ID</option>
          <option value="name">Por Nombre</option>
          <option value="productId">Por Id/Prodct.</option>
        </select>

        <!-- 🔎 Input -->
        <input v-model="searchQuery"
          :placeholder="({
            id: 'ID del descuento',
            name: 'Nombre del descuento',
            productId: 'ID del producto'
          } as Record<string, string>)[searchType] || 'Buscar...'"
          class="form-control-search form-control-sm"
          type="text"
          :disabled="!searchType" style="width: 100%; max-width: 130px !important;" />
      </div>
    </div>

    <div class="content-2">
      <div class="table-responsive">
        <table class="table table-striped custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th class="text-center">Descripcion</th>
              <th class="text-center">Id/Producto</th>
              <th>Estado</th>
              <th class="text-center">Inicio</th>
              <th class="text-center">Fin</th>
              <th class="text-center">Creado</th>
              <th class="text-center">Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in filteredDiscounts" :key="d.id">
              <td>{{ d.id }}</td>
              <td>{{ d.name }}</td>
              <td>{{ d.description }}</td>
              <td class="text-center">
                <template v-if="d.product">{{ d.product.id }}</template>
                <template v-else>Sin producto</template>
              </td>
              <td>
                <span class="badge" :class="getStatusColor(d.status)">
                  {{ translateStatus(d.status) }}
                </span>
              </td>
              <td>{{ formatDate(d.startDate) }}</td>
              <td>{{ formatDate(d.endDate) }}</td>
              <td>{{ formatDate(d.createdAt) }}</td>
              <td>{{ formatDate(d.updatedAt) }}</td>
              <td>
                <div class="d-flex gap-2 justify-content-center">
                  <RouterLink :to="`/admin/discount/update/${d.id}`" class="btn btn-warning btn-sm">
                    <i class="bi bi-pencil"></i>
                  </RouterLink>
                  <button class="btn btn-danger btn-sm" @click="confirmDelete(d.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredDiscounts.length === 0">
              <td colspan="10" class="text-center">No se encontraron resultados</td>
            </tr>
          </tbody>
        </table>
      </div>
        <div class="cards-summary">
          <DiscountFilterTotal />
        </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import '@/assets/css/styles-table.css'
import { exportToExcel } from '@/utils/export/export-excel'
import { exportToPDF } from '@/utils/export/export-pdf'
import type { DiscountGetModel } from '@/domain/models/DiscountModel'
import { fetchDiscountsAdminUseCase } from '@/domain/usecases/discounts/GetDiscountsAdminUseCase'
import { deleteDiscountUseCase } from '@/domain/usecases/discounts/DeleteDiscountUseCase'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import ButtonWidget from '@/presentation/widgets/admin/buttons/ButtonWidget.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'
import DiscountFilterTotal from '@/presentation/widgets/admin/filters/DiscountFilterTotal.vue'

const discounts = ref<DiscountGetModel[]>([])
const searchType = ref<'id' | 'name' | 'productId' | ''>('')
const searchQuery = ref('')

onMounted(async () => {
    try {
        discounts.value = await fetchDiscountsAdminUseCase()
    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudieron cargar los descuentos', 'error')
    }
})

async function confirmDelete(id: number) {
    const result = await Swal.fire({
        title: '¿Eliminar descuento?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
        Swal.fire({
            title: 'Eliminando...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        })

        await deleteDiscountUseCase(id)
        discounts.value = await fetchDiscountsAdminUseCase()
        Swal.fire('Eliminado', 'Descuento eliminado correctamente.', 'success')
    } catch (err) {
        console.error(err)
        Swal.fire('Error', 'No se pudo eliminar el descuento.', 'error')
    }
}

function formatDate(dateString: string | null): string {
    if (!dateString) return 'Sin modificar'
    return new Date(dateString).toLocaleString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).replace(',', ' -')
}

async function exportToExcelHandler() {
    const result = await Swal.fire({
        icon: 'question',
        title: 'Exportar descuentos',
        text: '¿Deseas exportar los descuentos visibles a Excel?',
        showCancelButton: true,
        confirmButtonText: 'Exportar',
        cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    const data = filteredDiscounts.value.map(d => ({
        id: d.id,
        name: d.name,
        slogan: d.slogan,
        description: d.description,
        amount: d.amount,
        startDate: formatDate(d.startDate),
        endDate: formatDate(d.endDate),
        productId: d.product?.id ?? 'N/A',
        createdAt: formatDate(d.createdAt),
        updatedAt: formatDate(d.updatedAt),
    }))

    const columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Slogan', key: 'slogan', width: 30 },
        { header: 'Descripción', key: 'description', width: 40 },
        { header: 'Monto', key: 'amount', width: 10 },
        { header: 'Inicio', key: 'startDate', width: 20 },
        { header: 'Fin', key: 'endDate', width: 20 },
        { header: 'Producto ID', key: 'productId', width: 15 },
        { header: 'Creado', key: 'createdAt', width: 20 },
        { header: 'Actualizado', key: 'updatedAt', width: 20 },
    ]

    await exportToExcel(data, columns, 'REPORTE_DESCUENTOS.xlsx')
    Swal.fire('Éxito', 'Excel exportado correctamente.', 'success')
}

async function exportToPDFHandler() {
    const headers = ['ID', 'Nombre', 'Descripción', 'Monto', 'Inicio', 'Fin']
    const data = filteredDiscounts.value.map(d => [
        d.id,
        d.name ?? '',
        d.description ?? '',
        d.amount.toFixed(2),
        formatDate(d.startDate),
        formatDate(d.endDate),
    ])

    await exportToPDF({
        title: 'Reporte de Descuentos',
        headers,
        data,
        fileName: 'REPORTE_DESCUENTOS.pdf',
    })

    Swal.fire('Éxito', 'PDF exportado correctamente.', 'success')
}

// Add this function to provide badge color based on status
function translateStatus(status: string): string {
    switch (status.toUpperCase()) {
        case 'ACTIVE':
            return 'Activo'
        case 'PENDING':
            return 'Pendiente'
        case 'EXPIRED':
            return 'Expirado'
        default:
            return 'Desconocido'
    }
}

function getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
        case 'ACTIVE':
            return 'bg-success text-white' // Verde
        case 'PENDING':
            return 'bg-warning text-dark'  // Amarillo
        case 'EXPIRED':
            return 'bg-secondary text-white' // Gris
        default:
            return 'bg-dark text-white'
    }
}

//FILTER POR ESTADO: 
const statusFilter = ref('')

const filteredDiscounts = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    let list = [...discounts.value].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    if (statusFilter.value) {
        list = list.filter(d => d.status === statusFilter.value)
    }

    if (!query) return list

    return list.filter(d => {
        if (searchType.value === 'id') return d.id.toString().includes(query)
        if (searchType.value === 'name') return (d.name ?? '').toLowerCase().includes(query)
        if (searchType.value === 'productId') return d.product?.id?.toString().includes(query)
        return true
    })
})

</script>
<style scoped>
.form-select-sm {
  min-width: 140px;
}

.form-control-search {
  min-width: 180px;
}

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