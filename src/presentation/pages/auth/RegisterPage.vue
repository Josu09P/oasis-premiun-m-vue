<template>
  <div
    class="d-flex align-items-center justify-content-center min-vh-100 position-relative text-white register-background">
    <section class="bg-light text-dark p-4 rounded-3 shadow-lg w-100" style="max-width: 480px;">
      <header class="mb-4 text-center">
        <LogoMain />
        <p class="text-muted">Crea una nueva cuenta</p>
      </header>
      <form @submit.prevent="handleRegister">
        <div class="row">
          <div class="mb-3 col-md-6">
            <label class="form-label">Nombre</label>
            <input v-model="form.name" type="text" class="form-control" required />
          </div>
          <div class="mb-3 col-md-6">
            <label class="form-label">Apellido</label>
            <input v-model="form.lastname" type="text" class="form-control" required />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Correo Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Teléfono</label>
          <input v-model="form.phone" type="text" class="form-control" required maxlength="9" pattern="\d{9}" />
        </div>
        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input v-model="form.password" type="password" class="form-control" required />
        </div>

        <button type="submit" class="btn btn-dark w-100" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>

        <div class="text-center mt-3">
          ¿Ya tienes una cuenta?
          <RouterLink to="/auth/login" class="text-primary">Inicia sesión</RouterLink>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RegisterModel } from '@/domain/models/AuthModel'
import { RegisterUser } from '@/domain/usecases/auth/RegisterUser'
import LogoMain from '@/presentation/widgets/LogoMain.vue'

const router = useRouter()
const loading = ref(false)

const form = ref<RegisterModel>({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  password: ''
})

async function handleRegister() {
  try {
    loading.value = true
    await RegisterUser(form.value)
    router.push('/auth/login')
  } catch (err: any) {
    alert('Error al registrarse: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>
