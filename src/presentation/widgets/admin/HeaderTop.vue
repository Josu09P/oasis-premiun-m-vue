<template>
    <header class="d-flex justify-content-between align-items-center px-4 py-3 header-top">
        <div class="d-flex align-items-center gap-4">
            <div class="container-title d-flex align-items-center gap-3">
                <LogoMain />
                <i class="bi bi-toggles" id="toggle-sidebar"></i>
            </div>

            <form class="d-flex" role="search">
                <input class="form-control" type="search" placeholder="Buscar..." aria-label="Buscar"
                    style="min-width: 200px; border-radius: 1.3em" />
            </form>
        </div>

        <div class="d-flex align-items-center gap-3">
            <div class="position-relative">
                <i class="fas fa-bell fs-5"></i>
                <span>Notificaciones</span>
                <span class="position-absolute top-0 start-100 translate-middle p-1 bg-orange rounded-circle"></span>
            </div>
            <div class="d-flex align-items-center gap-2">
                <i class="fas fa-adjust"></i>
                <span>Temas</span>
            </div>
            <div class="d-flex align-items-center gap-2">
                <img src="#" id="user-image" class="rounded-circle" width="32" height="32" />
                <span id="user-name"></span>
            </div>
            <div class="bounce-effect user-logout">
                <i class="bi bi-door-open" id="cerrar-sesion"></i>
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LogoMain from '@/presentation/widgets/LogoMain.vue'

const router = useRouter()
const store = useUserStore()
const DEFAULT_IMAGE = '/src/assets/err/image-error.png'
const ERROR_PAGE = '/error/401'
const LOGIN_PAGE = '/auth/login'
const VALID_ROLES = ['ADMIN', 'SUPER_ADMIN']
const MAX_SESSION_TIME = 6 * 60 * 60 * 1000 // 6 horas en ms

onMounted(() => {
  store.loadUserFromLocalStorage()

  // Validación completa
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

  // Mostrar datos visuales
  const userName = document.getElementById('user-name')
  const userImage = document.getElementById('user-image')

  if (userName) userName.textContent = `👤 ${store.name}`
  if (userImage) {
    userImage.setAttribute('src', store.image || DEFAULT_IMAGE)
    userImage.setAttribute('alt', store.name)
  }

  // Logout con sweetalert
  const logoutBtn = document.getElementById('cerrar-sesion')
  logoutBtn?.addEventListener('click', async (e) => {
    e.preventDefault()

    const { isDenied } = await Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Estás seguro de que quieres cerrar sesión?',
      icon: 'question',
      showDenyButton: true,
      denyButtonText: 'Cerrar sesión',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showConfirmButton: false,
    })

    if (isDenied) {
      store.logout()
      await Swal.fire('Sesión cerrada', '', 'success')
      router.push(LOGIN_PAGE)
    }
  })
})
</script>

<style scoped>
header.header-top {
    position: sticky;
    top:20px !important;
    z-index: 999;
    border-radius: 1.3em;
    margin-bottom: 20px;
}

#toggle-sidebar {
    cursor: pointer;
    margin-left: 10px;
    font-size: 1.5rem;
    background-color: white;
    padding: 5px;
    border-radius: 8px;
    color: #52667d;
    transition: color 0.3s ease;
}
</style>