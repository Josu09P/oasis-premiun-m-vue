import { createCarousel } from "@/data/services/carousel/CarouselService"
import type { CarouselPostModel } from "@/domain/models/CarouselModel"

export async function createCarouselUseCase(formData: FormData): Promise<CarouselPostModel> {
  return await createCarousel(formData)
}
