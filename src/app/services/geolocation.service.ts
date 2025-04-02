import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  /**
  * Проверяет поддержку API геолокации
  */
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Получает текущий статус разрешения
   */
  getPermissionState(): Observable<PermissionState | 'not_supported'> {
    if (!this.isSupported()) {
      return of('not_supported' as const);
    }

    if (!navigator.permissions || !navigator.permissions.query) {
      return of('prompt' as PermissionState);
    }

    return from(navigator.permissions.query({ name: 'geolocation' })).pipe(
      map(permission => permission.state),
      catchError(() => of('prompt' as PermissionState))
    );
  }

  /**
    * Запрашивает текущее местоположение
    */
  getCurrentPosition(options?: PositionOptions): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if (!this.isSupported()) {
        observer.error('Геолокация не поддерживается');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          observer.next(position);
          observer.complete();
        },
        error => observer.error(error),
        options
      );
    });
  }

  /**
   * Запрашивает разрешение (косвенно, через попытку получения местоположения)
   */
  requestPermission(): Observable<PermissionState> {
    return this.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 100,
      maximumAge: Infinity
    }).pipe(
      map(() => 'granted' as PermissionState),
      catchError(error => {
        if (error.code === error.PERMISSION_DENIED) {
          return of('denied' as PermissionState);
        }
        return of('prompt' as PermissionState);
      })
    );
  }

}
