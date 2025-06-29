<template>
  <section class="section-products-summary">
    <div class="products-header d-flex justify-content-between align-items-center">
      <button @click="toggleList" class="btn btn-sm custom-btn-dark" style="width: 100%; max-width: 300px;">
        <i class="fas fa-list me-1"></i>
        {{ showList ? 'Ocultar Lista de Productos' : 'Mostrar Lista de Productos' }}
      </button>

      <div class="products-total">
        <span class="total-label">Total:</span>
        <span class="total-number">{{ products.length }}</span>
      </div>
    </div>

    <div v-show="showList" class="products-list mt-3">
      <div
        v-for="prod in products"
        :key="prod.id"
        class="product-item border-bottom py-3 px-2"
        @click="openModal(prod)"
      >
        <h5 class="mb-1 text-primary fw-bold">{{ prod.name }}</h5>
        <small class="text-muted">ID: {{ prod.id }}</small>
        <p class="text-secondary mb-2" style="font-style: italic;">
          {{ prod.description || 'Sin descripción' }}
        </p>
        <div class="text-muted" style="font-size: 0.85rem;">
          Precio: S/. {{ prod.price }} <br>
          Creado: {{ formatDate(prod.created_at ?? null) }}
        </div>
      </div>
    </div>

    <!-- Modal Detalles -->
    <div class="modal fade" id="product-modal" tabindex="-1" ref="productModalEl">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles del Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedProduct" class="product-details">
              <div class="detail-row"><strong>ID:</strong> {{ selectedProduct.id }}</div>
              <div class="detail-row"><strong>Nombre:</strong> {{ selectedProduct.name }}</div>
              <div class="detail-row"><strong>Descripción:</strong> {{ selectedProduct.description }}</div>
              <div class="detail-row"><strong>Precio:</strong> S/. {{ selectedProduct.price }}</div>
              <div class="detail-row"><strong>Categoría:</strong> {{ selectedProduct.category?.name || 'Sin categoría' }}</div>
              <div class="detail-row"><strong>Creado:</strong> {{ formatDate(selectedProduct.created_at ?? null) }}</div>
              <div class="detail-row"><strong>Actualizado:</strong> {{ formatDate(selectedProduct.updated_at ?? null) }}</div>
              <div class="detail-row mt-3">
                <div class="row g-2">
                  <div class="col-6 col-md-4" v-for="n in 4" :key="n">
                    <img
                      :src="getImage(selectedProduct, n) || '/src/assets/err/image-error.png'"
                      alt="Imagen producto"
                      class="img-thumbnail w-100"
                      @click="openImageModal(getImage(selectedProduct, n))"
                      style="cursor: pointer;"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal imagen ampliada -->
    <div class="modal fade" id="product-image-modal" tabindex="-1" ref="imageModalEl">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vista ampliada</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body text-center">
            <img :src="selectedImage ?? undefined" alt="Vista ampliada" class="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import '@/assets/css/list-products-filter.css'
import { fetchProducts } from '@/data/services/products/ProductsServices'
import type { ProductGetModel } from '@/domain/models/ProductsModel'

const products = ref<ProductGetModel[]>([])
const showList = ref(false)
const selectedProduct = ref<ProductGetModel | null>(null)
const selectedImage = ref<string | null>(null)

const productModalEl = ref<HTMLElement | null>(null)
const imageModalEl = ref<HTMLElement | null>(null)
let productModal: bootstrap.Modal
let imageModal: bootstrap.Modal

onMounted(async () => {
  try {
    products.value = await fetchProducts()
    productModal = new bootstrap.Modal(productModalEl.value!)
    imageModal = new bootstrap.Modal(imageModalEl.value!)
  } catch (error) {
    console.error('Error al obtener productos:', error)
  }
})

function toggleList() {
  showList.value = !showList.value
}

function openModal(product: ProductGetModel) {
  selectedProduct.value = product
  productModal.show()
}

function openImageModal(imageUrl: string | undefined) {
  if (imageUrl) {
    selectedImage.value = imageUrl
    imageModal.show()
  }
}

function getImage(product: ProductGetModel, index: number): string | undefined {
  return product[`image${index}` as keyof ProductGetModel] as string | undefined
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Sin registro'
  const date = new Date(dateStr)
  return date.toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<style scoped>
.section-products-summary {
  width: 100%;
  margin: 0 auto !important;
}
.products-header {
  padding: 5px;
  border-radius: 8px;
  margin: -5px;
}
.products-total {
  font-weight: bold;
}
.product-item {
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  background-color: aliceblue;
  border-radius: 10px;
}
</style>
