<template>
  <section class="section-categories-summary">
    <div class="categories-header d-flex justify-content-between align-items-center">
      <button @click="toggleList" class="btn btn-sm custom-btn-dark" id="toggle-categories-btn" style="width: 100%; max-width: 300px;">
        <i class="fas fa-list me-1"></i>
        {{ showList ? 'Ocultar Lista de Categorías' : 'Mostrar Lista de Categorías' }}
      </button>

      <div class="categories-total">
        <span class="total-label">Total:</span>
        <span class="total-number">{{ categories.length }}</span>
      </div>
    </div>

    <div v-show="showList" class="categories-list mt-3">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="category-item border-bottom py-3 px-2"
        @click="openModal(cat)"
      >
        <h5 class="mb-1 text-primary fw-bold">{{ cat.name }}</h5>
        <small class="text-muted">ID: {{ cat.id }}</small>
        <p class="text-secondary mb-2" style="font-style: italic;">
          {{ cat.description || 'Sin descripción' }}
        </p>
        <div class="text-muted" style="font-size: 0.85rem;">
          Creado: {{ formatDate(cat.created_at) }}
        </div>
      </div>
    </div>

    <!-- Modal Detalles -->
    <div class="modal fade" id="category-modal" tabindex="-1" ref="categoryModalEl">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de Categoría</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedCategory" class="category-details">
              <div class="detail-row"><strong>ID:</strong> {{ selectedCategory.id }}</div>
              <div class="detail-row"><strong>Nombre:</strong> {{ selectedCategory.name }}</div>
              <div class="detail-row"><strong>Descripción:</strong> {{ selectedCategory.description }}</div>
              <div class="detail-row"><strong>Creado:</strong> {{ formatDate(selectedCategory.created_at) }}</div>
              <div class="detail-row"><strong>Actualizado:</strong> {{ formatDate(selectedCategory.updated_at) }}</div>
              <div class="detail-row mt-3" v-if="selectedCategory.image">
                <img :src="selectedCategory.image" alt="Imagen categoría" class="img-thumbnail" style="width: 100%" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchCategories } from '@/data/services/categories/CategoriesServices'
import * as bootstrap from 'bootstrap'
import '@/assets/css/list-filter.css'

interface Category {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  image?: string
}

const categories = ref<Category[]>([])
const showList = ref(false)
const selectedCategory = ref<Category | null>(null)
const categoryModalEl = ref<HTMLElement | null>(null)
let categoryModal: bootstrap.Modal

onMounted(async () => {
  try {
    const fetched = await fetchCategories()
    categories.value = fetched.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description ?? '',
      created_at: cat.created_at ?? '',
      updated_at: cat.updated_at ?? '',
      image: cat.image
    }))
    categoryModal = new bootstrap.Modal(categoryModalEl.value!)
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  }
})

function toggleList() {
  showList.value = !showList.value
}

function openModal(category: Category) {
  selectedCategory.value = category
  categoryModal.show()
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>
