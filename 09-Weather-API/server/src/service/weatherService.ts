import dotenv from 'dotenv';
import dayjs, {type Dayjs} from 'dayjs';
dotenv.config();

interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  county: string;
  state: string;
}

class Weather {
  constructor(
    public city: string,
    public date: Dayjs,
    public tempF: number,
    public windSpeed: number,
    public humidity: number,
    public icon: string,
    public iconDescription: string,
  ) {}
}

class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private city = "";

  constructor(
  ) {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
  }

  private async fetchLocationData(query: string) {
    try {
      if ((!this.baseURL || !this.apiKey)) {
        throw new Error("API base URL and key are required");
      }

      const response : Coordinates[] = await fetch(query).then(res => res.json());
      return response[0];
    } catch (error) {
      console.error(error);
    }
  } 

  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      throw new Error("Location data is required");
    }

    const { name, lat, lon, county, state } = locationData;

    const coordinates : Coordinates = { 
      name, 
      lat, 
      lon, 
      county, 
      state 
    };

    return coordinates;
  }

  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    return 
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {

  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {

  }
}

export default new WeatherService();
