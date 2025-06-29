<template>
  <header class="d-flex justify-content-between align-items-center px-4 py-3 header-top">
    <div class="d-flex align-items-center gap-4">
      <div class="container-title d-flex align-items-center gap-3">
        <LogoMain />
        <i class="bi bi-toggles" id="toggle-sidebar"></i>
      </div>
    </div>

    <div class="d-flex align-items-center gap-3">
      <div class="position-relative">
                <span style="color: #52667d !important;" class="me-2">Notificaciones</span>
                <i class="bi bi-chat-dots" style="color: #52667d !important;"></i>
            </div>
      <div class="d-flex align-items-center gap-2">
        <img
          :src="store.image || defaultImage"
          alt="user"
          class="rounded-circle"
          width="26"
          height="26"
        />
        <span style="color: #52667d !important;">{{ store.name }}</span>
        <i class="bi bi-person-circle" style="color: #52667d !important;"></i>
      </div>
      <div class="bounce-effect user-logout" @click="logout">
        <i class="bi bi-door-open" style="color: #52667d !important;"></i>
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
import { initializeSidebar } from '@/utils/sidebar'

const router = useRouter()
const store = useUserStore()
const defaultImage = '/src/assets/err/image-error.png'

onMounted(() => {
  store.loadUserFromLocalStorage()
  initializeSidebar()
})

const logout = async () => {
  const { isDenied } = await Swal.fire({
    title: 'Cerrar sesión',
    text: '¿Estás seguro de que quieres cerrar sesión?',
    icon: 'question',
    showDenyButton: true,
    denyButtonText: 'Cerrar sesión',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    showConfirmButton: false
  })

  if (isDenied) {
    store.logout()
    await Swal.fire('Sesión cerrada', '', 'success')
    router.push('/auth/login')
  }
}
</script>

<style scoped>
header.header-top {
  position: sticky;
  margin-top: -10px !important;
  z-index: 999;
  border-radius: 1.3em;
  margin-bottom: 20px;
  padding: 1rem;
  min-height: 70px;
  width: 100%;
  max-width: 100%;
}

#toggle-sidebar {
  cursor: pointer;
  margin-left: 10px;
  font-size: 1.5rem;
  width: 40px;
  height: 45px;
  text-align: center;
  padding: 5px;
  border-radius: 8px;
  color: #52667d;
  transition: color 0.3s ease;
}
</style>
