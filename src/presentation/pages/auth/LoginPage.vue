<template>
  <div
    class="d-flex align-items-center justify-content-center min-vh-100 position-relative text-white login-background">
    <section id="loginSection" class="bg-light shadow text-dark p-4 rounded-3 w-100" style="max-width: 420px;">
      <header class="mb-4 text-center">
        <LogoMain />
        <p class="text-muted">Ingresa tus credenciales para acceder</p>
      </header>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Correo Email</label>
          <input v-model="email" type="email" class="form-control" id="loginEmail" placeholder="Ingresa tu correo"
            required />
        </div>
        <div class="mb-3">
          <label for="loginPassword" class="form-label">Contraseña</label>
          <input v-model="password" type="password" class="form-control" id="loginPassword"
            placeholder="Ingresa tu contraseña" required />
        </div>
        <button type="submit" class="btn btn-dark w-100" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
        <div class="text-center mt-3">
          ¿No tienes una cuenta?
          <RouterLink to="/auth/register" class="text-primary">Regístrate aquí</RouterLink>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LoginUser } from '@/domain/usecases/auth/LoginUser'
import LogoMain from '@/presentation/widgets/LogoMain.vue'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true

    Swal.fire({
      title: 'Espere un momento...',
      text: 'Verificando credenciales...',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    })

    const route = await LoginUser({ email: email.value, password: password.value })

    Swal.fire({
      title: 'Inicio de sesión exitoso',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      router.push(route) // ← redirige al dashboard según el rol
    })

  } catch (err: any) {
    Swal.fire('Error', 'Credenciales incorrectas o servidor no disponible', 'error')
  } finally {
    loading.value = false
  }
}

</script>