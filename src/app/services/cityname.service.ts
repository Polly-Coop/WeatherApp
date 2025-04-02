import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitynameService {

  public cityName$ = new Subject<string>();

  public changeCity(name: string) {
     this.cityName$.next(name); 
  }
}
