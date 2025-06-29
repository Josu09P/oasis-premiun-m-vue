<template>
    <HomeClientLayout>
      <section class="container-products">
        <h1 class="title">🛍️ Nuestros Productos</h1>
  
        <div v-if="isLoading" class="loading">Cargando productos...</div>
  
        <div v-else class="grid-products">
          <div v-for="prod in products" :key="prod.id" class="product-card">
            <img
              :src="prod.image1 || '/src/assets/err/image-error.png'"
              alt="Producto"
              class="product-img"
            />
            <div class="product-info">
              <h2 class="product-name">{{ prod.name }}</h2>
              <p class="product-desc">{{ prod.description }}</p>
              <p class="product-price">S/ {{ prod.price }}</p>
            </div>
          </div>
        </div>
      </section>
    </HomeClientLayout>
  </template>
  
  <script setup lang="ts">
  import HomeClientLayout from '@/presentation/layouts/HomeClientLayout.vue'
  import { ref, onMounted } from 'vue'
  import { fetchProductsUseCase } from '@/domain/usecases/products/GetProductsUseCase'
  import type { ProductGetModel } from '@/domain/models/ProductsModel'
  
  const products = ref<ProductGetModel[]>([])
  const isLoading = ref(true)
  
  onMounted(async () => {
    try {
      products.value = await fetchProductsUseCase()
    } catch (err) {
      console.error('Error al obtener productos', err)
    } finally {
      isLoading.value = false
    }
  })
  </script>
  
  <style scoped>
  .container-products {
    padding: 3rem 2rem;
    background-color: #f0fdf4; /* fondo general más claro */
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2.5rem;
    text-align: center;
    color: #14532d;
    position: relative;
  }
  
  .title::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background-color: #16a34a;
    margin: 0.5rem auto 0;
    border-radius: 4px;
  }
  
  .loading {
    text-align: center;
    font-weight: 600;
    font-size: 1.2rem;
    color: #4b5563;
  }
  
  .grid-products {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2rem;
    justify-items: center;
  }
  
  .product-card {
    background-color: #dcfce7; /* verde claro */
    border-radius: 16px;
    box-shadow: 0 6px 12px rgba(21, 128, 61, 0.12);
    overflow: hidden;
    width: 100%;
    max-width: 320px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    border: 1px solid #bbf7d0;
  }
  
  .product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 20px rgba(21, 128, 61, 0.2);
  }
  
  .product-img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-bottom: 1px solid #a7f3d0;
  }
  
  .product-info {
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .product-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: #065f46;
  }
  
  .product-desc {
    font-size: 0.95rem;
    color: #4b5563;
    max-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .product-price {
    font-size: 1.1rem;
    font-weight: bold;
    color: #15803d;
    margin-top: 0.3rem;
  }
  </style>
  