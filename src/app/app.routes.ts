import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CityComponent } from './components/city.component/city.component.component';

export const routes: Routes = [
    { path: 'cityName/:id', component: CityComponent }
];
