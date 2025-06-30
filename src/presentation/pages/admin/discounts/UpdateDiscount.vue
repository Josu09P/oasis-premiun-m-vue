<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directo', path: '/admin/discount', icon: 'bi bi-house' },
            { name: 'Lista descuentos', path: '/admin/discount/list', icon: 'bi bi-tags' },
            { name: 'Actualizar', icon: 'bi bi-pencil-square' }
        ]" />

        <TitlePage title="Actualizar Descuento" paragraph="Edita los datos del descuento seleccionado." />

        <form @submit.prevent="submitHandler" class="container-fluid px-3 mt-3 form-create-update">
            <div class="row px-3 mb-3">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre del Descuento</label>
                    <input v-model="form.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Slogan</label>
                    <input v-model="form.slogan" type="text" class="form-control" required />
                </div>
            </div>

            <div class="row px-3 mb-3">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Buscar Producto</label>

                    <div class="d-flex gap-3 align-items-center mb-2">
                        <div class="form-check">
                            <input class="form-check-input me-2" type="radio" id="searchByName" value="name"
                                v-model="productSearchMode">
                            <label class="form-check-label" for="searchByName">Nombre</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input me-2" type="radio" id="searchById" value="id"
                                v-model="productSearchMode">
                            <label class="form-check-label" for="searchById">ID</label>
                        </div>
                    </div>

                    <input type="text" v-model="searchProduct" class="form-control"
                        :placeholder="productSearchMode === 'id' ? 'Ingrese ID del producto' : 'Ingrese nombre del producto'"
                        @focus="showProductDropdown = true" @blur="onProductInputBlur" />

                    <ul v-if="showProductDropdown" class="list-group position-absolute w-100 z-3 mt-1"
                        style="max-height: 200px; max-width: 400px; overflow-y: auto;">
                        <li v-for="p in filteredProducts" :key="p.id" class="list-group-item list-group-item-action"
                            @mousedown.prevent="selectProduct(p)">
                            ID: {{ p.id }} - {{ p.name }} - S/.{{ p.price }}
                        </li>
                    </ul>
                </div>

                <div class="col-md-6 mb-3" style="margin-top: 37px;">
                    <label class="form-label">Monto del Descuento (S/.)</label>
                    <input v-model.number="form.amount" type="number" min="0.01" step="0.01" class="form-control"
                        required />
                </div>
            </div>

            <div class="row px-3 mb-3">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha de Inicio</label>
                    <input v-model="form.startDate" type="datetime-local" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha de Fin</label>
                    <input v-model="form.endDate" type="datetime-local" class="form-control" required />
                </div>
            </div>

            <div class="row px-3 mb-3">
                <div class="col-12">
                    <label class="form-label">Descripción</label>
                    <textarea v-model="form.description" rows="3" class="form-control" required></textarea>
                </div>
            </div>

            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success w-auto mt-3">
                    <i class="bi bi-floppy2 me-2"></i> Guardar Cambios
                </button>
            </div>
        </form>
    </DashboardLayout>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import '@/assets/css/form-create-update.css'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue'
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue'
import { fetchProductsUseCase } from '@/domain/usecases/products/GetProductsUseCase'
import type { ProductGetModel } from '@/domain/models/ProductsModel'
import { fetchDiscountByIdUseCase } from '@/domain/usecases/discounts/GetDiscountByIdUseCase'
import { updateDiscountUseCase } from '@/domain/usecases/discounts/UpdateDiscountUseCase'

const route = useRoute()
const router = useRouter()
const discountId = Number(route.params.id)

const form = reactive({
    name: '',
    description: '',
    slogan: '',
    amount: 0,
    startDate: '',
    endDate: '',
    product: { id: 0, name: '' },
})

const searchProduct = ref('')
const productSearchMode = ref<'name' | 'id'>('name')
const showProductDropdown = ref(false)
const products = ref<ProductGetModel[]>([])

const filteredProducts = computed(() => {
    const query = searchProduct.value.toLowerCase().trim()
    if (!query) return products.value

    return products.value.filter(p => {
        return productSearchMode.value === 'name'
            ? p.name.toLowerCase().includes(query)
            : p.id.toString().includes(query)
    })
})

function onProductInputBlur() {
    setTimeout(() => {
        showProductDropdown.value = false
    }, 200)
}

function selectProduct(product: ProductGetModel) {
    form.product.id = product.id
    form.product.name = product.name
    searchProduct.value = `ID: ${product.id} - ${product.name} - ${product.price}`
    showProductDropdown.value = false
}

onMounted(async () => {
    try {
        products.value = await fetchProductsUseCase()
        const discount = await fetchDiscountByIdUseCase(discountId)
        form.name = discount.name
        form.description = discount.description
        form.slogan = discount.slogan
        form.amount = discount.amount
        form.startDate = discount.startDate.slice(0, 16)
        form.endDate = discount.endDate.slice(0, 16)
        form.product.id = discount.product?.id || 0
        form.product.name = discount.product?.name || ''
        searchProduct.value = discount.product ? `ID: ${discount.product.id} - ${discount.product.name}` : ''
    } catch (error) {
        console.error('Error al cargar datos:', error)
        Swal.fire('Error', 'No se pudieron cargar los datos del descuento', 'error')
    }
})

async function submitHandler() {
    const result = await Swal.fire({
        title: '¿Actualizar descuento?',
        text: '¿Estás seguro de que deseas guardar los cambios?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
        await updateDiscountUseCase(discountId, {
            name: form.name,
            description: form.description,
            slogan: form.slogan,
            amount: Number(form.amount), // 👈 forzar conversión aquí
            startDate: form.startDate,
            endDate: form.endDate,
            productId: Number(form.product.id), // 👈 por si acaso
        })


        await Swal.fire('Éxito', 'Descuento actualizado correctamente.', 'success')

        await Swal.fire({
            icon: 'info',
            title: 'Actualización de estado en proceso',
            text: 'El estado del descuento se actualizará automáticamente en menos de 1 minuto por seguridad del sistema.',
            timer: 5000,
            showConfirmButton: false,
            timerProgressBar: true,
        })

        router.push('/admin/discount/list')

    } catch (error) {
        console.error(error)
        Swal.fire('Error', 'No se pudo actualizar el descuento', 'error')
    }
}
</script>
