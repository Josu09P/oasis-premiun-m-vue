<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directo', path: '/admin/products', icon: 'bi bi-house' },
            { name: 'Lista productos', icon: 'bi bi-grid' },
        ]" />

        <TitlePage title="Lista de productos creados"
            paragraph="Listado general con gestión de productos, imágenes, categorías y control de stock." />

        <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap search-toolbar">
            <div class="container-btns d-flex jusfify-content-between">
                <ButtonWidget href="/admin/products/create" icon="bi bi-card-list" title="Crear producto"
                    color="btn-dark me-2" />
                <button class="btn btn-success me-2" id="exportExcel" @click="exportProductsToExcel" style="display: none;">
                    <i class="bi bi-filetype-xlsx me-1"></i>
                </button>
                <!--EN DESARROLLO, NO DISPONIBLE, NO TOCAR, ATT. JOSHO EL DEV-->
                <button class="btn btn-danger" id="exportPdf" @click="exportProductsToPDF" style="display: none;">
                    <i class="bi bi-file-earmark-pdf me-1"></i>
                </button>
            </div>

            <div class="d-flex align-items-center gap-2 mb-2">
                <select v-model="searchType" class="form-select form-select-sm">
                    <option disabled value="">Buscar...</option>
                    <option value="id">Por Id</option>
                    <option value="name">Por Nombre</option>
                </select>

                <input v-model="searchQuery"
                    :placeholder="searchType === 'id' ? 'ID del producto' : searchType === 'name' ? 'Nombre del producto' : 'Escoge el tipo de búsqueda'"
                    class="form-control-search form-control-sm" type="text" :disabled="!searchType" />
            </div>
        </div>

        <div class="content-2">
           <div class="table-responsive" style="overflow-x: auto;">
             <table class="table table-striped custom-table w-100">
                    <thead>
                        <tr>
                            <th style="width: 50px;">ID</th>
                            <th style="width: 150px;">Nombre</th>
                            <th style="width: 350px;">Descripción</th>
                            <th style="width: 80px;">Precio</th>
                            <th style="width: 150px;">Categoría</th>
                            <th style="width: 150px;">Fecha de creación</th>
                            <th style="width: 150px;">Fecha de actualización</th>
                            <th style="width: 270px; text-align: center;">Imágenes</th>
                            <th style="width: 100px;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="prod in filteredProducts" :key="prod.id">
                            <td>{{ prod.id }}</td>
                            <td>{{ prod.name }}</td>
                            <td>{{ prod.description }}</td>
                            <td>S/.{{ prod.price }}</td>
                            <td>{{ prod.category?.name || 'Sin categoría' }}</td>
                            <td>{{ formatDate(prod.created_at || null) }}</td>
                            <td>{{ formatDate(prod.updated_at || null) }}</td>
                            <td>
                                <div class="d-flex justify-content-around">
                                    <img v-for="n in 4" :key="n"
                                        :src="getProductImage(prod, n) || '/src/assets/err/image-error.png'"
                                        :alt="`Imagen ${n}`" width="45" height="45" class="img-thumbnail" />
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center gap-2">
                                    <RouterLink :to="`/admin/products/update/${prod.id}`"
                                        class="btn btn-warning btn-sm">
                                        <i class="bi bi-pen"></i>
                                    </RouterLink>
                                    <button class="btn btn-danger btn-sm" @click="confirmDelete(prod.id)"
                                        style="width: 100%; max-width: 35px;">
                                        <i class="bi bi-trash3"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredProducts.length === 0">
                            <td colspan="9" class="text-center">No se encontraron resultados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="cards-summary">
                <ProductsFilterTotal :total="products.length" />
            </div>
        </div>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import '@/assets/css/styles-table.css'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import ButtonWidget from '@/presentation/widgets/admin/buttons/ButtonWidget.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'
import { fetchProductsUseCase } from '@/domain/usecases/products/GetProductsUseCase'
import type { ProductGetModel } from '@/domain/models/ProductsModel'
import { exportToExcel } from '@/utils/export/export-excel'
import { exportToPDF } from '@/utils/export/export-pdf'
import { deleteProductByIdUseCase } from '@/domain/usecases/products/DeleteProductUseCase'
import ProductsFilterTotal from '@/presentation/widgets/admin/filters/ProductsFilterTotal.vue'

const products = ref<ProductGetModel[]>([])
const searchQuery = ref('')
const searchType = ref<'id' | 'name' | ''>('')

onMounted(loadProducts)

async function loadProducts() {
    try {
        products.value = await fetchProductsUseCase()
    } catch (err) {
        console.error('Error al cargar productos', err)
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error')
    }
}

function formatDate(dateString: string | null): string {
    if (!dateString) return 'Sin modificar'
    return new Date(dateString).toLocaleString('es-PE', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(',', ' -')
}

const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) return products.value

    return products.value.filter(prod => {
        if (searchType.value === 'id') return prod.id.toString().includes(query)
        return prod.name.toLowerCase().includes(query)
    })
})

async function confirmDelete(id: number) {
  const result = await Swal.fire({
    title: '¿Eliminar producto?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    try {
      // Mostrar carga mientras se elimina
      Swal.fire({
        title: 'Eliminando...',
        text: 'Por favor espera mientras se elimina el producto.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      await deleteProductByIdUseCase(id)
      await loadProducts()

      Swal.fire('Eliminado', 'El producto fue eliminado correctamente.', 'success')
    } catch (err) {
      console.error(err)
      Swal.fire('Error', 'No se pudo eliminar el producto.', 'error')
    }
  }
}


async function exportProductsToExcel() {
  const result = await Swal.fire({
    icon: 'question',
    title: 'Exportar productos',
    text: '¿Deseas exportar los productos visibles a Excel?',
    showCancelButton: true,
    confirmButtonText: 'Exportar',
    cancelButtonText: 'Cancelar',
  })

  if (!result.isConfirmed) return

  const data = filteredProducts.value.map(prod => ({
    id: prod.id,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    category: prod.category?.name || 'Sin categoría',
    created_at: formatDate(prod.created_at || null),
    updated_at: formatDate(prod.updated_at || null),
    image1: prod.image1 ?? 'Sin imagen',
    image2: prod.image2 ?? 'Sin imagen',
    image3: prod.image3 ?? 'Sin imagen',
    image4: prod.image4 ?? 'Sin imagen',
  }))

  const columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nombre', key: 'name', width: 30 },
    { header: 'Descripción', key: 'description', width: 40 },
    { header: 'Precio', key: 'price', width: 15 },
    { header: 'Categoría', key: 'category', width: 25 },
    { header: 'Creado en', key: 'created_at', width: 20 },
    { header: 'Actualizado en', key: 'updated_at', width: 20 },
    { header: 'Imagen 1', key: 'image1', width: 40 },
    { header: 'Imagen 2', key: 'image2', width: 40 },
    { header: 'Imagen 3', key: 'image3', width: 40 },
    { header: 'Imagen 4', key: 'image4', width: 40 },
  ]

  await exportToExcel(data, columns, 'REPORTE_PRODUCTOS.xlsx')
  Swal.fire('Éxito', 'Archivo exportado correctamente.', 'success')
}

async function exportProductsToPDF() {
    const headers = ['ID', 'Nombre', 'Descripción', 'Precio', 'Categoría', 'Creado en', 'Actualizado en']
    const data = filteredProducts.value.map(prod => [
        prod.id,
        prod.name,
        prod.description,
        prod.price,
        prod.category?.name || 'Sin categoría',
        formatDate(prod.created_at || null),
        formatDate(prod.updated_at || null)
    ])

    await exportToPDF({
        title: 'Reporte de Productos',
        headers,
        data,
        fileName: 'REPORTE_PRODUCTOS.pdf'
    })
    Swal.fire('Éxito', 'PDF exportado correctamente.', 'success')
}

// Helper function to safely access image fields
function getProductImage(prod: ProductGetModel, n: number): string | undefined {
    switch (n) {
        case 1: return prod.image1
        case 2: return prod.image2
        case 3: return prod.image3
        case 4: return prod.image4
        default: return undefined
    }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }

  .table {
    font-size: 0.875rem; /* texto más compacto */
  }

  .table thead th,
  .table tbody td {
    white-space: nowrap;
  }

  .img-thumbnail {
    max-width: 40px;
    max-height: 40px;
    object-fit: cover;
  }
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