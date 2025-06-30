<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directos', path: '/admin/discount', icon: 'bi bi-house' }
        ]" />
        <TitlePage
        title = "Accesos directos"
        paragraph= "Gestion general de descuentos principal"        
        />
        <DiscountCardDetail />
        <br>
        <div class="container-card-access-direct">
        <AccesDirectCard
        href="/admin/discount/list"
        icon="bi bi-images"
        title="Lista de descuentos"
        bgColor="#f5f5f585"
        textColor="white"
        />
        <AccesDirectCard
        href="/admin/discount/create"
        icon="bi bi-plus-square"
        title="Crear nuevo descuento"
        bgColor="#f5f5f585"
        textColor="white"
        />

        </div>
    </DashboardLayout>
</template>
<script setup lang="ts">
import DiscountCardDetail from '@/presentation/widgets/admin/cards/DiscountCardDetail.vue'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue';
import AccesDirectCard from '@/presentation/widgets/admin/cards/AccesDirectCard.vue';
import BreadCrumb from '@/presentation/widgets/admin/links/BreadCrumb.vue';
import TitlePage from '@/presentation/widgets/admin/TitlePage.vue';
</script>

<style scoped>
.container-card-access-direct {
    display: flex;
    justify-content: space-between;
}
</style>