<template>
    <div class="container-all-home">
        <Header />
        <main id="body-page-layout">
            <slot />
        </main>
        <Footer />
    </div>
</template>
<script setup lang="ts">
import Header from '@/presentation/widgets/client/Header.vue'
import Footer from '@/presentation/widgets/client/Footer.vue'
</script>
