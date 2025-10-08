import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  constructor() {}

  // Devuelve base64 (sin prefijo data:)
  async takePhotoAsBase64(): Promise<string | null> {
    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      return photo.base64String ?? null;
    } catch (err) {
      console.warn('Camera cancelled or failed', err);
      return null;
    }
  }

  // Alternativa: obtener Uri y convertir a base64 (si prefieres)
  async takePhotoFromUriAsBase64(): Promise<string | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 70,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      if (!photo || !photo.webPath) return null;
      const resp = await fetch(photo.webPath);
      const blob = await resp.blob();
      const buffer = await blob.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch (err) {
      console.warn('Camera error', err);
      return null;
    }
  }
}
