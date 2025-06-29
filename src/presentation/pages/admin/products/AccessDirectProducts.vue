<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directo', path: '/admin/products', icon: 'bi bi-house' }
        ]" />
        <TitlePage
        title = "Accesos directos"
        paragraph= "Gestion general de productos"        
        />
        <br>
        <CategoriesFilterList />
        <br>
        <div class="container-card-access-direct">
        <AccesDirectCard
        href="/admin/products/list"
        icon="bi bi-card-list"
        title="Lista de Productos"
        bgColor="#f5f5f585"
        textColor="white"
        />
        <AccesDirectCard
        href="/admin/products/create"
        icon="bi bi-plus-square"
        title="Crear nuevo producto"
        bgColor="#f5f5f585"
        textColor="white"
        />

        </div>
    </DashboardLayout>
</template>
<script setup lang="ts">
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue';
import AccesDirectCard from '@/presentation/widgets/admin/cards/AccesDirectCard.vue';
import CategoriesFilterList from '@/presentation/widgets/admin/filters/CategoriesFilterList.vue';
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue';
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue';
</script>

<style scoped>
.container-card-access-direct {
    display: flex;
    justify-content: space-between;
}
</style>