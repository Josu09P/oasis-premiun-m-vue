import { updateCarouselFormData } from "@/data/services/carousel/CarouselService"
import type { CarouselGetModel } from "@/domain/models/CarouselModel"

interface UpdateCarouselPayload {
  title?: string;
  description?: string;
  is_enabled?: boolean;
  images_to_update?: number[];
  images_to_delete: number[];
}

export async function updateCarouselUseCase(
  id: number,
  data: UpdateCarouselPayload,
  files: File[] = []
): Promise<CarouselGetModel> {
  return await updateCarouselFormData(id, data, files);
}
