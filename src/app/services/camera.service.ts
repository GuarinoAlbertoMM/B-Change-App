// src/app/services/camera.service.ts
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({ providedIn: 'root' })
export class CameraService {
  constructor() {}

  // devuelve base64 o path según preferencia
  async takePhotoAsBase64() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 70,
    });
    return photo.base64String; // puede ser null si cancelan
  }

  // si prefieres guardar como archivo y devolver path:
  async takePhotoAndSave(): Promise<string | null> {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 70,
    });
    if (!photo || !photo.path) return null;
    // lee archivo y lo guarda si quieres
    const base64 = await fetch(photo.webPath!).then(r => r.arrayBuffer()).then(buf => {
      let binary = '';
      const bytes = new Uint8Array(buf);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    });
    return base64;
  }
}
