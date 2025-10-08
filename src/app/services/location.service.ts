import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor() {}

  // Pide permiso y devuelve lat/lng
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // Request permissions (en algunos entornos es necesario)
      await Geolocation.requestPermissions();
      const pos = await Geolocation.getCurrentPosition();
      return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch (err) {
      console.warn('Geolocation error', err);
      return null;
    }
  }
}
