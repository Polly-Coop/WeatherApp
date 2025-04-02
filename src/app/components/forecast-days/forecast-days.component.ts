import { Component, Input, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { WeatherDataSixDay } from '../../interfaces/weather';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'forecast-days',
  imports: [CommonModule, FormsModule],
  templateUrl: './forecast-days.component.html',
  styleUrl: './forecast-days.component.scss'
})
export class ForecastDaysComponent implements OnInit {

  @Input() cityName: string = ""
  cntDay: number = 20
  pic: string[] = []
  forecast: string[] = ["Завтра"]
  weeks: string[] = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
  dates: string[] = []
  weatherDataSixDay!: WeatherDataSixDay

  constructor(
      private weatherService: WeatherService
    ) {}

  ngOnInit(): void {
    this.getWeatherData(this.cityName);
  }

  public getWeatherData(cityName: string) {

     //получение данных о погоде на 6 дней
        this.weatherService.getWeatherDataSixDay(cityName).subscribe({
                  next: (response) => {
            
                    this.weatherDataSixDay = response;
            
                    //дни недели
                    for (let i = 1; i < this.cntDay; i++) {
                      this.forecast.push(this.weeks[moment().add(i+1, 'days').weekday()])
                    }

                    //даты недели
                    for (let i = 0; i < this.cntDay; i++) {
                      this.dates.push(moment().add(i+1, 'days').format('DD.MM'))
                    }

                    //изображения для 10 дней
                    for (let i = 0; i < this.cntDay; i++) {
                      this.pic.push("/assets/" + this.weatherDataSixDay.list[i].weather[0].icon + ".png")
                    }
                  }
                })

  }

  public getUrl(index: number) {
    return `url(${this.pic[index]})`
  }


}
