import axios from "axios";

export interface WeatherResult {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
}

export const getWeather = async (
  city: string
): Promise<WeatherResult> => {
  const apiKey = process.env.OPENWEATHER_API_KEY!;

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        q: city,
        appid: apiKey,
        units: "metric",
      },
    }
  );

  const data = response.data;

  return {
    city: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
  };
};