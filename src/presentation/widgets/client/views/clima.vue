<template>
  <div class="weather-app">
    <!-- Fondo animado -->
    <div class="animated-background">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>

    <div class="container mb-4 d-flex justify-content-center">
  <form @submit.prevent="buscarCiudad" class="d-flex" style="gap: 10px; height: 40px;">
    <input
      v-model="ciudad"
      type="text"
      class="form-control shadow-sm border-3"
      placeholder="Buscar ciudad..."
      required
      style="height: 100%; width: 300px;"
    />
    <button
      type="submit"
      class="btn"
      style="height: 99%;border: 2px solid; background-color: gray; color: white;"
    >
      Buscar
    </button>
  </form>
</div>


    <!-- Clima Actual -->
    <div v-if="forecast" class="current-weather-card">
      <div class="card-header">
        <h2 class="card-title">Clima Actual</h2>
        <div class="actions">
          <button @click="cambiarUnidades" class="action-btn units-btn">
            {{ unidades === 'metric' ? '°F' : '°C' }}
          </button>
          <button @click="buscarCiudad" class="action-btn refresh-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      <div class="current-weather-content">
        <div class="weather-main">
          <div class="weather-icon-temp">
            <img :src="icono" alt="Icono del clima" class="weather-icon" />
            <div class="temperature">
              <span class="temp-value">
                {{ hoy ? Math.round(hoy.main.temp) : '-' }}
              </span>
              <span class="temp-unit">°{{ unidades === 'metric' ? 'C' : 'F' }}</span>
            </div>
          </div>
          <div class="weather-description">
            <p class="description">{{ hoy && hoy.weather[0].description }}</p>
            <p class="feels-like">Sensación térmica: {{ sensacionTermica }}°</p>
          </div>
        </div>

        <div class="location-info">
          <h3 class="city-name">{{ forecast.city.name }}, {{ forecast.city.country }}</h3>
          <p class="coordinates">{{ forecast.city.coord.lat.toFixed(2) }}, {{ forecast.city.coord.lon.toFixed(2) }}</p>
          <p class="current-date">{{ fechaActual }}</p>
        </div>

        <div class="weather-details">
          <div class="detail-item">
            <span class="detail-label">Humedad</span>
            <span class="detail-value">{{ hoy?.main?.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Presión</span>
            <span class="detail-value">{{ hoy?.main.pressure }} hPa</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Viento</span>
            <span class="detail-value">{{ hoy?.wind.speed }} {{ unidades === 'metric' ? 'm/s' : 'mph' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Nubosidad</span>
            <span class="detail-value">{{ hoy?.clouds.all }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Amanecer</span>
            <span class="detail-value">{{ amanecer }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Atardecer</span>
            <span class="detail-value">{{ atardecer }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pronóstico -->
    <div v-if="forecast" class="forecast-section">
      <h3 class="forecast-title">Pronóstico para 4 días</h3>
      <div class="forecast-grid">
        <div v-for="(dia, index) in diasPronostico" :key="index" class="forecast-card">
          <div class="forecast-date">{{ formatearFecha(dia.dt) }}</div>
          <img :src="`https://openweathermap.org/img/wn/${dia.weather[0].icon}@2x.png`" alt="Icono clima"
            class="forecast-icon" />
          <div class="forecast-description">{{ dia.weather[0].description }}</div>
          <div class="forecast-temps">
            <span class="temp-max">{{ Math.round(dia.main.temp_max) }}°</span>
            <span class="temp-min">{{ Math.round(dia.main.temp_min) }}°</span>
          </div>
          <div class="forecast-wind">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
            </svg>
            {{ dia.wind.speed }} {{ unidades === 'metric' ? 'm/s' : 'mph' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-card">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FetchForecastUseCase } from '@/domain/usecases/clima/FetchForecastUseCase'
import type { ForecastData } from '@/domain/models/ForecastModel'

const ciudad = ref('Tarapoto')
const unidades = ref<'metric' | 'imperial'>('metric')
const forecast = ref<ForecastData | null>(null)
const error = ref('')

const hoy = computed(() => forecast.value?.list[0])
const icono = computed(() => hoy.value ? `https://openweathermap.org/img/wn/${hoy.value.weather[0].icon}@2x.png` : '')
const fechaActual = computed(() => hoy.value ? new Date(hoy.value.dt * 1000).toLocaleString('es-ES', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
}) : '')
const amanecer = computed(() => forecast.value ? new Date(forecast.value.city.sunrise * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '')
const atardecer = computed(() => forecast.value ? new Date(forecast.value.city.sunset * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '')

const sensacionTermica = computed(() => {
  return hoy.value && hoy.value.main ? Math.round(hoy.value.main.feels_like) : '-'
})

const diasPronostico = computed(() => {
  if (!forecast.value) return []
  return [1, 2, 3, 4].map(i => forecast.value!.list[i * 8]).filter(Boolean)
})

function formatearFecha(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
    weekday: 'long', month: 'short', day: 'numeric'
  })
}

async function buscarCiudad() {
  try {
    error.value = ''
    forecast.value = await FetchForecastUseCase(ciudad.value, unidades.value)
  } catch (err: any) {
    error.value = `No se pudo obtener el clima para "${ciudad.value}"`
    forecast.value = null
  }
}

function cambiarUnidades() {
  unidades.value = unidades.value === 'metric' ? 'imperial' : 'metric'
  buscarCiudad()
}
</script>

<style scoped>
.weather-app {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  background: linear-gradient(135deg, #dddddd 0%, #3a5a5f 100%);
  overflow: hidden;
}

/* Fondo animado */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.cloud {
  position: absolute;
  background: rgba(197, 197, 197, 0.333);
  border-radius: 70px;
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.cloud-1 {
  width: 100px;
  height: 50px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.cloud-2 {
  width: 80px;
  height: 40px;
  top: 60%;
  right: 15%;
  animation-delay: -7s;
}

.cloud-3 {
  width: 120px;
  height: 60px;
  top: 40%;
  left: 70%;
  animation-delay: -14s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }

  25% {
    transform: translateY(-20px) translateX(10px);
  }

  50% {
    transform: translateY(-10px) translateX(-5px);
  }

  75% {
    transform: translateY(-15px) translateX(8px);
  }
}

/* Contenedores principales */
.search-section,
.current-weather-card,
.forecast-section,
.error-card {
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

/* Buscador */
.search-section {
  padding: 1.5rem;
  max-width: 500px;
  margin: 0 auto 2rem auto;
}

.search-form {
  width: 100%;
}

.search-input-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.search-input::placeholder {
  color: #666;
}

.search-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 15px;
  padding: 1rem 1.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Clima Actual */
.current-weather-card {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto 2rem auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.card-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.current-weather-content {
  display: grid;
  gap: 2rem;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.weather-icon-temp {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-icon {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.temperature {
  display: flex;
  align-items: baseline;
  color: white;
}

.temp-value {
  font-size: 4rem;
  font-weight: 300;
  line-height: 1;
}

.temp-unit {
  font-size: 1.5rem;
  font-weight: 400;
  margin-left: 0.2rem;
}

.weather-description {
  flex: 1;
  min-width: 200px;
}

.description {
  color: white;
  font-size: 1.4rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  text-transform: capitalize;
}

.feels-like {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0;
}

.location-info {
  text-align: center;
  color: white;
}

.city-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.coordinates {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.current-date {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin: 0;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.detail-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.detail-value {
  color: white;
  font-weight: 600;
}

/* Pronóstico */
.forecast-section {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.forecast-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.forecast-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.forecast-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.forecast-date {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-transform: capitalize;
}

.forecast-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.forecast-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  text-transform: capitalize;
}

.forecast-temps {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.temp-max {
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
}

.temp-min {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.forecast-wind {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Error */
.error-card {
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #fff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .weather-app {
    padding: 1rem;
  }

  .weather-main {
    flex-direction: column;
    text-align: center;
  }

  .temp-value {
    font-size: 3rem;
  }

  .weather-details {
    grid-template-columns: 1fr;
  }

  .forecast-grid {
    grid-template-columns: 1fr;
  }
}
</style>