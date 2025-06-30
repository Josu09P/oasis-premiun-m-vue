// src/stores/carouselStore.ts
import { defineStore } from 'pinia'
import type { CarouselGetModel } from '@/domain/models/CarouselModel'
import { fetchCarouselsAdmin } from '@/data/services/carousel/CarouselService'

export const useCarouselStore = defineStore('carousel', {
  state: () => ({
    carousels: [] as CarouselGetModel[],
    loading: false,
  }),
  actions: {
    async loadCarousels() {
      try {
        this.loading = true
        this.carousels = await fetchCarouselsAdmin()
      } catch (err) {
        console.error('Error al cargar carruseles en el store', err)
      } finally {
        this.loading = false
      }
    },
    setCarousels(data: CarouselGetModel[]) {
      this.carousels = data
    }
  },
})
