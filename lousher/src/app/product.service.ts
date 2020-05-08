import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';

@Injectable()
export class ProductService {

  private apiRoot = 'http://localhost:8000/api/product';

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get<Product[]>(this.apiRoot);
  }

  getById(id: number) {
    return this.http.get<Product>(`${this.apiRoot}/${id}`);
  }

  getOffers() {
    return this.http.get<Product[]>(this.apiRoot.concat('/ofertas'));
  }

}
