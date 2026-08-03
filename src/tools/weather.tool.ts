import axios from "axios";

export interface WeatherResult {
  success: boolean;
  city?: string;
  temperature?: number;
  description?: string;
  humidity?: number;
  error?: string;
}

export const getWeather = async (
  city: string
): Promise<WeatherResult> => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY!;

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: apiKey,
          units: "metric",
        },
        timeout: 10000,
      }
    );

    const data = response.data;

    return {
      success: true,
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
    };
  } catch (error: any) {
    console.error(
      "Weather API Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      error: "Unable to fetch weather.",
    };
  }
};