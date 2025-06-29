import { fetchCarouselsAdmin } from "@/data/services/carousel/CarouselService"
import type { CarouselGetModel } from "@/domain/models/CarouselModel"

export async function fetchCarouselsAdminUseCase(): Promise<CarouselGetModel[]> {
  return await fetchCarouselsAdmin()
}
