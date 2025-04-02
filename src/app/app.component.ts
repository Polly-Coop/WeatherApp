import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from './interfaces/weather';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './services/weather.service';
import { CityComponent } from "./components/city.component/city.component.component";
import { ForecastDaysComponent } from "./components/forecast-days/forecast-days.component";
import 'leaflet/dist/leaflet.css';
import { MapComponentComponent } from "./components/map.component/map.component.component";
import { GeolocationService } from './services/geolocation.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, CityComponent, ForecastDaysComponent, MapComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  constructor(
    private weatherService: WeatherService,
    private geolocationService: GeolocationService
  ) { }

  cityName: string = ""
  weatherData!: WeatherData
  currentThemeBack: string = "white"
  currentThemeText: string = "#333333"

  position: GeolocationPosition | null = null;
  loading = false;
  error: string | null = null;
  text: string = "Мое местоположение";

  getLocation(): void {
    this.loading = true;
    this.error = null;
    this.position = null;

    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.position = position;
        this.loading = false;
        this.text = `${this.position.coords.latitude}, ${position.coords.longitude}`
        localStorage.setItem("coord", this.text);
        this.getWeatherDataCoord(this.position.coords.latitude, position.coords.longitude)
      },
      error: (err) => {
        this.error = this.getErrorMessage(err);
        this.loading = false;
      }
    });
  }

  private getErrorMessage(error: GeolocationPositionError): string {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        return 'Доступ к геолокации запрещён. Разрешите доступ в настройках браузера.';
      case error.POSITION_UNAVAILABLE:
        return 'Информация о местоположении недоступна.';
      case error.TIMEOUT:
        return 'Время ожидания определения местоположения истекло.';
      default:
        return 'Произошла неизвестная ошибка при определении местоположения.';
    }
  }

  addItem(name: string) {
    localStorage.setItem("city", name)
    window.location.reload();
  }

  ngOnInit(): void {
    this.cityName = "Новозыбков"
    if (localStorage.getItem("city") != null) {
      this.cityName = localStorage.getItem("city")!;
    }
    if (localStorage.getItem("coord") != null) {
      this.text = localStorage.getItem("coord")!;
    }
    this.getWeatherData(this.cityName)
  }

  public getWeatherData(cityName: string) {

    //получение текущих данных по значение города
    this.weatherService.getWeatherData(cityName).subscribe({
      next: (response) => {

        this.weatherData = response;

      }
    });
  }

  public getWeatherDataCoord(lat: number, lon: number) {

    //получение текущих данных по значение координат
    this.weatherService.getWeatherDataCoord(lat, lon).subscribe({
      next: (response) => {

        this.weatherData = response;
        this.addItem(this.weatherData.name)
      }
    });
  }


  //методы для визуала
  public updateTheme(): void {
    this.currentThemeBack = this.currentThemeBack === 'white' ? 'black' : 'white'
    this.currentThemeText = this.currentThemeBack === 'white' ? '#333333' : 'white'
  }
  public getNaprWind(degrees: number) {
    const normalizedDegrees = ((degrees % 360) + 360) % 360;
    const directions = [
      'северный',
      'северо-восточный',
      'восточный',
      'юго-восточный',
      'южный',
      'юго-западный',
      'западный',
      'северо-западный'
    ];
    
    const index = Math.round(normalizedDegrees / 45) % 8;
    return directions[index];
  }

}
