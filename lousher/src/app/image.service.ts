import { Injectable } from '@angular/core';
import Unsplash, { toJson } from 'unsplash-js';
import { callbackFunction } from './types';


@Injectable()
export class ImageService {
  
  private accessKey = 'sQwXILykBhRxUKVg2CveYhArKt9Tj04g79dpz5zYXKs';
  private unsplash = new Unsplash({ accessKey: this.accessKey });
  
  constructor() { }
  
  public getPhoto(id: string, callback: callbackFunction): void {
    this.unsplash.photos.getPhoto(id)
      .then(toJson)
      .then(callback);
  }
  
}