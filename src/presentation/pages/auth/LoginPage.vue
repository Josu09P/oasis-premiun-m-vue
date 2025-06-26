<template>
  <div
    class="d-flex align-items-center justify-content-center min-vh-100 position-relative text-white login-background"
  >
    <section
      id="loginSection"
      class="bg-light text-dark p-4 rounded-3 shadow-lg w-100"
      style="max-width: 420px;"
    >
      <header class="mb-4 text-center">
        <!-- Reemplaza esto por un componente logo si lo tienes -->
        <img src="@/assets/img/icon-img.png" alt="Logo" style="max-height: 60px" />
        <p class="text-muted">Ingresa tus credenciales para acceder</p>
      </header>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Correo Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="loginEmail"
            placeholder="Ingresa tu correo"
            required
          />
        </div>
        <div class="mb-3">
          <label for="loginPassword" class="form-label">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="loginPassword"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        <button type="submit" class="btn btn-dark w-100" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
        <div class="text-center mt-3">
          ¿No tienes una cuenta?
          <RouterLink to="/auth/RegisterAuthPage" class="text-primary">Regístrate aquí</RouterLink>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LoginUser } from '@/domain/usecases/auth/LoginUser'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true
    await LoginUser({ email: email.value, password: password.value })
    // Redirige a dashboard o panel
    router.push('/dashboard')
  } catch (err: any) {
    alert('Error al iniciar sesión: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-background {
  background: linear-gradient(120deg, #3a3a3a, #9f7282);
}

.swal2-container {
  z-index: 9999 !important;
}

body {
  z-index: 1;
}

.hidden {
  display: none;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: black;
}

input::placeholder {
  color: rgba(58, 58, 58, 0.7);
}

button {
  width: 100%;
  padding: 10px;
  background: black;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #a56c7f;
}

.switch-text {
  margin-top: 10px;
}

.switch-text a {
  color: white;
  text-decoration: underline;
}
</style>
