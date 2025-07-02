<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directo', path: '/admin/categories', icon: 'bi bi-house' },
            { name: 'Lista categorías', icon: 'bi bi-grid' },
        ]" />
        <TitlePage title="Lista de Categorias"
            paragraph="Lista de todas las categorias y gestion en general de el modulo de categorias" />
        <!-- BUSCADOR -->
        <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap search-toolbar">
            <div class="container-btns d-flex jusfify-content-between">
                <ButtonWidget href="/admin/categories/create" icon="bi bi-card-list" title="Crear categoría"
                    color="btn-dark me-2" />
                <button class="btn btn-success me-2" id="exportExcel" @click="exportCategoriesToExcel" style="display: none;">
                    <i class="bi bi-filetype-xlsx me-1"></i>
                </button>
                <button class="btn btn-danger" id="exportPdf" @click="exportCategoriesToPDF" style="display: none;">
                    <i class="bi bi-file-earmark-pdf me-1"></i>
                </button>
            </div>

            <div class="d-flex align-items-center gap-2 mb-2">
                <select v-model="searchType" class="form-select form-select-sm">
                    <option disabled value="">Buscar...</option>
                    <option value="id">Por Id</option>
                    <option value="name">Por Nombre</option>
                </select>

                <input v-model="searchQuery" :placeholder="searchType === 'id'
                    ? 'ID de categoría'
                    : searchType === 'name'
                        ? 'Nombre de categoría'
                        : 'Escoge el tipo de búsqueda'" class="form-control-search form-control-sm" type="text"
                    :disabled="!searchType" />

            </div>
        </div>
        <!-- TABLA -->
        <div class="content-2">
            <div class="table-responsive" style="max-height: 600px; overflow-y: auto;">
                <table class="table table-striped custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Fecha creación</th>
                            <th>Fecha actualización</th>
                            <th>Imagen</th>
                            <th style="text-align: center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cat in filteredCategories" :key="cat.id">
                            <td>{{ cat.id }}</td>
                            <td class="text-start">{{ cat.name }}</td>
                            <td class="text-start">{{ cat.description }}</td>
                            <td>{{ formatDate(cat.created_at || null) }}</td>
                            <td>{{ formatDate(cat.updated_at || 'sin modificar') }}</td>
                            <td>
                                <img :src="cat.image || '/src/assets/error/image-error.png'" width="60"
                                    class="img-thumbnail" />
                            </td>
                            <td>
                                <div class="d-flex justify-content-center gap-2">
                                    <RouterLink :to="`/admin/categories/update/${cat.id}`"
                                        class="btn btn-warning btn-sm">
                                        <i class="bi bi-pen"></i>
                                    </RouterLink>

                                    <button class="btn btn-danger btn-sm" @click="confirmDelete(cat.id)"
                                        style="width: 100%; max-width: 35px;">
                                        <i class="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredCategories.length === 0">
                            <td colspan="7" class="text-center">No se encontraron resultados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <div class="cards-summary">
                <CategoriesFilterTotal />
            </div>
        </div>
    </DashboardLayout>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'
import CategoriesFilterTotal from '@/presentation/widgets/admin/filters/CategoriesFilterTotal.vue'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import ButtonWidget from '@/presentation/widgets/admin/buttons/ButtonWidget.vue'
import { fetchCategoriesUseCase } from '@/domain/usecases/categories/GetCategoriesUseCase'
import { deleteCategoryUseCase } from '@/domain/usecases/categories/DeleteCategoryUseCase'
import type { CategoriesGetModel } from '@/domain/models/CategoriesModel'
import '@/assets/css/styles-table.css'
import { exportToExcel } from '@/utils/export/export-excel'
import { exportToPDF } from '@/utils/export/export-pdf'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'

const categories = ref<CategoriesGetModel[]>([])
const searchQuery = ref('')
const searchType = ref<'id' | 'name' | ''>('') // ← incluye '' como valor válido

onMounted(async () => {
    await loadCategories()
})

async function loadCategories() {
    try {
        categories.value = await fetchCategoriesUseCase()
    } catch (error) {
        console.error('Error al cargar categorías', error)
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error')
    }
}

function formatDate(dateString: string | null): string {
    if (!dateString || dateString === 'Sin modificar') return 'Sin modificar'

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }

    return new Date(dateString)
        .toLocaleString('es-ES', options)
        .replace(',', ' -') // separa fecha y hora
}

const filteredCategories = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) return categories.value

    if (searchType.value === 'id') {
        return categories.value.filter(cat => cat.id.toString().includes(query))
    }
    return categories.value.filter(cat =>
        cat.name.toLowerCase().includes(query)
    )
})

async function confirmDelete(id: number) {
    const result = await Swal.fire({
        title: '¿Eliminar categoría?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        try {
            await deleteCategoryUseCase(id)
            await Swal.fire('Eliminado', 'La categoría fue eliminada.', 'success')
            await loadCategories()
        } catch (err) {
            console.error(err)
            Swal.fire('Error', 'No se pudo eliminar la categoría', 'error')
        }
    }
}

// EXPORT IN XLSX LIST CATEGORIES
async function exportCategoriesToExcel() {
    const result = await Swal.fire({
        icon: 'question',
        title: 'Exportar categorías',
        text: '¿Deseas exportar las categorías visibles a Excel?',
        showCancelButton: true,
        confirmButtonText: 'Exportar',
        cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    const data = filteredCategories.value.map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        created_at: formatDate(cat.created_at || null),
        updated_at: cat.updated_at ? formatDate(cat.updated_at || null) : 'Sin modificar',
        image: cat.image ?? 'Sin imagen',
    }))

    const columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Descripción', key: 'description', width: 40 },
        { header: 'Creado en', key: 'created_at', width: 20 },
        { header: 'Actualizado en', key: 'updated_at', width: 20 },
        { header: 'Imagen', key: 'image', width: 40 },
    ]

    await exportToExcel(data, columns, 'REPORTE_CATEGORIAS.xlsx')

    Swal.fire('Éxito', 'Archivo exportado correctamente.', 'success')
}

// EXPORT IN DPF LIST CATEGORIES

async function exportCategoriesToPDF() {
    const result = await Swal.fire({
        icon: 'question',
        title: 'Exportar categorías',
        text: '¿Deseas exportar las categorías visibles a PDF?',
        showCancelButton: true,
        confirmButtonText: 'Exportar',
        cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    const headers = ['ID', 'Nombre', 'Descripción', 'Creado en', 'Actualizado en']
    const data = filteredCategories.value.map((cat) => [
        cat.id,
        cat.name,
        cat.description,
        formatDate(cat.created_at || null),
        cat.updated_at ? formatDate(cat.updated_at || null) : 'Sin modificar'
    ])

    await exportToPDF({
        title: 'Reporte de Categorías',
        headers,
        data,
        fileName: 'REPORTE_CATEGORIAS.pdf'
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
