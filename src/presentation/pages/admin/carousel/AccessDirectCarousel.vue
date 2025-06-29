<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directos', path: '/admin/carousel', icon: 'bi bi-house' }
        ]" />
        <TitlePage
        title = "Accesos directos"
        paragraph= "Gestion general del carrusel principal"        
        />
        <br>
        <ProductsFIlterList />
        <br>
        <div class="container-card-access-direct">
        <AccesDirectCard
        href="/admin/carousel/list"
        icon="bi bi-images"
        title="Lista de carruseles"
        bgColor="#f5f5f585"
        textColor="white"
        />
        <AccesDirectCard
        href="/admin/carousel/create"
        icon="bi bi-plus-square"
        title="Crear nuevo carrusell"
        bgColor="#f5f5f585"
        textColor="white"
        />

        </div>
    </DashboardLayout>
</template>
<script setup lang="ts">
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue';
import AccesDirectCard from '@/presentation/widgets/admin/cards/AccesDirectCard.vue';
import ProductsFIlterList from '@/presentation/widgets/admin/filters/ProductsFIlterList.vue';
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue';
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue';
</script>

<style scoped>
.container-card-access-direct {
    display: flex;
    justify-content: space-between;
}
</style>