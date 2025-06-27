import { fetchForecastByCity } from "@/data/services/clima/ClimaServices"
import type { ForecastData } from "@/domain/models/ForecastModel"

export async function FetchForecastUseCase(ciudad: string, unidades: "metric" | "imperial" = "metric"): Promise<ForecastData> {
    // Aquí podrías meter transformación de datos si necesitas en el futuro
    return await fetchForecastByCity(ciudad, unidades)
}
