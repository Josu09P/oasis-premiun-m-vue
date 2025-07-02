<template>
  <aside class="p-3 header-left d-flex flex-column" id="sidebar">
    <div class="d-flex justify-content-center align-items-center w-100 mb-4 container-initial">
      <h1 class="mb-0 text-truncate">Dashboard</h1>
    </div>

    <div class="d-flex justify-content-center align-items-center mb-4 container-role border"
      style="background-color: #f4f4f4; border-radius: 1.2rem;">
      <i class="bi bi-shield-lock-fill me-2"></i>
      <p class="mb-0 text-truncate text-uppercase" id="user-role" style="font-size: 13px; max-width: 200px;"></p>
    </div>

    <nav class="nav flex-column">
      <RouterLink class="nav-link text-orange" to="/admin/dashboard">
        <i class="bi bi-house-door-fill me-2"></i>Inicio
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/categories">
        <i class="bi bi-tags-fill me-2"></i>Categorías
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/carousel">
        <i class="bi bi-images me-2"></i>Carrusel
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/products">
        <i class="bi bi-boxes me-2"></i>Productos
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/discount">
        <i class="bi bi-percent me-2"></i>Descuentos
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/stock">
        <i class="bi bi-box-seam me-2"></i>Stock
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/orders">
        <i class="bi bi-clipboard-data me-2"></i>Pedidos
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/sales">
        <i class="bi bi-graph-up-arrow me-2"></i>Ventas
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/address">
        <i class="bi bi-geo-alt-fill me-2"></i>Direcciones
      </RouterLink>
      <RouterLink class="nav-link text-dark" to="/admin/clients">
        <i class="bi bi-people-fill me-2"></i>Clientes
      </RouterLink>
    </nav>

    <div class="d-flex justify-content-center align-items-center w-100 mt-auto container-footer">
      <p class="mb-0 text-truncate small text-muted">© 2025 Easypantry</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import Swal from 'sweetalert2'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useUserStore()
const ERROR_PAGE = '/error/401'
const LOGIN_PAGE = '/auth/login'
const VALID_ROLES = ['ADMIN', 'SUPER_ADMIN']
const MAX_SESSION_TIME = 6 * 60 * 60 * 1000 // 6 horas en ms

onMounted(() => {
  store.loadUserFromLocalStorage()
  const now = Date.now()
  const { role, loginTime } = store

  if (!VALID_ROLES.includes(role)) {
    console.warn('Rol no permitido')
    return router.replace(ERROR_PAGE)
  }

  if (now - loginTime > MAX_SESSION_TIME) {
    Swal.fire('Sesión expirada', 'Por favor inicia sesión nuevamente.', 'warning').then(() => {
      store.logout()
      router.replace(LOGIN_PAGE)
    })
    return
  }

  const userRole = document.getElementById('user-role')
  if (userRole) userRole.textContent = `${store.role}`
})
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
  font-size: 14px !important;
  padding: 10px;
  color: #52667d;
  font-weight: bold;
  text-align: center;
}

aside.header-left {
  height: 100%;
  display: flex;
  justify-content: space-between;
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
  font-size: 13px;
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
  padding: 20px 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}


.main-content.full-width {
  margin-left: 0;
}
</style>