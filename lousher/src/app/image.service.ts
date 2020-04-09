import { Injectable } from '@angular/core';
import Unsplash, { toJson } from 'unsplash-js';

const unplashAccessKey = 'sQwXILykBhRxUKVg2CveYhArKt9Tj04g79dpz5zYXKs';

@Injectable()
export class ImageService {
  
  private unsplash = new Unsplash({ accessKey: unplashAccessKey });
  
  constructor() { }
  
  public getPhoto(id: string, callback: () => void): void {
    this.unsplash.photos.getPhoto(id)
      .then(toJson)
      .then(callback);
  }
}
