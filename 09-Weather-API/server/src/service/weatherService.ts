import dotenv from 'dotenv';
import dayjs, {type Dayjs} from 'dayjs';
dotenv.config();

interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

class Weather {
  constructor(
    public city: string,
    public date: Dayjs | string,
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
  private city = ""

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
  }

  private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error("API base URL and key are required");
      }

      const response : Coordinates[] = await fetch(query).then(res => res.json());
      return response[0];
    } catch (error) {
      throw new Error(`Error fetching location data: ${error}`);
    }
  } 

  private destructureLocationData(locationData: Coordinates | any): Coordinates {
    if (!locationData) {
      throw new Error("Location data is required");
    }

    const { name, lat, lon, country, state } = locationData;

    const coordinates : Coordinates = { 
      name, 
      lat, 
      lon, 
      country, 
      state
    };

    return coordinates;
  }

  private buildGeocodeQuery(cityName: string): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }

  private buildWeatherQuery(coordinates: Coordinates) {
    const { lat, lon } = coordinates;
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }

  private async fetchAndDestructureLocationData(cityName: string) {
    return await this.fetchLocationData(this.buildGeocodeQuery(cityName)).then(locationData => this.destructureLocationData(locationData));
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      if (!response.ok) {
        throw new Error("Invalid weather data");
        
      }
      const data = await response.json();
      const currentWeather: Weather = this.parseCurrentWeather(data.list[0]);
      const forecast: Weather[] = this.buildForecastArray(currentWeather, data.list);
      return forecast;

    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private parseCurrentWeather(response: any) {
    const parsedDate = dayjs.unix(response.dt).format("MM/DD/YYYY");
    const currentWeather = new Weather(
      this.city,
      parsedDate,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main,
    );
    return currentWeather;
  }

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast: Weather[] = [currentWeather];
    const filteredWeatherData = weatherData.filter((data: any) =>  data.dt_txt.includes("12:00:00"));

    for (const day of filteredWeatherData) {
      forecast.push(new Weather(this.city, dayjs.unix(day.dt).format("MM/DD/YY"), day.main.temp, day.wind.speed, day.main.humidity, day.weather[0].icon, day.weather[0].description || day.weather[0].main));
    }
    return forecast;
  }

  async getWeatherForCity(city: string) {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData(city);
      if (coordinates && coordinates.name) {
        this.city = coordinates.name; 
        const weather = await this.fetchWeatherData(coordinates);
        return weather; 
      }
      throw new Error("Invalid city name");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  }

export default new WeatherService();
