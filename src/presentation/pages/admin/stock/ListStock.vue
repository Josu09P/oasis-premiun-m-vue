<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Inventario', path: '/admin/stock', icon: 'bi bi-box' },
            { name: 'Lista de stock', icon: 'bi bi-grid' },
        ]" />

        <TitlePage title="Lista de Stock" paragraph="Listado de productos con su cantidad actual en inventario." />

        <!-- BUSCADOR -->
        <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap search-toolbar">
            <div class="container-btns d-flex jusfify-content-between">
                <ButtonWidget href="/admin/stock/create" icon="bi bi-card-list" title="Agregar Stock"
                    color="btn-dark me-2" />
                <button class="btn btn-success me-2" @click="exportStockToExcel" style="width: 37px;">
                    <i class="bi bi-filetype-xlsx me-1"></i>
                </button>
                <button class="btn btn-danger" @click="exportStockToPDF" style="width: 37px;">
                    <i class="bi bi-file-earmark-pdf me-1"></i>
                </button>
            </div>

            <div class="d-flex align-items-center gap-2 mb-2">
                <select v-model="searchType" class="form-select form-select-sm">
                    <option disabled value="">Buscar...</option>
                    <option value="stockId">Por Id/Stock</option>
                    <option value="id">Por Id/Prdc.</option>
                    <option value="name">Por Nmbr./Prdc.</option>
                </select>

                <input v-model="searchQuery" class="form-control-search form-control-sm" type="text" :placeholder="searchType
                    ? { stockId: 'ID de stock', id: 'ID del producto', name: 'Nombre del producto' }[searchType]
                    : 'Selecciona tipo de búsqueda'" :disabled="!searchType" />
            </div>
        </div>

        <!-- TABLA -->
        <div class="content-2">
            <div class="table-responsive" style="max-height: 600px; overflow-y: auto;">
                <table class="table table-striped custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Fecha creación</th>
                            <th>Fecha actualización</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredStocks" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.product.name }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ formatDate(item.created_at || null) }}</td>
                            <td>{{ formatDate(item.updated_at || 'sin modificar') }}</td>
                            <td>
                                <div class="d-flex justify-content-center gap-2">
                                    <RouterLink :to="`/admin/stock/add/${item.product.id}`" class="btn btn-success btn-sm">
                                      <i class="bi bi-plus-circle"></i>
                                    </RouterLink>
                                    <RouterLink :to="`/admin/stock/update/${item.id}`" class="btn btn-warning btn-sm">
                                        <i class="bi bi-pen"></i>
                                    </RouterLink>
                                    <button class="btn btn-danger btn-sm" @click="handleDeleteStock(item.product.id)" style="width: 35px;">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>

                        </tr>
                        <tr v-if="filteredStocks.length === 0">
                            <td colspan="6" class="text-center">No se encontraron resultados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'
import '@/assets/css/styles-table.css'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import ButtonWidget from '@/presentation/widgets/admin/buttons/ButtonWidget.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'
import type { StockGetModel } from '@/domain/models/StockModel'
import { exportToExcel } from '@/utils/export/export-excel'
import { exportToPDF } from '@/utils/export/export-pdf'
import { getAllStocksUseCase } from '@/domain/usecases/stock/GetAllStocksUseCase'
import { deleteStockUseCase } from '@/domain/usecases/stock/DeleteStockUseCase'

const stocks = ref<StockGetModel[]>([])
const searchQuery = ref('')
const searchType = ref<'stockId' | 'id' | 'name' | ''>('')

onMounted(async () => {
    await loadStock()
})

async function loadStock() {
    try {
        stocks.value = await getAllStocksUseCase()
    } catch (error) {
        console.error('Error al cargar el stock', error)
        Swal.fire('Error', 'No se pudo cargar el stock', 'error')
    }
}

function formatDate(dateString: string | null): string {
    if (!dateString || dateString === 'sin modificar') return 'Sin modificar'

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }
    return new Date(dateString).toLocaleString('es-ES', options).replace(',', ' -')
}

async function handleDeleteStock(id_product: number) {
    const result = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esto eliminará el stock del producto seleccionado.',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    try {
        await deleteStockUseCase(id_product)
        stocks.value = stocks.value.filter(stock => stock.product.id !== id_product)
        Swal.fire('Eliminado', 'Stock eliminado correctamente.', 'success')
    } catch (error) {
        console.error('Error al eliminar stock', error)
        Swal.fire('Error', 'No se pudo eliminar el stock.', 'error')
    }
}


const filteredStocks = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) return stocks.value

    return stocks.value.filter(stock => {
        if (searchType.value === 'stockId') {
            return stock.id.toString().includes(query)
        }
        if (searchType.value === 'id') {
            return stock.product.id.toString().includes(query)
        }
        if (searchType.value === 'name') {
            return stock.product.name.toLowerCase().includes(query)
        }
        return true
    })
})

async function exportStockToExcel() {
    const result = await Swal.fire({
        icon: 'question',
        title: '¿Exportar a Excel?',
        text: '¿Deseas exportar el stock filtrado a Excel?',
        showCancelButton: true,
        confirmButtonText: 'Exportar',
        cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return

    const data = filteredStocks.value.map(stock => ({
        id: stock.id,
        product: stock.product.name,
        quantity: stock.quantity,
        created_at: formatDate(stock.created_at || null),
        updated_at: stock.updated_at ? formatDate(stock.updated_at || null) : 'Sin modificar',
    }))

    const columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Producto', key: 'product', width: 30 },
        { header: 'Cantidad', key: 'quantity', width: 15 },
        { header: 'Creado en', key: 'created_at', width: 20 },
        { header: 'Actualizado en', key: 'updated_at', width: 20 },
    ]

    await exportToExcel(data, columns, 'REPORTE_STOCK.xlsx')
    Swal.fire('Éxito', 'Archivo exportado correctamente.', 'success')
}

async function exportStockToPDF() {
    const result = await Swal.fire({
        icon: 'question',
        title: '¿Exportar a PDF?',
        text: '¿Deseas exportar el stock filtrado a PDF?',
        showCancelButton: true,
        confirmButtonText: 'Exportar',
        cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return

    const headers = ['ID', 'Producto', 'Cantidad', 'Creado en', 'Actualizado en']
    const data = filteredStocks.value.map(stock => [
        stock.id,
        stock.product.name,
        stock.quantity,
        formatDate(stock.created_at || null),
        stock.updated_at ? formatDate(stock.updated_at || null) : 'Sin modificar',
    ])

    await exportToPDF({
        title: 'Reporte de Stock',
        headers,
        data,
        fileName: 'REPORTE_STOCK.pdf',
    })

    Swal.fire('Éxito', 'PDF exportado correctamente.', 'success')
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
