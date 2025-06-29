import { fetchCarousels } from "@/data/services/carousel/CarouselService"
import type { CarouselGetModel } from "@/domain/models/CarouselModel"

export async function fetchCarouselsUseCase(): Promise<CarouselGetModel[]> {
  return await fetchCarousels()
}
