// src/app/services/location.service.ts
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({ providedIn: 'root' })
export class LocationService {
  async getCurrentPosition() {
    const pos = await Geolocation.getCurrentPosition();
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  }
}
