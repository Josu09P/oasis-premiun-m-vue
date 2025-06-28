<template>
    <DashboardLayout>
        <div class="container title-view">
            <h1>hello</h1>
        </div>
        <AccesDirectCard
        href="/admin/products"
        icon="bi bi-box-seam"
        title="Gestión de Productos"
        bgColor="#F87171"
        textColor="white"
        />
    </DashboardLayout>
</template>
<script setup lang="ts">
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue';
import AccesDirectCard from '@/presentation/widgets/admin/cards/AccesDirectCard.vue';


</script>