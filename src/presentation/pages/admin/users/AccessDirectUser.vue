
<template>
    <DashboardLayout>
        <BreadCrumb :customRoutes="[
            { name: 'Accesos directo', path: '/admin/client', icon: 'bi bi-house' }
        ]" />
        <TitlePage
        title = "Accesos directos"
        paragraph= "Gestion general de los usuarios registrados en el sistema"        
        />
        <CategoriesFilterList />
        <br>
        <div class="container-card-access-direct">
        <AccesDirectCard
        href="/admin/users/list"
        icon="bi bi-people"
        title="Lista de usuarios"
        bgColor="#f5f5f585"
        textColor="white"
        />
        <AccesDirectCard
        href="/admin/users/create"
        icon="bi bi-plus-square"
        title="Registrar un nuevo usuario"
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