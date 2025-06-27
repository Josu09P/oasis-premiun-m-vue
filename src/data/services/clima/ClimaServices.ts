import API_KEY_OPEN_WATHER from "@/data/api/ApiOpenWather";
import type { ForecastData } from "@/domain/models/ForecastModel";

export async function fetchForecastByCity(ciudad: string, unidades: "metric" | "imperial" = "metric"): Promise<ForecastData> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${API_KEY_OPEN_WATHER}&units=${unidades}&lang=es`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("No se pudo obtener la información del clima.");
    }

    const data: ForecastData = await response.json();
    return data;
}
    