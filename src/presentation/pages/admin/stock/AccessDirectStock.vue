<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directos', path: '/admin/stock', icon: 'bi bi-house' }
        ]" />
        <TitlePage
        title = "Accesos directos"
        paragraph= "Gestion general del stock principal"        
        />
        <CarouselFilterList />
        <br>
        <div class="container-card-access-direct">
        <AccesDirectCard
        href="/admin/stock/list"
        icon="bi bi-collection"
        title="Lista de stocks y gestión"
        bgColor="#f5f5f585"
        textColor="white"
        />
        <AccesDirectCard
        href="/admin/stock/create"
        icon="bi bi-plus-square"
        title="Añadir un nuevo stock"
        bgColor="#f5f5f585"
        textColor="white"
        />

        </div>
    </DashboardLayout>
</template>
<script setup lang="ts">
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue';
import AccesDirectCard from '@/presentation/widgets/admin/cards/AccesDirectCard.vue';
import CarouselFilterList from '@/presentation/widgets/admin/cards/CarouselCardDetail.vue';
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue';
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue';
</script>

<style scoped>
.container-card-access-direct {
    display: flex;
    justify-content: space-between;
}
</style>