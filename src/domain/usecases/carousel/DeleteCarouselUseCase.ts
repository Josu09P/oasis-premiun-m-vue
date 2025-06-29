import { deleteCarouselById } from "@/data/services/carousel/CarouselService"

export async function deleteCarouselUseCase(id: number): Promise<void> {
  return await deleteCarouselById(id)
}
