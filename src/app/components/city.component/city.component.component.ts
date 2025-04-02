import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { WeatherDataSixDay, WeatherData } from '../../interfaces/weather';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitynameService } from '../../services/cityname.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-city',
  imports: [CommonModule, FormsModule],
  templateUrl: './city.component.component.html',
  styleUrl: './city.component.component.scss'
})
export class CityComponent {

  @Output() newItemEvent = new EventEmitter<string>();
  cityName: string = ""

  constructor(
        private cityNameService: CitynameService
      ) {}

  //срабатывает всякий раз при изменении значения города
  public onSubmit() {
      this.newItemEvent.emit(this.cityName);
      this.cityNameService.changeCity(this.cityName);
  }  
}
