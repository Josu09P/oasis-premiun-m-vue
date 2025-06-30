import { toggleCarouselStatus } from "@/data/services/carousel/CarouselService";

export async function toggleCarouselStatusUseCase(id: number, is_enabled: boolean): Promise<void> {
  return await toggleCarouselStatus(id, is_enabled)
}
