import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { FormsModule } from '@angular/forms';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeolocationService } from '../../services/geolocation.service';

@Component({
  selector: 'map-comp',
  imports: [FormsModule],
  templateUrl: './map.component.component.html',
  styleUrl: './map.component.component.scss'
})
export class MapComponentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: Map;
  private markerLayer!: VectorLayer<VectorSource>;
  private weatherLayer!: TileLayer<XYZ>;
  private readonly apiKey = '9c0d979c5fb6887ff0b6498fc353e635';
  weatherOpacity: number = 1;
  zoom: number = 12;

  @Input() lon: number = 0
  @Input() lat: number = 0
  @Input() op: string = "pressure_new"

  constructor() { }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.addWeatherLayer();
  }

  private initializeMap(): void {
    this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      }),
      controls: defaultControls()
    });

    this.markerLayer = new VectorLayer({
      source: new VectorSource()
    });
    this.map.addLayer(this.markerLayer);
  }

  private addWeatherLayer(): void {
    this.weatherLayer = new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/${this.op}/{z}/{x}/{y}.png?appid=${this.apiKey}`,
        crossOrigin: 'anonymous'
      }),
      opacity: 1,
      visible: true
    });

    this.map.addLayer(this.weatherLayer);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
    }
  }

  public toggleWeatherLayer(): void {
    const currentVisibility = this.weatherLayer.getVisible();
    this.weatherLayer.setVisible(!currentVisibility);
  }

  public changeMapLayer(params: string): void {
    this.op = params;
    this.map.removeLayer(this.weatherLayer);
    this.addWeatherLayer();
  }

  public updateWeatherOpacity(): void {
    this.weatherLayer.setOpacity(this.weatherOpacity);
  }

}
