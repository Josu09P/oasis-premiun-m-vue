// src/stores/discountStore.ts
import { defineStore } from 'pinia'
import type { DiscountGetModel } from '@/domain/models/DiscountModel'
import { fetchDiscountsAdminUseCase } from '@/domain/usecases/discounts/GetDiscountsAdminUseCase'


export const useDiscountStore = defineStore('discount', {
  state: () => ({
    discounts: [] as DiscountGetModel[],
    loading: false,
  }),
  actions: {
    async loadDiscounts() {
      try {
        this.loading = true
        this.discounts = await fetchDiscountsAdminUseCase()
      } catch (err) {
        console.error('Error al cargar descuentos en el store', err)
      } finally {
        this.loading = false
      }
    },
    setDiscounts(data: DiscountGetModel[]) {
      this.discounts = data
    }
  },
})
