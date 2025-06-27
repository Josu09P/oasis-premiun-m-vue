<template>
    <aside class="p-3 header-left d-flex flex-column" id="sidebar">
        <div class="d-flex justify-content-center align-items-center w-100 mb-4 container-initial">
            <h1 class="mb-0 text-truncate">Dashboard</h1>
        </div>
        <div class="d-flex justify-content-center align-items-center w-100 mb-4 container-role">
            <i class="fas fa-user-shield me-2"></i>
            <p class="mb-0 text-truncate text-uppercase" id="user-role" style="font-size: 15px; max-width: 200px;">
            </p>
        </div>
        <nav class="nav flex-column">
            <a class="nav-link text-orange" href="/admin/home">
                <i class="fas fa-home me-2"></i>Inicio
            </a>
            <a class="nav-link text-dark" href="#">
                <i class="fas fa-clipboard-list me-2"></i>Pedidos
            </a>
            <a class="nav-link text-dark" href="/admin/categories/DashboardCategories">
                <i class="fas fa-chart-line me-2"></i>Ventas
            </a>
            <a class="nav-link text-dark" href="/admin/products/DashboardProducts">
                <i class="fas fa-cubes me-2"></i>Productos
            </a>
            <a class="nav-link text-dark" href="/admin/discounts/DashboardDiscounts">
                <i class="fas fa-percent me-2"></i>Descuentos
            </a>
            <a class="nav-link text-dark" href="/admin/carousels/DashboardCarousel">
                <i class="fas fa-images me-2"></i>Carrusel
            </a>
            <a class="nav-link text-dark" href="/admin/roles/ListRoles">
                <i class="fas fa-user-shield me-2"></i>Roles
            </a>
            <a class="nav-link text-dark" href="/admin/categories/DashboardCategories">
                <i class="fas fa-map-marker-alt me-2"></i>Direcciones
            </a>
            <a class="nav-link text-dark" href="/admin/clients/DashboardClients">
                <i class="fas fa-users me-2"></i>Clientes
            </a>
            <a class="nav-link text-dark" href="/admin/categories/DashboardCategories">
                <i class="fas fa-tags me-2"></i>Categorias
            </a>
        </nav>
        <div class="d-flex justify-content-center align-items-center w-100 mt-auto container-footer">
            <p class="mb-0 text-truncate small text-muted">© 2025 Easypantry</p>
        </div>
    </aside>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/user'


const store = useUserStore()
const userName = document.getElementById('user-name')
const userImage = document.getElementById('user-image')

if (userName) userName.textContent = `👤 ${store.name}`
if (userImage) {
    userImage.setAttribute('src', store.image || DEFAULT_IMAGE)
    userImage.setAttribute('alt', store.name)
}

</script>

<style>
.container-initial {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.698);
    border-radius: 1.2em;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

.container-footer {
    width: 100%;
    margin-top: auto;
    background-color: rgba(255, 255, 255, 0.599);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    border-radius: 1.2em;
    padding: 10px;
    color: #52667d;
    font-weight: bold;
    text-align: center;
    font-size: 13px;
}

.container-initial h1 {
    font-size: 17px !important;
    padding: 10px;
    color: #52667d;
    font-weight: bold;
    text-align: center;
}

aside.header-left {
    height: 100%;
    width: auto;
    border-radius: 1.2em;
}

#sidebar.collapsed {
    display: none !important;
    animation: erase 0.3s ease-in-out;
}

.nav-link {
    background-color: rgba(255, 255, 255, 0.698);
    border-radius: 1.3em;
    color: #52667d !important;
    font-weight: 500;
    font-size: 15px;
    transition: all 0.3s ease-in-out;
    margin-bottom: 10px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

.nav-link:hover {
    border-radius: 1.3em;
    background-color: #52667d;
    color: white !important;
}

aside.header-left .container-role {
    color: #52667d;
    border-radius: 1.3em;
    padding: 10px !important;
    width: 100%;
    max-width: 330px;
    display: flex;
    align-items: center;
}

aside.header-left .container-role p {
    margin: 0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 15px;
    max-width: 200px;
    overflow: hidden;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#sidebar {
    transition: all 0.3s ease-in-out;
    min-width: 200px;
}

.main-content {
    transition: all 0.3s ease-in-out;
}

.main-content.expanded {
    width: calc(100% - 200px);
}

.main-content.full-width {
    width: 100%;
}

.sidebar-container {
    top: 20px;
    position: fixed;
    width: 200px;
    height: 95vh;
    z-index: 1000;
    overflow-y: auto;
    transition: all 0.3s ease-in-out;
    background-color: #f5f5f585;
    border-radius: 1.2em;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

.sidebar-container.collapsed {
    width: 0;
    overflow: hidden;
}

.main-content {
    margin-left: 215px;
    transition: all 0.3s ease-in-out;
    padding: 0 1rem;
}

.main-content.full-width {
    margin-left: 0;
}
</style>