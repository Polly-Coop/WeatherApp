import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherData, WeatherDataSixDay } from '../interfaces/weather';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  key: string = "9c0d979c5fb6887ff0b6498fc353e635"

  getWeatherData(cityName: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.key}&lang=ru&units=metric`)
  }

  getWeatherDataSixDay(cityName: string): Observable<WeatherDataSixDay> {
    return this.http.get<WeatherDataSixDay>(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.key}&lang=ru&units=metric`)
  }

  getWeatherDataCoord(lat: number, lon: number): Observable<WeatherData> {
    return this.http.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.key}&lang=ru&units=metric`)
  }
}
