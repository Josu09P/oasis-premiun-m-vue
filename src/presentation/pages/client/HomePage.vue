<!-- HomePage.vue -->
<template>
  <HomeClientLayout>
    <section id="section-home" v-show="activeSection === 'home'">
      <!-- Contenido Home -->
    </section>

    <section id="section-products" v-show="activeSection === 'products'">
      <!-- Contenido Productos -->
    </section>

    <section id="section-clima" v-show="activeSection === 'clima'">
      <Clima />
    </section>

    <section id="section-contact" v-show="activeSection === 'contact'">
      <!-- Contáctanos -->
    </section>
  </HomeClientLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import HomeClientLayout from '@/presentation/layouts/HomeClientLayout.vue'
import Clima from '@/presentation/widgets/client/views/clima.vue'

// Secciones válidas y por defecto
const validSections = ['home', 'products', 'clima', 'contact']
const activeSection = ref('home')

const handleHashChange = () => {
  const hash = window.location.hash.replace('#', '')
  activeSection.value = validSections.includes(hash) ? hash : 'home'
}

onMounted(() => {
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
})
</script>
