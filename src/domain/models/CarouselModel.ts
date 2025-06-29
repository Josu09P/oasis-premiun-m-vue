export interface CarouselGetModel {
  id: number
  title?: string
  description?: string
  image1?: string
  image2?: string
  image3?: string
  image4?: string
  image5?: string
  is_enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CarouselPostModel {
  title?: string
  description?: string
  image1?: string
  image2?: string
  image3?: string
  image4?: string
  image5?: string
}
